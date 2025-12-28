export type Role = "worker" | "fm";

export type Floor = 5 | 6;

export type Zone = "1-10" | "11-20" | "21-30" | "31-40";

export type Comfort = "cold" | "comfortable" | "warm";

export type ComfortReport = {
  id: string;
  role: Role;
  floor: Floor;
  zone: Zone;
  comfort: Comfort;
  comment?: string;
  createdAt: string;
};

