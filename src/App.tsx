import { GameCanvas } from "./components/GameCanvas/GameCanvas";
import { GameHud } from "./components/GameHud/GameHud";
import { GameOverlay } from "./components/GameOverlay/GameOverlay";

export const App = () => (
    <main className="app">
        <GameCanvas />
        <GameHud />
        <GameOverlay />
    </main>
);
