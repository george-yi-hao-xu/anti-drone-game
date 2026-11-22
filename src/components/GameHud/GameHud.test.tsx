// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { game } from "../../stores/GameStore";
import { hud } from "../../stores/HudStore";
import { GameHud } from "./GameHud";

afterEach(() => {
    cleanup();
    game.returnToBriefing();
});

describe("GameHud", () => {
    it("is hidden outside an active mission", () => {
        render(<GameHud />);

        expect(screen.queryByLabelText("Combat status")).toBeNull();
    });

    it("shows current mission and weapon state", () => {
        game.start();
        hud.setElapsed(30);
        hud.setAmmo(7, 84);
        hud.takeDamage(25);
        hud.recordKill();

        render(<GameHud />);

        expect(screen.getByLabelText("Mission timer").textContent).toContain("1:00");
        expect(screen.getByLabelText("Player health").textContent).toContain("75%");
        expect(screen.getByLabelText("Drones destroyed").textContent).toContain("1");
        expect(screen.getByLabelText("Fire mode").textContent).toContain("AUTO");
        expect(screen.getByLabelText("Ammunition").textContent).toContain("07/ 84");
    });
});
