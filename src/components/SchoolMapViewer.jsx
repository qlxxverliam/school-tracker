import { useEffect, useState } from "react";
import { Box, Map } from "lucide-react";
import {
  getSpaceFootprint,
  getSpaceWallSegments,
  schoolMapBounds,
  schoolSpaces,
  selectableSchoolSpaces,
} from "../school3dLayout.js";
import SchoolMap3D from "./SchoolMap3D.jsx";

const SPACE_COLORS = {
  classroom: "#e9dfca",
  special: "#e5d8b9",
  shop: "#d9e0d9",
  commons: "#d3e0d3",
  athletics: "#d3dce7",
  arts: "#ead5c7",
  courtyard: "#a7bb91",
  hallway: "#d9d3c2",
};

function shortLabel(space) {
  if (/^\d+$/.test(space.id)) return space.id;
  if (space.id === "cafeteria") return "CAFETERIA";
  if (space.id.startsWith("courtyard-")) return "COURTYARD";
  if (space.id === "boys-locker") return "BOYS";
  if (space.id === "girls-locker") return "GIRLS";
  if (space.id === "stage") return "STAGE";
  if (space.id === "kit") return "KIT";
  return space.name.toUpperCase();
}

function detailLabel(space) {
  if (!/^\d+$/.test(space.id) && space.name.includes(" · ")) {
    return space.name.split(" · ").slice(1).join(" · ").toUpperCase();
  }
  if (["200", "203", "205", "500", "602", "700", "707"].includes(space.id)) {
    return space.name.split(" · ").slice(1).join(" · ").toUpperCase();
  }
  return "";
}

function TopDownPlan({ selectedRoomId, onSelectRoom }) {
  const selectableIds = new Set(selectableSchoolSpaces.map((space) => space.id));
  const margin = 3;
  const width = schoolMapBounds.maxX - schoolMapBounds.minX + margin * 2;
  const height = schoolMapBounds.maxZ - schoolMapBounds.minZ + margin * 2;
  const viewBox = [
    schoolMapBounds.minX - margin,
    schoolMapBounds.minZ - margin,
    width,
    height,
  ].join(" ");
  const orderedSpaces = [
    ...schoolSpaces.filter((space) => space.category === "hallway"),
    ...schoolSpaces.filter((space) => space.category !== "hallway"),
  ];

  const selectWithKeyboard = (event, id) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelectRoom(id);
  };

  return (
    <div className="map-stage flat top-down-stage">
      <div className="map-frame top-down-frame">
        <svg
          className="top-down-plan"
          viewBox={viewBox}
          role="group"
          aria-label="Approximate top-down school floor plan. Select a room to highlight it."
        >
          <title>Brandywine school top-down room plan</title>
          <rect
            className="plan-ground"
            x={schoolMapBounds.minX - margin}
            y={schoolMapBounds.minZ - margin}
            width={width}
            height={height}
            rx="2"
          />
          {orderedSpaces.map((space) => {
            const isSelectable = selectableIds.has(space.id);
            const selected = space.id === selectedRoomId;
            const x = space.x - space.width / 2;
            const y = space.z - space.depth / 2;
            const secondaryLabel = detailLabel(space);
            const label = shortLabel(space);
            const footprint = getSpaceFootprint(space);
            const wallSegments = getSpaceWallSegments(space);

            return (
              <g
                key={space.id}
                className={[
                  "plan-space",
                  `plan-space-${space.category}`,
                  selected ? "is-selected" : "",
                  isSelectable ? "is-selectable" : "",
                ].filter(Boolean).join(" ")}
                role={isSelectable ? "button" : undefined}
                tabIndex={isSelectable ? 0 : undefined}
                aria-label={isSelectable ? space.name : undefined}
                aria-pressed={isSelectable ? selected : undefined}
                onClick={isSelectable ? () => onSelectRoom(space.id) : undefined}
                onKeyDown={isSelectable
                  ? (event) => selectWithKeyboard(event, space.id)
                  : undefined}
              >
                <title>{space.name}</title>
                {space.angle ? (
                  <polygon
                    points={footprint.map((point) => `${point.x},${point.z}`).join(" ")}
                    fill={SPACE_COLORS[space.category] ?? SPACE_COLORS.classroom}
                  />
                ) : (
                  <rect
                    x={x}
                    y={y}
                    width={space.width}
                    height={space.depth}
                    rx={space.category === "hallway" ? 0.45 : 0.28}
                    fill={SPACE_COLORS[space.category] ?? SPACE_COLORS.classroom}
                  />
                )}
                {wallSegments.map((segment, index) => (
                  <path
                    key={`${space.id}-wall-${index}`}
                    className={`plan-wall${space.category === "hallway" ? " plan-wall-hallway" : ""}`}
                    d={`M ${segment.x1} ${segment.z1} L ${segment.x2} ${segment.z2}`}
                  />
                ))}
                {isSelectable && (
                  <text
                    className="plan-space-label"
                    x={space.x}
                    y={space.z}
                    textAnchor="middle"
                    dominantBaseline={secondaryLabel ? "central" : "middle"}
                  >
                    <tspan>{label}</tspan>
                    {secondaryLabel && (
                      <tspan
                        className="plan-space-detail"
                        x={space.x}
                        dy="1.25"
                      >
                        {secondaryLabel}
                      </tspan>
                    )}
                  </text>
                )}
              </g>
            );
          })}
          <g className="plan-compass" aria-hidden="true">
            <path d={`M ${schoolMapBounds.maxX - 1} ${schoolMapBounds.maxZ - 2.5} l -3 0 l 1.2 -1.2 m -1.2 1.2 l 1.2 1.2`} />
            <text
              x={schoolMapBounds.maxX - 2.2}
              y={schoolMapBounds.maxZ - 1.3}
              textAnchor="start"
            >
              N
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

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
          {view === "3d" ? "Interactive room model" : "Top-down room plan"}
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
        <TopDownPlan
          selectedRoomId={selectedMapRoomId}
          onSelectRoom={selectRoom}
        />
      )}
    </div>
  );
}
