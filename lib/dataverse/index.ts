/**
 * Dataverse Integration Module
 * 
 * Exports all Dataverse-related functionality for use throughout the application.
 */

export { DataverseClient, createDataverseClient } from './client';
export {
  writeCampaignMetrics,
  writeCampaignMetricsToDataverse,
  queryRecentMetrics,
  type CampaignMetrics,
} from './writeCampaignMetrics';
export {
  logChannelPublish,
  writeChannelMetricsToDataverse,
  queryRecentChannelMetrics,
  type ChannelPublishMetrics,
} from './writeChannelMetrics';
