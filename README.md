# Bobcat Map

A static school map and weekday schedule reference for Brandywine Middle/High School.

## Run in Replit

The **Start application** workflow runs the web app on port 5000. To run it from a shell:

```sh
npm run dev
```

To create a production build:

```sh
npm run build
```

Schedules are maintained in `src/scheduleData.js`. The shared approximate room layout that drives both the top-down and interactive 3D views is in `src/school3dLayout.js`. Times are shown in Detroit time. The supplied school map is a visual reference; the app does not track anyone's location.

The map and named student schedules are sensitive school information. The app has no login or access control, so do not publish it publicly unless the school has approved that broader access. Vercel can build this Vite app with `npm run build` (output directory: `dist`).