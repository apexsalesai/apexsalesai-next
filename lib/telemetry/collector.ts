/**
 * Telemetry Collector — Phase 5.1 (Dataverse-backed)
 * 
 * Collects and stores telemetry events in Dataverse for dashboard KPIs
 * and agent performance tracking.
 */

import { v4 as uuid } from 'uuid';
import { DataverseApiService } from '../services/dataverse/dataverseApi';
import { 
  TelemetryEvent, 
  TelemetryEventType,
  TelemetrySeverity 
} from '../intelligence/types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const TELEMETRY_ENABLED = process.env.TELEMETRY_ENABLED === 'true';
const SAMPLE_RATE = Number(process.env.TELEMETRY_SAMPLE_RATE ?? '0.1');

// Dataverse entity names
const TELEMETRY_EVENTS_ENTITY = 'apex_telemetry_events';
const KPI_COUNTERS_ENTITY = 'apex_kpi_counters';

// ============================================================================
// SAMPLING LOGIC
// ============================================================================

/**
 * Determine if event should be sampled based on severity
 */
function shouldSample(severity: TelemetrySeverity): boolean {
  // Always capture warn, error, critical
  if (['warn', 'error', 'critical'].includes(severity)) {
    return true;
  }
  
  // Sample info and debug based on configured rate
  return Math.random() < SAMPLE_RATE;
}

// ============================================================================
// CORE COLLECTOR
// ============================================================================

/**
 * Collect and store a telemetry event
 */
export async function collect(event: Partial<TelemetryEvent>): Promise<void> {
  // Feature flag check
  if (!TELEMETRY_ENABLED) {
    return;
  }

  try {
    // Validate required fields
    if (!event.eventType) {
      console.warn('[Telemetry] Event missing eventType, skipping');
      return;
    }

    // Apply sampling
    const severity = event.severity ?? 'info';
    if (!shouldSample(severity)) {
      return;
    }

    // Build complete event
    const completeEvent: TelemetryEvent = {
      eventType: event.eventType,
      severity,
      timestamp: event.timestamp ?? new Date().toISOString(),
      campaignId: event.campaignId,
      userId: event.userId,
      tenantId: event.tenantId,
      assetId: event.assetId,
      taskId: event.taskId,
      requestId: event.requestId ?? uuid(),
      payload: event.payload
    };

    // Write to Dataverse (async, non-blocking)
    writeEventToDataverse(completeEvent).catch(err => {
      console.error('[Telemetry] Failed to write event:', err);
    });

    // Update KPI counters for relevant events
    if (shouldUpdateCounter(completeEvent.eventType)) {
      incrementCounter(completeEvent.eventType).catch(err => {
        console.error('[Telemetry] Failed to increment counter:', err);
      });
    }

  } catch (error) {
    // Never throw - telemetry failures should not break app
    console.error('[Telemetry] Collection error:', error);
  }
}

// ============================================================================
// DATAVERSE OPERATIONS
// ============================================================================

/**
 * Write telemetry event to Dataverse
 */
async function writeEventToDataverse(event: TelemetryEvent): Promise<void> {
  try {
    await DataverseApiService.createRecord(TELEMETRY_EVENTS_ENTITY, {
      apex_eventtype: event.eventType,
      apex_severity: event.severity,
      apex_timestamp: event.timestamp,
      apex_campaignid: event.campaignId,
      apex_userid: event.userId,
      apex_tenantid: event.tenantId,
      apex_assetid: event.assetId,
      apex_taskid: event.taskId,
      apex_requestid: event.requestId,
      apex_payload: event.payload ? JSON.stringify(event.payload) : null
    });
  } catch (error) {
    // Log but don't throw
    console.error('[Telemetry] Dataverse write failed:', error);
  }
}

/**
 * Determine if event type should update counters
 */
function shouldUpdateCounter(eventType: TelemetryEventType): boolean {
  const counterEvents: TelemetryEventType[] = [
    'campaign_created',
    'agent_task_completed',
    'agent_task_error',
    'asset_published',
    'asset_created'
  ];
  
  return counterEvents.includes(eventType);
}

/**
 * Increment KPI counter in Dataverse
 */
