import { PlacedComponent } from '../types/builder';

export interface BreadboardSnapResult {
  isColliding: boolean;
  snappedX: number;
  snappedY: number;
  column: number;
  rowName: string;
}

/**
 * Calculates whether a component collides with a placed breadboard
 * and snaps its coordinates to the nearest breadboard socket tie-point row/column.
 */
export function calculateBreadboardSnap(
  compX: number,
  compY: number,
  componentId: string,
  breadboard: PlacedComponent
): BreadboardSnapResult | null {
  const bbX = breadboard.x;
  const bbY = breadboard.y;
  const bbW = 300;
  const bbH = 145;

  // Collision tolerance margins
  const margin = 15;
  if (
    compX < bbX - margin ||
    compX > bbX + bbW + margin ||
    compY < bbY - margin ||
    compY > bbY + bbH + margin
  ) {
    return null;
  }

  // Calculate nearest column (1 to 30)
  const colPitch = 7.8;
  const colStart = 36;
  const rawCol = Math.round((compX - bbX - colStart) / colPitch) + 1;
  const column = Math.max(1, Math.min(30, rawCol));
  const snappedX = Math.round(bbX + colStart + (column - 1) * colPitch);

  // Calculate nearest row section
  const relY = compY - bbY;
  let snappedY = compY;
  let rowName = 'Tie Point';

  if (relY < 38) {
    // Top Power Rails
    snappedY = bbY + 18;
    rowName = `Top Power Rail (+ / -) Col ${column}`;
  } else if (relY >= 38 && relY < 75) {
    // Rows a - e (Top strip)
    snappedY = bbY + 48;
    rowName = `Rows a-e (Tie points), Col ${column}`;
  } else if (relY >= 75 && relY < 105) {
    // Rows f - j (Bottom strip)
    snappedY = bbY + 84;
    rowName = `Rows f-j (Tie points), Col ${column}`;
  } else {
    // Bottom Power Rails
    snappedY = bbY + 114;
    rowName = `Bottom Power Rail (+ / -) Col ${column}`;
  }

  return {
    isColliding: true,
    snappedX,
    snappedY,
    column,
    rowName
  };
}
