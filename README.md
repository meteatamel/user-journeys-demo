# User Journeys demo

Build:

```
docker build . -t user-journeys-demo
```

Run locally:

```
docker run --cap-add=SYS_ADMIN user-journeys-demo journeys/cloud.google.com/home-to-cloud-run.js
```

Replace `journeys/cloud.google.com/home-to-cloud-run.js` with the any export of Chrome DevTools' Record 