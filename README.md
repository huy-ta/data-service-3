# Data Service (User & Department)

- Live Demo: https://dms3.pagekite.me

## How to run the application

- Download NodeJS, Docker & Docker Compose.
- Install the dependencies:

```
npm install
```

- Run the app:

```
docker-compose up
```

- If it is the first time you're running the app, you might want to sync all data first:

```
curl -X POST localhost:7070/users/sync-all
```
