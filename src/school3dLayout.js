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
  ...row(["327", "325", "323", "321", "319", "317", "315"], -59, -25, 4.7, 5.7, 0.35),
  ...row(["311", "309", "307", "305", "303", "301"], -20, -25, 5.4, 5.8, 1.15),
  { id: "215", name: "215 · Machine Tool", x: 32, z: -24, width: 14, depth: 8, category: "shop", doorSide: "south" },
  { id: "217", name: "217 · Woods", x: 50, z: -24, width: 8, depth: 8, category: "shop", doorSide: "south" },
  { id: "219", name: "219 · Work Room", x: 60, z: -24, width: 8, depth: 8, category: "shop", doorSide: "south" },
  { id: "221", name: "221 · Auto", x: 55, z: -16, width: 6, depth: 4.5, category: "shop", doorSide: "south" },

  // Middle classroom wing and art rooms around the courtyard edge.
  ...row(["320", "318", "316", "314"], -50, -16.5, 4.9, 5.8, 0.8, "classroom", "north"),
  { id: "401", name: "Room 401", x: -26.5, z: -16.5, width: 5.5, depth: 5.8, doorSide: "south" },
  { id: "403", name: "Room 403", x: -19.8, z: -16.5, width: 5.5, depth: 5.8, doorSide: "south" },
  { id: "405", name: "Room 405", x: -13.1, z: -16.5, width: 5.5, depth: 5.8, doorSide: "south" },
  { id: "306", name: "Room 306", x: -5.4, z: -16.5, width: 5.4, depth: 5.8, doorSide: "south" },
  { id: "304", name: "Room 304", x: 0.4, z: -16.5, width: 5.4, depth: 5.8, doorSide: "south" },
  { id: "302", name: "302 · Art", x: 7, z: -16.5, width: 9.5, depth: 5.8, category: "special", doorSide: "south" },
  { id: "kit", name: "Kitchen", x: 13, z: -10.7, width: 5.5, depth: 5.3, category: "special", doorSide: "south" },

  // The narrow 400 wing lies between the western and central courtyards.
  { id: "406", name: "Room 406", x: -22, z: -9, width: 5.5, depth: 5.6, doorSide: "east" },
  { id: "407", name: "Room 407", x: -22, z: -2.8, width: 5.5, depth: 5.6, doorSide: "east" },
  { id: "408", name: "Room 408", x: -22, z: 3.4, width: 5.5, depth: 5.6, doorSide: "east" },

  // West-side 600 wing: 601, lecture hall 602, and room 600.
  { id: "601", name: "Room 601", x: -59, z: -17.5, width: 7.5, depth: 5.6, doorSide: "east" },
  { id: "602", name: "602 · Lecture Hall", x: -59.5, z: -7.6, width: 9.5, depth: 8.5, category: "special", doorSide: "east" },
  { id: "600", name: "Room 600", x: -59, z: 1.2, width: 7.5, depth: 5.5, doorSide: "east" },

  // The two open courtyards and cafeteria define the central footprint.
  { id: "courtyard-west", name: "West Courtyard", x: -39, z: -4.5, width: 18, depth: 18, category: "courtyard", walls: false },
  { id: "courtyard-center", name: "Main Courtyard", x: -7, z: -5, width: 22, depth: 21, category: "courtyard", walls: false },
  { id: "cafeteria", name: "Cafeteria", x: 13, z: -2, width: 16, depth: 20, category: "commons", doorSide: "west" },

  // Continuous corridor runs and returns around both courtyards and wings.
  hallway("hall-north", "North Hallway", -20, -20.8, 80, 1.7, ["west", "east"]),
  hallway("hall-shop-link", "Shop Wing Hallway", 23.5, -20.8, 8, 1.7, ["west", "east"]),
  hallway("hall-west-court-north", "West Courtyard North Hall", -39, -14.9, 18, 1.5, ["west", "east"]),
  hallway("hall-west-court-east", "West Courtyard East Hall", -28.8, -4.5, 1.6, 18, ["north", "south"]),
  hallway("hall-west-court-south", "West Courtyard South Hall", -39, 5.2, 18, 1.4, ["west", "east"]),
  hallway("hall-court-west", "Central Courtyard West Hall", -19, -5, 1.8, 21, ["north", "south"]),
  hallway("hall-court-north", "Central Courtyard North Hall", -7, -16.1, 22, 1.3, ["west", "east"]),
  hallway("hall-court-east", "Central Courtyard East Hall", 4.8, -5, 1.7, 21, ["north", "south"]),
  hallway("hall-court-south", "Central Courtyard South Hall", -7, 6.4, 22, 1.4, ["west", "east"]),
  hallway("hall-south-west", "West South Hallway", -36, 10.2, 28, 1.7, ["west", "east"]),
  hallway("hall-south-main", "Main South Hallway", 16, 10.2, 62, 1.7, ["west", "east"]),
  hallway("hall-library-link", "Library Hallway", -25, 12.1, 11, 1.3, ["west", "east"]),
  hallway("hall-arts-link", "Arts Hallway", 37, 12.1, 29, 1.5, ["west", "east"]),
  hallway("hall-bacc-link", "BACC Connector Hall", -73, 18.6, 2, 1.3, ["north", "south"]),

  // East gym wing, locker rooms, and the choir / band rooms.
  { id: "stage", name: "Stage", x: 32, z: -15.1, width: 19, depth: 5, category: "athletics", doorSide: "south" },
  { id: "200", name: "200 · Gym", x: 32, z: -2.4, width: 21, depth: 21, category: "athletics", doorSide: "south" },
  { id: "boys-locker", name: "Boys Locker Room", x: 47.5, z: -5.3, width: 9, depth: 10, category: "athletics", doorSide: "west" },
  { id: "girls-locker", name: "Girls Locker Room", x: 47.5, z: 5, width: 9, depth: 10, category: "athletics", doorSide: "west" },
  { id: "203", name: "203 · Choir", x: 31, z: 16.2, width: 9, depth: 8, category: "arts", doorSide: "north" },
  { id: "205", name: "205 · Band", x: 42, z: 16.2, width: 12, depth: 8, category: "arts", doorSide: "north" },

  // South rooms, library, weight room, and the separate BACC extension.
  ...row(["523", "521"], -63, 7, 4.5, 5.8, 0.4, "special", "south"),
  ...row(["515", "513", "511", "509", "507", "505", "503", "501"], -51, 7, 4.1, 5.8, 0.55, "classroom", "south"),
  { id: "500", name: "500 · Library", x: -25, z: 18, width: 11, depth: 10, category: "commons", doorSide: "north" },
  { id: "707", name: "707 · Weight Room", x: -73, z: 14, width: 22, depth: 8, category: "athletics", doorSide: "south" },
  { id: "700", name: "700 · BACC", x: -73, z: 29, width: 23, depth: 20, category: "commons", doorSide: "north" },
];

