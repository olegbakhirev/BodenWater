const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeWebsite() {
  try {
    console.log('Fetching website content...');
    const response = await axios.get('https://powerplants.vattenfall.com/en/boden/');
    const html = response.data;

    console.log('Parsing HTML...');
    const $ = cheerio.load(html);

    // Look for elements containing the text "Last update"
    console.log('\nSearching for "Last update" elements:');
    $(':contains("Last update")').each((i, el) => {
      console.log(`${i}: ${$(el).prop('tagName')} - ${$(el).attr('class') || 'no class'}`);

      // Check the next element or sibling for possible image
      const next = $(el).next();
      if (next.length) {
        console.log(`  Next element: ${next.prop('tagName')} - ${next.attr('class') || 'no class'}`);
        const img = next.find('img');
        if (img.length) {
          console.log(`  Contains image: ${img.attr('src')}`);
        }
      }
    });

    // Look for elements containing the text "Through turbine"
    console.log('\nSearching for "Through turbine" elements:');
    $(':contains("Through turbine")').each((i, el) => {
      console.log(`${i}: ${$(el).prop('tagName')} - ${$(el).attr('class') || 'no class'}`);

      // Check the next element or sibling for possible image
      const next = $(el).next();
      if (next.length) {
        console.log(`  Next element: ${next.prop('tagName')} - ${next.attr('class') || 'no class'}`);
        const img = next.find('img');
        if (img.length) {
          console.log(`  Contains image: ${img.attr('src')}`);
        }
      }
    });

    // Look for elements containing the text "Through pond hatch"
    console.log('\nSearching for "Through pond hatch" elements:');
    $(':contains("Through pond hatch")').each((i, el) => {
      console.log(`${i}: ${$(el).prop('tagName')} - ${$(el).attr('class') || 'no class'}`);

      // Check the next element or sibling for possible image
      const next = $(el).next();
      if (next.length) {
        console.log(`  Next element: ${next.prop('tagName')} - ${next.attr('class') || 'no class'}`);
        const img = next.find('img');
        if (img.length) {
          console.log(`  Contains image: ${img.attr('src')}`);
        }
      }
    });

    // Also look for any images that might contain the data
    console.log('\nAll images on the page:');
    $('img').each((i, el) => {
      console.log(`${i}: ${$(el).attr('src')} - ${$(el).attr('alt') || 'no alt'}`);
      console.log(`  Parent: ${$(el).parent().prop('tagName')} - ${$(el).parent().attr('class') || 'no class'}`);
    });

  } catch (error) {
    console.error('Error analyzing website:', error);
  }
}

analyzeWebsite();
