export interface Physical {
  height: number | null;
  weight: number | null;
}

export interface HorseProfile {
  favouriteFood: string | null;
  physical: Physical | null;
}

export interface Horse {
  id?: string; // ID is optional for new horses
  name: string;
  profile: HorseProfile | null;
  classification?: string; // Add classification field for HorseDetails
}