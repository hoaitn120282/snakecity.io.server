# SnakerCity Platform
A nodejs source development APIs

### Install dependencies

```sh
npm i
```

### To setup the project

- Create an environment file by copying the `.env.example` file and add respective values.

### To run the project in development

```sh
npm run dev
```

##### For Linting files

```sh
npm run lint
```

## Database migration notes:

#### For creating database migrations

```sh
npm run migration:create <migration-name>
```

#### For running the database migrations

```sh
npm run db:migrate
```
