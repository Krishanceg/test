document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authForm = document.getElementById('authForm');
    const authTitle = document.getElementById('auth-title');
    const authSubmit = document.getElementById('auth-submit');
    const authToggleText = document.getElementById('auth-toggle-text');
    const authToggleLink = document.getElementById('auth-toggle-link');
    const urlParams = new URLSearchParams(window.location.search);
    const isRegister = urlParams.get('register') === 'true';

    // Toggle between login and register
    if (isRegister) {
        setRegisterMode();
    }

    authToggleLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (authTitle.textContent === 'Login to Your Account') {
            setRegisterMode();
        } else {
            setLoginMode();
        }
    });

    function setRegisterMode() {
        authTitle.textContent = 'Create an Account';
        authSubmit.textContent = 'Register';
        authToggleText.innerHTML = 'Already have an account? <a href="#" id="auth-toggle-link">Login</a>';
        // You could add additional fields for registration here
    }

    function setLoginMode() {
        authTitle.textContent = 'Login to Your Account';
        authSubmit.textContent = 'Login';
        authToggleText.innerHTML = 'Don\'t have an account? <a href="#" id="auth-toggle-link">Register</a>';
    }

    // Form submission
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // In a real app, you would make an API call here
        console.log(authSubmit.textContent + ' attempt with:', email, password);
        
        // Simulate successful auth
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    });

    // Check if user is already logged in
    if (localStorage.getItem('isAuthenticated') && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
});