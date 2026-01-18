/**
 * LearnNepal Core Scripts
 * Handles Navigation, Mobile Menu, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileMenu();
    initDropdownsForMobile();
    initSidebarAccordion();
    initSidebarAccordion();
    initProgressBar();
    initBackToTop();
});

function initProgressBar() {
    // Create Progress Bar Elements
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressContainer.appendChild(progressBar);
    
    document.body.prepend(progressContainer);
    
    // Update on Scroll
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

function initBackToTop() {
    // Create Back to Top Button
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.ariaLabel = "Back to Top";
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    
    document.body.appendChild(btn);
    
    // Show/Hide Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    
    // Click to Scroll Top
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initSidebarAccordion() {
    const sidebarGroups = document.querySelectorAll('.sidebar-group');
    
    sidebarGroups.forEach(group => {
        const title = group.querySelector('.sidebar-group-title');
        
        if (title) {
            title.addEventListener('click', () => {
                group.classList.toggle('active');
            });
        }
    });
}

function initStickyHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-menu');
    const bars = document.querySelectorAll('.bar');

    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        
        // Animate hamburger to X
        if (nav.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
             // Only close if it's not a dropdown toggle
             if (!link.parentElement.classList.contains('dropdown')) {
                 nav.classList.remove('active');
             }
        });
    });
}

function initDropdownsForMobile() {
    // Remove early return so listeners attach even if loaded on desktop then resized
    const dropdowns = document.querySelectorAll('.dropdown > .nav-link');
    
    dropdowns.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Check width at the moment of click
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = trigger.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
}
