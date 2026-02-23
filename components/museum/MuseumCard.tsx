"use client";

import type { Museum } from "@/lib/types";

interface MuseumCardProps {
  museum: Museum;
  isHost: boolean;
  onHover: (museum: Museum | null) => void;
  onClick: (museum: Museum) => void;
}

export default function MuseumCard({
  museum,
  isHost,
  onHover,
  onClick,
}: MuseumCardProps) {
  return (
    <div
      className={`card-flip-container ${isHost ? "cursor-pointer" : ""}`}
      onMouseEnter={() => onHover(museum)}
      onMouseLeave={() => onHover(null)}
      onClick={() => isHost && onClick(museum)}
    >
      <div className="card-flip-inner h-72 w-full rounded-2xl shadow-lg">
        {/* Front face */}
        <div className="card-face flex flex-col rounded-2xl bg-surface overflow-hidden">
          <div className="h-44 bg-surface-alt overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={museum.image}
              alt={museum.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.innerHTML = `<div class="h-full w-full flex items-center justify-center text-4xl bg-surface-alt">🏛️</div>`;
                }
              }}
            />
          </div>
          <div className="flex-1 p-3">
            <h3 className="font-semibold text-foreground text-sm leading-tight truncate">
              {museum.name}
            </h3>
            <p className="text-xs text-muted mt-1">{museum.location}</p>
          </div>
        </div>

        {/* Back face */}
        <div className="card-face card-face-back flex flex-col rounded-2xl bg-surface p-4 overflow-hidden">
          <h3 className="font-semibold text-foreground text-sm mb-2">
            {museum.name}
          </h3>
          <p className="text-xs text-muted flex-1 leading-relaxed">
            {museum.description}
          </p>
          <a
            href={museum.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-2 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Visit website &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
