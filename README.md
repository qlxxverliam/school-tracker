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

Schedules and room-marker positions are maintained in `src/scheduleData.js`. Times are shown in Detroit time. The app uses the supplied school map as a static reference; it does not track anyone's location.

The map and named student schedules are sensitive school information. The app has no login or access control, so do not publish it publicly unless the school has approved that broader access.