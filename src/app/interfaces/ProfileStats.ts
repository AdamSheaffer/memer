export interface ProfileStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalPoints: number;
}

export interface ProfileStatsChanges {
  gamesPlayed?: number;
  gamesWon?: number;
  gamesLost?: number;
  totalPoints?: number;
}
