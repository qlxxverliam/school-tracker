import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Expand,
  Info,
  Map,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  formatScheduleTime,
  getDetroitClock,
  people,
  roomLocations,
  schedules,
} from "./scheduleData.js";

const WEEKDAYS = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);

function getDayStatus(clock, schedule) {
  if (!WEEKDAYS.has(clock.weekday)) {
    return { kind: "outside", title: "Weekend", detail: "Weekday schedule only" };
  }
  const activeBlock = schedule.find(
    (block) => clock.minutes >= block.start && clock.minutes < block.end,
  );
  if (activeBlock) return { kind: "active", block: activeBlock };
  const first = schedule[0];
  const last = schedule[schedule.length - 1];
  if (clock.minutes < first.start) {
    return { kind: "outside", title: "Before the school day", detail: "First scheduled block starts at 7:45 AM" };
  }
  if (clock.minutes >= last.end) {
    return { kind: "outside", title: "School day complete", detail: "No class is scheduled right now" };
  }
  return { kind: "outside", title: "Between scheduled blocks", detail: "No class is scheduled right now" };
}

function getBlockPlace(block) {
  if (block.room) return roomLocations[block.room]?.label ?? `Room ${block.room}`;
  if (block.place === "cafeteria") return "Cafeteria";
  return "No room";
}

function MapImage({ schedule, selectedBlock, onSelectBlock, expanded = false }) {
  const availableRooms = useMemo(() => {
    const rooms = new Set(schedule.map((block) => block.room ?? block.place).filter(Boolean));
    return Object.entries(roomLocations).filter(([id]) => rooms.has(id));
  }, [schedule]);

  const matchingBlock = (roomId) =>
    schedule.find(
      (block) =>
        block.id === selectedBlock?.id &&
        (block.room ?? block.place) === roomId,
    ) ??
    schedule.find((block) => (block.room ?? block.place) === roomId);

  return (
    <div className="map-frame">
      <img
        src="/school-map.jpg"
        alt="Brandywine Middle/High School tornado safety area floor plan. Classroom markers show scheduled rooms only."
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
            aria-label={`Select ${room.label}${isActive ? ", selected" : ""}`}
            aria-pressed={isActive}
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
  );
}

