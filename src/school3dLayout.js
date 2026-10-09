const row = (ids, x, z, width, depth, gap = 0.2, category = "classroom") =>
  ids.map((id, index) => ({
    id,
    name: `Room ${id}`,
    x: x + index * (width + gap),
    z,
    width,
    depth,
    category,
  }));

// Approximate room centers traced from the supplied tornado-safety floor plan.
// Keep both map views driven by this one layout so room footprints stay aligned.
export const schoolSpaces = [
  // North classroom wing and the rooms across its central section.
  ...row(["327", "325", "323", "321", "319", "317", "315"], -50, -25, 5.05, 6),
  ...row(["311", "309", "307", "305", "303", "301"], -17, -25, 5.25, 6),
  { id: "215", name: "215 · Machine Tool", x: 28, z: -25, width: 10, depth: 7, category: "shop" },
  { id: "217", name: "217 · Woods", x: 39, z: -25, width: 8, depth: 7, category: "shop" },
  { id: "219", name: "219 · Work Room", x: 48, z: -25, width: 7, depth: 7, category: "shop" },
  { id: "221", name: "221 · Auto", x: 48, z: -17.8, width: 7, depth: 5.5, category: "shop" },

  // West classroom row, art wing, kitchen, and the connected 400 wing.
  ...row(["320", "318", "316", "314"], -43, -17.9, 5.35, 6.1),
  { id: "401", name: "Room 401", x: -25, z: -17.9, width: 5.8, depth: 6.1 },
  { id: "403", name: "Room 403", x: -19, z: -17.9, width: 5.8, depth: 6.1 },
  { id: "405", name: "Room 405", x: -13, z: -17.9, width: 5.8, depth: 6.1 },
  { id: "306", name: "Room 306", x: -1.8, z: -17.9, width: 5.7, depth: 6.1 },
  { id: "304", name: "Room 304", x: 4.1, z: -17.9, width: 5.7, depth: 6.1 },
  { id: "302", name: "302 · Art", x: 10, z: -17.9, width: 9.4, depth: 6.1, category: "special" },
  { id: "kit", name: "Kitchen", x: 19.8, z: -13.1, width: 5.3, depth: 5.3, category: "special" },
  { id: "406", name: "Room 406", x: -7.8, z: -10.8, width: 5.7, depth: 6 },
  { id: "407", name: "Room 407", x: -7.8, z: -4.6, width: 5.7, depth: 6 },
  { id: "408", name: "Room 408", x: -7.8, z: 1.6, width: 5.7, depth: 6 },

  // The west-side 600 wing, including the lecture hall.
  { id: "601", name: "Room 601", x: -49, z: -11.3, width: 7.5, depth: 6.1 },
  { id: "602", name: "602 · Lecture Hall", x: -49, z: -4.8, width: 9.8, depth: 8.7, category: "special" },
  { id: "600", name: "Room 600", x: -49, z: 3.7, width: 7.3, depth: 5.7 },

  // Open courtyards and cafeteria form the center of the irregular footprint.
  { id: "courtyard-west", name: "West Courtyard", x: -34, z: -8.5, width: 17, depth: 16, category: "courtyard", walls: false },
  { id: "courtyard-center", name: "Main Courtyard", x: -14.5, z: -8, width: 20, depth: 16, category: "courtyard", walls: false },
  { id: "cafeteria", name: "Cafeteria", x: 7.3, z: -5.5, width: 15, depth: 18, category: "commons" },

  // Hallway segments follow the bends around the two courtyards.
  { id: "hall-west", name: "West Hallway", x: -37, z: 9.5, width: 27, depth: 3.1, category: "hallway", walls: false },
  { id: "hall-center", name: "Main Hallway", x: -7, z: 9.5, width: 35, depth: 3.1, category: "hallway", walls: false },
  { id: "hall-north", name: "North Hallway", x: -10, z: -21.3, width: 79, depth: 1.8, category: "hallway", walls: false },
  { id: "hall-west-court-north", name: "West Courtyard North Hall", x: -34, z: -17.6, width: 18, depth: 1.6, category: "hallway", walls: false },
  { id: "hall-west-court-side", name: "West Courtyard Hall", x: -44.2, z: -8, width: 1.7, depth: 18, category: "hallway", walls: false },
  { id: "hall-court-north", name: "Courtyard North Hall", x: -14.5, z: -17, width: 21, depth: 1.7, category: "hallway", walls: false },
  { id: "hall-court-side", name: "Courtyard Hall", x: -26.2, z: -8, width: 1.7, depth: 17, category: "hallway", walls: false },

  // Gym, stage, locker rooms, choir, and band wing.
  { id: "stage", name: "Stage", x: 27, z: -23.5, width: 18.4, depth: 5.5, category: "athletics" },
  { id: "200", name: "200 · Gym", x: 27, z: -17.5, width: 19.3, depth: 23, category: "athletics" },
  { id: "boys-locker", name: "Boys Locker Room", x: 47, z: -16.5, width: 8, depth: 10.2, category: "athletics" },
  { id: "girls-locker", name: "Girls Locker Room", x: 47, z: -5.8, width: 8, depth: 10.2, category: "athletics" },
  { id: "203", name: "203 · Choir", x: 27, z: 7.1, width: 9.2, depth: 7.6, category: "arts" },
  { id: "205", name: "205 · Band", x: 36.5, z: 7.1, width: 11.5, depth: 7.6, category: "arts" },

  // South-side 500 rooms, library, weight room, and BACC.
  ...row(["523", "521"], -49, 14.2, 4.8, 5.8, 0.2, "special"),
  ...row(["515", "513", "511", "509", "507", "505", "503", "501"], -39, 14.2, 4.15, 5.8, 0.2),
  { id: "500", name: "500 · Library", x: -4.8, z: 14.6, width: 10.5, depth: 9.3, category: "commons" },
  { id: "707", name: "707 · Weight Room", x: -48, z: 21.2, width: 15.6, depth: 7, category: "athletics" },
  { id: "700", name: "700 · BACC", x: -48, z: 28.6, width: 16.3, depth: 12.2, category: "commons" },
];

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
