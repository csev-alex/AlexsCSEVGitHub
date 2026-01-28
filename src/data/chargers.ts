import { EVSEEquipment, ChargerLevel, SiteVoltage } from '../types';

/**
 * EVSE Equipment Catalog
 * Data sourced from CSEV_Station_List_v1.0.xlsx
 */

export const evseEquipment: EVSEEquipment[] = [
  // Level 2 Chargers
  {
    id: 'l2-48a-dp-pedestal',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-DP - 48A Output - Dual Port Pedestal with CMS',
    description: 'MaxiCharger ACUltra - CSEV-AC-DP - 48A Output - Dual Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: 48,
    kw208V: 9.98,
    kw240V: 11.52,
    kw480V: null,
  },
  {
    id: 'l2-48a-sp-pedestal',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-SP - 48A Output - Single Port Pedestal with CMS',
    description: 'MaxiCharger ACUltra - CSEV-AC-SP - 48A Output - Single Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 1,
    amperage: 48,
    kw208V: 9.98,
    kw240V: 11.52,
    kw480V: null,
  },
  {
    id: 'l2-48a-sp-wall',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-SP - 48A Output - Single Port Wall Mount',
    description: 'MaxiCharger ACUltra - CSEV-AC-SP - 48A Output - Single Port Wall Mount. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 1,
    amperage: 48,
    kw208V: 9.98,
    kw240V: 11.52,
    kw480V: null,
  },
  {
    id: 'l2-40a-dp-pedestal',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-DP - 40A Output - Dual Port Pedestal with CMS',
    description: 'MaxiCharger ACUltra - CSEV-AC-DP - 40A Output - Dual Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: 40,
    kw208V: 8.32,
    kw240V: 9.6,
    kw480V: null,
  },
  {
    id: 'l2-40a-sp-pedestal',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-SP - 40A Output - Single Port Pedestal with CMS',
    description: 'MaxiCharger ACUltra - CSEV-AC-SP - 40A Output - Single Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 1,
    amperage: 40,
    kw208V: 8.32,
    kw240V: 9.6,
    kw480V: null,
  },
  {
    id: 'l2-40a-sp-wall',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-SP - 40A Output - Single Port Wall Mount',
    description: 'MaxiCharger ACUltra - CSEV-AC-SP - 40A Output - Single Port Wall Mount. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 1,
    amperage: 40,
    kw208V: 8.32,
    kw240V: 9.6,
    kw480V: null,
  },
  {
    id: 'l2-80a-dp-pedestal',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-DP - 80A Output - Dual Port Pedestal with CMS',
    description: 'MaxiCharger ACUltra - CSEV-AC-DP - 80A Output - Dual Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: 80,
    kw208V: 16.64,
    kw240V: 19.2,
    kw480V: null,
  },
  {
    id: 'l2-80a-sp-pedestal',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-SP - 80A Output - Single Port Pedestal with CMS',
    description: 'MaxiCharger ACUltra - CSEV-AC-SP - 80A Output - Single Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 1,
    amperage: 80,
    kw208V: 16.64,
    kw240V: 19.2,
    kw480V: null,
  },
  {
    id: 'l2-80a-sp-wall',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-SP - 80A Output - Single Port Wall Mount',
    description: 'MaxiCharger ACUltra - CSEV-AC-SP - 80A Output - Single Port Wall Mount. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 1,
    amperage: 80,
    kw208V: 16.64,
    kw240V: 19.2,
    kw480V: null,
  },
  {
    id: 'l2-32a-dp-pedestal',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-DP - 32A Output - Dual Port Pedestal with CMS',
    description: 'MaxiCharger ACUltra - CSEV-AC-DP - 32A Output - Dual Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: 32,
    kw208V: 6.66,
    kw240V: 7.68,
    kw480V: null,
  },
  {
    id: 'l2-32a-sp-pedestal',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-SP - 32A Output - Single Port Pedestal with CMS',
    description: 'MaxiCharger ACUltra - CSEV-AC-SP - 32A Output - Single Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 1,
    amperage: 32,
    kw208V: 6.66,
    kw240V: 7.68,
    kw480V: null,
  },
  {
    id: 'l2-32a-sp-wall',
    level: 'Level 2',
    name: 'MaxiCharger ACUltra - CSEV-AC-SP - 32A Output - Single Port Wall Mount',
    description: 'MaxiCharger ACUltra - CSEV-AC-SP - 32A Output - Single Port Wall Mount. Includes 3 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 1,
    amperage: 32,
    kw208V: 6.66,
    kw240V: 7.68,
    kw480V: null,
  },

  // DCFC (Level 3) Chargers
  {
    id: 'dcfc-60kw-ccs-ccs',
    level: 'DCFC (Level 3)',
    name: 'CSEV MaxiCharger 60kW DC Fast - CCS/CCS - POS & CMS & Boost Cables',
    description: 'CSEV MaxiCharger 60kW DC Fast - CCS/CCS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: null,
    kw208V: null,
    kw240V: null,
    kw480V: 60,
  },
  {
    id: 'dcfc-120kw-ccs-ccs',
    level: 'DCFC (Level 3)',
    name: 'CSEV MaxiCharger 120kW DC Fast - CCS/CCS - POS & CMS & Boost Cables',
    description: 'CSEV MaxiCharger 120kW DC Fast - CCS/CCS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: null,
    kw208V: null,
    kw240V: null,
    kw480V: 120,
  },
  {
    id: 'dcfc-180kw-ccs-ccs',
    level: 'DCFC (Level 3)',
    name: 'CSEV MaxiCharger 180kW DC Fast - CCS/CCS - POS & CMS & Boost Cables',
    description: 'CSEV MaxiCharger 180kW DC Fast - CCS/CCS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: null,
    kw208V: null,
    kw240V: null,
    kw480V: 180,
  },
  {
    id: 'dcfc-240kw-ccs-ccs',
    level: 'DCFC (Level 3)',
    name: 'CSEV MaxiCharger 240kW DC Fast - CCS/CCS - POS & CMS & Boost Cables',
    description: 'CSEV MaxiCharger 240kW DC Fast - CCS/CCS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: null,
    kw208V: null,
    kw240V: null,
    kw480V: 240,
  },
  {
    id: 'dcfc-60kw-ccs-nacs',
    level: 'DCFC (Level 3)',
    name: 'CSEV MaxiCharger 60kW DC Fast - CCS/NACS - POS & CMS & Boost Cables',
    description: 'CSEV MaxiCharger 60kW DC Fast - CCS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: null,
    kw208V: null,
    kw240V: null,
    kw480V: 60,
  },
  {
    id: 'dcfc-120kw-ccs-nacs',
    level: 'DCFC (Level 3)',
    name: 'CSEV MaxiCharger 120kW DC Fast - CCS/NACS - POS & CMS & Boost Cables',
    description: 'CSEV MaxiCharger 120kW DC Fast - CCS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: null,
    kw208V: null,
    kw240V: null,
    kw480V: 120,
  },
  {
    id: 'dcfc-180kw-ccs-nacs',
    level: 'DCFC (Level 3)',
    name: 'CSEV MaxiCharger 180kW DC Fast - CCS/NACS - POS & CMS & Boost Cables',
    description: 'CSEV MaxiCharger 180kW DC Fast - CCS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: null,
    kw208V: null,
    kw240V: null,
    kw480V: 180,
  },
  {
    id: 'dcfc-240kw-ccs-nacs',
    level: 'DCFC (Level 3)',
    name: 'CSEV MaxiCharger 240kW DC Fast - CCS/NACS - POS & CMS & Boost Cables',
    description: 'CSEV MaxiCharger 240kW DC Fast - CCS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 2,
    amperage: null,
    kw208V: null,
    kw240V: null,
    kw480V: 240,
  },
  {
    id: 'dcfc-320kw-ccs-nacs',
    level: 'DCFC (Level 3)',
    name: 'CSEV DCHP 320kW - CCS/NACS - POS & CMS & Boost Cables',
    description: 'CSEV DCHP 320kW - CCS/NACS - POS & CMS & Boost Cables (Bundle of 2x 320kW chargers). Includes 2 Years of Parts Only Warranty',
    manufacturer: 'Autel',
    numberOfPlugs: 4,
    amperage: null,
    kw208V: null,
    kw240V: null,
    kw480V: 640,
  },
];

