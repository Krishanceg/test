// scripts/chart.js
document.addEventListener('DOMContentLoaded', function() {
    // Get the selected bot ID from localStorage
    const botId = localStorage.getItem('selectedBotId');
    
    // Redirect if no bot is selected
    if (!botId) {
        window.location.href = 'dashboard.html';
        return;
    }

    // In a real app, you would fetch this from your API
    const userBots = JSON.parse(localStorage.getItem('userBots') || '[]');
    const bot = userBots.find(b => b.id == botId);
    
    // Redirect if bot not found
    if (!bot) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Update bot details in the UI
    updateBotDetails(bot);

    // Initialize all charts
    initPerformanceChart(bot);
    initWinRateChart(bot);
    initDailyReturnsChart(bot);

    // Back button event listener
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    // Rating interaction
    setupRatingInteraction(bot);
});

function updateBotDetails(bot) {
    // Update basic bot info
    document.getElementById('bot-name').textContent = bot.name;
    document.getElementById('bot-strategy').textContent = formatStrategyName(bot.strategy);
    document.getElementById('bot-asset-pair').textContent = bot.assetPair;
    document.getElementById('bot-timeframe').textContent = formatTimeframe(bot.timeframe);
    document.getElementById('bot-status').textContent = bot.status || 'active';
    document.getElementById('bot-status').className = `status status-${bot.status || 'active'}`;
    
    // Update risk parameters
    document.getElementById('bot-investment').textContent = `${bot.maxInvestment}%`;
    document.getElementById('bot-stop-loss').textContent = `${bot.stopLoss}%`;
    document.getElementById('bot-take-profit').textContent = `${bot.takeProfit}%`;
    
    // Update performance metrics (sample data)
    document.getElementById('total-profit').textContent = `$${(bot.profit || 2450).toLocaleString()}`;
    document.getElementById('win-rate').textContent = `${bot.winRate || 72}%`;
    document.getElementById('total-trades').textContent = bot.trades || 124;
    document.getElementById('sharpe-ratio').textContent = (bot.sharpeRatio || 1.8).toFixed(2);
    
    // Update rating display
    if (bot.rating) {
        const ratingStars = document.getElementById('rating-stars');
        ratingStars.innerHTML = '';
        const fullStars = Math.floor(bot.rating);
        const hasHalfStar = bot.rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            if (i < fullStars) {
                star.className = 'fas fa-star';
            } else if (i === fullStars && hasHalfStar) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            ratingStars.appendChild(star);
        }
        
        document.getElementById('rating-value').textContent = bot.rating.toFixed(1);
    }
}

function initPerformanceChart(bot) {
    const ctx = document.getElementById('performance-chart').getContext('2d');
    
    // Sample performance data - in a real app, fetch from API
    const performanceData = generatePerformanceData(bot);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: performanceData.labels,
            datasets: [{
                label: 'Cumulative Profit',
                data: performanceData.profit,
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderColor: 'rgba(67, 97, 238, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 5
            }]
        },
        options: getChartOptions('Cumulative Profit Performance')
    });
}

