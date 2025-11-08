import { Dimension } from "../types/dimension";

// Date property ID to label mapping for year dimension
const yearPropertyMap: { [key: string]: string } = {
  P575: "discovered", // or invented
  P7589: "date of assent",
  P577: "published",
  P1191: "first performed",
  P1619: "officially opened",
  P571: "created",
  P1249: "earliest record",
  P576: "ended",
  P8556: "became extinct",
  P6949: "announced",
  P1319: "earliest",
  P569: "born",
  P570: "died",
  P582: "ended",
  P580: "started",
  P7125: "latest one",
  P7124: "first one",
};

// Price property ID to label mapping
const pricePropertyMap: { [key: string]: string } = {
  P2124: "price",
  P2284: "purchase price",
  P3002: "estimated value",
  P2067: "mass market price",
};

export const yearDimension: Dimension = {
  name: "year",
  unit: "years",
  displayFormat: (value: number) => {
    if (value < -10000) {
      return value.toLocaleString();
    }
    return value.toString();
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return yearPropertyMap[propertyId] || propertyId;
  },
  periods: [
    [-100000, 1000],
    [1000, 1800],
    [1800, 2020],
  ],
};

export const priceDimension: Dimension = {
  name: "price",
  unit: "USD",
  displayFormat: (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return pricePropertyMap[propertyId] || "price";
  },
  periods: [
    [0, 10000],
    [10000, 100000],
    [100000, 1000000],
  ],
};

export const dimensions: { [key: string]: Dimension } = {
  year: yearDimension,
  price: priceDimension,
};

export function getDimension(name: string): Dimension {
  return dimensions[name] || yearDimension;
}

