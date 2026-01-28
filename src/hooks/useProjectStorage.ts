import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, DEFAULT_PROJECT, DEFAULT_BILLING_INPUTS, ServiceClass } from '../types';

const STORAGE_KEY = 'ev-pir-projects';
const CURRENT_PROJECT_KEY = 'ev-pir-current-project';

/**
 * Map old service class names to new ones
 */
const SERVICE_CLASS_MIGRATION: Record<string, ServiceClass> = {
  'SC-1': 'SC-2D',
  'SC-2': 'SC-2D',
  'SC-3': 'SC-3 Secondary',
  'SC-2-MRP': 'SC-2D',
};

/**
 * Migrate a project to use new service class names and add new fields
 */
function migrateProject(project: Project): Project {
  let migrated = { ...project };

  // Migrate old service class names
  const newServiceClass = SERVICE_CLASS_MIGRATION[project.serviceClass];
  if (newServiceClass) {
    migrated.serviceClass = newServiceClass;
  }

  // Add ownershipType if missing (default to customer-owned)
  if (!migrated.ownershipType) {
    migrated.ownershipType = 'customer-owned';
  }

  // Migrate bookingProfit to bookingProfitPerBooking and remove bookingMargin
  if (migrated.revenueSettings) {
    // Use type assertion to check for legacy fields
    const settings = migrated.revenueSettings as unknown as Record<string, unknown>;
    if ('bookingProfit' in settings && !('bookingProfitPerBooking' in settings)) {
      migrated.revenueSettings = {
        ...migrated.revenueSettings,
        bookingProfitPerBooking: settings.bookingProfit as number,
      };
    }
    // Remove deprecated bookingMargin field by creating clean object
    if ('bookingMargin' in settings || 'bookingProfit' in settings) {
      const { bookingMargin, bookingProfit, ...cleanSettings } = settings;
      migrated.revenueSettings = {
        ...migrated.revenueSettings,
        ...cleanSettings,
      } as typeof migrated.revenueSettings;
    }
  }

  return migrated;
}

/**
 * Load all projects from localStorage
 */
function loadProjects(): Project[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const projects: Project[] = JSON.parse(stored);
      // Migrate old service class names
      return projects.map(migrateProject);
    }
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
  }
  return [];
}

/**
 * Save all projects to localStorage
 */
function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
  }
}

/**
 * Load current project ID from localStorage
 */
function loadCurrentProjectId(): string | null {
  try {
    return localStorage.getItem(CURRENT_PROJECT_KEY);
  } catch (error) {
    console.error('Error loading current project ID:', error);
  }
  return null;
}

/**
 * Save current project ID to localStorage
 */
function saveCurrentProjectId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(CURRENT_PROJECT_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_PROJECT_KEY);
    }
  } catch (error) {
    console.error('Error saving current project ID:', error);
  }
}

/**
 * Create a new project with default values
 */
function createNewProject(name?: string): Project {
  const now = new Date().toISOString();
  return {
    ...DEFAULT_PROJECT,
    id: uuidv4(),
    name: name || 'New Project',
    createdAt: now,
    updatedAt: now,
    billingInputs: { ...DEFAULT_BILLING_INPUTS },
    chargers: [],
  };
}

/**
 * Hook to manage project storage and state
 */
export function useProjectStorage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects on mount
  useEffect(() => {
    const loadedProjects = loadProjects();
    setProjects(loadedProjects);

    // Load current project
    const currentId = loadCurrentProjectId();
    if (currentId) {
      const project = loadedProjects.find((p) => p.id === currentId);
      if (project) {
        setCurrentProject(project);
      } else if (loadedProjects.length > 0) {
        // If saved project not found, use first project
        setCurrentProject(loadedProjects[0]);
        saveCurrentProjectId(loadedProjects[0].id);
      }
    } else if (loadedProjects.length > 0) {
      // No current project saved, use first project
      setCurrentProject(loadedProjects[0]);
      saveCurrentProjectId(loadedProjects[0].id);
    }

    setIsLoading(false);
  }, []);

  // Save projects whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveProjects(projects);
    }
  }, [projects, isLoading]);

  // Save current project ID whenever it changes
  useEffect(() => {
    if (!isLoading && currentProject) {
      saveCurrentProjectId(currentProject.id);
    }
  }, [currentProject, isLoading]);

  /**
   * Create a new project
   */
  const createProject = useCallback((name?: string): Project => {
    const newProject = createNewProject(name);
    setProjects((prev) => [...prev, newProject]);
    setCurrentProject(newProject);
    return newProject;
  }, []);

  /**
   * Update the current project
   */
  const updateProject = useCallback((updates: Partial<Project>): void => {
    if (!currentProject) return;

    const updatedProject: Project = {
      ...currentProject,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updatedProject);
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  }, [currentProject]);

  /**
   * Select a project by ID
   */
  const selectProject = useCallback((id: string): void => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      setCurrentProject(project);
    }
  }, [projects]);

  /**
   * Delete a project by ID
   */
  const deleteProject = useCallback((id: string): void => {
    setProjects((prev) => prev.filter((p) => p.id !== id));

    if (currentProject?.id === id) {
      const remaining = projects.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        setCurrentProject(remaining[0]);
      } else {
        setCurrentProject(null);
        saveCurrentProjectId(null);
      }
    }
  }, [currentProject, projects]);

  /**
   * Duplicate a project
   */
  const duplicateProject = useCallback((id: string): Project | null => {
    const original = projects.find((p) => p.id === id);
    if (!original) return null;

    const now = new Date().toISOString();
    const duplicate: Project = {
      ...original,
      id: uuidv4(),
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };

    setProjects((prev) => [...prev, duplicate]);
    setCurrentProject(duplicate);
    return duplicate;
  }, [projects]);

  return {
    projects,
    currentProject,
    isLoading,
    createProject,
    updateProject,
    selectProject,
    deleteProject,
    duplicateProject,
  };
}

export default useProjectStorage;
