import React from 'react';
import { Project } from '../../types';

interface ProjectInfoProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ project, onUpdate }) => {
  return (
    <div className="card">
      <h2 className="section-title flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Project Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="projectName" className="label">
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            className="input-field"
            value={project.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label htmlFor="customerName" className="label">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            className="input-field"
            value={project.customerName}
            onChange={(e) => onUpdate({ customerName: e.target.value })}
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label htmlFor="projectAddress" className="label">
            Project Address
          </label>
          <input
            type="text"
            id="projectAddress"
            className="input-field"
            value={project.projectAddress || ''}
            onChange={(e) => onUpdate({ projectAddress: e.target.value })}
            placeholder="Enter project address"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
