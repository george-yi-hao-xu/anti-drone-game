import { observer } from "mobx-react-lite";
import { MISSION } from "~/constants";
import { game } from "~/stores/GameStore";
import { requestGamePointerLock } from "~/systems/PlayerControls/pointerLock";
import { Mouse, MousePointer } from 'lucide-react';
import "./GameOverlay.scss";

const startMission = () => {
    game.start();
    requestGamePointerLock();
};

const resumeMission = () => {
    game.resume();
    requestGamePointerLock();
};

const Briefing = () => (
    <section className="panel" aria-labelledby="briefing-title">
        {/* <p className="panel__eyebrow">Arcade defense prototype</p> */}
        <h1 id="briefing-title">Shoot down FPVs</h1>
        <p className="panel__lead">
            Hold your position for {MISSION.duration} seconds. Shoot down all drones!
        </p>

        <dl className="controls" aria-label="Controls">
            <div>
                <dt>View</dt>
                <dd><Mouse /></dd>
            </div>
            <div>
                <dt>Fire</dt>
                <dd><MousePointer /></dd>
            </div>
            <div>
                <dt>Reload</dt>
                <dd>R</dd>
            </div>
            <div>
                <dt>Fire mode</dt>
                <dd>B</dd>
            </div>
        </dl>

        <button className="button button--primary" onClick={startMission}>
            Start Game
        </button>
    </section>
);

const Pause = () => (
    <section className="panel panel--compact" aria-labelledby="pause-title">
        <p className="panel__eyebrow">Mission interrupted</p>
        <h1 id="pause-title">Paused</h1>
        <p className="panel__lead">The timer and incoming drones are frozen.</p>
        <div className="button-row">
            <button className="button button--primary" onClick={resumeMission}>
                Resume
            </button>
            <button className="button" onClick={startMission}>
                Restart mission
            </button>
        </div>
    </section>
);

const Result = observer(({ won }: { won: boolean }) => {
    const result = game.result;

    return (
        <section className="panel panel--compact" aria-labelledby="result-title">
            <p className="panel__eyebrow">Mission complete</p>
            <h1 id="result-title">{won ? "WIN!" : "Position lost"}</h1>
            <p className="panel__lead">
                {won
                    ? "You survived the full assault."
                    : "The defensive position was overrun."}
            </p>

            {result && (
                <dl className="results" aria-label="Mission results">
                    <div>
                        <dt>Drones destroyed</dt>
                        <dd>{result.kills}</dd>
                    </div>
                    <div>
                        <dt>Shots fired</dt>
                        <dd>{result.shots}</dd>
                    </div>
                    <div>
                        <dt>Health remaining</dt>
                        <dd>{result.health}%</dd>
                    </div>
                </dl>
            )}

            <button className="button button--primary" onClick={startMission}>
                Try again
            </button>
        </section>
    );
});

export const GameOverlay = observer(() => {
    if (game.phase === "playing") {
        return null;
    }

    return (
        <div className={`overlay overlay--${game.phase}`}>
            {game.phase === "briefing" && <Briefing />}
            {game.phase === "paused" && <Pause />}
            {game.phase === "victory" && <Result won />}
            {game.phase === "defeat" && <Result won={false} />}
        </div>
    );
});
