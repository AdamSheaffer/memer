export enum RoundType {
  Standard = 'Standard',
  Reverse = 'Reverse'
}

export interface Round {
  roundType: RoundType;
  isSpecial: boolean;
}
