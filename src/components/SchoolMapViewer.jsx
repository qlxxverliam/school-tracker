import { useMemo } from "react";
import { Box, Layers2 } from "lucide-react";
import { roomLocations } from "../scheduleData.js";

export function MapViewToggle({ view, onChange }) {
  return (
    <div className="map-view-toggle" role="group" aria-label="Floor plan view">
      <button
        type="button"
        className={view === "flat" ? "is-active" : ""}
        aria-pressed={view === "flat"}
        onClick={() => onChange("flat")}
      >
        <Layers2 size={14} aria-hidden="true" />
        <span>Flat</span>
      </button>
      <button
        type="button"
        className={view === "3d" ? "is-active" : ""}
        aria-pressed={view === "3d"}
        onClick={() => onChange("3d")}
      >
        <Box size={14} aria-hidden="true" />
        <span>Raised</span>
      </button>
    </div>
  );
}

export default function SchoolMapViewer({
  schedule,
  selectedBlock,
  onSelectBlock,
  view,
  onViewChange,
  expanded = false,
}) {
  const availableRooms = useMemo(() => {
    const rooms = new Set(schedule.map((block) => block.room ?? block.place).filter(Boolean));
    return Object.entries(roomLocations).filter(([id]) => rooms.has(id));
  }, [schedule]);

  const matchingBlock = (roomId) =>
    schedule.find(
      (block) =>
        block.id === selectedBlock?.id &&
        (block.room ?? block.place) === roomId,
    ) ?? schedule.find((block) => (block.room ?? block.place) === roomId);

  return (
    <div className="school-map-viewer">
      <div className="viewer-toolbar">
        <span className="viewer-mode-note">
          {view === "3d" ? "Raised paper view" : "Original plan · flat"}
        </span>
        <MapViewToggle view={view} onChange={onViewChange} />
      </div>
      <div className={`map-stage ${view === "3d" ? "isometric" : "flat"}`}>
        <div className="map-object">
          <div className="map-frame">
            <img
              src="/school-map.jpg"
              alt="Original Brandywine Middle/High School tornado safety area floor plan. The selected marker highlights a scheduled room only."
              draggable="false"
            />
            {availableRooms.map(([roomId, room]) => {
              const block = matchingBlock(roomId);
              const isActive =
                selectedBlock &&
                (selectedBlock.room === roomId || selectedBlock.place === roomId);
              return (
                <button
                  key={roomId}
                  type="button"
                  className={`room-marker${isActive ? " active" : ""}`}
                  style={{ "--x": `${room.x}%`, "--y": `${room.y}%` }}
                  aria-label={`Select ${room.label}${isActive ? ", selected scheduled room" : ""}`}
                  aria-pressed={Boolean(isActive)}
                  title={`${room.label} · select scheduled class`}
                  onClick={() => onSelectBlock(block)}
                >
                  <span className="marker-core" aria-hidden="true" />
                  <span className="marker-label">{room.label}</span>
                </button>
              );
            })}
            {expanded && <span className="sr-only">Expanded static reference map</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
