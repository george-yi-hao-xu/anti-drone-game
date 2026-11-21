import { observer } from "mobx-react-lite";
import { GameCanvas } from "./components/GameCanvas/GameCanvas";
import { GameOverlay } from "./components/GameOverlay/GameOverlay";
import { game } from "./stores/GameStore";

export const App = observer(() => {
    const isPlaying = game.phase === "playing" || game.phase === "paused";

    return (
        <main className="app">
            {isPlaying && <GameCanvas />}
            <GameOverlay />
        </main>
    );
});
