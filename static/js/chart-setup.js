document.addEventListener('DOMContentLoaded', function() {
    setupTaskStatusChart();
    setupCompletionChart();
    setupCategoryCompletionChart();
});

function setupTaskStatusChart() {
    const ctx = document.getElementById('task-status-chart');
    if (!ctx) return;
    
    // Get data from HTML attributes
    const notStarted = parseInt(ctx.dataset.notStarted);
    const inProgress = parseInt(ctx.dataset.inProgress);
    const completed = parseInt(ctx.dataset.completed);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Not Started', 'In Progress', 'Completed'],
            datasets: [{
                data: [notStarted, inProgress, completed],
                backgroundColor: [
                    '#dc3545',  // Danger for not started
                    '#ffc107',  // Warning for in progress
                    '#198754'   // Success for completed
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function setupCompletionChart() {
    const ctx = document.getElementById('completion-chart');
    if (!ctx) return;
    
    // Get data from HTML attributes
    const labels = JSON.parse(ctx.dataset.labels);
    const data = JSON.parse(ctx.dataset.data);
    
    // Format date labels to be more readable
    const formattedLabels = labels.map(dateStr => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: formattedLabels,
            datasets: [{
                label: 'Tasks Completed',
                data: data,
                fill: false,
                borderColor: '#0d6efd',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function setupCategoryCompletionChart() {
    const ctx = document.getElementById('category-chart');
    if (!ctx) return;
    
    // Get category data from HTML elements
    const categoryElements = document.querySelectorAll('.category-stat');
    const labels = [];
    const completionRates = [];
    const backgroundColors = [];
    
    // Generate a color palette
    const colorPalette = [
        '#0d6efd', '#6610f2', '#6f42c1', '#d63384', 
        '#dc3545', '#fd7e14', '#ffc107', '#198754', 
        '#20c997', '#0dcaf0'
    ];
    
    categoryElements.forEach((element, index) => {
        labels.push(element.dataset.name);
        completionRates.push(parseFloat(element.dataset.completionRate));
        backgroundColors.push(colorPalette[index % colorPalette.length]);
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Completion Rate (%)',
                data: completionRates,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Function for achievement trophy visualization
function setupAchievementTrophies() {
    const trophyContainers = document.querySelectorAll('.trophy-container');
    if (!trophyContainers.length) return;
    
    trophyContainers.forEach(container => {
        const level = parseInt(container.dataset.level);
        let trophyColor;
        
        switch (level) {
            case 1:
                trophyColor = '#CD7F32'; // Bronze
                break;
            case 2:
                trophyColor = '#C0C0C0'; // Silver
                break;
            case 3:
                trophyColor = '#FFD700'; // Gold
                break;
            default:
                trophyColor = '#6c757d'; // Default gray
        }
        
        // Add trophy icon with appropriate color
        container.innerHTML = `
            <i class="fa fa-trophy" style="color: ${trophyColor}; font-size: 2rem;"></i>
        `;
    });
}