export default function App() {
  const [personId, setPersonId] = useState("blake");
  const [clock, setClock] = useState(() => getDetroitClock());
  const [selectedBlockId, setSelectedBlockId] = useState(
    () => getDayStatus(clock, schedules.blake).block?.id ?? schedules.blake[0]?.id ?? null,
  );
  const [mapExpanded, setMapExpanded] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(getDetroitClock()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mapExpanded) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMapExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mapExpanded]);

  const person = people.find((entry) => entry.id === personId) ?? people[0];
  const schedule = schedules[person.id];
  const dayStatus = getDayStatus(clock, schedule);
  const selectedBlock = schedule.find((block) => block.id === selectedBlockId) ?? null;

  const choosePerson = (id) => {
    const nextSchedule = schedules[id];
    const nextStatus = getDayStatus(clock, nextSchedule);
    const nextSelected = nextStatus.block ?? nextSchedule[0];
    setPersonId(id);
    setSelectedBlockId(nextSelected?.id ?? null);
  };

  const selectBlock = (block) => {
    if (block) setSelectedBlockId(block.id);
  };

  const jumpToCurrent = () => {
    if (dayStatus.block) setSelectedBlockId(dayStatus.block.id);
  };

  const mapSelectedBlock = selectedBlock?.room || selectedBlock?.place
    ? selectedBlock
    : null;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="Bobcat Map">
          <div className="brand-mark" aria-hidden="true"><MapPin size={21} strokeWidth={2.2} /></div>
          <div>
            <div className="brand-name">Bobcat Map</div>
            <div className="brand-caption">Brandywine Middle / High</div>
          </div>
        </div>
        <div className="top-meta">
          <div className="weekday-tag"><CalendarDays size={14} /> Weekdays only</div>
          <div className="privacy-pill"><ShieldCheck size={15} /> No location is shared</div>
        </div>
      </header>

      <main className="main">
        <div className="intro-row">
          <div>
            <div className="eyebrow"><span>PERSONAL SCHOOL-DAY REFERENCE</span></div>
            <h1>Your day, in one place.</h1>
            <p className="intro-subtitle">Check a class, then find its room on the school map.</p>
          </div>
          <div className="date-stamp" aria-label={`Today, ${clock.label}; ${clock.timeLabel}`}>
            <strong>{clock.label}</strong>
            <span>{clock.timeLabel} · Detroit time</span>
          </div>
        </div>

        <div className="content-grid">
          <section className="panel schedule-panel" aria-labelledby="schedule-heading">
            <div className="panel-heading">
              <div className="schedule-heading">
                <div className="section-kicker">WEEKDAY LINEUP</div>
                <h2 id="schedule-heading">{person.name}&apos;s schedule</h2>
              </div>
              <div className="person-switch" role="group" aria-label="Choose a student schedule">
                {people.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className="person-button"
                    aria-pressed={person.id === entry.id}
                    onClick={() => choosePerson(entry.id)}
                  >
                    {entry.name}
                  </button>
                ))}
              </div>
            </div>

            {dayStatus.kind === "active" ? (
              <div className="now-card" role="status" aria-live="polite">
                <div className="now-copy">
                  <div className="now-label"><span className="now-dot" /> Scheduled now</div>
                  <div className="now-title">{dayStatus.block.title}</div>
                  <div className="now-detail">
                    {getBlockPlace(dayStatus.block)} · ends {formatScheduleTime(dayStatus.block.end)}
                  </div>
                </div>
                {(dayStatus.block.room || dayStatus.block.place) && (
                  <button type="button" className="jump-button" onClick={jumpToCurrent}>
                    <Map size={14} /> View room
                  </button>
                )}
              </div>
            ) : (
              <div className="now-card is-outside" role="status" aria-live="polite">
                <div className="now-copy">
                  <div className="now-label"><span className="now-dot" /> Schedule status</div>
                  <div className="now-title">{dayStatus.title}</div>
                  <div className="now-detail">{dayStatus.detail}</div>
                </div>
              </div>
            )}
            <p className="clock-note"><Clock3 size={12} /> Times shown in Detroit time</p>

            <div className="schedule-list" aria-label={`${person.name}'s complete weekday schedule`}>
              {schedule.map((block) => {
                const isSelected = block.id === selectedBlock?.id;
                const isCurrent = dayStatus.kind === "active" && block.id === dayStatus.block.id;
                return (
                  <button
                    key={block.id}
                    type="button"
                    className={`class-row${isSelected ? " selected" : ""}${isCurrent ? " current" : ""}${!block.room && !block.place ? " dismissal-row" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => selectBlock(block)}
                  >
                    <span className="class-time">
                      {formatScheduleTime(block.start)}<br />{formatScheduleTime(block.end)}
                    </span>
                    <span className="class-node" aria-hidden="true" />
                    <span className="class-info">
                      <span className="class-name">{block.title}</span>
                      <span className="class-location">{getBlockPlace(block)}</span>
                    </span>
                    <ChevronRight className="row-chevron" size={16} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
            <div className="schedule-footer">
              <CalendarDays size={13} /> This schedule applies Monday through Friday. Times are a reference.
            </div>
          </section>

          <section className="panel map-panel" aria-labelledby="map-heading">
            <div className="map-top">
              <div className="map-heading">
                <div className="section-kicker">STATIC ROOM REFERENCE</div>
                <h2 id="map-heading">School map</h2>
                <div className="map-subtitle">
                  {mapSelectedBlock
                    ? `Selected: ${getBlockPlace(mapSelectedBlock)}`
                    : "Choose a class to highlight its room"}
                </div>
              </div>
              <div className="map-actions">
                <button
                  type="button"
                  className="icon-action"
                  onClick={() => {
                    setMapZoom(window.innerWidth <= 700 ? 1.7 : 1);
                    setMapExpanded(true);
                  }}
                  aria-label="Inspect larger school map"
                  title="Inspect larger map"
                >
                  <Expand size={15} /><span>Inspect map</span>
                </button>
              </div>
            </div>
            <MapImage
              schedule={schedule}
              selectedBlock={mapSelectedBlock}
              onSelectBlock={selectBlock}
            />
            <div className="map-caption">
              <span className="map-legend"><span className="legend-dot" /> Selected scheduled room</span>
              <span className="static-note"><ShieldCheck size={12} /> No live or verified location</span>
            </div>
            <div className="notice">
              <Info size={14} />
              <span>Reference map only. This is not emergency guidance; follow school staff instructions in an emergency.</span>
            </div>
          </section>
        </div>
      </main>
      <footer className="footer-note">
        <ShieldCheck size={13} /> A static schedule reference — no location is being shared.
      </footer>

      {mapExpanded && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMapExpanded(false);
          }}
        >
          <section
            className="map-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-map-title"
          >
            <div className="modal-header">
              <div>
                <strong id="modal-map-title">Brandywine school map</strong>
                <p>Static reference · {mapSelectedBlock ? getBlockPlace(mapSelectedBlock) + " selected" : "No room selected"}</p>
              </div>
              <div className="modal-tools" role="group" aria-label="Map zoom controls">
                <button
                  type="button"
                  aria-label="Zoom out"
                  title="Zoom out"
                  disabled={mapZoom <= 1}
                  onClick={() => setMapZoom((zoom) => Math.max(1, +(zoom - 0.25).toFixed(2)))}
                >
                  <Minus size={15} />
                </button>
                <span>{Math.round(mapZoom * 100)}%</span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  title="Zoom in"
                  disabled={mapZoom >= 2.5}
                  onClick={() => setMapZoom((zoom) => Math.min(2.5, +(zoom + 0.25).toFixed(2)))}
                >
                  <Plus size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Reset map zoom"
                  title="Reset zoom"
                  disabled={mapZoom === 1}
                  onClick={() => setMapZoom(1)}
                >
                  <RotateCcw size={14} />
                </button>
              </div>
              <button
                type="button"
                className="close-button"
                aria-label="Close larger map"
                onClick={() => setMapExpanded(false)}
                autoFocus
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-map">
              <div className="zoomed-map" style={{ width: `${mapZoom * 100}%` }}>
                <MapImage
                  schedule={schedule}
                  selectedBlock={mapSelectedBlock}
                  onSelectBlock={selectBlock}
                  expanded
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
