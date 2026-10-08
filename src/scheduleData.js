export const people = [
  { id: "blake", name: "Blake", initials: "B" },
  { id: "tate", name: "Tate", initials: "T" },
];

export const roomLocations = {
  "205": { x: 73.5, y: 55.2, label: "Room 205" },
  "319": { x: 29.1, y: 24.2, label: "Room 319" },
  "407": { x: 34.4, y: 43.8, label: "Room 407" },
  "316": { x: 29.4, y: 28.8, label: "Room 316" },
  "325": { x: 20.8, y: 24.2, label: "Room 325" },
  "320": { x: 23.5, y: 28.2, label: "Room 320" },
  "309": { x: 46.4, y: 21.7, label: "Room 309" },
  "217": { x: 81.2, y: 24.2, label: "Room 217" },
  cafeteria: { x: 58.4, y: 42.2, label: "Cafeteria" },
};

const block = (id, title, start, end, room = null, place = null) => ({
  id,
  title,
  start,
  end,
  room,
  place,
});

export const schedules = {
  blake: [
    block("band", "Band", 465, 520, "205"),
    block("sped", "SPED class", 525, 575, "319"),
    block("science", "Science", 580, 630, "407"),
    block("ela", "ELA", 635, 685, "316"),
    block("health-1", "Health · Part 1", 690, 715, "325"),
    block("lunch", "Lunch", 715, 740, null, "cafeteria"),
    block("health-2", "Health · Part 2", 745, 765, "325"),
    block("pre-algebra", "Pre-algebra", 770, 820, "320"),
    block("history", "History", 825, 875, "309"),
    block("dismissal", "School over", 875, 885),
  ],
  tate: [
    block("band", "Band", 465, 520, "205"),
    block("sped", "SPED class", 525, 575, "319"),
    block("science", "Science", 580, 630, "407"),
    block("ela", "ELA", 635, 685, "316"),
    block("woods", "Woods", 690, 740, "217"),
    block("lunch", "Lunch", 740, 765, null, "cafeteria"),
    block("pre-algebra", "Pre-algebra", 770, 820, "320"),
    block("history", "History", 825, 875, "309"),
    block("dismissal", "School over", 875, 885),
  ],
};

export const getDetroitClock = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Detroit",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    minutes: Number(values.hour) * 60 + Number(values.minute),
    weekday: values.weekday,
    label: new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Detroit",
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date),
    timeLabel: new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Detroit",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date),
  };
};

export const formatScheduleTime = (minutes) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
};
