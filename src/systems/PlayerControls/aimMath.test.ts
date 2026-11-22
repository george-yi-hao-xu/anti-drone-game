import { describe, expect, it } from "vitest";
import { applyPointerMovement } from "./aimMath";

describe("pointer aiming", () => {
    it("turns in the opposite direction of pointer displacement", () => {
        const aim = applyPointerMovement(0, 0, 100, -50, 1);

        expect(aim.yaw).toBeLessThan(0);
        expect(aim.pitch).toBeGreaterThan(0);
    });

    it("scales movement with sensitivity", () => {
        const normal = applyPointerMovement(0, 0, 20, 20, 1);
        const slow = applyPointerMovement(0, 0, 20, 20, 0.5);

        expect(Math.abs(normal.yaw)).toBeGreaterThan(Math.abs(slow.yaw));
        expect(Math.abs(normal.pitch)).toBeGreaterThan(Math.abs(slow.pitch));
    });

    it("clamps vertical aiming", () => {
        const upward = applyPointerMovement(0, 0, 0, -10000, 1);
        const downward = applyPointerMovement(0, 0, 0, 10000, 1);

        expect(upward.pitch).toBe(1.05);
        expect(downward.pitch).toBe(-1.2);
    });
});
