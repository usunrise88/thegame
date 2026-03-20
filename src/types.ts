export interface UserData {
  name: string;
  nickname?: string;
  email: string;
  telegram: string;
  position?: string;
  company?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  nickname?: string;
  coins: number;
  date: string;
}
