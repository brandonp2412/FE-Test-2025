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
  classification?: string;
}

export function getHorseClassification(horse: Horse): string | null {
  const weight = horse.profile?.physical?.weight;
  if (weight === null || weight === undefined) {
    return horse.classification ?? null;
  }
  return weight >= 400 ? 'Horse' : 'Pony';
}