// Sequence Integration - Connects sequence definitions and actions to the SequenceEngine
import { SequenceDefinition } from 'types/sequence';
import { Lead } from 'types/agent';
import { realEstateLeadQualificationSequence, realEstateLeadQualificationActions } from './real-estate-lead-qualification';

/**
 * Registry of all available sequences in the system
 */
export const sequenceRegistry: Record<string, SequenceDefinition> = {
  'real-estate-lead-qualification': realEstateLeadQualificationSequence
};

/**
 * Registry of all sequence action implementations
 */
export const sequenceActionRegistry: Record<string, Record<string, (context: any) => Promise<any>>> = {
  'real-estate-lead-qualification': realEstateLeadQualificationActions
};

/**
 * Get a sequence definition by its ID
 */
export function getSequenceDefinition(sequenceId: string): SequenceDefinition | undefined {
  return sequenceRegistry[sequenceId];
}

/**
 * Get an action implementation for a specific sequence
 */
export function getSequenceAction(sequenceId: string, actionId: string): ((context: any) => Promise<any>) | undefined {
  const sequenceActions = sequenceActionRegistry[sequenceId];
  if (!sequenceActions) return undefined;
  
  return sequenceActions[actionId];
}

/**
 * Get all available sequence IDs
 */
export function getAvailableSequenceIds(): string[] {
  return Object.keys(sequenceRegistry);
}

/**
 * Get a sequence definition by business domain and purpose
 */
export function findSequenceByDomain(domain: string, purpose: string): SequenceDefinition | undefined {
  // For now, we only have one sequence, so this is simple
  if (domain === 'real-estate' && purpose === 'lead-qualification') {
    return sequenceRegistry['real-estate-lead-qualification'];
  }
  
  return undefined;
}

/**
 * Determine which sequence should be used for a lead based on its properties
 */
export function determineSequenceForLead(lead: Lead): string | undefined {
  // For now, we just return the real estate lead qualification sequence
  // In the future, this could be more sophisticated based on lead properties
  if (lead.industry?.toLowerCase().includes('real estate')) {
    return 'real-estate-lead-qualification';
  }
  
  // Default to real estate lead qualification for now
  return 'real-estate-lead-qualification';
}
