"use client";

interface TimerProps {
  secondsLeft: number;
  totalSeconds: number;
  size?: "lg" | "sm";
}

export default function Timer({
  secondsLeft,
  totalSeconds,
  size = "lg",
}: TimerProps) {
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const isUrgent = secondsLeft <= 120 && secondsLeft > 0;
  const isWarning = secondsLeft <= 300 && secondsLeft > 120;

  const isLarge = size === "lg";
  const circleSize = isLarge ? 200 : 56;
  const strokeWidth = isLarge ? 6 : 3;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const strokeColor = isUrgent
    ? "stroke-danger"
    : isWarning
      ? "stroke-accent"
      : "stroke-primary";

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={circleSize}
        height={circleSize}
        className={`-rotate-90 ${isUrgent ? "animate-pulse-soft" : ""}`}
      >
        {/* Background circle */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          className="stroke-border"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          className={`${strokeColor} transition-all duration-1000 ease-linear`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`absolute font-mono font-bold ${
          isLarge ? "text-5xl" : "text-sm"
        } ${isUrgent ? "text-danger" : isWarning ? "text-accent" : "text-foreground"}`}
      >
        {minutes}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
