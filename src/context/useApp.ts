import { useContext } from 'react';
import { AppContext } from './AppContext';
import type { AppContextValue } from './AppContext';

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
