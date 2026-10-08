import { useEffect, useMemo, useState } from "react";
import { Box, Map } from "lucide-react";
import { roomLocations } from "../scheduleData.js";
import SchoolMap3D from "./SchoolMap3D.jsx";

export function MapViewToggle({ view, onChange }) {
  return (
    <div className="map-view-toggle" role="group" aria-label="Map view">
      <button
        type="button"
        className={view === "flat" ? "is-active" : ""}
        aria-pressed={view === "flat"}
        onClick={() => onChange("flat")}
      >
        <Map size={14} aria-hidden="true" />
        <span>2D Plan</span>
      </button>
      <button
        type="button"
        className={view === "3d" ? "is-active" : ""}
        aria-pressed={view === "3d"}
        onClick={() => onChange("3d")}
      >
        <Box size={14} aria-hidden="true" />
        <span>3D Rooms</span>
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
  const scheduledRoomId = selectedBlock?.room ?? selectedBlock?.place ?? "";
  const [selectedMapRoomId, setSelectedMapRoomId] = useState(scheduledRoomId);

  useEffect(() => {
    setSelectedMapRoomId(scheduledRoomId);
  }, [scheduledRoomId, selectedBlock?.id]);

  const matchingBlock = (roomId) =>
    schedule.find(
      (block) =>
        block.id === selectedBlock?.id &&
        (block.room ?? block.place) === roomId,
    ) ?? schedule.find((block) => (block.room ?? block.place) === roomId);

  const selectRoom = (roomId) => {
    setSelectedMapRoomId(roomId);
    const scheduledBlock = matchingBlock(roomId);
    if (scheduledBlock) onSelectBlock(scheduledBlock);
  };

  return (
    <div className="school-map-viewer">
      <div className="viewer-toolbar">
        <span className="viewer-mode-note">
          {view === "3d" ? "Interactive room model" : "Original floor plan"}
        </span>
        <MapViewToggle view={view} onChange={onViewChange} />
      </div>
      {view === "3d" ? (
        <SchoolMap3D
          selectedRoomId={selectedMapRoomId}
          onSelectRoom={selectRoom}
          onUseFlatPlan={() => onViewChange("flat")}
        />
      ) : (
        <div className="map-stage flat">
          <div className="map-object">
            <div className="map-frame">
              <img
                src="/school-map.jpg"
                alt="Original Brandywine Middle/High School floor plan showing the printed room labels and room numbers."
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
              {expanded && <span className="sr-only">Expanded original floor plan</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
