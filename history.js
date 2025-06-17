document.addEventListener('DOMContentLoaded', function() {
    // Load all bots for filter dropdown
    const bots = JSON.parselocalStorage.getItem('bots') || [];
    const botFilter = document.getElementById('bot-filter');
    
    bots.forEach(bot => {
        const option = document.createElement('option');
        option.value = bot.id;
        option.textContent = bot.name;
        botFilter.appendChild(option);
    });
    
    // Load and display history
    function loadHistory(filter = {}) {
        const history = JSON.parse(localStorage.getItem('tradingHistory') || '[]');
        const tbody = document.querySelector('#history-table tbody');
        tbody.innerHTML = '';
        
        const filteredHistory = history.filter(entry => {
            if (filter.botId && entry.botId !== filter.botId) return false;
            if (filter.timePeriod) {
                const entryDate = new Date(entry.timestamp);
                const now = new Date();
                
                if (filter.timePeriod === 'day' && 
                    !isSameDay(entryDate, now)) return false;
                if (filter.timePeriod === 'week' && 
                    !isSameWeek(entryDate, now)) return false;
                if (filter.timePeriod === 'month' && 
                    !isSameMonth(entryDate, now)) return false;
            }
            return true;
        });
        
        filteredHistory.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(entry.timestamp)}</td>
                <td>${getBotName(entry.botId)}</td>
                <td>${entry.pair}</td>
                <td class="${entry.action}">${entry.action.toUpperCase()}</td>
                <td>${entry.price.toFixed(2)}</td>
                <td>${entry.quantity.toFixed(4)}</td>
                <td class="${entry.profitLoss >= 0 ? 'positive' : 'negative'}">
                    ${entry.profitLoss >= 0 ? '+' : ''}${entry.profitLoss.toFixed(2)}
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Helper functions
    function getBotName(botId) {
        const bots = JSON.parse(localStorage.getItem('bots') || '[]');
        const bot = bots.find(b => b.id === botId);
        return bot ? bot.name : 'Unknown Bot';
    }
    
    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString();
    }
    
    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }
    
    // Add event listeners for filters
    document.getElementById('time-filter').addEventListener('change', function() {
        loadHistory({ timePeriod: this.value });
    });
    
    document.getElementById('bot-filter').addEventListener('change', function() {
        loadHistory({ botId: this.value === 'all' ? null : this.value });
    });
    
    // Initial load
    loadHistory();
});