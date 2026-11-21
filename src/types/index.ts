export type GamePhase =
    "briefing" | "playing" | "paused" | "victory" | "defeat";
export type FireMode = "SEMI" | "AUTO";

export interface HudState {
    health: number;
    ammo: number;
    reserve: number;
    fireMode: FireMode;
    elapsed: number;
    kills: number;
    shots: number;
    nearBlasts: number;
    targetRange: number | null;
    targetUnsafe: boolean;
    reloading: boolean;
    message: string;
}

export interface ResultState {
    won: boolean;
    kills: number;
    shots: number;
    health: number;
    nearBlasts: number;
}
