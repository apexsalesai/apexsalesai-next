/**
 * Vertical-specific prompt management for the LangGraph agent
 */

import { IndustryVertical } from '@lib/services/agent/langgraph/types';
import { realEstatePrompts } from './realEstate';
import { mortgagePrompts } from './mortgage';
import { mspPrompts } from './msp';
import { consultingPrompts } from './consulting';
import { solarPrompts } from './solar';
import { hvacPrompts } from './hvac';

/**
 * Vertical prompt interface
 */
export interface VerticalPrompt {
  systemPrompt: string;
  specialistPrompt: string;
  planningPrompt: string;
  fallbackPrompt: string;
  examples: Array<{
    user: string;
    agent: string;
  }>;
}

/**
 * Get vertical-specific prompts
 */
export function getVerticalPrompt(vertical: IndustryVertical): VerticalPrompt {
  switch (vertical) {
    case IndustryVertical.REAL_ESTATE:
      return realEstatePrompts;
    case IndustryVertical.MORTGAGE:
      return mortgagePrompts;
    case IndustryVertical.MSP:
      return mspPrompts;
    case IndustryVertical.CONSULTING:
      return consultingPrompts;
    case IndustryVertical.SOLAR:
      return solarPrompts;
    case IndustryVertical.HVAC:
      return hvacPrompts;
    default:
      return realEstatePrompts; // Default to real estate
  }
}
