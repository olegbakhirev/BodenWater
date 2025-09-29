import sqlite3 from 'sqlite3';
import path from 'path';
import { WaterFlowData } from './fetcher';

// Initialize the database
const dbPath = path.join(__dirname, '..', 'data.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS water_flow (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        last_update TEXT UNIQUE,
        through_turbine REAL,
        through_pond_hatch REAL,
        total REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error initializing database:', err);
      } else {
        console.log('Database initialized');
      }
    });
  });
}

/**
 * Saves water flow data to the database if it doesn't already exist
 * @param data The water flow data to save
 * @returns Promise<boolean> indicating if the data was saved (true) or already existed (false)
 */
export function saveWaterFlowData(data: WaterFlowData): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // Check if data with this last_update already exists
      db.get('SELECT id FROM water_flow WHERE last_update = ?', [data.lastUpdate], (err, row) => {
        if (err) {
          console.error('Error checking for existing data:', err);
          reject(new Error('Failed to check for existing data'));
          return;
        }

        if (row) {
          console.log(`Data for ${data.lastUpdate} already exists, skipping`);
          resolve(false);
          return;
        }

        // Insert the new data
        db.run(`
          INSERT INTO water_flow (last_update, through_turbine, through_pond_hatch, total)
          VALUES (?, ?, ?, ?)
        `, [data.lastUpdate, data.throughTurbine, data.throughPondHatch, data.total], function(err) {
          if (err) {
            console.error('Error inserting data:', err);
            reject(new Error('Failed to save water flow data'));
            return;
          }

          console.log(`Saved new data for ${data.lastUpdate}`);
          resolve(true);
        });
      });
    } catch (error) {
      console.error('Error saving water flow data:', error);
      reject(new Error('Failed to save water flow data'));
    }
  });
}

/**
 * Gets all water flow data from the database
 * @returns Promise<WaterFlowData[]> Array of water flow data objects
 */
export function getAllWaterFlowData(): Promise<WaterFlowData[]> {
  return new Promise((resolve, reject) => {
    try {
      db.all(`
        SELECT last_update as lastUpdate, through_turbine as throughTurbine, 
               through_pond_hatch as throughPondHatch, total
        FROM water_flow
        ORDER BY created_at ASC
      `, [], (err, rows: WaterFlowData[]) => {
        if (err) {
          console.error('Error retrieving water flow data:', err);
          reject(new Error('Failed to retrieve water flow data'));
          return;
        }

        resolve(rows);
      });
    } catch (error) {
      console.error('Error retrieving water flow data:', error);
      reject(new Error('Failed to retrieve water flow data'));
    }
  });
}

// Initialize the database when the module is imported
initializeDatabase();

export default {
  saveWaterFlowData,
  getAllWaterFlowData
};
