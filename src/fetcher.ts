import axios from 'axios';
import * as cheerio from 'cheerio';
import { createWorker } from 'tesseract.js';

export interface WaterFlowData {
  lastUpdate: string;
  throughTurbine: number;
  throughPondHatch: number;
  total: number;
}

/**
 * Performs OCR on a base64 image to extract text
 * @param base64Image The base64 encoded image data
 * @returns Promise with the extracted text
 */
async function performOCR(base64Image: string): Promise<string> {
  try {
    const worker = await createWorker('eng');
    const result = await worker.recognize(base64Image);
    await worker.terminate();
    return result.data.text.trim();
  } catch (error) {
    console.error('Error performing OCR:', error);
    throw new Error('Failed to perform OCR on image');
  }
}

/**
 * Fetches water flow data from the Vattenfall Boden power plant website
 * @returns Promise with the parsed water flow data
 */
export async function fetchWaterFlowData(): Promise<WaterFlowData> {
  try {
    // Fetch the HTML content from the website
    const response = await axios.get('https://powerplants.vattenfall.com/en/boden/');
    const html = response.data;

    // Parse the HTML using cheerio
    const $ = cheerio.load(html);

    // Find the elements containing the data
    // The data is in images, not in a table as previously assumed
    const lastUpdateImgSrc = $('div.label.span60.fact-label:contains("Last update")').next('div.label.span40.fact-data.water-image').find('img').attr('src');
    const throughTurbineImgSrc = $('div.label.span60.fact-label:contains("Through turbine")').next('div.label.span40.fact-data.water-image').find('img').attr('src');
    const throughPondHatchImgSrc = $('div.label.span60.fact-label:contains("Through pond hatch")').next('div.label.span40.fact-data.water-image').find('img').attr('src');

    if (!lastUpdateImgSrc || !throughTurbineImgSrc || !throughPondHatchImgSrc) {
      throw new Error('Failed to find all required data elements on the page');
    }

    console.log('Performing OCR on images to extract data...');

    // Extract text from the images using OCR
    const lastUpdate = await performOCR(lastUpdateImgSrc);
    const throughTurbineText = await performOCR(throughTurbineImgSrc);
    const throughPondHatchText = await performOCR(throughPondHatchImgSrc);

    console.log(`OCR Results - Last Update: ${lastUpdate}, Through Turbine: ${throughTurbineText}, Through Pond Hatch: ${throughPondHatchText}`);

    // Parse the numeric values
    // Extract the number before "m3/s" using regex
    const turbineMatch = throughTurbineText.match(/(\d+(?:\.\d+)?)\s*m3\/s/);
    const pondHatchMatch = throughPondHatchText.match(/(\d+(?:\.\d+)?)\s*m3\/s/);

    const throughTurbine = turbineMatch ? parseFloat(turbineMatch[1]) : 0;
    const throughPondHatch = pondHatchMatch ? parseFloat(pondHatchMatch[1]) : 0;

    // Calculate the total
    const total = throughTurbine + throughPondHatch;

    return {
      lastUpdate,
      throughTurbine,
      throughPondHatch,
      total
    };
  } catch (error) {
    console.error('Error fetching water flow data:', error);
    throw new Error('Failed to fetch water flow data');
  }
}
