import React from 'react';
import { Project } from '../types';
import { formatDateTime } from '../utils/formatters';

interface ProjectsModalProps {
  projects: Project[];
  currentProjectId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCreate: () => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  projects,
  currentProjectId,
  isOpen,
  onClose,
  onSelect,
  onDelete,
  onDuplicate,
  onCreate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">My Projects</h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-neutral-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <p className="text-neutral-500 mb-4">No saved projects yet</p>
                <button onClick={onCreate} className="btn-primary">
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      project.id === currentProjectId
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          onSelect(project.id);
                          onClose();
                        }}
                      >
                        <h3 className="font-medium text-neutral-900">
                          {project.name}
                          {project.id === currentProjectId && (
                            <span className="ml-2 text-xs text-primary-600 bg-primary-100 px-2 py-0.5 rounded">
                              Current
                            </span>
                          )}
                        </h3>
                        {project.customerName && (
                          <p className="text-sm text-neutral-600 mt-0.5">
                            {project.customerName}
                          </p>
                        )}
                        <p className="text-xs text-neutral-400 mt-1">
                          Last updated: {formatDateTime(project.updatedAt)}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                          <span>
                            {project.chargers.reduce((sum, c) => sum + c.quantity, 0)}{' '}
                            EVSE unit{project.chargers.reduce((sum, c) => sum + c.quantity, 0) !== 1 ? 's' : ''}
                          </span>
                          <span>{project.serviceClass}</span>
                          <span>
                            {project.meteringType === 'separate'
                              ? 'Separate meter'
                              : 'Combined meter'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(project.id);
                          }}
                          className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Duplicate project"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                `Are you sure you want to delete "${project.name}"?`
                              )
                            ) {
                              onDelete(project.id);
                            }
                          }}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete project"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {projects.length > 0 && (
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
              <button onClick={onCreate} className="btn-primary w-full">
                + Create New Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsModal;
