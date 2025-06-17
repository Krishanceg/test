document.addEventListener('DOMContentLoaded', function() {
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });

    // Load bots from localStorage
    const loadBots = () => {
        const botsContainer = document.getElementById('bots-container');
        const bots = JSON.parse(localStorage.getItem('bots')) || [];
        
        if (bots.length === 0) {
            document.querySelector('.no-bots-message').style.display = 'flex';
            return;
        } else {
            document.querySelector('.no-bots-message').style.display = 'none';
        }

        // Update stats
        document.getElementById('active-bots-count').textContent = bots.length;
        
        // Calculate total profit
        const totalProfit = bots.reduce((sum, bot) => sum + (bot.profit || 0), 0);
        document.getElementById('total-profit').textContent = `$${totalProfit.toLocaleString()}`;
        document.getElementById('total-profit').className = `stat-value ${totalProfit >= 0 ? 'positive' : 'negative'}`;
        
        // Calculate win rate (averaging all bots)
        const winRate = bots.length > 0 ? 
            Math.round(bots.reduce((sum, bot) => sum + (parseInt(bot.winRate) || 0), 0) / bots.length) : 0;
        document.getElementById('win-rate').textContent = `${winRate}%`;
        
        // Calculate average rating
        const avgRating = bots.length > 0 ? 
            (bots.reduce((sum, bot) => sum + parseFloat(bot.rating || 0), 0) / bots.length).toFixed(1) : 0;
        document.getElementById('avg-rating').innerHTML = `${avgRating} <span class="rating-stars">${'★'.repeat(Math.round(avgRating))}${'☆'.repeat(5-Math.round(avgRating))}</span>`;
        
        // Generate bot cards
        botsContainer.innerHTML = '';
        bots.forEach(bot => {
            const botCard = document.createElement('div');
            botCard.className = 'bot-card';
            botCard.innerHTML = `
                <div class="bot-header">
                    <h3>${bot.name}</h3>
                    <span class="bot-rating">${bot.rating} ★</span>
                </div>
                <div class="bot-details">
                    <p><strong>Strategy:</strong> ${bot.strategy.replace('-', ' ')}</p>
                    <p><strong>Pair:</strong> ${bot.pair}</p>
                    <p><strong>Status:</strong> <span class="status-${bot.status}">${bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}</span></p>
                </div>
                <div class="bot-stats">
                    <div class="stat">
                        <span>Profit</span>
                        <span class="${bot.profit >= 0 ? 'positive' : 'negative'}">$${(bot.profit || 0).toFixed(2)}</span>
                    </div>
                    <div class="stat">
                        <span>Win Rate</span>
                        <span>${bot.winRate || '0'}%</span>
                    </div>
                </div>
                <div class="bot-actions">
                    <button class="btn btn-outline" onclick="viewBotDetails('${bot.id}')">
                        <i class="fas fa-chart-bar"></i> Details
                    </button>
                    <button class="btn btn-danger" onclick="stopBot('${bot.id}')">
                        <i class="fas fa-stop"></i> Stop
                    </button>
                </div>
            `;
            botsContainer.appendChild(botCard);
        });
    };

    // Initial load
    loadBots();
});

// Helper functions - these need to be in global scope
function viewBotDetails(botId) {
    // Implement bot details viewing
    console.log(`Viewing details for bot ${botId}`);
    // You could redirect to a details page or show a modal
}

function stopBot(botId) {
    // Implement bot stopping
    if (confirm('Are you sure you want to stop this bot?')) {
        let bots = JSON.parse(localStorage.getItem('bots')) || [];
        bots = bots.map(bot => {
            if (bot.id === botId) {
                return {...bot, status: 'stopped'};
            }
            return bot;
        });
        localStorage.setItem('bots', JSON.stringify(bots));
        
        // Reload the bots to update the UI
        document.dispatchEvent(new Event('DOMContentLoaded'));
    }
}