import { useMemo } from 'react';
import { Project, CalculationResult } from '../types';
import { calculateResults } from '../utils/calculations';

/**
 * Hook to perform calculations based on project data
 * Returns memoized calculation results
 */
export function useCalculations(project: Project | null): CalculationResult | null {
  return useMemo(() => {
    if (!project) {
      return null;
    }

    // Check if we have minimum required data
    if (project.chargers.length === 0) {
      return null;
    }

    return calculateResults(project);
  }, [project]);
}

export default useCalculations;
