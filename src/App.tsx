import { GameCanvas } from "./components/GameCanvas/GameCanvas";
import { GameOverlay } from "./components/GameOverlay/GameOverlay";

export const App = () => (
    <main className="app">
        <GameCanvas />
        <GameOverlay />
    </main>
);
