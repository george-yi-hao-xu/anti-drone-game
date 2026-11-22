export type PositionPanelVariant = "cardinal" | "bearing";

export interface PositionPanelConfig {
    position: readonly [number, number, number];
    rotationY: number;
    label: string;
    variant: PositionPanelVariant;
    accent?: string;
}

const CARDINAL_COLORS = {
    N: "#27d7ff",
    E: "#ffcb45",
    S: "#ff6b8a",
    W: "#8bf08f",
} as const;

export const CARDINAL_PANEL_RADIUS = 30;
export const BEARING_PANEL_RADIUS = 42;

const CARDINAL_LABELS = new Map<number, keyof typeof CARDINAL_COLORS>([
    [0, "N"],
    [4, "E"],
    [8, "S"],
    [12, "W"],
]);

const panelRotationTowardOrigin = (x: number, z: number) => Math.atan2(-x, -z);

export const formatBearingLabel = (index: number) => {
    const cardinal = CARDINAL_LABELS.get(index);

    if (cardinal) {
        return cardinal;
    }

    return Math.round(index * 22.5)
        .toString()
        .padStart(3, "0");
};

export const CARDINAL_PANELS: PositionPanelConfig[] = [
    { label: "N", x: 0, z: -CARDINAL_PANEL_RADIUS },
    { label: "E", x: CARDINAL_PANEL_RADIUS, z: 0 },
    { label: "S", x: 0, z: CARDINAL_PANEL_RADIUS },
    { label: "W", x: -CARDINAL_PANEL_RADIUS, z: 0 },
].map(({ label, x, z }) => ({
    position: [x, 0, z] as const,
    rotationY: panelRotationTowardOrigin(x, z),
    label,
    variant: "cardinal",
    accent: CARDINAL_COLORS[label as keyof typeof CARDINAL_COLORS],
}));

export const BEARING_PANELS: PositionPanelConfig[] = Array.from(
    { length: 16 },
    (_, index) => {
        const angle = (index / 16) * Math.PI * 2;
        const x = Math.sin(angle) * BEARING_PANEL_RADIUS;
        const z = -Math.cos(angle) * BEARING_PANEL_RADIUS;
        const label = formatBearingLabel(index);
        const cardinal = CARDINAL_LABELS.get(index);

        return {
            position: [x, 0, z] as const,
            rotationY: panelRotationTowardOrigin(x, z),
            label,
            variant: "bearing",
            accent: cardinal ? CARDINAL_COLORS[cardinal] : undefined,
        };
    },
);
