const row = (
  ids,
  x,
  z,
  width,
  depth,
  gap = 0.15,
  category = "classroom",
  doorSide = "south",
) =>
  ids.map((id, index) => ({
    id,
    name: `Room ${id}`,
    x: x + index * (width + gap),
    z,
    width,
    depth,
    category,
    doorSide,
  }));

const hallway = (id, name, x, z, width, depth, openSides, angle = 0) => ({
  id,
  name,
  x,
  z,
  width,
  depth,
  category: "hallway",
  doorSide: null,
  openSides,
  angle,
});

// Approximate room centers traced from the supplied school floor plan. North is
// negative Z; keep both map views and the 3D wall model on this same geometry.
export const schoolSpaces = [
  // North academic wing, then the machine-tool / woods / auto wing.
  ...row(["327", "325", "323", "321", "319", "317", "315"], -54, -25, 4.7, 5.7, 0.5),
  ...row(["311", "309", "307", "305", "303", "301"], -14.2, -25, 5.4, 5.8, 1.4),
  { id: "215", name: "215 · Machine Tool", x: 39, z: -24, width: 19, depth: 8, category: "shop", doorSide: "south" },
  { id: "217", name: "217 · Woods", x: 55, z: -24, width: 9, depth: 8, category: "shop", doorSide: "south" },
  { id: "219", name: "219 · Work Room", x: 65, z: -24, width: 8, depth: 8, category: "shop", doorSide: "south" },
  { id: "221", name: "221 · Auto", x: 60, z: -16, width: 6, depth: 4.5, category: "shop", doorSide: "south" },

  // Middle classroom wing and art rooms around the courtyard edge.
  ...row(["320", "318", "316", "314"], -44, -16.5, 4.9, 5.8, 0.8, "classroom", "north"),
  { id: "401", name: "Room 401", x: -21.4, z: -16.5, width: 5.5, depth: 5.8, doorSide: "south" },
  { id: "403", name: "Room 403", x: -15.5, z: -16.5, width: 5.5, depth: 5.8, doorSide: "south" },
  { id: "405", name: "Room 405", x: -8.2, z: -16.5, width: 5.5, depth: 5.8, doorSide: "south" },
  { id: "306", name: "Room 306", x: -1.2, z: -16.5, width: 5.4, depth: 5.8, doorSide: "south" },
  { id: "304", name: "Room 304", x: 5.2, z: -16.5, width: 5.4, depth: 5.8, doorSide: "south" },
  { id: "302", name: "302 · Art", x: 12.3, z: -16.5, width: 8, depth: 5.8, category: "special", doorSide: "south" },
  { id: "kit", name: "Kitchen", x: 18.5, z: -14.7, width: 3.4, depth: 2.4, category: "special", doorSide: "south" },

  // The narrow 400 wing lies between the western and central courtyards.
  { id: "406", name: "Room 406", x: -16.3, z: -9, width: 5.5, depth: 5.6, doorSide: "east" },
  { id: "407", name: "Room 407", x: -16.3, z: -2.8, width: 5.5, depth: 5.6, doorSide: "east" },
  { id: "408", name: "Room 408", x: -16.3, z: 3.4, width: 5.5, depth: 5.6, doorSide: "east" },

  // West-side 600 wing: 601, lecture hall 602, and room 600.
  { id: "601", name: "Room 601", x: -53, z: -17.5, width: 7.5, depth: 5.6, doorSide: "east" },
  { id: "602", name: "602 · Lecture Hall", x: -54, z: -7.6, width: 9.5, depth: 8.5, category: "special", doorSide: "east" },
  { id: "600", name: "Room 600", x: -53, z: 1.2, width: 7.5, depth: 5.5, doorSide: "east" },

  // The two open courtyards and cafeteria define the central footprint.
  { id: "courtyard-west", name: "West Courtyard", x: -34, z: -4.5, width: 23, depth: 18, category: "courtyard", walls: false },
  { id: "courtyard-center", name: "Main Courtyard", x: 1, z: -3, width: 27, depth: 21, category: "courtyard", walls: false },
  { id: "cafeteria", name: "Cafeteria", x: 20.5, z: -2, width: 11.5, depth: 20, category: "commons", doorSide: "west" },

  // Continuous corridor runs and returns around both courtyards and wings.
  hallway("hall-north", "North Hallway", -16, -20.8, 91, 1.7, ["west", "east"]),
  hallway("hall-shop-link", "Shop Wing Hallway", 28, -20.8, 8, 1.7, ["west", "east"], -10),
  hallway("hall-west-court-north", "West Courtyard North Hall", -34, -14.9, 23, 1.5, ["west", "east"], -8),
  hallway("hall-west-court-east", "West Courtyard East Hall", -21.7, -4.5, 1.6, 18, ["north", "south"], 7),
  hallway("hall-west-court-south", "West Courtyard South Hall", -34, 5.2, 23, 1.4, ["west", "east"], 11),
  hallway("hall-court-west", "Central Courtyard West Hall", -13.5, -3, 1.2, 21, ["north", "south"], -5),
  hallway("hall-court-north", "Central Courtyard North Hall", 1, -14.2, 27, 1.3, ["west", "east"], -5),
  hallway("hall-court-east", "Central Courtyard East Hall", 14.8, -3, 1, 21, ["north", "south"], 8),
  hallway("hall-court-south", "Central Courtyard South Hall", 1, 8.2, 27, 1.4, ["west", "east"], 6),
  hallway("hall-south-west", "West South Hallway", -38, 10.3, 26, 1.5, ["west", "east"], -7),
  hallway("hall-south-main", "Main South Hallway", 19, 10.3, 58, 1.7, ["west", "east"]),
  hallway("hall-library-link", "Library Hallway", -23, 12.1, 11, 1.3, ["west", "east"], 7),
  hallway("hall-arts-link", "Arts Hallway", 39, 12.1, 29, 1.5, ["west", "east"], 10),
  hallway("hall-bacc-link", "BACC Connector Hall", -73, 18.6, 2, 1.3, ["north", "south"]),

  // East gym wing, locker rooms, and the choir / band rooms.
  { id: "stage", name: "Stage", x: 37, z: -15.2, width: 19, depth: 4.4, category: "athletics", doorSide: "south" },
  { id: "200", name: "200 · Gym", x: 37, z: -2.4, width: 21, depth: 21, category: "athletics", doorSide: "south" },
  { id: "boys-locker", name: "Boys Locker Room", x: 52, z: -5.3, width: 9, depth: 10, category: "athletics", doorSide: "west" },
  { id: "girls-locker", name: "Girls Locker Room", x: 52, z: 5, width: 9, depth: 10, category: "athletics", doorSide: "west" },
  { id: "203", name: "203 · Choir", x: 32.5, z: 16.2, width: 9, depth: 8, category: "arts", doorSide: "north" },
  { id: "205", name: "205 · Band", x: 43, z: 16.2, width: 12, depth: 8, category: "arts", doorSide: "north" },

  // South rooms, library, weight room, and the separate BACC extension.
  ...row(["523", "521"], -64.2, 1.2, 4.5, 4.8, 0.4, "special", "south"),
  ...row(["515", "513", "511", "509", "507", "505", "503", "501"], -60, 7.5, 4.1, 5, 0.55, "classroom", "south"),
  { id: "500", name: "500 · Library", x: -22, z: 18, width: 11, depth: 10, category: "commons", doorSide: "north" },
  { id: "707", name: "707 · Weight Room", x: -67, z: 14, width: 22, depth: 8, category: "athletics", doorSide: "south" },
  { id: "700", name: "700 · BACC", x: -67, z: 29, width: 23, depth: 20, category: "commons", doorSide: "north" },
];

