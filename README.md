# Boden Water Flow Tracker

A web application that tracks and visualizes water flow data from Vattenfall's Boden power plant.

## Features

- Polls the Vattenfall Boden power plant website hourly to fetch water flow data
- Extracts "Last update", "Through turbine", and "Through pond hatch" values
- Stores data in a SQLite database, avoiding duplicates
- Visualizes the data as a line chart showing water flow over time
- Displays the latest water flow data

## Technologies Used

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Database**: SQLite (via better-sqlite3)
- **Scheduling**: node-cron
- **HTTP Requests**: axios
- **HTML Parsing**: cheerio
- **OCR (Optical Character Recognition)**: tesseract.js

## Project Structure

```
BodenWater/
├── dist/               # Compiled TypeScript files
├── public/             # Static frontend files
│   ├── index.html      # Main HTML page
│   ├── styles.css      # CSS styles
│   └── app.js          # Frontend JavaScript
├── src/                # TypeScript source files
│   ├── index.ts        # Main application entry point
│   ├── fetcher.ts      # Module for fetching data from the website
│   ├── database.ts     # Database operations
│   └── server.ts       # Express server setup
├── data.db             # SQLite database file (created on first run)
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the TypeScript code:
   ```
   npm run build
   ```
4. Start the application:
   ```
   npm start
   ```

## Development

For development with automatic reloading:
```
npm run dev
```

## How It Works

1. The application polls the Vattenfall Boden power plant website hourly
2. It locates elements containing "Last update", "Through turbine", and "Through pond hatch" text
3. The application extracts image data from these elements and applies OCR (Optical Character Recognition) to read the values
4. New data is stored in the SQLite database (if it doesn't already exist)
5. The web server provides an API endpoint to access the stored data
6. The frontend fetches the data from the API and visualizes it as a line chart

## Data Source

Data is sourced from [Vattenfall's Boden Power Plant](https://powerplants.vattenfall.com/en/boden/).
