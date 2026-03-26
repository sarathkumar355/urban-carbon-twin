export type EmissionRecord = {
  year: number;
  value: number; // MtCO2e
};

export const emissionsHistory: EmissionRecord[] = [
  { year: 2014, value: 34250 },
  { year: 2015, value: 34500 },
  { year: 2016, value: 34800 },
  { year: 2017, value: 35200 },
  { year: 2018, value: 36100 },
  { year: 2019, value: 36400 },
  { year: 2020, value: 34000 }, // Global Dip due to lockdowns
  { year: 2021, value: 36300 },
  { year: 2022, value: 36800 },
  { year: 2023, value: 37100 },
  { year: 2024, value: 37400 }
];
