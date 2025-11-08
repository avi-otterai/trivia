export interface Dimension {
  name: string;
  unit: string;
  displayFormat: (value: number) => string;
  compare: (a: number, b: number) => number;
  propertyLabel: (propertyId: string) => string;
  periods?: [number, number][];
}

