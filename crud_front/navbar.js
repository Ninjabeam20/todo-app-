// Navbar functionality: handles username display, dropdown toggle, and logout redirect
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username') || 'User';

    const usernameElement = document.getElementById('navbarUsername');
    if (usernameElement) {
        usernameElement.textContent = username;
    }

    const logoutBtn = document.getElementById('navbarLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        });
    }

    const accountIcon = document.getElementById('accountIcon');
    const accountDropdown = document.getElementById('accountDropdown');

    if (accountIcon && accountDropdown) {
        accountIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            accountDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!accountIcon.contains(e.target) && !accountDropdown.contains(e.target)) {
                accountDropdown.classList.remove('show');
            }
        });
    }
});