export function getSpaceFootprint(space) {
  if (Array.isArray(space.footprint)) return space.footprint;
  const halfWidth = space.width / 2;
  const halfDepth = space.depth / 2;
  const radians = ((space.angle ?? 0) * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return [
    { x: -halfWidth, z: -halfDepth },
    { x: halfWidth, z: -halfDepth },
    { x: halfWidth, z: halfDepth },
    { x: -halfWidth, z: halfDepth },
  ].map(({ x, z }) => ({
    x: space.x + x * cosine - z * sine,
    z: space.z + x * sine + z * cosine,
  }));
}

export function getSpaceWallSegments(space) {
  if (space.walls === false) return [];

  const footprint = getSpaceFootprint(space);
  const openSides = new Set(space.openSides ?? []);
  const openEdges = new Set(space.openEdges ?? []);
  const doorSide = space.doorSide ?? (space.category === "hallway" ? null : "south");
  const wallSegments = [];

  for (let index = 0; index < footprint.length; index += 1) {
    const side = ["north", "east", "south", "west"][index];
    const start = footprint[index];
    const end = footprint[(index + 1) % footprint.length];
    if (openSides.has(side) || openEdges.has(index)) continue;
    const length = Math.hypot(end.x - start.x, end.z - start.z);
    const doorWidth = doorSide === side
      ? Math.min(space.doorWidth ?? (space.category === "athletics" ? 2.2 : 1.45), length * 0.35)
      : 0;

    if (!doorWidth) {
      wallSegments.push({
        x1: start.x,
        z1: start.z,
        x2: end.x,
        z2: end.z,
        side,
      });
      continue;
    }

    const dx = (end.x - start.x) / length;
    const dz = (end.z - start.z) / length;
    const doorStart = (length - doorWidth) / 2;
    const doorEnd = doorStart + doorWidth;
    wallSegments.push({
      x1: start.x,
      z1: start.z,
      x2: start.x + dx * doorStart,
      z2: start.z + dz * doorStart,
      side,
    });
    wallSegments.push({
      x1: start.x + dx * doorEnd,
      z1: start.z + dz * doorEnd,
      x2: end.x,
      z2: end.z,
      side,
    });
  }

  return wallSegments;
}

export const selectableSchoolSpaces = schoolSpaces.filter(
  (space) => !space.id.startsWith("hall-"),
);

export const schoolMapBounds = schoolSpaces.reduce(
  (bounds, space) => getSpaceFootprint(space).reduce(
    (next, point) => ({
      minX: Math.min(next.minX, point.x),
      maxX: Math.max(next.maxX, point.x),
      minZ: Math.min(next.minZ, point.z),
      maxZ: Math.max(next.maxZ, point.z),
    }),
    bounds,
  ),
  { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity },
);
