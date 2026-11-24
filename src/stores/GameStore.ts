import { action, makeObservable, observable } from "mobx";
import type { GamePhase, ResultState } from "~/types";
import { hud, type HudStore } from "./HudStore";
import { runtime, type RuntimeStore } from "./RuntimeStore";

export class GameStore {
    phase: GamePhase = "briefing";
    sensitivity = 1;
    result: ResultState | null = null;

    constructor(
        private readonly hudStore: HudStore = hud,
        private readonly runtimeStore: RuntimeStore = runtime,
    ) {
        makeObservable(this, {
            phase: observable,
            sensitivity: observable,
            result: observable,
            start: action,
            pause: action,
            resume: action,
            finish: action,
            returnToBriefing: action,
            setSensitivity: action,
        });
    }

    start() {
        this.hudStore.reset();
        this.runtimeStore.reset();
        this.result = null;
        this.phase = "playing";
    }

    pause() {
        if (this.phase === "playing") {
            this.phase = "paused";
        }
    }

    resume() {
        if (this.phase === "paused") {
            this.phase = "playing";
        }
    }

    finish(won: boolean) {
        if (this.phase !== "playing" && this.phase !== "paused") {
            return;
        }

        this.runtimeStore.ended = true;
        this.result = {
            won,
            kills: this.hudStore.kills,
            shots: this.hudStore.shots,
            health: this.hudStore.health,
            nearBlasts: this.hudStore.nearBlasts,
        };
        this.phase = won ? "victory" : "defeat";
    }

    returnToBriefing() {
        this.hudStore.reset();
        this.runtimeStore.reset();
        this.result = null;
        this.phase = "briefing";
    }

    setSensitivity(s: number) {
        this.sensitivity = Math.min(2, Math.max(0.25, s));
    }
}

export const game = new GameStore();
