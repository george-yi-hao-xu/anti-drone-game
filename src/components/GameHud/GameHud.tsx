import { observer } from "mobx-react-lite";
import type { CSSProperties } from "react";
import { MISSION } from "~/constants";
import { GameRadar } from "~/components/GameRadar/GameRadar";
import { game } from "~/stores/GameStore";
import { hud } from "~/stores/HudStore";
import { runtime } from "~/stores/RuntimeStore";
import "./GameHud.scss";

const LOW_AMMO_THRESHOLD = 5;

const formatTime = (seconds: number) => {
    const remaining = Math.max(0, Math.ceil(MISSION.duration - seconds));
    const minutes = Math.floor(remaining / 60);
    const paddedSeconds = String(remaining % 60).padStart(2, "0");

    return `${minutes}:${paddedSeconds}`;
};

export const GameHud = observer(() => {
    if (game.phase !== "playing" && game.phase !== "paused") {
        return null;
    }

    const healthState = hud.health <= 25 ? "critical" : hud.health <= 50 ? "warning" : "ready";
    const reloadProgress = hud.reloading
        ? Math.min(
            100,
            Math.max(
                0,
                ((hud.elapsed - (runtime.reloadEnd - MISSION.reloadSeconds)) /
                    MISSION.reloadSeconds) *
                    100,
            ),
        )
        : 0;
    const recoilBloom = Math.min(1, runtime.recoil / 0.11) * 8;
    const reticleHalfGap = 3 + (1 - runtime.aimProgress) * 13 + recoilBloom;
    const reticleOpacity = Math.max(0, 1 - runtime.aimProgress);

    return (
        <aside className="game-hud" aria-label="Combat status">
            <div className="game-hud__top-left">
                <section className="hud-panel hud-panel--mission" aria-label="Mission timer">
                    <span className="hud-label">Hold position</span>
                    <strong className="hud-time">{formatTime(hud.elapsed)}</strong>
                </section>

                <section className="hud-panel hud-panel--health" aria-label="Player health">
                    <div className="hud-row">
                        <span className="hud-label">Integrity</span>
                        <strong>{hud.health}%</strong>
                    </div>
                    <div className="hud-meter" aria-hidden="true">
                        <span
                            className={`hud-meter__fill hud-meter__fill--${healthState}`}
                            style={{ width: `${hud.health}%` }}
                        />
                    </div>
                </section>
            </div>

            <div className="game-hud__top-right">
                <section className="hud-panel hud-panel--compact" aria-label="Drones destroyed">
                    <span className="hud-label">Destroyed</span>
                    <strong>{hud.kills}</strong>
                </section>
                <section className="hud-panel hud-panel--compact" aria-label="Fire mode">
                    <span className="hud-label">Fire mode</span>
                    <strong>{hud.fireMode}</strong>
                </section>
            </div>

            <div className="game-hud__status" role="status" aria-live="polite">
                <span className={hud.targetUnsafe ? "hud-status hud-status--danger" : "hud-status"}>
                    {hud.reloading ? "RELOADING" : hud.message}
                </span>
                {hud.targetRange !== null && (
                    <span className="hud-range">{Math.round(hud.targetRange)} M</span>
                )}
            </div>

            {/* 屏幕中央的准星  */}
            <div
                className="game-hud__reticle"
                style={{
                    "--reticle-half-gap": `${reticleHalfGap}px`,
                    opacity: reticleOpacity,
                } as CSSProperties}
                aria-hidden="true"
            />

            {hud.ammo > 0 && hud.ammo < LOW_AMMO_THRESHOLD && !hud.reloading && (
                <div className="game-hud__reload-prompt">Press R to reload</div>
            )}

            <GameRadar />

            <section
                className={`hud-ammo${hud.reloading ? " hud-ammo--reloading" : ""}`}
                aria-label="Ammunition"
            >
                <span className="hud-label">Ammunition</span>
                <div className="hud-ammo__count">
                    <strong>{String(hud.ammo).padStart(2, "0")}</strong>
                    <span>/ {hud.reserve}</span>
                </div>
                <div className="hud-ammo__magazine" aria-hidden="true">
                    {Array.from({ length: MISSION.magazineSize }, (_, index) => (
                        <span key={index} className={index < hud.ammo ? "is-loaded" : ""} />
                    ))}
                </div>
                {hud.reloading && (
                    <div className="hud-reload" aria-label="Reloading">
                        <span style={{ width: `${reloadProgress}%` }} />
                    </div>
                )}
            </section>
        </aside>
    );
});
