# Decision Intelligence System - Implementation Plan

## Status: IN PROGRESS
**Branch:** `feature/decision-intelligence-system`
**Started:** Dec 18, 2025 11:56am

## Phase 1: API Schema Update ✅
- [x] Update TypeScript types to `DecisionIntelligenceResult`
- [ ] Update LLM system prompt to generate Decision Intelligence format
- [ ] Update response construction logic
- [ ] Add helper functions for classification mapping
- [ ] Test API endpoint

## Phase 2: Decision Panel Component
- [ ] Create `DecisionPanel.tsx` component
- [ ] Implement Action Readiness display
- [ ] Implement Recommended Action section
- [ ] Implement Risk & Time Sensitivity indicators
- [ ] Style for executive authority (Bloomberg/Palantir aesthetic)

## Phase 3: UI Hierarchy Reconstruction
- [ ] Update `EchoBreakerClient.tsx` layout
- [ ] Move Decision Panel above the fold
- [ ] Redesign confidence display (bands, not raw %)
- [ ] Implement Evidence Snapshot section
- [ ] Update "What the Evidence Shows" section
- [ ] Add "Why This Narrative Spread" section
- [ ] Update footer with Trust Artifact controls

## Phase 4: Decision Dossier Page
- [ ] Create `/app/v/[id]/page.tsx`
- [ ] Implement shareable verification page
- [ ] Add PDF export functionality
- [ ] Add citation copy functionality
- [ ] Ensure legal-safe disclaimer

## Phase 5: Staged Analysis Experience
- [ ] Update loading states in client
- [ ] Add "Collecting official records" stage
- [ ] Add "Assessing consensus" stage
- [ ] Add "Evaluating risk signals" stage
- [ ] Add "Synthesizing decision output" stage
- [ ] Remove spinners, use calm progression

## Phase 6: Share & Export Controls
- [ ] Wire up X/Twitter share
- [ ] Wire up LinkedIn share
- [ ] Wire up Email share
- [ ] Wire up Reddit share
- [ ] Wire up Facebook share
- [ ] Implement "Copy Link" functionality
- [ ] Add API/Embed flag for paid tiers

## Phase 7: Testing & Validation
- [ ] Test with high-confidence claim
- [ ] Test with low-confidence claim
- [ ] Test with mixed evidence
- [ ] Verify tier-1 source dominance
- [ ] Verify confidence capping (no tier-1 = max 65%)
- [ ] Test /v/{id} page functionality
- [ ] Test share functionality
- [ ] Verify executive "10-second decision" criterion

## Phase 8: Deployment
- [ ] Merge to production-prooflayer
- [ ] Update Vercel (already has correct env vars)
- [ ] Monitor deployment
- [ ] Verify production functionality
- [ ] Create demo video/screenshots

## Acceptance Criteria (GO/NO-GO)
- [ ] Executives can decide in <10 seconds
- [ ] Journalists can cite without embarrassment
- [ ] Legal sees audit-ready structure
- [ ] Proof link works without re-entry
- [ ] Confidence visually makes sense
- [ ] Tier-1 sources are dominant
- [ ] Share + dossier actually function

## Key Design Principles
1. **Decision-first, not verification-first**
2. **Calm, institutional authority** (no emojis, no sensationalism)
3. **Executive scan pattern** (most important above fold)
4. **Actionable output** (every section answers "what should I do?")
5. **Trust infrastructure** (audit-ready, citable, defensible)

## Technical Notes
- Model: `claude-sonnet-4-5` (verified working)
- API Key: echo-fact (verified working)
- No ANTHROPIC_MODEL env var (uses DEFAULT_MODEL from code)
- Tier 1 sources: .gov, .mil, .edu, WHO, CDC, NIH, etc.
- Confidence cap: 65% max if no Tier 1 sources
- Tier 4 (social) NEVER affects verdict

## Next Immediate Step
Update LLM system prompt to generate Decision Intelligence format with:
- Decision Panel fields
- Verdict classification (SUBSTANTIATED/CONTEXTUALLY_INCOMPLETE/NOT_SUPPORTED)
- Action scenarios (PUBLISH/WAIT/IGNORE)
- Evidence strength assessment
- Risk evaluation
