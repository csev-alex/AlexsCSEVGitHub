import { ServiceClass } from '../types';

export interface ServiceClassInfo {
  id: ServiceClass;
  name: string;
  description: string;
  minKw?: number;
  maxKw?: number;
  notes?: string;
}

export const serviceClasses: ServiceClassInfo[] = [
  {
    id: 'SC-2D',
    name: 'SC-2D',
    description: 'Commercial service with demand metering',
    notes: 'Most common service class for commercial EV charging installations.',
  },
  {
    id: 'SC-3 Secondary',
    name: 'SC-3 Secondary',
    description: 'Large commercial service - Secondary voltage',
    minKw: 100,
    notes: 'For larger facilities receiving power at secondary voltage levels.',
  },
  {
    id: 'SC-3 Primary',
    name: 'SC-3 Primary',
    description: 'Large commercial service - Primary voltage',
    minKw: 100,
    notes: 'For facilities with primary voltage service (4kV-35kV).',
  },
  {
    id: 'SC-3 SubT/Trans',
    name: 'SC-3 SubT/Trans',
    description: 'Large commercial service - Subtransmission/Transmission voltage',
    minKw: 1000,
    notes: 'For major facilities receiving power at subtransmission or transmission voltage.',
  },
  {
    id: 'SC-3A Sec/Pri',
    name: 'SC-3A Sec/Pri',
    description: 'Large commercial with TOU - Secondary/Primary voltage',
    minKw: 100,
    notes: 'Time-of-use rate structure at secondary or primary voltage.',
  },
  {
    id: 'SC-3A SubT',
    name: 'SC-3A SubT',
    description: 'Large commercial with TOU - Subtransmission voltage',
    minKw: 1000,
    notes: 'Time-of-use rate structure at subtransmission voltage.',
  },
  {
    id: 'SC-3A Trans',
    name: 'SC-3A Trans',
    description: 'Large commercial with TOU - Transmission voltage',
    minKw: 1000,
    notes: 'Time-of-use rate structure at transmission voltage.',
  },
];

export function getServiceClassInfo(id: ServiceClass): ServiceClassInfo | undefined {
  return serviceClasses.find((sc) => sc.id === id);
}

export function getServiceClassesForDemand(demandKw: number): ServiceClassInfo[] {
  return serviceClasses.filter((sc) => {
    const meetsMin = sc.minKw === undefined || demandKw >= sc.minKw;
    const meetsMax = sc.maxKw === undefined || demandKw <= sc.maxKw;
    return meetsMin && meetsMax;
  });
}
