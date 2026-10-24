# Gather & Thyme

A warm, responsive recipe discovery app powered by [TheMealDB](https://www.themealdb.com/). Search recipes, browse categories and cuisines, view cooking instructions, and keep a personal recipe box in your browser.

## Features

- Search real meals by name and browse by category, cuisine, or ingredient.
- View recipe ingredients, measurements, instructions, source links, and video tutorials when provided.
- Save and remove favorites; they persist in browser local storage.
- Discover a random recipe with “Surprise me”.
- Responsive layouts, keyboard-visible focus, and loading, empty, and error states.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

From this directory:

```sh
npm install
npm run dev
```

Use the local URL printed by Vite. To create and preview a production build:

```sh
npm run build
npm run preview
```

## Tech

React, Vite, React Router, Lucide icons, CSS, and the browser Fetch API. Recipe content is provided by TheMealDB's public API; favorites are stored locally and are not synced between devices.
