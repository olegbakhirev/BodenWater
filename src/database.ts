import Database from 'better-sqlite3';
import path from 'path';
import { WaterFlowData } from './fetcher';

// Initialize the database
const dbPath = path.join(__dirname, '..', 'data.db');
const db = new Database(dbPath);

// Create tables if they don't exist
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS water_flow (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      last_update TEXT UNIQUE,
      through_turbine REAL,
      through_pond_hatch REAL,
      total REAL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized');
}

/**
 * Saves water flow data to the database if it doesn't already exist
 * @param data The water flow data to save
 * @returns boolean indicating if the data was saved (true) or already existed (false)
 */
export function saveWaterFlowData(data: WaterFlowData): boolean {
  try {
    // Check if data with this last_update already exists
    const existing = db.prepare('SELECT id FROM water_flow WHERE last_update = ?').get(data.lastUpdate);

    if (existing) {
      console.log(`Data for ${data.lastUpdate} already exists, skipping`);
      return false;
    }

    // Insert the new data
    const stmt = db.prepare(`
      INSERT INTO water_flow (last_update, through_turbine, through_pond_hatch, total)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(data.lastUpdate, data.throughTurbine, data.throughPondHatch, data.total);
    console.log(`Saved new data for ${data.lastUpdate}`);
    return true;
  } catch (error) {
    console.error('Error saving water flow data:', error);
    throw new Error('Failed to save water flow data');
  }
}

/**
 * Gets all water flow data from the database
 * @returns Array of water flow data objects
 */
export function getAllWaterFlowData(): WaterFlowData[] {
  try {
    const rows = db.prepare(`
      SELECT last_update as lastUpdate, through_turbine as throughTurbine, 
             through_pond_hatch as throughPondHatch, total
      FROM water_flow
      ORDER BY created_at ASC
    `).all() as WaterFlowData[];

    return rows;
  } catch (error) {
    console.error('Error retrieving water flow data:', error);
    throw new Error('Failed to retrieve water flow data');
  }
}

// Initialize the database when the module is imported
initializeDatabase();

export default {
  saveWaterFlowData,
  getAllWaterFlowData
};
