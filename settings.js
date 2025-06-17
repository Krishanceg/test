document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Font size slider
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    
    fontSizeSlider.addEventListener('input', () => {
        fontSizeValue.textContent = `${fontSizeSlider.value}px`;
    });

    // Save button functionality
    const saveButton = document.getElementById('save-btn');
    saveButton.addEventListener('click', () => {
        // In a real app, you would save these settings to localStorage or send to a server
        alert('Settings saved successfully!');
        
        // Example of saving to localStorage
        const settings = {
            language: document.getElementById('language').value,
            theme: document.getElementById('theme').value,
            autoUpdate: document.getElementById('auto-update').checked,
            dataCollection: document.getElementById('data-collection').checked,
            notificationsEnabled: document.getElementById('notifications-enable').checked,
            fontSize: fontSizeSlider.value,
            colorScheme: document.querySelector('input[name="color-scheme"]:checked').value
        };
        
        localStorage.setItem('appSettings', JSON.stringify(settings));
    });

    // Cancel button functionality
    const cancelButton = document.getElementById('cancel-btn');
    cancelButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to discard changes?')) {
            // In a real app, you might reload the page or reset form values
            window.location.reload();
        }
    });

    // Reset to defaults button
    const resetButton = document.getElementById('reset-btn');
    resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all settings to default values?')) {
            // Reset all form elements to their default values
            document.querySelectorAll('select, input').forEach(element => {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    element.checked = element.defaultChecked;
                } else if (element.type === 'range') {
                    element.value = element.defaultValue;
                    fontSizeValue.textContent = `${element.value}px`;
                } else {
                    element.value = element.defaultValue;
                }
            });
        }
    });

    // Load saved settings if they exist
    function loadSettings() {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Apply saved settings to form elements
            document.getElementById('language').value = settings.language;
            document.getElementById('theme').value = settings.theme;
            document.getElementById('auto-update').checked = settings.autoUpdate;
            document.getElementById('data-collection').checked = settings.dataCollection;
            document.getElementById('notifications-enable').checked = settings.notificationsEnabled;
            fontSizeSlider.value = settings.fontSize;
            fontSizeValue.textContent = `${settings.fontSize}px`;
            
            const colorRadio = document.querySelector(`input[name="color-scheme"][value="${settings.colorScheme}"]`);
            if (colorRadio) colorRadio.checked = true;
        }
    }
    
    loadSettings();
});