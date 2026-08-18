import type { MLCEngine } from "@mlc-ai/web-llm";

let engine: MLCEngine | null = {} as MLCEngine;

export async function loadLocalModel(
  onProgress?: (progress: number) => void,
): Promise<MLCEngine> {
  onProgress?.(100);
  return engine;
}

export function getLocalEngine(): MLCEngine {
  return engine as MLCEngine;
}
