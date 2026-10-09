import { useEffect, useRef, useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import {
  getSpaceWallSegments,
  schoolMapBounds,
  schoolSpaces,
  selectableSchoolSpaces,
} from "../school3dLayout.js";

const FLOOR_COLORS = {
  classroom: "#e9dfca",
  special: "#e5d8b9",
  shop: "#d9e0d9",
  commons: "#d3e0d3",
  athletics: "#d3dce7",
  arts: "#ead5c7",
  courtyard: "#a7bb91",
  hallway: "#d9d3c2",
};

const SELECTED_COLOR = "#c55645";
const FLOOR_THICKNESS = 0.34;
const WALL_HEIGHT = 5.2;
const WALL_THICKNESS = 0.32;
const MIN_ZOOM = 0.55;
const MAX_ZOOM = 4.5;

function vector(x, y, z) {
  return { x, y, z };
}

function add(a, b) {
  return vector(a.x + b.x, a.y + b.y, a.z + b.z);
}

function subtract(a, b) {
  return vector(a.x - b.x, a.y - b.y, a.z - b.z);
}

function scale(a, amount) {
  return vector(a.x * amount, a.y * amount, a.z * amount);
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a, b) {
  return vector(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x,
  );
}

function normalize(a) {
  const length = Math.hypot(a.x, a.y, a.z) || 1;
  return scale(a, 1 / length);
}

function shadeColor(hex, factor) {
  const value = hex.replace("#", "");
  const red = Math.min(255, Math.round(parseInt(value.slice(0, 2), 16) * factor));
  const green = Math.min(255, Math.round(parseInt(value.slice(2, 4), 16) * factor));
  const blue = Math.min(255, Math.round(parseInt(value.slice(4, 6), 16) * factor));
  return `rgb(${red} ${green} ${blue})`;
}

function makeCuboid(x, y, z, width, height, depth, color, role, spaceId = null) {
  const points = [
    vector(x - width / 2, y - height / 2, z - depth / 2),
    vector(x + width / 2, y - height / 2, z - depth / 2),
    vector(x + width / 2, y + height / 2, z - depth / 2),
    vector(x - width / 2, y + height / 2, z - depth / 2),
    vector(x - width / 2, y - height / 2, z + depth / 2),
    vector(x + width / 2, y - height / 2, z + depth / 2),
    vector(x + width / 2, y + height / 2, z + depth / 2),
    vector(x - width / 2, y + height / 2, z + depth / 2),
  ];
  const definitions = [
    { indices: [0, 1, 2, 3], normal: vector(0, 0, -1), shade: 0.78 },
    { indices: [4, 7, 6, 5], normal: vector(0, 0, 1), shade: 0.88 },
    { indices: [0, 3, 7, 4], normal: vector(-1, 0, 0), shade: 0.72 },
    { indices: [1, 5, 6, 2], normal: vector(1, 0, 0), shade: 0.82 },
    { indices: [3, 2, 6, 7], normal: vector(0, 1, 0), shade: 1.08, top: true },
    { indices: [0, 4, 5, 1], normal: vector(0, -1, 0), shade: 0.6 },
  ];

  return definitions.map((definition) => ({
    points: definition.indices.map((index) => points[index]),
    normal: definition.normal,
    shade: definition.shade,
    top: Boolean(definition.top),
    color,
    role,
    spaceId,
  }));
}

function makeBuildingModel() {
  const boxes = [];

  for (const space of schoolSpaces) {
    const floorColor = FLOOR_COLORS[space.category] ?? FLOOR_COLORS.classroom;
    boxes.push(
      ...makeCuboid(
        space.x,
        0,
        space.z,
        space.width,
        FLOOR_THICKNESS,
        space.depth,
        floorColor,
        "floor",
        space.id,
      ),
    );

    if (space.walls === false) continue;

    const wallColor =
      space.category === "hallway" ? "#bdb7a9" : "#d9d2c3";
    const wallY = FLOOR_THICKNESS / 2 + WALL_HEIGHT / 2;
    for (const segment of getSpaceWallSegments(space)) {
      const segmentWidth = Math.hypot(
        segment.x2 - segment.x1,
        segment.z2 - segment.z1,
      );
      const horizontal = Math.abs(segment.z2 - segment.z1) < 0.001;
      boxes.push(
        ...makeCuboid(
          (segment.x1 + segment.x2) / 2,
          wallY,
          (segment.z1 + segment.z2) / 2,
          horizontal ? segmentWidth : WALL_THICKNESS,
          WALL_HEIGHT,
          horizontal ? WALL_THICKNESS : segmentWidth,
          wallColor,
          "wall",
          space.id,
        ),
      );
    }
  }
  return boxes;
}

function makeCamera(view, width, height) {
  const target = vector(
    (schoolMapBounds.minX + schoolMapBounds.maxX) / 2,
    1.2,
    (schoolMapBounds.minZ + schoolMapBounds.maxZ) / 2,
  );
  const worldWidth = schoolMapBounds.maxX - schoolMapBounds.minX;
  const worldDepth = schoolMapBounds.maxZ - schoolMapBounds.minZ;
  const planeWidth =
    Math.abs(Math.cos(view.yaw)) * worldWidth +
    Math.abs(Math.sin(view.yaw)) * worldDepth;
  const planeHeight =
    Math.sin(view.pitch) *
    (Math.abs(Math.sin(view.yaw)) * worldWidth +
      Math.abs(Math.cos(view.yaw)) * worldDepth) +
    WALL_HEIGHT;
  const focalLength = height * 1.12;
  const radius =
    Math.max(
      (focalLength * planeWidth) / (width * 0.82),
      (focalLength * planeHeight) / (height * 0.74),
      96,
    ) / view.zoom;
  const horizontal = Math.cos(view.pitch) * radius;
  const position = vector(
    target.x + Math.sin(view.yaw) * horizontal,
    target.y + Math.sin(view.pitch) * radius,
    target.z + Math.cos(view.yaw) * horizontal,
  );
  const forward = normalize(subtract(target, position));
  const right = normalize(cross(forward, vector(0, 1, 0)));
  const up = normalize(cross(right, forward));
  return {
    position,
    forward,
    right,
    up,
    centerX: width / 2,
    centerY: height * 0.54,
    focalLength,
  };
}

function projectPoint(point, camera) {
  const relative = subtract(point, camera.position);
  const depth = dot(relative, camera.forward);
  if (depth < 1) return null;
  const perspective = camera.focalLength / depth;
  return {
    x: camera.centerX + dot(relative, camera.right) * perspective,
    y: camera.centerY - dot(relative, camera.up) * perspective,
    depth,
    scale: perspective,
  };
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const current = polygon[i];
    const previous = polygon[j];
    const crosses =
      current.y > point.y !== previous.y > point.y &&
      point.x <
        ((previous.x - current.x) * (point.y - current.y)) /
          (previous.y - current.y) +
          current.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

function labelFor(space) {
  if (/^\d+$/.test(space.id)) return space.id;
  if (space.id === "cafeteria") return "CAF";
  if (space.id === "courtyard-west") return "COURT";
  if (space.id === "courtyard-center") return "COURT";
  if (space.id === "boys-locker") return "BOYS";
  if (space.id === "girls-locker") return "GIRLS";
  if (space.id === "kit") return "KIT";
  if (space.id === "stage") return "STAGE";
  return space.name.slice(0, 4).toUpperCase();
}

export default function SchoolMap3D({
  selectedRoomId,
  onSelectRoom,
  onUseFlatPlan,
}) {
  const canvasRef = useRef(null);
  const viewRef = useRef({ yaw: 0.73, pitch: 0.92, zoom: 1 });
  const polygonsRef = useRef([]);
  const redrawRef = useRef(null);
  const selectedRoomRef = useRef(selectedRoomId);
  const onSelectRoomRef = useRef(onSelectRoom);
  const [renderError, setRenderError] = useState("");
  const [zoom, setZoom] = useState(1);

  selectedRoomRef.current = selectedRoomId;
  onSelectRoomRef.current = onSelectRoom;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) {
      setRenderError("Canvas drawing isn’t available in this browser. Use the 2D plan instead.");
      return undefined;
    }
    setRenderError("");

    const model = makeBuildingModel();
    const selectableIds = new Set(selectableSchoolSpaces.map((space) => space.id));
    const view = viewRef.current;
    const pointers = new Map();
    let frameId = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let dragStart = null;
    let pinchStart = null;

    const requestDraw = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        draw();
      });
    };

    const draw = () => {
      if (!width || !height) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, "#f3f0e8");
      background.addColorStop(1, "#e7e4da");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      const camera = makeCamera(view, width, height);
      const visibleFaces = [];
      const roomPolygons = [];
      const currentSelection = selectedRoomRef.current;

      for (const face of model) {
        const center = face.points.reduce(
          (sum, point) => add(sum, point),
          vector(0, 0, 0),
        );
        const faceCenter = scale(center, 1 / face.points.length);
        if (dot(face.normal, subtract(camera.position, faceCenter)) <= 0) continue;
        const projected = face.points.map((point) => projectPoint(point, camera));
        if (projected.some((point) => !point)) continue;
        const depth =
          projected.reduce((sum, point) => sum + point.depth, 0) /
          projected.length;
        let baseColor = face.color;
        if (face.role === "floor" && face.spaceId === currentSelection && face.top) {
          baseColor = SELECTED_COLOR;
        } else if (
          face.role === "wall" &&
          face.spaceId === currentSelection
        ) {
          baseColor = "#e4b4aa";
        }
        visibleFaces.push({
          points: projected,
          depth,
          color: shadeColor(baseColor, face.shade),
          selected: face.spaceId === currentSelection && face.role === "floor",
          top: face.top,
          role: face.role,
          spaceId: face.spaceId,
        });

        if (
          face.role === "floor" &&
          face.top &&
          face.spaceId &&
          selectableIds.has(face.spaceId)
        ) {
          roomPolygons.push({
            id: face.spaceId,
            points: projected.map(({ x, y }) => ({ x, y })),
            depth,
          });
        }
      }

      visibleFaces.sort((a, b) => b.depth - a.depth);
      for (const face of visibleFaces) {
        context.beginPath();
        context.moveTo(face.points[0].x, face.points[0].y);
        for (let i = 1; i < face.points.length; i += 1) {
          context.lineTo(face.points[i].x, face.points[i].y);
        }
        context.closePath();
        context.fillStyle = face.color;
        context.fill();
        context.strokeStyle = face.selected
          ? "#963e32"
          : face.role === "wall"
            ? "rgba(55, 58, 51, 0.52)"
            : face.top
              ? "rgba(69, 77, 62, 0.42)"
              : "rgba(70, 72, 62, 0.2)";
        context.lineWidth = face.selected ? 1.7 : face.role === "wall" ? 1 : 0.8;
        context.stroke();
      }
      polygonsRef.current = roomPolygons;

      const labels = selectableSchoolSpaces
        .map((space) => {
          const anchor = projectPoint(
            vector(space.x, FLOOR_THICKNESS / 2 + 0.08, space.z),
            camera,
          );
          return anchor ? { space, anchor, text: labelFor(space) } : null;
        })
        .filter(Boolean)
        .sort((a, b) => {
          if (a.space.id === currentSelection) return -1;
          if (b.space.id === currentSelection) return 1;
          return a.anchor.depth - b.anchor.depth;
        });
      const placedLabels = [];
      for (const item of labels) {
        const { space, anchor, text } = item;
        if (
          anchor.x < -20 ||
          anchor.x > width + 20 ||
          anchor.y < -20 ||
          anchor.y > height + 20
        ) continue;
        const selected = space.id === currentSelection;
        const fontSize = Math.max(6, Math.min(12, Math.round(anchor.scale * 2.45)));
        context.font = `700 ${fontSize}px system-ui, sans-serif`;
        const labelWidth = context.measureText(text).width + (selected ? 8 : 3);
        const labelHeight = fontSize + (selected ? 5 : 3);
        let placement = null;
        const candidateOffsets = [{ x: 0, y: 0 }];
        for (let radius = 8; radius <= 52; radius += 8) {
          for (let step = 0; step < 16; step += 1) {
            const angle = (step * Math.PI) / 8;
            candidateOffsets.push({
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
            });
          }
        }
        for (const offset of candidateOffsets) {
          const x = anchor.x + offset.x;
          const y = anchor.y + offset.y;
          const bounds = {
            left: x - labelWidth / 2,
            right: x + labelWidth / 2,
            top: y - labelHeight / 2,
            bottom: y + labelHeight / 2,
          };
          const fits =
            bounds.left >= 2 &&
            bounds.right <= width - 2 &&
            bounds.top >= 2 &&
            bounds.bottom <= height - 2;
          const overlaps = placedLabels.some(
            (other) =>
              bounds.left < other.right + 2 &&
              bounds.right > other.left - 2 &&
              bounds.top < other.bottom + 2 &&
              bounds.bottom > other.top - 2,
          );
          if (fits && !overlaps) {
            placement = { x, y, bounds, moved: Math.hypot(offset.x, offset.y) > 2 };
            break;
          }
        }
        if (!placement) {
          const x = Math.min(width - labelWidth / 2 - 1, Math.max(labelWidth / 2 + 1, anchor.x));
          const y = Math.min(height - labelHeight / 2 - 1, Math.max(labelHeight / 2 + 1, anchor.y));
          placement = {
            x,
            y,
            moved: Math.hypot(x - anchor.x, y - anchor.y) > 2,
            bounds: {
              left: x - labelWidth / 2,
              right: x + labelWidth / 2,
              top: y - labelHeight / 2,
              bottom: y + labelHeight / 2,
            },
          };
        }
        placedLabels.push(placement.bounds);
        if (placement.moved) {
          context.beginPath();
          context.moveTo(anchor.x, anchor.y);
          context.lineTo(placement.x, placement.y);
          context.strokeStyle = "rgba(69, 77, 62, 0.42)";
          context.lineWidth = 0.7;
          context.stroke();
        }
        context.beginPath();
        context.roundRect(
          placement.bounds.left,
          placement.bounds.top,
          labelWidth,
          labelHeight,
          labelHeight / 2,
        );
        context.fillStyle = selected
          ? SELECTED_COLOR
          : "rgba(255, 254, 248, 0.83)";
        context.fill();
        context.strokeStyle = selected ? "#963e32" : "rgba(69, 77, 62, 0.2)";
        context.lineWidth = selected ? 1 : 0.6;
        context.stroke();
        context.font = `700 ${fontSize}px system-ui, sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineWidth = 0;
        context.fillStyle = selected ? "#ffffff" : "#314b43";
        context.fillText(text, placement.x, placement.y + 0.5);
      }
    };

    redrawRef.current = requestDraw;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.8);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      requestDraw();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const canvasPoint = (event) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const pointerDistance = () => {
      const [a, b] = Array.from(pointers.values());
      return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
    };
    const onPointerDown = (event) => {
      event.preventDefault();
      canvas.setPointerCapture?.(event.pointerId);
      pointers.set(event.pointerId, canvasPoint(event));
      if (pointers.size === 1) {
        dragStart = {
          ...canvasPoint(event),
          yaw: view.yaw,
          pitch: view.pitch,
          moved: false,
        };
      } else if (pointers.size === 2) {
        if (dragStart) dragStart.moved = true;
        pinchStart = { distance: pointerDistance(), zoom: view.zoom };
      }
    };
    const onPointerMove = (event) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, canvasPoint(event));
      if (pointers.size > 1) {
        const distance = pointerDistance();
        if (pinchStart?.distance > 0 && distance > 0) {
          view.zoom = Math.min(MAX_ZOOM, Math.max(
            MIN_ZOOM,
            pinchStart.zoom * (distance / pinchStart.distance),
          ));
          setZoom(view.zoom);
          requestDraw();
        }
        return;
      }
      if (!dragStart) return;
      const point = pointers.get(event.pointerId);
      const dx = point.x - dragStart.x;
      const dy = point.y - dragStart.y;
      if (Math.hypot(dx, dy) > 4) dragStart.moved = true;
      view.yaw = dragStart.yaw - dx * 0.008;
      view.pitch = Math.max(0.27, Math.min(1.33, dragStart.pitch + dy * 0.006));
      requestDraw();
    };
    const selectAt = (point) => {
      const matches = polygonsRef.current
        .filter((polygon) => pointInPolygon(point, polygon.points))
        .sort((a, b) => a.depth - b.depth);
      if (matches[0]) onSelectRoomRef.current?.(matches[0].id);
    };
    const onPointerUp = (event) => {
      const point = canvasPoint(event);
      const shouldSelect =
        pointers.size === 1 && dragStart && !dragStart.moved;
      if (shouldSelect) selectAt(point);
      pointers.delete(event.pointerId);
      if (pointers.size === 1) {
        const [remaining] = Array.from(pointers.values());
        dragStart = {
          ...remaining,
          yaw: view.yaw,
          pitch: view.pitch,
          moved: true,
        };
        pinchStart = null;
      } else if (pointers.size === 0) {
        dragStart = null;
        pinchStart = null;
      }
    };
    const onPointerCancel = (event) => {
      pointers.delete(event.pointerId);
      dragStart = null;
      pinchStart = null;
    };
    const onWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      view.zoom = Math.min(MAX_ZOOM, Math.max(
        MIN_ZOOM,
        view.zoom * Math.exp(-event.deltaY * 0.0014),
      ));
      setZoom(view.zoom);
      requestDraw();
    };
    const onLostPointerCapture = (event) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinchStart = null;
      if (pointers.size === 0) dragStart = null;
    };
    const onContextMenu = (event) => event.preventDefault();

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("lostpointercapture", onLostPointerCapture);
    const stage = canvas.parentElement;
    stage?.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", onContextMenu);
    requestDraw();

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frameId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("lostpointercapture", onLostPointerCapture);
      stage?.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onContextMenu);
      redrawRef.current = null;
      polygonsRef.current = [];
    };
  }, []);

  useEffect(() => {
    redrawRef.current?.();
  }, [selectedRoomId]);

  const resetView = () => {
    Object.assign(viewRef.current, { yaw: 0.73, pitch: 0.92, zoom: 1 });
    setZoom(1);
    redrawRef.current?.();
  };
  const changeZoom = (factor) => {
    viewRef.current.zoom = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, viewRef.current.zoom * factor),
    );
    setZoom(viewRef.current.zoom);
    redrawRef.current?.();
  };

  const selectedSpace = selectableSchoolSpaces.find(
    (space) => space.id === selectedRoomId,
  );

  return (
    <div className="school-map3d">
      <div className="map3d-instructions">
        <span>Drag to rotate · scroll or pinch to zoom</span>
        <span className="map3d-accuracy">Approximate layout · not to scale</span>
      </div>
      <div className="map3d-stage">
        <canvas
          className="school-map3d-canvas"
          ref={canvasRef}
          aria-label="Interactive 3D cutaway school map. Drag to rotate, pinch or scroll to zoom, and use the room selector to choose a room."
        />
        <div className="map3d-controls" role="group" aria-label="3D map controls">
          <button
            type="button"
            onClick={() => changeZoom(1.25)}
            aria-label="Zoom in"
            title="Zoom in"
            disabled={zoom >= MAX_ZOOM}
          >
            <ZoomIn size={15} />
          </button>
          <button
            type="button"
            onClick={() => changeZoom(0.8)}
            aria-label="Zoom out"
            title="Zoom out"
            disabled={zoom <= MIN_ZOOM}
          >
            <ZoomOut size={15} />
          </button>
          <button
            type="button"
            className="map3d-reset"
            onClick={resetView}
            aria-label="Reset 3D map view"
            title="Reset view"
          >
            <RotateCcw size={14} />
            <span>Reset view</span>
          </button>
        </div>
        {renderError && (
          <div className="map3d-error" role="status">
            <span>{renderError}</span>
            <button type="button" onClick={onUseFlatPlan}>Show 2D plan</button>
          </div>
        )}
      </div>
      <div className="map3d-room-tools">
        <label className="map3d-room-picker">
          <span>Find a room</span>
          <select
            value={selectedRoomId ?? ""}
            onChange={(event) => {
              if (event.target.value) onSelectRoom(event.target.value);
            }}
          >
            <option value="">Choose a room</option>
            {selectableSchoolSpaces.map((space) => (
              <option key={space.id} value={space.id}>{space.name}</option>
            ))}
          </select>
        </label>
        <div className="map3d-selection" aria-live="polite">
          {selectedSpace ? (
            <>
              <strong>{selectedSpace.name}</strong>
              <span>
                {selectedSpace.id === "cafeteria"
                  ? "Shared area"
                  : selectedSpace.category === "courtyard"
                    ? "Outdoor courtyard"
                    : "Room outline is approximate"}
              </span>
            </>
          ) : (
            <>
              <strong>Select any room</strong>
              <span>Room shapes are estimated from the supplied plan.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
