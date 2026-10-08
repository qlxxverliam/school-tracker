const row = (ids, x, z, width, depth, gap = 0.22, category = "classroom") =>
  ids.map((id, index) => ({
    id,
    name: `Room ${id}`,
    x: x + index * (width + gap),
    z,
    width,
    depth,
    category,
  }));

export const schoolSpaces = [
  ...row(["327", "325", "323", "321", "319", "317", "315"], -48, -25, 5.05, 6),
  ...row(["311", "309", "307", "305", "303", "301"], -8, -25, 5.25, 6),
  { id: "215", name: "215 · Machine Tool", x: 28, z: -25, width: 10, depth: 7, category: "shop" },
  { id: "217", name: "217 · Woods", x: 38.2, z: -25, width: 8, depth: 7, category: "shop" },
  { id: "219", name: "219 · Work Room", x: 46.4, z: -25, width: 7, depth: 7, category: "shop" },
  { id: "221", name: "221 · Auto", x: 46.4, z: -17.8, width: 7, depth: 5.5, category: "shop" },

  ...row(["320", "318", "316", "314"], -42, -17.9, 5.35, 6.1),
  { id: "401", name: "Room 401", x: -20, z: -17.9, width: 5.8, depth: 6.1 },
  { id: "403", name: "Room 403", x: -14, z: -17.9, width: 5.8, depth: 6.1 },
  { id: "405", name: "Room 405", x: -8, z: -17.9, width: 5.8, depth: 6.1 },
  { id: "306", name: "Room 306", x: -1.8, z: -17.9, width: 5.7, depth: 6.1 },
  { id: "304", name: "Room 304", x: 4.1, z: -17.9, width: 5.7, depth: 6.1 },
  { id: "302", name: "302 · Art", x: 10, z: -17.9, width: 9.4, depth: 6.1, category: "special" },
  { id: "kit", name: "Kitchen", x: 19.8, z: -13.1, width: 5.3, depth: 5.3, category: "special" },

  { id: "601", name: "Room 601", x: -49, z: -11.3, width: 7.5, depth: 6.1 },
  { id: "602", name: "602 · Lecture Hall", x: -49, z: -5, width: 9.8, depth: 8.7, category: "special" },
  { id: "600", name: "Room 600", x: -45.5, z: 3.9, width: 7.3, depth: 5.7 },
  { id: "406", name: "Room 406", x: -7.8, z: -10.8, width: 5.7, depth: 6 },
  { id: "407", name: "Room 407", x: -7.8, z: -4.6, width: 5.7, depth: 6 },
  { id: "408", name: "Room 408", x: -7.8, z: 1.6, width: 5.7, depth: 6 },

  { id: "courtyard-west", name: "West Courtyard", x: -34, z: -8, width: 18, depth: 17, category: "courtyard", walls: false },
  { id: "courtyard-center", name: "Main Courtyard", x: -14.5, z: -8, width: 21, depth: 17, category: "courtyard", walls: false },
  { id: "cafeteria", name: "Cafeteria", x: 7.3, z: -5.5, width: 15, depth: 18, category: "commons" },
  { id: "hall-west", name: "West Hallway", x: -37, z: 9.5, width: 27, depth: 3.1, category: "hallway", walls: false },
  { id: "hall-center", name: "Main Hallway", x: -7, z: 9.5, width: 35, depth: 3.1, category: "hallway", walls: false },

  { id: "stage", name: "Stage", x: 27, z: -23.5, width: 18.4, depth: 5.5, category: "athletics" },
  { id: "200", name: "200 · Gym", x: 27, z: -17.5, width: 19.3, depth: 23, category: "athletics" },
  { id: "boys-locker", name: "Boys Locker Room", x: 47, z: -16.5, width: 8, depth: 10.2, category: "athletics" },
  { id: "girls-locker", name: "Girls Locker Room", x: 47, z: -5.8, width: 8, depth: 10.2, category: "athletics" },
  { id: "203", name: "203 · Choir", x: 27, z: 7.1, width: 9.2, depth: 7.6, category: "arts" },
  { id: "205", name: "205 · Band", x: 36.5, z: 7.1, width: 11.5, depth: 7.6, category: "arts" },

  ...row(["523", "521"], -49, 14.2, 4.8, 5.8, 0.2, "special"),
  ...row(["515", "513", "511", "509", "507", "505", "503", "501"], -39, 14.2, 4.15, 5.8, 0.2),
  { id: "500", name: "500 · Library", x: -4.8, z: 14.6, width: 10.5, depth: 9.3, category: "commons" },
  { id: "707", name: "707 · Weight Room", x: -48, z: 21.2, width: 15.6, depth: 7, category: "athletics" },
  { id: "700", name: "700 · BACC", x: -48, z: 28.6, width: 16.3, depth: 12.2, category: "commons" },
];

export const selectableSchoolSpaces = schoolSpaces.filter(
  (space) => !space.id.startsWith("hall-"),
);
