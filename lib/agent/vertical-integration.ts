/**
 * Vertical-Specific Integration
 * 
 * This file integrates the vertical-specific logic presets (real estate, mortgage)
 * with the main sequence engine, allowing dynamic switching of LangGraph node paths
 * based on lead type and industry.
 */

import { Lead } from 'types/agent';
import { SequenceDefinition } from 'types/sequence';
import * as RealEstate from './presets/realestate';
import * as Mortgage from './presets/mortgage';

/**
 * Registry of all available sequences by domain
 */
const sequenceRegistry = {
  'Real Estate': [
    RealEstate.realEstateLeadQualificationSequence,
    RealEstate.realEstateFollowUpSequence,
    RealEstate.realEstatePriceReductionSequence
  ],
  'Mortgage': [
    Mortgage.mortgageDocumentChaseSequence,
    Mortgage.mortgageLoanStatusSequence,
    Mortgage.mortgageRateChangeSequence
  ]
};

/**
 * Registry of all action handlers by domain
 */
const actionHandlerRegistry = {
  'Real Estate': RealEstate.realEstateActionHandlers,
  'Mortgage': Mortgage.mortgageActionHandlers
};

/**
 * Determines the appropriate vertical for a lead based on its properties
 * @param lead The lead to analyze
 * @returns The vertical domain (e.g., 'Real Estate', 'Mortgage')
 */
export function determineVerticalForLead(lead: Lead): string {
  // Simple logic for now - could be enhanced with more sophisticated rules
  if (lead.industry?.toLowerCase().includes('real estate') || 
      lead.industry?.toLowerCase().includes('property') ||
      lead.industry?.toLowerCase().includes('realtor')) {
    return 'Real Estate';
  } else if (lead.industry?.toLowerCase().includes('mortgage') || 
           lead.industry?.toLowerCase().includes('loan') ||
           lead.industry?.toLowerCase().includes('lending')) {
    return 'Mortgage';
  }
  
  // Default to Real Estate if we can't determine
  return 'Real Estate';
}

/**
 * Gets all sequences for a specific vertical domain
 * @param domain The vertical domain
 * @returns Array of sequence definitions for that domain
 */
export function getSequencesForDomain(domain: string): SequenceDefinition[] {
  return sequenceRegistry[domain as keyof typeof sequenceRegistry] || [];
}

/**
 * Gets the appropriate sequence for a lead based on its properties and status
 * @param lead The lead to analyze
 * @param sequenceType Optional sequence type to filter by
 * @returns The most appropriate sequence definition
 */
export function determineSequenceForLead(lead: Lead, sequenceType?: string): SequenceDefinition | undefined {
  const domain = determineVerticalForLead(lead);
  const sequences = getSequencesForDomain(domain);
  
  if (sequences.length === 0) {
    return undefined;
  }
  
  // If a specific sequence type is requested, try to find it
  if (sequenceType) {
    const matchingSequence = sequences.find(seq => 
      seq.id.includes(sequenceType.toLowerCase()) || 
      seq.name.toLowerCase().includes(sequenceType.toLowerCase())
    );
    
    if (matchingSequence) {
      return matchingSequence;
    }
  }
  
  // Default logic for selecting the most appropriate sequence
  if (domain === 'Real Estate') {
    // For real estate, use lead qualification for new leads
    if (!lead.status || lead.status === 'New') {
      return sequences.find(seq => seq.id === 'real-estate-lead-qualification');
    }
    
    // For non-responsive leads, use follow-up
    if (lead.status === 'Cold' || lead.status === 'Nurture') {
      return sequences.find(seq => seq.id === 'real-estate-follow-up');
    }
  } else if (domain === 'Mortgage') {
    // For mortgage, use document chase for new applications
    if (!lead.status || lead.status === 'New') {
      return sequences.find(seq => seq.id === 'mortgage-document-chase');
    }
    
    // For loans in process, use status updates
    if (lead.status === 'In Process' || lead.status === 'Active') {
      return sequences.find(seq => seq.id === 'mortgage-loan-status');
    }
  }
  
  // Default to the first sequence if no specific match
  return sequences[0];
}

/**
 * Gets the action handler for a specific action and domain
 * @param actionName The name of the action
 * @param domain The vertical domain
 * @returns The action handler function or undefined if not found
 */
export function getActionHandler(actionName: string, domain: string): Function | undefined {
  const domainHandlers = actionHandlerRegistry[domain as keyof typeof actionHandlerRegistry];
  if (!domainHandlers) return undefined;
  
  return domainHandlers[actionName as keyof typeof domainHandlers];
}

/**
 * Registers a new sequence for a specific domain
 * @param sequence The sequence definition to register
 * @param domain The vertical domain
 */
export function registerSequence(sequence: SequenceDefinition, domain: string): void {
  if (!sequenceRegistry[domain as keyof typeof sequenceRegistry]) {
    (sequenceRegistry as any)[domain] = [];
  }
  
  sequenceRegistry[domain as keyof typeof sequenceRegistry].push(sequence);
}

/**
 * Registers new action handlers for a specific domain
 * @param handlers Object containing action handler functions
 * @param domain The vertical domain
 */
export function registerActionHandlers(handlers: Record<string, Function>, domain: string): void {
  if (!actionHandlerRegistry[domain as keyof typeof actionHandlerRegistry]) {
    (actionHandlerRegistry as any)[domain] = {};
  }
  
  Object.assign(actionHandlerRegistry[domain as keyof typeof actionHandlerRegistry], handlers);
}
