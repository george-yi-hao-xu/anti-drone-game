import { describe, expect, it } from "vitest";
import {
    BEARING_PANEL_RADIUS,
    BEARING_PANELS,
    CARDINAL_PANEL_RADIUS,
    CARDINAL_PANELS,
    formatBearingLabel,
} from "./arenaLayout";

describe("arena panel layout", () => {
    it("formats clockwise bearings with cardinal quarter labels", () => {
        expect(BEARING_PANELS.map((panel) => panel.label)).toEqual([
            "N",
            "023",
            "045",
            "068",
            "E",
            "113",
            "135",
            "158",
            "S",
            "203",
            "225",
            "248",
            "W",
            "293",
            "315",
            "338",
        ]);
        expect(formatBearingLabel(1)).toBe("023");
    });

    it("places the cardinal panels on the expected Three.js axes", () => {
        expect(CARDINAL_PANELS.map((panel) => panel.position)).toEqual([
            [0, 0, -CARDINAL_PANEL_RADIUS],
            [CARDINAL_PANEL_RADIUS, 0, 0],
            [0, 0, CARDINAL_PANEL_RADIUS],
            [-CARDINAL_PANEL_RADIUS, 0, 0],
        ]);
    });

    it("faces every bearing panel toward the origin", () => {
        expect(BEARING_PANELS).toHaveLength(16);

        for (const panel of BEARING_PANELS) {
            const [x, , z] = panel.position;
            const distance = Math.hypot(x, z);
            const forwardX = Math.sin(panel.rotationY);
            const forwardZ = Math.cos(panel.rotationY);

            expect(forwardX).toBeCloseTo(-x / distance);
            expect(forwardZ).toBeCloseTo(-z / distance);
            expect(distance).toBeCloseTo(BEARING_PANEL_RADIUS);
        }
    });
});
