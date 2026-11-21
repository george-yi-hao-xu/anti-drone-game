import { GamePhase } from "../types";
import { makeAutoObservable } from "mobx";

class GameStore {
    phase: GamePhase = "briefing";
    sensetivity = 1;

    constructor() {
        makeAutoObservable(this);
    }

    setPhase(p: GamePhase) {
        this.phase = p;
    }

    setSensitivity(s: number) {
        this.sensetivity = s;
    }
}

export const game = new GameStore();
