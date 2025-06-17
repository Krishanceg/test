document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.creation-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const form = document.getElementById('bot-creation-form');
    
    // Form elements
    const botNameInput = document.getElementById('bot-name');
    const assetPairSelect = document.getElementById('asset-pair');
    const timeframeSelect = document.getElementById('timeframe');
    const investmentRange = document.getElementById('investment');
    const investmentValue = document.getElementById('investment-value');
    const stopLossRange = document.getElementById('stop-loss');
    const stopLossValue = document.getElementById('stop-loss-value');
    const takeProfitRange = document.getElementById('take-profit');
    const takeProfitValue = document.getElementById('take-profit-value');
    
    // Review elements
    const reviewBotName = document.getElementById('review-bot-name');
    const reviewStrategy = document.getElementById('review-strategy');
    const reviewAssetPair = document.getElementById('review-asset-pair');
    const reviewTimeframe = document.getElementById('review-timeframe');
    const reviewRisk = document.getElementById('review-risk');
    
    // Initialize first step
    steps[0].classList.add('active');
    stepContents[0].classList.add('active');
    
    // Range input events
    investmentRange.addEventListener('input', updateRangeValue.bind(null, investmentRange, investmentValue, '%'));
    stopLossRange.addEventListener('input', updateRangeValue.bind(null, stopLossRange, stopLossValue, '%'));
    takeProfitRange.addEventListener('input', updateRangeValue.bind(null, takeProfitRange, takeProfitValue, '%'));
    
    function updateRangeValue(rangeElement, valueElement, suffix = '') {
        valueElement.textContent = rangeElement.value + suffix;
    }
    
    // Step navigation
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.creation-step.active');
            const nextStepId = this.dataset.next;
            
            if (validateStep(currentStep.id)) {
                navigateToStep(nextStepId);
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStepId = this.dataset.prev;
            navigateToStep(prevStepId);
        });
    });
    
    steps.forEach(step => {
        step.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            const stepId = this.dataset.step;
            navigateToStep(stepId);
        });
    });
    
    function validateStep(stepId) {
        switch(stepId) {
            case 'step-1':
                return true;
            case 'step-2':
                if (!botNameInput.value.trim()) {
                    alert('Please enter a bot name');
                    return false;
                }
                return true;
            case 'step-3':
                return true;
            default:
                return true;
        }
    }
    
    function navigateToStep(stepId) {
        steps.forEach(step => step.classList.remove('active'));
        stepContents.forEach(content => content.classList.remove('active'));
        
        document.querySelector(`.step[data-step="${stepId}"]`).classList.add('active');
        document.getElementById(`step-${stepId}`).classList.add('active');
        
        if (stepId === '4') updateReviewSection();
    }
    
    function updateReviewSection() {
        const selectedStrategy = document.querySelector('input[name="strategy"]:checked');
        
        reviewBotName.textContent = botNameInput.value || 'Unnamed Bot';
        reviewStrategy.textContent = selectedStrategy.nextElementSibling.querySelector('h3').textContent;
        reviewAssetPair.textContent = assetPairSelect.options[assetPairSelect.selectedIndex].text;
        reviewTimeframe.textContent = timeframeSelect.options[timeframeSelect.selectedIndex].text;
        reviewRisk.textContent = `${stopLossRange.value}% Stop Loss, ${takeProfitRange.value}% Take Profit`;
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const botData = {
            id: Date.now().toString(),
            name: botNameInput.value,
            strategy: document.querySelector('input[name="strategy"]:checked').value,
            pair: assetPairSelect.value,
            timeframe: timeframeSelect.value,
            stopLoss: stopLossRange.value,
            takeProfit: takeProfitRange.value,
            investment: investmentRange.value,
            status: 'active',
            profit: 0,
            winRate: 0,
            rating: (Math.random() * 1 + 4).toFixed(1),
            createdAt: new Date().toISOString()
        };
        
        let bots = JSON.parse(localStorage.getItem('bots')) || [];
        bots.push(botData);
        localStorage.setItem('bots', JSON.stringify(bots));
        
        alert('Bot created successfully!');
        window.location.href = 'dashboard.html';
    });
});