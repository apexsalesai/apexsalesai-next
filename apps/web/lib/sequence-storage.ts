// Persistent storage service for the Sequence Engine
import { SequenceState } from 'types/sequence';
import { SequenceStorageDB } from './sequence-storage-db';

/**
 * SequenceStorage - Handles persistent storage of sequence states
 * 
 * This implementation uses a type-safe database service for production-ready storage.
 * Falls back to localStorage in the browser for development if needed.
 */
export class SequenceStorage {
  private storagePrefix = 'apex_sequence_';
  private isServer: boolean;
  private dbStorage: SequenceStorageDB | null = null;

  constructor() {
    // Check if we're running on server or client
    this.isServer = typeof window === 'undefined';
    
    // Initialize database storage on server
    if (this.isServer) {
      this.dbStorage = new SequenceStorageDB();
    }
  }

  /**
   * Save a sequence state to persistent storage
   */
  async saveSequenceState(leadId: number, state: SequenceState): Promise<void> {
    const key = `${this.storagePrefix}${leadId}`;
    
    if (this.isServer && this.dbStorage) {
      try {
        console.log(`[SERVER] Saving sequence state for lead ${leadId}`);
        await this.dbStorage.saveSequenceState(leadId, state);
      } catch (error) {
        console.error('Error saving sequence state to database:', error);
        // Fall back to console logging the state for debugging
        console.log('State that failed to save:', JSON.stringify(state));
      }
    } else {
      // Client-side storage (localStorage)
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error('Error saving sequence state to localStorage:', error);
      }
    }
  }

  /**
   * Get a sequence state from persistent storage
   */
  async getSequenceState(leadId: number): Promise<SequenceState | null> {
    const key = `${this.storagePrefix}${leadId}`;
    
    if (this.isServer && this.dbStorage) {
      try {
        console.log(`[SERVER] Getting sequence state for lead ${leadId}`);
        return await this.dbStorage.getSequenceState(leadId);
      } catch (error) {
        console.error('Error retrieving sequence state from database:', error);
        return null;
      }
    } else {
      // Client-side storage (localStorage)
      try {
        const stateJson = localStorage.getItem(key);
        if (!stateJson) return null;
        return JSON.parse(stateJson) as SequenceState;
      } catch (error) {
        console.error('Error retrieving sequence state from localStorage:', error);
        return null;
      }
    }
  }

  /**
   * Delete a sequence state from persistent storage
   */
  async deleteSequenceState(leadId: number): Promise<void> {
    const key = `${this.storagePrefix}${leadId}`;
    
    if (this.isServer && this.dbStorage) {
      try {
        console.log(`[SERVER] Deleting sequence state for lead ${leadId}`);
        await this.dbStorage.deleteSequenceState(leadId);
      } catch (error) {
        console.error('Error deleting sequence state from database:', error);
      }
    } else {
      // Client-side storage (localStorage)
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error deleting sequence state from localStorage:', error);
      }
    }
  }

  /**
   * Get all sequence states from persistent storage
   */
  async getAllSequenceStates(): Promise<Record<number, SequenceState>> {
    if (this.isServer && this.dbStorage) {
      try {
        console.log('[SERVER] Getting all sequence states');
        return await this.dbStorage.getAllSequenceStates();
      } catch (error) {
        console.error('Error retrieving all sequence states from database:', error);
        return {};
      }
    } else {
      // Client-side storage (localStorage)
      try {
        const states: Record<number, SequenceState> = {};
        
        // Iterate through localStorage keys
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(this.storagePrefix)) {
            const leadId = parseInt(key.replace(this.storagePrefix, ''), 10);
            const stateJson = localStorage.getItem(key);
            if (stateJson && !isNaN(leadId)) {
              states[leadId] = JSON.parse(stateJson) as SequenceState;
            }
          }
        }
        
        return states;
      } catch (error) {
        console.error('Error retrieving all sequence states from localStorage:', error);
        return {};
      }
    }
  }
  
  // Helper methods are now handled by the SequenceStorageDB class
}
