document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress chart if on the dashboard
    const progressCanvas = document.getElementById('progressChart');
    if (progressCanvas) {
        initProgressChart();
    }
    
    // Initialize achievements chart if on the achievements page
    const achievementsCanvas = document.getElementById('achievementsChart');
    if (achievementsCanvas) {
        initAchievementsChart();
    }
});

function initProgressChart() {
    const progressCanvas = document.getElementById('progressChart');
    if (!progressCanvas) return;
    
    // Get task data from the tasks-data div
    const tasksDataElement = document.getElementById('tasks-data');
    if (!tasksDataElement) return;
    
    try {
        const tasksData = JSON.parse(tasksDataElement.dataset.tasks);
        
        // Count tasks by priority
        const priorityCounts = {
            'High': tasksData.filter(task => task.priority === 'High').length,
            'Medium': tasksData.filter(task => task.priority === 'Medium').length,
            'Low': tasksData.filter(task => task.priority === 'Low').length
        };
        
        // Calculate completion percentages for tasks with progress tracking
        const progressTasks = tasksData.filter(task => task.track_progress);
        
        let totalProgress = 0;
        if (progressTasks.length > 0) {
            totalProgress = progressTasks.reduce((sum, task) => sum + task.progress, 0) / progressTasks.length;
        }
        
        // Create the chart
        const progressChart = new Chart(progressCanvas, {
            type: 'doughnut',
            data: {
                labels: ['High', 'Medium', 'Low'],
                datasets: [{
                    label: 'Tasks by Priority',
                    data: [priorityCounts.High, priorityCounts.Medium, priorityCounts.Low],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 205, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Tasks by Priority'
                    }
                }
            }
        });
        
        // Create progress gauge
        const progressGaugeCanvas = document.getElementById('progressGauge');
        if (progressGaugeCanvas) {
            const progressGauge = new Chart(progressGaugeCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Remaining'],
                    datasets: [{
                        data: [totalProgress, 100 - totalProgress],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(200, 200, 200, 0.2)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    circumference: 180,
                    rotation: 270,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Overall Progress'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.dataIndex === 0) {
                                        return `Completed: ${Math.round(totalProgress)}%`;
                                    } else {
                                        return `Remaining: ${Math.round(100 - totalProgress)}%`;
                                    }
                                }
                            }
                        }
                    }
                }
            });
            
            // Add center text
            Chart.register({
                id: 'progressText',
                beforeDraw: function(chart) {
                    const width = chart.width;
                    const height = chart.height;
                    const ctx = chart.ctx;
                    
                    ctx.restore();
                    const fontSize = (height / 100).toFixed(2);
                    ctx.font = fontSize + 'em sans-serif';
                    ctx.textBaseline = 'middle';
                    
                    const text = `${Math.round(totalProgress)}%`;
                    const textX = Math.round((width - ctx.measureText(text).width) / 2);
                    const textY = height - fontSize * 20;
                    
                    ctx.fillStyle = '#fff';
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                }
            });
            
            // Update the chart
            progressGauge.options.plugins.progressText = {};
            progressGauge.update();
        }
    } catch (error) {
        console.error('Error initializing progress chart:', error);
    }
}

function initAchievementsChart() {
    const achievementsCanvas = document.getElementById('achievementsChart');
    if (!achievementsCanvas) return;
    
    // Get achievements data
    const achievementsDataElement = document.getElementById('achievements-data');
    if (!achievementsDataElement) return;
    
    try {
        const achievementsData = JSON.parse(achievementsDataElement.dataset.achievements);
        const completedTasks = parseInt(achievementsDataElement.dataset.completedTasks);
        
        // Determine next achievement milestone
        const milestones = [5, 10, 25, 50, 100];
        let nextMilestone = milestones.find(m => m > completedTasks) || completedTasks + 10;
        const progressToNext = (completedTasks / nextMilestone) * 100;
        
        // Create achievements chart
        const achievementsChart = new Chart(achievementsCanvas, {
            type: 'bar',
            data: {
                labels: achievementsData.map(a => a.title),
                datasets: [{
                    label: 'Achievements Earned',
                    data: achievementsData.map(() => 1),  // Each achievement counts as 1
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgb(153, 102, 255)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Your Achievements'
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Create progress to next achievement chart
        const nextMilestoneCanvas = document.getElementById('nextMilestoneChart');
        if (nextMilestoneCanvas) {
            const nextMilestoneChart = new Chart(nextMilestoneCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Progress', 'Remaining'],
                    datasets: [{
                        data: [completedTasks, nextMilestone - completedTasks],
                        backgroundColor: [
                            'rgba(153, 102, 255, 0.7)',
                            'rgba(200, 200, 200, 0.2)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: `Progress to Next Achievement (${completedTasks}/${nextMilestone})`
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.dataIndex === 0) {
                                        return `Completed: ${completedTasks} tasks`;
                                    } else {
                                        return `Remaining: ${nextMilestone - completedTasks} tasks`;
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error initializing achievements chart:', error);
    }
}
