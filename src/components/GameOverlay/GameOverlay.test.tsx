// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { game } from "~/stores/GameStore";
import { hud } from "~/stores/HudStore";
import { GameOverlay } from "./GameOverlay";

afterEach(() => {
    cleanup();
    game.returnToBriefing();
});

describe("GameOverlay", () => {
    it("starts the mission from the briefing", () => {
        render(<GameOverlay />);

        expect(screen.getByRole("heading", { name: "Anti-Drone" })).toBeTruthy();
        fireEvent.click(screen.getByRole("button", { name: "Begin defense" }));

        expect(game.phase).toBe("playing");
        expect(screen.queryByRole("heading", { name: "Anti-Drone" })).toBeNull();
    });

    it("resumes a paused mission", () => {
        game.start();
        game.pause();
        render(<GameOverlay />);

        expect(screen.getByRole("heading", { name: "Paused" })).toBeTruthy();
        fireEvent.click(screen.getByRole("button", { name: "Resume" }));

        expect(game.phase).toBe("playing");
    });

    it("shows captured mission results and retries", () => {
        game.start();
        hud.recordKill();
        hud.recordShot();
        game.finish(true);
        render(<GameOverlay />);

        expect(screen.getByRole("heading", { name: "Position held" })).toBeTruthy();
        expect(screen.getByText("Drones destroyed").nextSibling?.textContent).toBe("1");
        fireEvent.click(screen.getByRole("button", { name: "Try again" }));

        expect(game.phase).toBe("playing");
        expect(hud.kills).toBe(0);
    });
});
