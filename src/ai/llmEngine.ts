import {
  CreateMLCEngine,
  type MLCEngine,
} from "@mlc-ai/web-llm";

const MODEL = "Llama-3.2-3B-Instruct-q4f16_1-MLC";

let engine: MLCEngine | null = null;

let loadingPromise: Promise<MLCEngine> | null = null;

export async function loadLocalModel(
  onProgress?: (progress: number) => void
): Promise<MLCEngine> {
  if (engine) {
    return engine;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = CreateMLCEngine(MODEL, {
    initProgressCallback: (progress) => {
      const percentage = Math.round(
        progress.progress * 100
      );

      onProgress?.(percentage);
    },
  });

  try {
    engine = await loadingPromise;
    return engine;
  } finally {
    loadingPromise = null;
  }
}

export function getLocalEngine(): MLCEngine {
  if (!engine) {
    throw new Error(
      "Local AI model has not been loaded yet."
    );
  }

  return engine;
}