import React from 'react';
import { Project, ServiceClass } from '../../types';
import { serviceClasses, getServiceClassInfo } from '../../data/serviceClasses';

interface ServiceClassSelectorProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export const ServiceClassSelector: React.FC<ServiceClassSelectorProps> = ({
  project,
  onUpdate,
}) => {
  const selectedInfo = getServiceClassInfo(project.serviceClass);

  return (
    <div>
      <label htmlFor="serviceClass" className="label">
        Service Class
      </label>
      <select
        id="serviceClass"
        className="input-field"
        value={project.serviceClass}
        onChange={(e) => onUpdate({ serviceClass: e.target.value as ServiceClass })}
      >
        {serviceClasses.map((sc) => (
          <option key={sc.id} value={sc.id}>
            {sc.name}
          </option>
        ))}
      </select>
      {selectedInfo && (
        <p className="help-text">
          {selectedInfo.description}
          {selectedInfo.minKw && selectedInfo.maxKw && (
            <span className="block mt-1">
              Demand range: {selectedInfo.minKw.toLocaleString()} -{' '}
              {selectedInfo.maxKw.toLocaleString()} kW
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export default ServiceClassSelector;
