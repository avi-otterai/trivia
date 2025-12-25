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

// Speed property ID to label mapping
const speedPropertyMap: { [key: string]: string } = {
  P2052: "top speed",
  P2053: "max speed",
  P8516: "cruising speed",
};

// Height property ID to label mapping
const heightPropertyMap: { [key: string]: string } = {
  P2048: "height",
  P2044: "elevation",
  P2793: "structural height",
};

// Population property ID to label mapping
const populationPropertyMap: { [key: string]: string } = {
  P1082: "population",
  P1539: "female population",
  P1540: "male population",
};

// Weight property ID to label mapping
const weightPropertyMap: { [key: string]: string } = {
  P2067: "weight",
  P2068: "mass",
  P2128: "curb weight",
};

// Prep time property ID to label mapping
const preptimePropertyMap: { [key: string]: string } = {
  P2781: "prep time",
};

// Lifespan property ID to label mapping
const lifespanPropertyMap: { [key: string]: string } = {
  P2250: "lifespan",
};

// Distance property ID to label mapping
const distancePropertyMap: { [key: string]: string } = {
  P2043: "distance",
};

// Temperature property ID to label mapping
const temperaturePropertyMap: { [key: string]: string } = {
  P2076: "temperature",
};

// Area property ID to label mapping
const areaPropertyMap: { [key: string]: string } = {
  P2046: "area",
};

// Depth property ID to label mapping
const depthPropertyMap: { [key: string]: string } = {
  P4511: "depth",
};

// Calories property ID to label mapping
const caloriesPropertyMap: { [key: string]: string } = {
  P1109: "calories",
};

// Duration property ID to label mapping
const durationPropertyMap: { [key: string]: string } = {
  P2047: "duration",
};

// Box office property ID to label mapping
const boxofficePropertyMap: { [key: string]: string } = {
  P2142: "box office",
};

// Album sales property ID to label mapping
const albumsalesPropertyMap: { [key: string]: string } = {
  P2142: "sales",
};

// Net worth property ID to label mapping
const networthPropertyMap: { [key: string]: string } = {
  P2218: "net worth",
};

// Game sales property ID to label mapping
const gamesalesPropertyMap: { [key: string]: string } = {
  P2142: "sales",
};

// Followers property ID to label mapping
const followersPropertyMap: { [key: string]: string } = {
  P8687: "followers",
};

// Stadium capacity property ID to label mapping
const stadiumsPropertyMap: { [key: string]: string } = {
  P1083: "capacity",
};

// Horsepower property ID to label mapping
const horsepowerPropertyMap: { [key: string]: string } = {
  P2109: "horsepower",
};

// Elevation property ID to label mapping
const elevationPropertyMap: { [key: string]: string } = {
  P2044: "elevation",
};

// Founded property ID to label mapping
const foundedPropertyMap: { [key: string]: string } = {
  P571: "founded",
};

// Oscars property ID to label mapping
const oscarsPropertyMap: { [key: string]: string } = {
  P166: "Oscar wins",
};

// Streams property ID to label mapping
const streamsPropertyMap: { [key: string]: string } = {
  P2142: "streams",
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
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
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
    [100000, 1000000000],
  ],
};

export const speedDimension: Dimension = {
  name: "speed",
  unit: "km/h",
  displayFormat: (value: number) => {
    if (value >= 10000) {
      return `${(value / 1000).toFixed(0)}K km/h`;
    }
    if (value >= 1000) {
      return `${value.toLocaleString()} km/h`;
    }
    return `${value} km/h`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return speedPropertyMap[propertyId] || "top speed";
  },
  periods: [
    [0, 100],
    [100, 500],
    [500, 50000],
  ],
};