function initWinRateChart(bot) {
    const ctx = document.getElementById('win-rate-chart').getContext('2d');
    
    // Sample win rate data
    const winRateData = {
        labels: ['Winning Trades', 'Losing Trades'],
        datasets: [{
            data: [bot.winRate || 72, 100 - (bot.winRate || 72)],
            backgroundColor: [
                'rgba(40, 167, 69, 0.8)',
                'rgba(220, 53, 69, 0.8)'
            ],
            borderColor: [
                'rgba(40, 167, 69, 1)',
                'rgba(220, 53, 69, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: winRateData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

function initDailyReturnsChart(bot) {
    const ctx = document.getElementById('returns-chart').getContext('2d');
    
    // Sample daily returns data
    const returnsData = generateDailyReturnsData(bot);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: returnsData.labels,
            datasets: [{
                label: 'Daily Returns',
                data: returnsData.returns,
                backgroundColor: function(context) {
                    return context.raw >= 0 ? 
                        'rgba(40, 167, 69, 0.7)' : 
                        'rgba(220, 53, 69, 0.7)';
                },
                borderColor: function(context) {
                    return context.raw >= 0 ? 
                        'rgba(40, 167, 69, 1)' : 
                        'rgba(220, 53, 69, 1)';
                },
                borderWidth: 1
            }]
        },
        options: getChartOptions('Daily Returns (%)', {
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw > 0 ? '+' : ''}${context.raw}%`;
                        }
                    }
                }
            }
        })
    });
}

function setupRatingInteraction(bot) {
    const stars = document.querySelectorAll('#rate-bot .star');
    let currentRating = bot.userRating || 0;
    
    stars.forEach((star, index) => {
        // Set initial rating
        if (index < currentRating) {
            star.classList.add('fas');
            star.classList.remove('far');
        }
        
        // Hover effect
        star.addEventListener('mouseover', () => {
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });
        
        // Click to rate
        star.addEventListener('click', () => {
            currentRating = index + 1;
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('fas');
                    s.classList.remove('far');
                } else {
                    s.classList.add('far');
                    s.classList.remove('fas');
                }
            });
            
            // In a real app, send rating to server
            console.log(`Rated bot ${bot.id} with ${currentRating} stars`);
            
            // Update the average rating (simulated)
            const newRating = calculateNewRating(bot.rating || 4.2, currentRating, bot.ratingCount || 15);
            document.getElementById('rating-value').textContent = newRating.toFixed(1);
            
            // Update stars for average rating
            const ratingStars = document.getElementById('rating-stars');
            ratingStars.innerHTML = '';
            const fullStars = Math.floor(newRating);
            const hasHalfStar = newRating % 1 >= 0.5;
            
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('i');
                if (i < fullStars) {
                    star.className = 'fas fa-star';
                } else if (i === fullStars && hasHalfStar) {
                    star.className = 'fas fa-star-half-alt';
                } else {
                    star.className = 'far fa-star';
                }
                ratingStars.appendChild(star);
            }
        });
    });
}

// Helper functions
function formatStrategyName(strategy) {
    return strategy.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatTimeframe(timeframe) {
    const mappings = {
        '1m': '1 Minute',
        '5m': '5 Minutes',
        '15m': '15 Minutes',
        '1h': '1 Hour',
        '4h': '4 Hours',
        '1d': '1 Day'
    };
    return mappings[timeframe] || timeframe;
}

function generatePerformanceData(bot) {
    // Generate sample performance data based on bot strategy
    const baseValue = 1000;
    const volatility = bot.strategy === 'mean-reversion' ? 0.3 : 0.5;
    const trend = bot.strategy === 'momentum' ? 1.2 : 1;
    
    const labels = [];
    const profit = [];
    let currentValue = baseValue;
    
    for (let i = 0; i < 30; i++) {
        labels.push(`Day ${i + 1}`);
        const randomChange = (Math.random() - 0.5) * volatility * 2;
        currentValue = currentValue * (1 + (randomChange * trend));
        profit.push(Math.round(currentValue));
    }
    
    return { labels, profit };
}

function generateDailyReturnsData(bot) {
    // Generate sample daily returns
    const labels = [];
    const returns = [];
    const volatility = bot.strategy === 'arbitrage' ? 0.5 : 1;
    
    for (let i = 0; i < 14; i++) {
        labels.push(`${i + 1} ${bot.timeframe || 'Day'}`);
        const randomReturn = (Math.random() - 0.4) * volatility * 5;
        returns.push(parseFloat(randomReturn.toFixed(2)));
    }
    
    return { labels, returns };
}

function getChartOptions(title, customOptions = {}) {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 14
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `$${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: false,
                grid: {
                    drawBorder: false
                },
                ticks: {
                    callback: function(value) {
                        return `$${value.toLocaleString()}`;
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };
    
    return mergeOptions(defaultOptions, customOptions);
}

function mergeOptions(defaultOptions, customOptions) {
    // Simple deep merge for chart options
    return {
        ...defaultOptions,
        ...customOptions,
        plugins: {
            ...defaultOptions.plugins,
            ...(customOptions.plugins || {})
        },
        scales: {
            ...defaultOptions.scales,
            ...(customOptions.scales || {})
        }
    };
}

function calculateNewRating(currentAverage, newRating, ratingCount) {
    // Calculate new average rating
    return ((currentAverage * ratingCount) + newRating) / (ratingCount + 1);
}