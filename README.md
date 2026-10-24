# Gather & Thyme

Gather & Thyme is a responsive recipe discovery app built with React and powered by [TheMealDB](https://www.themealdb.com/). Search meals, browse by category, cuisine, or ingredient, follow recipe instructions, and save favorites in your browser.

## Features

- Search TheMealDB recipes by name.
- Browse recipes by meal category, cuisine, or main ingredient.
- Open recipe details with available ingredients, measurements, instructions, source links, and YouTube tutorials.
- Save and remove favorites; complete recipe details persist in IndexedDB.
- Discover a random recipe with **Surprise me**.
- Switch between light and dark themes. Your selection is saved in local storage; on first visit, the app follows your device’s color-scheme preference.
- Offline support in production: the app shell and visited API responses are cached, loaded MealDB images are reused from cache, and saved favorites include their complete recipe details in IndexedDB.
- Connectivity alerts announce when the browser goes offline and when it reconnects.
- Responsive navigation and layouts, keyboard focus indicators, and loading, empty, and error states.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

Open a terminal in the project directory, then install dependencies and start Vite:

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173`.

The service worker that enables offline asset and API caching is registered in production builds, not during Vite development. To try it locally, build and preview the app, visit it while online once, then disconnect and reload:

```sh
npm run build
npm run preview
```

Offline use requires a secure context (HTTPS, or localhost). The app shell and any API results, category images, and recipe images already loaded online can be reused offline. Complete details for saved favorites are stored in IndexedDB, so opening a saved recipe does not depend on the API. External source and YouTube pages still require an internet connection.

On Windows PowerShell, if script execution prevents `npm` from running, use `npm.cmd` instead:

```powershell
npm.cmd install
npm.cmd run dev
```

## Production build

Create and preview a production build with:

```sh
npm run build
npm run preview
```

## Technology

- React and Vite
- React Router
- Lucide React icons
- CSS
- The browser Fetch API
- TheMealDB public API
- IndexedDB for complete saved favorite recipes
- Browser local storage for theme preference and migration of older favorites

## Data and privacy

Recipe information is retrieved from TheMealDB’s public API. Recipe availability and optional fields depend on that service. Favorites and the theme selection are stored in this browser only; the app does not use an account or sync data between devices.
