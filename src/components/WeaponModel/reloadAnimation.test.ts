import { describe, expect, it } from "vitest";
import { getReloadHandTravel } from "./reloadAnimation";

const RELOAD_END = 12.2;
const RELOAD_DURATION = 2.2;

const travelAtProgress = (progress: number, reloading = true) =>
    getReloadHandTravel(
        RELOAD_END - RELOAD_DURATION + RELOAD_DURATION * progress,
        RELOAD_END,
        RELOAD_DURATION,
        reloading,
    );

describe("reload hand animation", () => {
    it("rests when no reload is active", () => {
        expect(travelAtProgress(0.5, false)).toBe(0);
    });

    it("moves down, holds, and returns to the grip", () => {
        expect(travelAtProgress(0)).toBe(0);
        expect(travelAtProgress(0.17)).toBeGreaterThan(0);
        expect(travelAtProgress(0.34)).toBe(1);
        expect(travelAtProgress(0.5)).toBe(1);
        expect(travelAtProgress(0.8)).toBeGreaterThan(0);
        expect(travelAtProgress(1)).toBe(0);
    });

    it("keeps travel bounded outside the reload window", () => {
        expect(travelAtProgress(-1)).toBe(0);
        expect(travelAtProgress(2)).toBe(0);
    });

    it("ignores invalid reload durations", () => {
        expect(getReloadHandTravel(1, 1, 0, true)).toBe(0);
    });
});
