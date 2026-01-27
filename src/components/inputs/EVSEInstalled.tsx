import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, ChargerEntry, ChargerLevel, SiteVoltage } from '../../types';
import {
  getChargerLevels,
  getEquipmentByLevel,
  getEquipmentById,
  getAvailableVoltages,
  getDefaultVoltage,
  getKwForVoltage,
  levelToType,
} from '../../data/chargers';
import { formatKw } from '../../utils/formatters';

interface EVSEInstalledProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export const EVSEInstalled: React.FC<EVSEInstalledProps> = ({
  project,
  onUpdate,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<ChargerLevel | ''>('');
  const [selectedEvseId, setSelectedEvseId] = useState<string>('');
  const [selectedVoltage, setSelectedVoltage] = useState<SiteVoltage>(240);
  const [quantity, setQuantity] = useState<number>(1);
  const [individualCircuits, setIndividualCircuits] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const chargerLevels = getChargerLevels();
  const availableEquipment = selectedLevel ? getEquipmentByLevel(selectedLevel) : [];
  const selectedEquipment = selectedEvseId ? getEquipmentById(selectedEvseId) : null;
  const availableVoltages = selectedLevel ? getAvailableVoltages(selectedLevel) : [];

  // Calculate kW for current selection
  const currentKw = selectedEquipment
    ? getKwForVoltage(selectedEquipment, selectedVoltage)
    : 0;

  // Handle level change
  const handleLevelChange = (level: ChargerLevel | '') => {
    setSelectedLevel(level);
    setSelectedEvseId('');
    if (level) {
      setSelectedVoltage(getDefaultVoltage(level));
    }
  };

  // Handle equipment change
  const handleEquipmentChange = (evseId: string) => {
    setSelectedEvseId(evseId);
  };

  // Handle voltage change
  const handleVoltageChange = (voltage: SiteVoltage) => {
    setSelectedVoltage(voltage);
  };

  // Reset form
  const resetForm = () => {
    setSelectedLevel('');
    setSelectedEvseId('');
    setSelectedVoltage(240);
    setQuantity(1);
    setIndividualCircuits(false);
  };

  // Add new EVSE to inventory
  const handleAddEVSE = () => {
    if (!selectedEquipment || !selectedLevel) return;

    const newEntry: ChargerEntry = {
      id: uuidv4(),
      evseId: selectedEvseId,
      name: selectedEquipment.name,
      type: levelToType(selectedLevel),
      level: selectedLevel,
      siteVoltage: selectedVoltage,
      kwPerCharger: currentKw,
      quantity: quantity,
      numberOfPlugs: selectedEquipment.numberOfPlugs,
      individualCircuits: individualCircuits,
    };

    onUpdate({ chargers: [...project.chargers, newEntry] });
    resetForm();
  };

  // Update existing EVSE entry
  const handleUpdateCharger = (id: string, updates: Partial<ChargerEntry>) => {
    const updatedChargers = project.chargers.map((charger) => {
      if (charger.id !== id) return charger;

      // If voltage changed, recalculate kW
      if (updates.siteVoltage !== undefined) {
        const evse = getEquipmentById(charger.evseId);
        if (evse) {
          updates.kwPerCharger = getKwForVoltage(evse, updates.siteVoltage);
        }
      }

      return { ...charger, ...updates };
    });
    onUpdate({ chargers: updatedChargers });
  };

  // Remove EVSE from inventory
  const handleRemoveCharger = (id: string) => {
    onUpdate({ chargers: project.chargers.filter((c) => c.id !== id) });
    if (editingId === id) setEditingId(null);
  };

  // Calculate charger kW considering individual circuits
  const getChargerTotalKw = (charger: ChargerEntry): number => {
    const baseKw = charger.kwPerCharger * charger.quantity;
    if (charger.individualCircuits && charger.numberOfPlugs > 1) {
      return baseKw * charger.numberOfPlugs;
    }
    return baseKw;
  };

  // Calculate totals
  const totalKw = project.chargers.reduce(
    (sum, c) => sum + getChargerTotalKw(c),
    0
  );
  const totalUnits = project.chargers.reduce((sum, c) => sum + c.quantity, 0);
  const totalPlugs = project.chargers.reduce(
    (sum, c) => sum + c.numberOfPlugs * c.quantity,
    0
  );

  const canAdd = selectedLevel && selectedEvseId && currentKw > 0 && quantity > 0;

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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        EVSE Installed
      </h2>

      {/* Add EVSE Form - Improved Layout */}
      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg mb-4">
        <div className="space-y-4">
          {/* Row 1: Level and Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Charger Level</label>
              <select
                className="input-field"
                value={selectedLevel}
                onChange={(e) => handleLevelChange(e.target.value as ChargerLevel | '')}
              >
                <option value="">Select Level...</option>
                {chargerLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">EVSE Equipment</label>
              <select
                className="input-field"
                value={selectedEvseId}
                onChange={(e) => handleEquipmentChange(e.target.value)}
                disabled={!selectedLevel}
              >
                <option value="">
                  {selectedLevel ? 'Select equipment...' : 'Select level first'}
                </option>
                {availableEquipment.map((equip) => (
                  <option key={equip.id} value={equip.id}>
                    {equip.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Voltage, kW Output, Quantity, Individual Circuits */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="label">Site Voltage</label>
              <select
                className="input-field"
                value={selectedVoltage}
                onChange={(e) =>
                  handleVoltageChange(parseInt(e.target.value) as SiteVoltage)
                }
                disabled={!selectedLevel || selectedLevel === 'DCFC (Level 3)'}
              >
                {availableVoltages.map((v) => (
                  <option key={v} value={v}>
                    {v}V
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">kW Output</label>
              <div className="input-field bg-neutral-100 text-neutral-700 font-medium">
                {currentKw > 0 ? `${currentKw} kW` : '-'}
              </div>
            </div>

            <div>
              <label className="label">Quantity</label>
              <input
                type="number"
                className="input-field"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
            </div>

            <div>
              <label className="label">Individual Circuits</label>
              <select
                className="input-field"
                value={individualCircuits ? 'yes' : 'no'}
                onChange={(e) => setIndividualCircuits(e.target.value === 'yes')}
                disabled={!selectedEquipment || selectedEquipment.numberOfPlugs <= 1}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddEVSE}
                disabled={!canAdd}
                className="btn-primary w-full"
              >
                + Add EVSE
              </button>
            </div>
          </div>

          {selectedEquipment && (
            <div className="text-sm text-neutral-600 bg-white p-2 rounded border border-neutral-200">
              <span className="font-medium">{selectedEquipment.numberOfPlugs} plug{selectedEquipment.numberOfPlugs > 1 ? 's' : ''}</span> per unit
              {selectedLevel === 'DCFC (Level 3)' && <span className="ml-2">• Requires 480V service</span>}
              {selectedEquipment.numberOfPlugs > 1 && (
                <span className="ml-2">
                  • Individual Circuits: {individualCircuits ? 'Yes' : 'No'}
                  {individualCircuits && ` (${currentKw} kW × ${selectedEquipment.numberOfPlugs} plugs = ${(currentKw * selectedEquipment.numberOfPlugs).toFixed(2)} kW/unit)`}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* EVSE Inventory Table */}
      {project.chargers.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="font-medium">No EVSE equipment added yet</p>
          <p className="text-sm mt-1">Select equipment above to add to your project</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-neutral-500 border-b border-neutral-200">
                  <th className="text-left py-2 font-medium">EVSE Equipment</th>
                  <th className="text-center py-2 font-medium">Level</th>
                  <th className="text-center py-2 font-medium">Voltage</th>
                  <th className="text-center py-2 font-medium">kW/Unit</th>
                  <th className="text-center py-2 font-medium">Qty</th>
                  <th className="text-center py-2 font-medium">Plugs</th>
                  <th className="text-center py-2 font-medium">Ind. Circuits</th>
                  <th className="text-right py-2 font-medium">Total kW</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {project.chargers.map((charger) => {
                  const isEditing = editingId === charger.id;
                  const chargerVoltages = getAvailableVoltages(charger.level);
                  const chargerTotalKw = getChargerTotalKw(charger);

                  return (
                    <tr key={charger.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-3">
                        <div className="font-medium text-neutral-900" title={charger.name}>
                          {charger.name}
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            charger.level === 'Level 2'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {charger.level === 'Level 2' ? 'L2' : 'DCFC'}
                        </span>
                      </td>
                      <td className="text-center py-3">
                        {isEditing && charger.level === 'Level 2' ? (
                          <select
                            className="input-field text-sm py-1 w-20"
                            value={charger.siteVoltage}
                            onChange={(e) =>
                              handleUpdateCharger(charger.id, {
                                siteVoltage: parseInt(e.target.value) as SiteVoltage,
                              })
                            }
                          >
                            {chargerVoltages.map((v) => (
                              <option key={v} value={v}>
                                {v}V
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-neutral-600">{charger.siteVoltage}V</span>
                        )}
                      </td>
                      <td className="text-center py-3 text-neutral-600">
                        {charger.kwPerCharger}
                      </td>
                      <td className="text-center py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            className="input-field text-sm py-1 w-16 text-center"
                            value={charger.quantity}
                            onChange={(e) =>
                              handleUpdateCharger(charger.id, {
                                quantity: Math.max(1, parseInt(e.target.value) || 1),
                              })
                            }
                            min="1"
                          />
                        ) : (
                          <span className="text-neutral-600">{charger.quantity}</span>
                        )}
                      </td>
                      <td className="text-center py-3 text-neutral-600">
                        {charger.numberOfPlugs * charger.quantity}
                      </td>
                      <td className="text-center py-3">
                        {isEditing && charger.numberOfPlugs > 1 ? (
                          <select
                            className="input-field text-sm py-1 w-16"
                            value={charger.individualCircuits ? 'yes' : 'no'}
                            onChange={(e) =>
                              handleUpdateCharger(charger.id, {
                                individualCircuits: e.target.value === 'yes',
                              })
                            }
                          >
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </select>
                        ) : (
                          <span className={charger.individualCircuits ? 'text-green-600 font-medium' : 'text-neutral-400'}>
                            {charger.individualCircuits ? 'Yes' : 'No'}
                          </span>
                        )}
                      </td>
                      <td className="text-right py-3 font-semibold text-neutral-900">
                        {formatKw(chargerTotalKw)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1">
                          {isEditing ? (
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                              title="Done"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingId(charger.id)}
                              className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveCharger(charger.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Remove"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
              <span><span className="font-semibold text-neutral-900">{totalUnits}</span> unit{totalUnits !== 1 ? 's' : ''}</span>
              <span><span className="font-semibold text-neutral-900">{totalPlugs}</span> plug{totalPlugs !== 1 ? 's' : ''}</span>
            </div>
            <div className="text-lg font-bold text-primary-600">
              Total Nameplate: {formatKw(totalKw, 1)}
            </div>
          </div>

          {/* Load Management */}
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <label htmlFor="loadManagement" className="label">
              Load Management Limit (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="loadManagement"
                className="input-field w-40"
                value={project.loadManagementLimit ?? ''}
                onChange={(e) =>
                  onUpdate({
                    loadManagementLimit: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                placeholder={totalKw.toFixed(1)}
                min="0"
                step="0.1"
              />
              <span className="text-neutral-600">kW</span>
            </div>
            <p className="text-sm text-neutral-500 mt-2">
              Set if load management limits total draw below {totalKw.toFixed(1)} kW nameplate capacity
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default EVSEInstalled;
