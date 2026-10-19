# Recipes CRUD App (Node.js + Express + SQLite)

ICT251 Activity 4 – Question 2: Personal Recipe Card (resource: `recipes`, table: `recipes`).

## Project structure

```
recipes-crud/
├─ backend/
│  ├─ .env            (PORT, DB_FILE)
│  ├─ package.json
│  ├─ schema.sql      (table + 10 sample rows)
│  ├─ db.js           (SQLite connection, auto-creates + seeds DB)
│  └─ server.js       (Express REST API, CORS, serves frontend)
├─ frontend/
│  ├─ index.html
│  └─ app.js
└─ Recipes_CRUD.postman_collection.json
```

## Requirements

Node.js **22.13 or newer** (LTS from nodejs.org). SQLite is built into Node, so no database install is needed.

## Run locally (PowerShell)

```powershell
cd backend
npm install
npm start
```

(Node prints a harmless 'SQLite is experimental' warning.) Open http://localhost:3000 for the web page. The API is at http://localhost:3000/api/recipes.

## Database (Part A)

Table `recipes`: `id` (INTEGER PK AUTOINCREMENT), `title` (NOT NULL), `category`, `ingredients`,
`instructions`, `prep_time_minutes`, `servings`, `created_at`, `updated_at`. 10 sample records are inserted from `schema.sql`.

## API (Part B)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/recipes | List all records |
| GET | /api/recipes/:id | Get one record |
| POST | /api/recipes | Create a record |
| PUT | /api/recipes/:id | Update a record |
| DELETE | /api/recipes/:id | Delete a record |

All responses are JSON. Settings come from `.env`. CORS is enabled.

Example POST body:

```json
{
  "title": "Sweet Potato Fritters",
  "category": "Snack",
  "ingredients": "Sweet potato, flour, egg, cinnamon, oil",
  "instructions": "Grate potato, mix, fry until golden.",
  "prep_time_minutes": 25,
  "servings": 4
}
```

## Postman video checklist

1. Import `Recipes_CRUD.postman_collection.json`.
2. Run **GET all** (show URL, method, JSON response).
3. Run **POST create**, note the new `id`; set the `id` collection variable to it.
4. Run **GET one**, **PUT update** (show body), then **DELETE**.
5. Run **GET all** again to show the changes. Record the screen while doing this.

## Deploying to the cloud (Submission)

Firebase and Supabase are not a natural fit for an Express + SQLite server, so use a Node host instead (Render.com is free and simple):

1. Push this folder to a GitHub repository.
2. On Render: New > Web Service > connect the repo.
3. Root directory: `backend`. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables `PORT=3000` and `DB_FILE=./recipes.db`.
5. After deploy, your links are:
   - `https://YOUR-APP.onrender.com/api/recipes` (GET, POST)
   - `https://YOUR-APP.onrender.com/api/recipes/1` (GET, PUT, DELETE)
   - `https://YOUR-APP.onrender.com/` (the web page)

Note: on the free tier the SQLite file resets on each redeploy/restart, but it re-seeds the 10 sample rows automatically.

If your lecturer requires Supabase/Firebase specifically, ask me and I can convert the backend to use it.