export const heightDimension: Dimension = {
  name: "height",
  unit: "meters",
  displayFormat: (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} km`;
    }
    return `${value.toLocaleString()} m`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return heightPropertyMap[propertyId] || "height";
  },
  periods: [
    [0, 200],
    [200, 1000],
    [1000, 10000],
  ],
};

export const populationDimension: Dimension = {
  name: "population",
  unit: "people",
  displayFormat: (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return populationPropertyMap[propertyId] || "population";
  },
  periods: [
    [0, 10000000],
    [10000000, 100000000],
    [100000000, 2000000000],
  ],
};

export const weightDimension: Dimension = {
  name: "weight",
  unit: "kg",
  displayFormat: (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000).toFixed(0)} tons`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} tons`;
    }
    if (value >= 1) {
      return `${value.toLocaleString()} kg`;
    }
    return `${(value * 1000).toFixed(0)} g`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return weightPropertyMap[propertyId] || "weight";
  },
  periods: [
    [0, 100],
    [100, 10000],
    [10000, 500000],
  ],
};

export const preptimeDimension: Dimension = {
  name: "preptime",
  unit: "minutes",
  displayFormat: (value: number) => {
    if (value >= 1440) {
      const days = value / 1440;
      if (days === Math.floor(days)) {
        return `${days} day${days > 1 ? "s" : ""}`;
      }
      return `${days.toFixed(1)} days`;
    }
    if (value >= 60) {
      const hours = value / 60;
      if (hours === Math.floor(hours)) {
        return `${hours} hr${hours > 1 ? "s" : ""}`;
      }
      return `${hours.toFixed(1)} hrs`;
    }
    return `${value} min`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return preptimePropertyMap[propertyId] || "prep time";
  },
  periods: [
    [0, 30],
    [30, 120],
    [120, 10000],
  ],
};

export const lifespanDimension: Dimension = {
  name: "lifespan",
  unit: "years",
  displayFormat: (value: number) => {
    if (value === 1) {
      return "1 year";
    }
    return `${value} years`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return lifespanPropertyMap[propertyId] || "lifespan";
  },
  periods: [
    [0, 20],
    [20, 80],
    [80, 500],
  ],
};

export const distanceDimension: Dimension = {
  name: "distance",
  unit: "km",
  displayFormat: (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(0)}B km`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M km`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K km`;
    }
    return `${value.toLocaleString()} km`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return distancePropertyMap[propertyId] || "distance";
  },
  periods: [
    [0, 10000],
    [10000, 1000000],
    [1000000, 1000000000000],
  ],
};

export const temperatureDimension: Dimension = {
  name: "temperature",
  unit: "°C",
  displayFormat: (value: number) => {
    return `${value}°C`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return temperaturePropertyMap[propertyId] || "temperature";
  },
  periods: [
    [-300, 0],
    [0, 100],
    [100, 100000],
  ],
};

export const areaDimension: Dimension = {
  name: "area",
  unit: "km²",
  displayFormat: (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M km²`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K km²`;
    }
    return `${value.toLocaleString()} km²`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return areaPropertyMap[propertyId] || "area";
  },
  periods: [
    [0, 1000],
    [1000, 1000000],
    [1000000, 20000000],
  ],
};

export const depthDimension: Dimension = {
  name: "depth",
  unit: "m",
  displayFormat: (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} km`;
    }
    return `${value.toLocaleString()} m`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return depthPropertyMap[propertyId] || "depth";
  },
  periods: [
    [0, 500],
    [500, 5000],
    [5000, 15000],
  ],
};

export const caloriesDimension: Dimension = {
  name: "calories",
  unit: "cal",
  displayFormat: (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K cal`;
    }
    return `${value} cal`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return caloriesPropertyMap[propertyId] || "calories";
  },
  periods: [
    [0, 100],
    [100, 500],
    [500, 10000],
  ],
};

export const durationDimension: Dimension = {
  name: "duration",
  unit: "seconds",
  displayFormat: (value: number) => {
    if (value >= 3600) {
      const hours = value / 3600;
      if (hours === Math.floor(hours)) {
        return `${hours} hr${hours > 1 ? "s" : ""}`;
      }
      return `${hours.toFixed(1)} hrs`;
    }
    if (value >= 60) {
      const mins = value / 60;
      if (mins === Math.floor(mins)) {
        return `${mins} min`;
      }
      return `${mins.toFixed(1)} min`;
    }
    return `${value} sec`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return durationPropertyMap[propertyId] || "duration";
  },
  periods: [
    [0, 60],
    [60, 3600],
    [3600, 100000],
  ],
};

