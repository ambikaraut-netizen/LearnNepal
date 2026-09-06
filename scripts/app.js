/**
 * LearnNepal Core Scripts
 * Handles Navigation, Mobile Menu, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initDropdowns();
    initSidebarAccordion();
    initSidebarToggle();
    initPageTransitions();
});

/* NOTE: initProgressBar() and initBackToTop() REMOVED.
 * Progress bar is now handled by #reading-progress in the HTML + inline JS.
 * Back-to-top button is now created by transitions.js → initBackToTop().
 * Having duplicates caused two progress bars and two back-to-top buttons. */

function initSidebarAccordion() {
    const sidebarGroups = document.querySelectorAll('.sidebar-group');
    
    sidebarGroups.forEach(group => {
        const title = group.querySelector('.sidebar-group-title');
        if (!title) return;

        // Make the accordion header keyboard-focusable and assign button role
        title.setAttribute('tabindex', '0');
        title.setAttribute('role', 'button');
        
        // Sync initial aria-expanded state
        const isActive = group.classList.contains('active');
        title.setAttribute('aria-expanded', isActive ? 'true' : 'false');

        function toggleGroup() {
            const nowActive = group.classList.toggle('active');
            title.setAttribute('aria-expanded', nowActive ? 'true' : 'false');
        }

        // Toggle on click
        title.addEventListener('click', toggleGroup);

        // Keyboard support: Space & Enter to toggle
        title.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
                e.preventDefault();
                toggleGroup();
            }
        });
    });
}

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-menu');
    if (!toggle || !nav) return;

    // Ensure toggle has proper ARIA semantics for screen readers
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'site-nav-menu');
    if (!nav.id) nav.id = 'site-nav-menu';

    // Dynamically create backdrop overlay if not present
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);
    }

    function toggleMenu() {
        const isOpen = document.body.classList.toggle('nav-open');
        nav.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }

    function closeMenu() {
        document.body.classList.remove('nav-open');
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        // Return focus to toggle so keyboard users don't get lost
        toggle.focus();
    }

    toggle.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
            closeMenu();
        }
    });

    // Close menu when clicking nav links (except dropdown parents)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
             if (!link.parentElement.classList.contains('dropdown')) {
                 closeMenu();
             }
         });
    });
}

