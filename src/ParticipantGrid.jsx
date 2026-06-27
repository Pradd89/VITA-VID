// src/ParticipantGrid.jsx
import React from "react";
import ParticipantView from "./ParticipantView";

const MemoizedParticipant = React.memo(
  ParticipantView,
  (prevProps, nextProps) => {
    return prevProps.participantId === nextProps.participantId;
  }
);

export default function ParticipantGrid({ participantIds }) {
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  // Distribución de la rejilla según cantidad de participantes
  let perRow;
  if (isMobile) {
    perRow = participantIds.length <= 2 ? 1 : 2;
  } else {
    if (participantIds.length === 1) perRow = 1;
    else if (participantIds.length === 2) perRow = 2;
    else perRow = 2; // Máximo 2 columnas para mejor visibilidad
  }

  const rows = Math.ceil(participantIds.length / perRow);

  return (
    <div className="flex flex-col w-full h-full gap-3 p-2">
      {Array.from({ length: rows }, (_, rowIndex) => {
        const start = rowIndex * perRow;
        const end = Math.min(start + perRow, participantIds.length);
        const rowParticipants = participantIds.slice(start, end);

        return (
          <div
            key={`row-${rowIndex}`}
            className="flex flex-row gap-3 w-full flex-1"
            style={{ minHeight: '200px' }}
          >
            {rowParticipants.map((id) => (
              <div
                key={`participant-${id}`}
                className="flex-1 min-w-0"
              >
                <MemoizedParticipant participantId={id} />
              </div>
            ))}
            {/* Rellenar espacios vacíos para mantener grid uniforme */}
            {rowParticipants.length < perRow && 
              Array.from({ length: perRow - rowParticipants.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex-1" />
              ))
            }
          </div>
        );
      })}
    </div>
  );
}