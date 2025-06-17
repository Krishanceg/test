// Shared functionality across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Check authentication for protected pages
    const protectedPages = ['dashboard.html', 'bot-creator.html', 'bot-details.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !localStorage.getItem('isAuthenticated')) {
        window.location.href = 'login.html';
    }
    
    // Update login button if already authenticated
    if (localStorage.getItem('isAuthenticated')) {
        const loginLinks = document.querySelectorAll('a[href="login.html"]');
        loginLinks.forEach(link => {
            link.href = 'dashboard.html';
            link.textContent = 'Dashboard';
        });
    }
});