import { Check, LoaderCircle } from "lucide-react";

const STEPS = [
  "Understanding your request",
  "Finding matching prospects",
  "Preparing your dataset",
];

export default function ProcessingMessage() {
  return (
    <div className="flex animate-fade-in justify-start">
      <div className="flex max-w-[85%] items-start gap-3">
        {/* AI avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700">
          AI
        </div>

        {/* Bubble */}
        <div className="rounded-2xl rounded-tl-md border border-zinc-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <LoaderCircle size={15} className="animate-spin text-zinc-500" />
            Analyzing your request…
          </div>

          <div className="mt-3 space-y-2">
            {STEPS.map((step) => (
              <div key={step} className="flex items-center gap-2 text-xs text-zinc-500">
                <Check size={13} className="text-emerald-500" />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
