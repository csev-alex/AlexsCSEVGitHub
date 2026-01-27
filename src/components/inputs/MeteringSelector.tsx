import React from 'react';
import { Project, MeteringType } from '../../types';

interface MeteringSelectorProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export const MeteringSelector: React.FC<MeteringSelectorProps> = ({
  project,
  onUpdate,
}) => {
  return (
    <div>
      <label className="label">Metering Configuration</label>
      <div className="space-y-3">
        <label className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
          <input
            type="radio"
            name="meteringType"
            value="separate"
            checked={project.meteringType === 'separate'}
            onChange={() => onUpdate({ meteringType: 'separate' as MeteringType })}
            className="mt-1 w-4 h-4 text-primary-500 focus:ring-primary-500"
          />
          <div>
            <span className="font-medium text-neutral-900">Separately Metered</span>
            <p className="text-sm text-neutral-500 mt-0.5">
              EV charging has its own dedicated meter. Recommended for new installations.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
          <input
            type="radio"
            name="meteringType"
            value="combined"
            checked={project.meteringType === 'combined'}
            onChange={() => onUpdate({ meteringType: 'combined' as MeteringType })}
            className="mt-1 w-4 h-4 text-primary-500 focus:ring-primary-500"
          />
          <div>
            <span className="font-medium text-neutral-900">Combined Meter</span>
            <p className="text-sm text-neutral-500 mt-0.5">
              EV charging shares a meter with other loads on the premises.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default MeteringSelector;
