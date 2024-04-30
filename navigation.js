// Get the current URL path
const path = window.location.pathname;

// Find the corresponding navigation link and add the 'active' class
const navPage = document.querySelectorAll('a[href="' + path + '"]');
navPage.forEach(link => {
    link.classList.add('active');
});