/**
 * Get all unique charger levels
 */
export function getChargerLevels(): ChargerLevel[] {
  return ['Level 2', 'DCFC (Level 3)'];
}

/**
 * Get EVSE equipment by level
 */
export function getEquipmentByLevel(level: ChargerLevel): EVSEEquipment[] {
  return evseEquipment.filter((e) => e.level === level);
}

/**
 * Get EVSE equipment by ID
 */
export function getEquipmentById(id: string): EVSEEquipment | undefined {
  return evseEquipment.find((e) => e.id === id);
}

/**
 * Get available voltages for a charger level
 */
export function getAvailableVoltages(level: ChargerLevel): SiteVoltage[] {
  if (level === 'Level 2') {
    return [240, 208]; // 240V is default
  }
  return [480]; // DCFC only uses 480V
}

/**
 * Get the default voltage for a charger level
 */
export function getDefaultVoltage(level: ChargerLevel): SiteVoltage {
  if (level === 'Level 2') {
    return 240;
  }
  return 480;
}

/**
 * Get kW output for an EVSE at a specific voltage
 */
export function getKwForVoltage(evse: EVSEEquipment, voltage: SiteVoltage): number {
  switch (voltage) {
    case 208:
      return evse.kw208V ?? 0;
    case 240:
      return evse.kw240V ?? 0;
    case 480:
      return evse.kw480V ?? 0;
    default:
      return 0;
  }
}

/**
 * Convert ChargerLevel to legacy ChargerType for calculations
 */
export function levelToType(level: ChargerLevel): 'Level2' | 'DCFC' {
  return level === 'Level 2' ? 'Level2' : 'DCFC';
}
