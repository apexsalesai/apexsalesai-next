-- Phase 3: Campaign Metrics Table for Dataverse Integration
-- This table stores aggregate telemetry data from agent runs

CREATE TABLE IF NOT EXISTS campaign_metrics (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id       UUID NOT NULL,
  run_id            UUID NOT NULL,
  phase             TEXT NOT NULL DEFAULT '2-3',
  agents_total      INT NOT NULL,
  agents_successful INT NOT NULL,
  assets_generated  INT NOT NULL,
  tokens_in         INT NOT NULL,
  tokens_out        INT NOT NULL,
  cost_usd          NUMERIC(10,5) NOT NULL,
  latency_p95_ms    INT NOT NULL,
  latency_avg_ms    INT NOT NULL,
  success_rate_pct  NUMERIC(5,2) NOT NULL,
  exported_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_created_at ON campaign_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_campaign_id ON campaign_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_exported ON campaign_metrics(exported_at) WHERE exported_at IS NULL;

-- View for Power Automate to read only fresh rows
CREATE OR REPLACE VIEW v_campaign_metrics_pending AS
SELECT 
  id,
  campaign_id,
  run_id,
  phase,
  agents_total,
  agents_successful,
  assets_generated,
  tokens_in,
  tokens_out,
  cost_usd,
  latency_p95_ms,
  latency_avg_ms,
  success_rate_pct,
  created_at
FROM campaign_metrics
WHERE exported_at IS NULL
  AND created_at >= now() - interval '7 days'
ORDER BY created_at DESC;

-- Comment for documentation
COMMENT ON TABLE campaign_metrics IS 'Aggregate telemetry metrics from agent campaign runs for Dataverse sync';
COMMENT ON VIEW v_campaign_metrics_pending IS 'Pending metrics not yet exported to Dataverse';
