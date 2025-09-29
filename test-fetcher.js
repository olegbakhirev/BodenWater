const { fetchWaterFlowData } = require('./dist/fetcher');

async function testFetcher() {
  try {
    console.log('Testing the updated fetcher with OCR...');
    const data = await fetchWaterFlowData();
    console.log('Successfully fetched water flow data:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing fetcher:', error);
  }
}

testFetcher();
