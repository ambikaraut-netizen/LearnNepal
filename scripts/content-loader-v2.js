/**
 * Content Loader v2
 * Fetches content from Node.js backend and updates the DOM.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Try LocalStorage (User edits)
    const localData = localStorage.getItem('learnnepal_content');
    if (localData) {
        try {
            const data = JSON.parse(localData);
            applyContent(data);
            return;
        } catch (e) {
            console.warn('Corrupt local content, falling back to file.');
        }
    }

    // 2. Fallback to static JSON
    fetch('data/db.json')
        .then(res => res.json())
        .then(data => {
            if (!data) return;
            applyContent(data);
        })
        .catch(err => console.error('Error loading content:', err));
});

function applyContent(data) {
    const editableElements = document.querySelectorAll('[data-editable]');
    
    editableElements.forEach(el => {
        const keyPath = el.getAttribute('data-editable').split('.');
        // Path example: ['home', 'hero', 'title']
        
        let value = data.pages; // Start at pages root
        
        // Traverse
        for (const key of keyPath) {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                value = null;
                break;
            }
        }
        
        if (value) {
            if (el.tagName === 'IMG') {
                el.src = value;
            } else {
                el.textContent = value;
            }
        }
    });
    
    // Global Meta (Title, etc) - optional
}
