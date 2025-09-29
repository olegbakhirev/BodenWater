// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Fetch water flow data from the API
    fetchWaterFlowData();
});

/**
 * Fetches water flow data from the API
 */
async function fetchWaterFlowData() {
    try {
        const response = await fetch('/api/water-flow');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            displayNoDataMessage();
            return;
        }

        // Process and display the data
        renderChart(data);
        displayLatestData(data[data.length - 1]);
    } catch (error) {
        console.error('Error fetching water flow data:', error);
        displayErrorMessage();
    }
}

/**
 * Renders the water flow chart using Chart.js
 * @param {Array} data - The water flow data
 */
function renderChart(data) {
    // Extract dates for x-axis
    const dates = data.map(item => item.lastUpdate);

    // Extract values for y-axis
    const turbineValues = data.map(item => item.throughTurbine);
    const pondHatchValues = data.map(item => item.throughPondHatch);
    const totalValues = data.map(item => item.total);

    // Get the canvas element
    const ctx = document.getElementById('waterFlowChart').getContext('2d');

    // Create the chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Through Turbine',
                    data: turbineValues,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Through Pond Hatch',
                    data: pondHatchValues,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Total Flow',
                    data: totalValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Water Flow (m³/s)'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Boden Power Plant Water Flow'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

/**
 * Displays the latest water flow data
 * @param {Object} latestData - The latest water flow data
 */
function displayLatestData(latestData) {
    const latestDataElement = document.getElementById('latestData');

    latestDataElement.innerHTML = `
        <div class="data-item">
            <span class="data-label">Last Update:</span>
            <span>${latestData.lastUpdate}</span>
        </div>
        <div class="data-item">
            <span class="data-label">Through Turbine:</span>
            <span>${latestData.throughTurbine} m³/s</span>
        </div>
        <div class="data-item">
            <span class="data-label">Through Pond Hatch:</span>
            <span>${latestData.throughPondHatch} m³/s</span>
        </div>
        <div class="data-item">
            <span class="data-label">Total Flow:</span>
            <span>${latestData.total} m³/s</span>
        </div>
    `;
}

/**
 * Displays a message when no data is available
 */
function displayNoDataMessage() {
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.innerHTML = '<div class="message">No water flow data available yet. Please check back later.</div>';

    const latestDataElement = document.getElementById('latestData');
    latestDataElement.innerHTML = '<p>No data available yet.</p>';
}

/**
 * Displays an error message when data fetching fails
 */
function displayErrorMessage() {
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.innerHTML = '<div class="message error">Failed to load water flow data. Please try again later.</div>';

    const latestDataElement = document.getElementById('latestData');
    latestDataElement.innerHTML = '<p class="error">Error loading data.</p>';
}
