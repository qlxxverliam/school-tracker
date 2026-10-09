# Project notes

- Run the app with `npm run dev`. The Replit **Start application** workflow serves it on port 5000.
- Run `npm run build` to check the production build.
- Edit weekday schedule blocks in `src/scheduleData.js` and the shared approximate room geometry for both map views in `src/school3dLayout.js`.
- The map and schedules are static references. The app has no login, location sharing, push notifications, or verified attendance.
- `public/school-map.jpg` is the user-provided school tornado map, re-encoded without photo metadata. It is a layout reference only, not emergency guidance; the app draws its own approximate top-down and 3D maps from the shared room layout.
- The app has no access control. Do not publish it publicly unless the school has approved that broader access to the map and named schedules.