async function incrementCounter(eventType: TelemetryEventType): Promise<void> {
  try {
    // Map event type to metric name
    const metricName = eventTypeToMetricName(eventType);
    
    // Query for existing counter
    const counters = await DataverseApiService.query(KPI_COUNTERS_ENTITY, {
      filter: `apex_metricname eq '${metricName}' and apex_period eq 'all_time'`,
      top: 1
    });

    if (counters && counters.length > 0) {
      // Update existing counter
      const counter = counters[0];
      await DataverseApiService.updateRecord(
        KPI_COUNTERS_ENTITY,
        counter.apex_kpicounterid,
        {
          apex_value: (counter.apex_value || 0) + 1,
          apex_lastupdated: new Date().toISOString()
        }
      );
    } else {
      // Create new counter
      await DataverseApiService.createRecord(KPI_COUNTERS_ENTITY, {
        apex_metricname: metricName,
        apex_value: 1,
        apex_lastupdated: new Date().toISOString(),
        apex_period: 'all_time'
      });
    }
  } catch (error) {
    console.error('[Telemetry] Counter increment failed:', error);
  }
}

/**
 * Map event type to KPI metric name
 */
function eventTypeToMetricName(eventType: TelemetryEventType): string {
  const mapping: Record<TelemetryEventType, string> = {
    'campaign_created': 'campaigns_created',
    'campaign_updated': 'campaigns_updated',
    'agent_task_started': 'agent_tasks_started',
    'agent_task_completed': 'agent_tasks_completed',
    'agent_task_error': 'agent_tasks_errors',
    'asset_created': 'assets_created',
    'asset_published': 'assets_published',
    'asset_publish_failed': 'assets_publish_failed',
    'kpi_ping': 'kpi_pings'
  };
  
  return mapping[eventType] || eventType;
}

// ============================================================================
// CONVENIENCE HELPERS
// ============================================================================

/**
 * Track agent task completion
 */
export async function trackAgentTaskCompleted(params: {
  campaignId?: string;
  taskId?: string;
  tokensIn?: number;
  tokensOut?: number;
  latencyMs?: number;
  costUsd?: number;
  agentName?: string;
  userId?: string;
  tenantId?: string;
}): Promise<void> {
  await collect({
    eventType: 'agent_task_completed',
    severity: 'info',
    campaignId: params.campaignId,
    taskId: params.taskId,
    userId: params.userId,
    tenantId: params.tenantId,
    payload: {
      agentTask: {
        tokensIn: params.tokensIn,
        tokensOut: params.tokensOut,
        latencyMs: params.latencyMs,
        costUsd: params.costUsd,
        agentName: params.agentName
      },
      publish: undefined,
      meta: undefined
    }
  });
}

/**
 * Track agent task error
 */
export async function trackAgentTaskError(params: {
  campaignId?: string;
  taskId?: string;
  error: string;
  agentName?: string;
  userId?: string;
  tenantId?: string;
}): Promise<void> {
  await collect({
    eventType: 'agent_task_error',
    severity: 'error',
    campaignId: params.campaignId,
    taskId: params.taskId,
    userId: params.userId,
    tenantId: params.tenantId,
    payload: {
      agentTask: {
        error: params.error,
        agentName: params.agentName
      },
      publish: undefined,
      meta: undefined
    }
  });
}

/**
 * Track asset published
 */
export async function trackAssetPublished(params: {
  campaignId?: string;
  assetId?: string;
  channel: 'blog' | 'email' | 'linkedin' | 'x' | 'youtube' | 'instagram';
  postUrl?: string;
  userId?: string;
  tenantId?: string;
}): Promise<void> {
  await collect({
    eventType: 'asset_published',
    severity: 'info',
    campaignId: params.campaignId,
    assetId: params.assetId,
    userId: params.userId,
    tenantId: params.tenantId,
    payload: {
      agentTask: undefined,
      publish: {
        channel: params.channel,
        postedAt: new Date().toISOString(),
        postUrl: params.postUrl
      },
      meta: undefined
    }
  });
}

/**
 * Track campaign created
 */
export async function trackCampaignCreated(params: {
  campaignId: string;
  userId?: string;
  tenantId?: string;
}): Promise<void> {
  await collect({
    eventType: 'campaign_created',
    severity: 'info',
    campaignId: params.campaignId,
    userId: params.userId,
    tenantId: params.tenantId
  });
}