export function getSpaceWallSegments(space) {
  if (space.walls === false) return [];

  const halfWidth = space.width / 2;
  const halfDepth = space.depth / 2;
  const sides = [
    {
      side: "north",
      start: { x: space.x - halfWidth, z: space.z - halfDepth },
      end: { x: space.x + halfWidth, z: space.z - halfDepth },
    },
    {
      side: "south",
      start: { x: space.x - halfWidth, z: space.z + halfDepth },
      end: { x: space.x + halfWidth, z: space.z + halfDepth },
    },
    {
      side: "west",
      start: { x: space.x - halfWidth, z: space.z - halfDepth },
      end: { x: space.x - halfWidth, z: space.z + halfDepth },
    },
    {
      side: "east",
      start: { x: space.x + halfWidth, z: space.z - halfDepth },
      end: { x: space.x + halfWidth, z: space.z + halfDepth },
    },
  ];
  const openSides = new Set(space.openSides ?? []);
  const doorSide = space.doorSide ?? (space.category === "hallway" ? null : "south");
  const wallSegments = [];

  for (const { side, start, end } of sides) {
    if (openSides.has(side)) continue;
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
  (bounds, space) => ({
    minX: Math.min(bounds.minX, space.x - space.width / 2),
    maxX: Math.max(bounds.maxX, space.x + space.width / 2),
    minZ: Math.min(bounds.minZ, space.z - space.depth / 2),
    maxZ: Math.max(bounds.maxZ, space.z + space.depth / 2),
  }),
  { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity },
);
