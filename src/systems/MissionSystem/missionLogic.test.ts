import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { MISSION, PLAYER_POSITION } from "~/constants";
import { createDrones } from "~/stores/RuntimeStore";
import { getBreachedDrones, getMissionOutcome } from "./missionLogic";

describe("mission outcome", () => {
    it("wins at exactly the mission duration", () => {
        expect(getMissionOutcome(MISSION.duration, 100)).toBe("victory");
    });

    it("loses when health reaches zero before time expires", () => {
        expect(getMissionOutcome(MISSION.duration - 1, 0)).toBe("defeat");
    });

    it("prioritizes survival when time and damage resolve together", () => {
        expect(getMissionOutcome(MISSION.duration, 0)).toBe("victory");
    });
});

describe("safety perimeter", () => {
    it("detects active drones at or inside the safety radius", () => {
        const inside = createDrones()[0];
        inside.active = true;
        inside.position.set(
            PLAYER_POSITION[0] + MISSION.safetyRadius,
            PLAYER_POSITION[1],
            PLAYER_POSITION[2],
        );

        expect(getBreachedDrones([inside])).toEqual([inside]);
    });

    it("ignores safe, destroyed, and previously breached drones", () => {
        const safe = createDrones()[0];
        safe.active = true;
        safe.position.copy(
            new THREE.Vector3(
                PLAYER_POSITION[0] + MISSION.safetyRadius + 1,
                PLAYER_POSITION[1],
                PLAYER_POSITION[2],
            ),
        );
        const destroyed = createDrones()[1];
        destroyed.active = true;
        destroyed.destroyed = true;
        destroyed.position.set(...PLAYER_POSITION);
        const breached = createDrones()[2];
        breached.active = true;
        breached.breached = true;
        breached.position.set(...PLAYER_POSITION);

        expect(getBreachedDrones([safe, destroyed, breached])).toEqual([]);
    });
});
