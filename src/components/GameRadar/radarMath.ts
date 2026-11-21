const RADAR_EDGE_PERCENT = 43;

export interface RadarPoint {
    left: number;
    top: number;
}

export function projectToRadar(
    x: number,
    z: number,
    range: number,
    playerYaw = 0,
): RadarPoint {
    const safeRange = Math.max(1, range);
    const cos = Math.cos(playerYaw);
    const sin = Math.sin(playerYaw);
    let normalizedX = (cos * x - sin * z) / safeRange;
    let normalizedZ = (sin * x + cos * z) / safeRange;
    const distance = Math.hypot(normalizedX, normalizedZ);

    if (distance > 1) {
        normalizedX /= distance;
        normalizedZ /= distance;
    }

    return {
        left: 50 + normalizedX * RADAR_EDGE_PERCENT,
        top: 50 + normalizedZ * RADAR_EDGE_PERCENT,
    };
}
