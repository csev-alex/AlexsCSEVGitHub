import React from 'react';
import { Project } from '../../types';
import { availableUtilities } from '../../data/rates/nationalGrid';

interface UtilitySelectorProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export const UtilitySelector: React.FC<UtilitySelectorProps> = ({
  project,
  onUpdate,
}) => {
  return (
    <div>
      <label htmlFor="utility" className="label">
        Utility Provider
      </label>
      <select
        id="utility"
        className="input-field"
        value={project.utility}
        onChange={(e) => onUpdate({ utility: e.target.value })}
      >
        {availableUtilities.map((utility) => (
          <option key={utility.id} value={utility.id}>
            {utility.name}
          </option>
        ))}
      </select>
      <p className="help-text">
        Select the utility company for this project
      </p>
    </div>
  );
};

export default UtilitySelector;
