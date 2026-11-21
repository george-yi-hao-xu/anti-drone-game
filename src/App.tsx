import { observer } from "mobx-react-lite";
import { GameCanvas } from "./components/GameCanvas/GameCanvas";
import { game } from "./stores/GameStore";

export const App = observer(() => {
    const isPlaying = game.phase === "playing" || game.phase === "paused";

    return <main className="app">{isPlaying && <GameCanvas />}</main>;
});