function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (!trigger || !menu) return;

        // Set initial ARIA attributes
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');

        function toggleDropdown(forceState) {
            const willOpen = typeof forceState === 'boolean' ? forceState : !dropdown.classList.contains('active');
            
            // Close other open dropdowns
            if (willOpen) {
                document.querySelectorAll('.dropdown.active').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                        const t = d.querySelector('.nav-link');
                        if (t) t.setAttribute('aria-expanded', 'false');
                    }
                });
            }

            dropdown.classList.toggle('active', willOpen);
            trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        }

        // Handle click
        trigger.addEventListener('click', (e) => {
            // Under 1024px, click is the toggle mechanism
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                toggleDropdown();
            }
        });

        // Handle Keyboard Events
        trigger.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
                e.preventDefault();
                toggleDropdown();
                if (dropdown.classList.contains('active')) {
                    // Focus first item when opened via keyboard
                    const firstItem = menu.querySelector('.dropdown-item');
                    if (firstItem) firstItem.focus();
                }
            } else if (e.key === 'ArrowDown' && !dropdown.classList.contains('active')) {
                e.preventDefault();
                toggleDropdown(true);
                const firstItem = menu.querySelector('.dropdown-item');
                if (firstItem) firstItem.focus();
            }
        });

        // Handle inside-menu keyboard navigation
        const items = Array.from(menu.querySelectorAll('.dropdown-item'));
        items.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    toggleDropdown(false);
                    trigger.focus();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextItem = items[index + 1] || items[0];
                    if (nextItem) nextItem.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevItem = items[index - 1] || items[items.length - 1];
                    if (prevItem) prevItem.focus();
                }
            });
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function initSidebarToggle() {
    const docsLayout = document.querySelector('.docs-layout');
    const sidebar = document.querySelector('.sidebar');
    const docsContent = document.querySelector('.docs-content');
    if (!docsLayout || !sidebar) return;

    // Create backdrop overlay for mobile if not already present
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
    }

    // Ensure close button exists in sidebar
    let closeBtn = sidebar.querySelector('.sidebar-close-btn');
    if (!closeBtn) {
        closeBtn = document.createElement('button');
        closeBtn.className = 'sidebar-close-btn';
        closeBtn.setAttribute('aria-label', 'Close sidebar');
        closeBtn.setAttribute('title', 'Close sidebar');
        closeBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">close</span>';
        
        const titleRow = sidebar.querySelector('.sidebar-title');
        if (titleRow) {
            let headerRow = sidebar.querySelector('.sidebar-header-row');
            if (!headerRow) {
                headerRow = document.createElement('div');
                headerRow.className = 'sidebar-header-row';
                titleRow.parentNode.insertBefore(headerRow, titleRow);
                headerRow.appendChild(titleRow);
            }
            headerRow.appendChild(closeBtn);
        } else {
            sidebar.insertBefore(closeBtn, sidebar.firstChild);
        }
    }

    // Ensure sidebar toggle button exists in docs-content
    let toggleBtn = document.querySelector('.sidebar-toggle-btn');
    if (!toggleBtn && docsContent) {
        toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle-btn';
        toggleBtn.id = 'sidebar-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Toggle chapters sidebar');
        toggleBtn.setAttribute('title', 'Toggle chapters sidebar');
        toggleBtn.innerHTML = '<span class="material-symbols-outlined">menu_open</span><span>Chapters</span>';
        
        if (docsContent.firstElementChild) {
            docsContent.firstElementChild.insertBefore(toggleBtn, docsContent.firstElementChild.firstChild);
        } else {
            docsContent.insertBefore(toggleBtn, docsContent.firstChild);
        }
    }

    // Sync button UI with current state
    function updateButtonState(isClosed) {
        const btns = document.querySelectorAll('.sidebar-toggle-btn, .mobile-sidebar-toggle');
        btns.forEach(btn => {
            const icon = btn.querySelector('.material-symbols-outlined');
            const label = btn.querySelector('span:not(.material-symbols-outlined)') || btn;
            if (isClosed) {
                btn.classList.add('is-collapsed');
                if (icon) icon.textContent = 'view_sidebar';
                if (label && label !== btn) label.textContent = 'Show Chapters';
            } else {
                btn.classList.remove('is-collapsed');
                if (icon) icon.textContent = 'menu_open';
                if (label && label !== btn) label.textContent = 'Hide Chapters';
            }
        });
    }

    // Restore desktop collapsed preference from localStorage
    const savedState = localStorage.getItem('learnnepal_sidebar_collapsed');
    if (window.innerWidth > 1024 && savedState === 'true') {
        docsLayout.classList.add('sidebar-collapsed');
        updateButtonState(true);
    } else {
        updateButtonState(false);
    }

    function toggleSidebar() {
        if (window.innerWidth <= 1024) {
            // Mobile: off-canvas drawer
            const isOpen = sidebar.classList.toggle('active');
            overlay.classList.toggle('active', isOpen);
            document.body.classList.toggle('sidebar-open', isOpen);
            updateButtonState(!isOpen);
        } else {
            // Desktop: collapse / expand grid column
            const isNowCollapsed = docsLayout.classList.toggle('sidebar-collapsed');
            localStorage.setItem('learnnepal_sidebar_collapsed', isNowCollapsed ? 'true' : 'false');
            updateButtonState(isNowCollapsed);
        }
    }

    function closeSidebar() {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            updateButtonState(true);
        } else {
            docsLayout.classList.add('sidebar-collapsed');
            localStorage.setItem('learnnepal_sidebar_collapsed', 'true');
            updateButtonState(true);
        }
    }

    // Attach listeners to all toggle buttons (custom + mobile toggle)
    document.querySelectorAll('.sidebar-toggle-btn, .mobile-sidebar-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    });

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSidebar();
    });

    overlay.addEventListener('click', closeSidebar);

    // Close mobile drawer when clicking a chapter link
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024 && link.getAttribute('href') !== '#' && !link.classList.contains('sidebar-group-title')) {
                closeSidebar();
            }
        });
    });

    // Keyboard support: Escape closes mobile sidebar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
}

function initPageTransitions() {
    const old = document.querySelector('.svg-transition-overlay');
    if (old) old.remove();
}
