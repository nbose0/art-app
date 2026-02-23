"use client";

interface RoundIndicatorProps {
  currentRound: number;
  totalRounds: number;
}

export default function RoundIndicator({
  currentRound,
  totalRounds,
}: RoundIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-muted">
        Round {currentRound + 1} of {totalRounds}
      </p>
      <div className="flex gap-2">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              i < currentRound
                ? "bg-primary"
                : i === currentRound
                  ? "bg-primary animate-pulse-soft scale-125"
                  : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