export const boxofficeDimension: Dimension = {
  name: "boxoffice",
  unit: "USD",
  displayFormat: (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(0)}M`;
    }
    return `$${value.toLocaleString()}`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return boxofficePropertyMap[propertyId] || "box office";
  },
  periods: [
    [0, 500000000],
    [500000000, 1500000000],
    [1500000000, 5000000000],
  ],
};

export const albumsalesDimension: Dimension = {
  name: "albumsales",
  unit: "copies",
  displayFormat: (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M copies`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K copies`;
    }
    return `${value.toLocaleString()} copies`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return albumsalesPropertyMap[propertyId] || "sales";
  },
  periods: [
    [0, 20000000],
    [20000000, 40000000],
    [40000000, 100000000],
  ],
};

export const networthDimension: Dimension = {
  name: "networth",
  unit: "USD",
  displayFormat: (value: number) => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(1)}T`;
    }
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(0)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(0)}M`;
    }
    return `$${value.toLocaleString()}`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return networthPropertyMap[propertyId] || "net worth";
  },
  periods: [
    [0, 10000000000],
    [10000000000, 100000000000],
    [100000000000, 1000000000000],
  ],
};

export const gamesalesDimension: Dimension = {
  name: "gamesales",
  unit: "copies",
  displayFormat: (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M copies`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K copies`;
    }
    return `${value.toLocaleString()} copies`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return gamesalesPropertyMap[propertyId] || "sales";
  },
  periods: [
    [0, 50000000],
    [50000000, 100000000],
    [100000000, 500000000],
  ],
};

export const followersDimension: Dimension = {
  name: "followers",
  unit: "followers",
  displayFormat: (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return followersPropertyMap[propertyId] || "followers";
  },
  periods: [
    [0, 100000000],
    [100000000, 300000000],
    [300000000, 1000000000],
  ],
};

export const stadiumsDimension: Dimension = {
  name: "stadiums",
  unit: "seats",
  displayFormat: (value: number) => {
    return `${value.toLocaleString()} seats`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return stadiumsPropertyMap[propertyId] || "capacity";
  },
  periods: [
    [0, 50000],
    [50000, 80000],
    [80000, 200000],
  ],
};

export const horsepowerDimension: Dimension = {
  name: "horsepower",
  unit: "hp",
  displayFormat: (value: number) => {
    return `${value.toLocaleString()} hp`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return horsepowerPropertyMap[propertyId] || "horsepower";
  },
  periods: [
    [0, 300],
    [300, 700],
    [700, 2000],
  ],
};

export const elevationDimension: Dimension = {
  name: "elevation",
  unit: "m",
  displayFormat: (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} km`;
    }
    return `${value.toLocaleString()} m`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return elevationPropertyMap[propertyId] || "elevation";
  },
  periods: [
    [0, 1000],
    [1000, 2500],
    [2500, 5000],
  ],
};

export const foundedDimension: Dimension = {
  name: "founded",
  unit: "year",
  displayFormat: (value: number) => {
    return value.toString();
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return foundedPropertyMap[propertyId] || "founded";
  },
  periods: [
    [0, 1900],
    [1900, 1980],
    [1980, 2030],
  ],
};

export const oscarsDimension: Dimension = {
  name: "oscars",
  unit: "wins",
  displayFormat: (value: number) => {
    if (value === 1) {
      return "1 win";
    }
    return `${value} wins`;
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return oscarsPropertyMap[propertyId] || "Oscar wins";
  },
  periods: [
    [0, 4],
    [4, 8],
    [8, 15],
  ],
};

export const streamsDimension: Dimension = {
  name: "streams",
  unit: "streams",
  displayFormat: (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    return value.toLocaleString();
  },
  compare: (a: number, b: number) => a - b,
  propertyLabel: (propertyId: string) => {
    return streamsPropertyMap[propertyId] || "streams";
  },
  periods: [
    [0, 2000000000],
    [2000000000, 4000000000],
    [4000000000, 10000000000],
  ],
};

export const dimensions: { [key: string]: Dimension } = {
  year: yearDimension,
  price: priceDimension,
  speed: speedDimension,
  height: heightDimension,
  population: populationDimension,
  weight: weightDimension,
  preptime: preptimeDimension,
  lifespan: lifespanDimension,
  distance: distanceDimension,
  temperature: temperatureDimension,
  area: areaDimension,
  depth: depthDimension,
  calories: caloriesDimension,
  duration: durationDimension,
  boxoffice: boxofficeDimension,
  albumsales: albumsalesDimension,
  networth: networthDimension,
  gamesales: gamesalesDimension,
  followers: followersDimension,
  stadiums: stadiumsDimension,
  horsepower: horsepowerDimension,
  elevation: elevationDimension,
  founded: foundedDimension,
  oscars: oscarsDimension,
  streams: streamsDimension,
};

export function getDimension(name: string): Dimension {
  return dimensions[name] || yearDimension;
}
