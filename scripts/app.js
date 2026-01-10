/**
 * LearnNepal Core Scripts
 * Handles Navigation, Mobile Menu, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileMenu();
    initDropdownsForMobile();
    initSidebarAccordion();
});

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
    if (window.innerWidth > 768) return;

    const dropdowns = document.querySelectorAll('.dropdown > .nav-link');
    
    dropdowns.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = trigger.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
}
