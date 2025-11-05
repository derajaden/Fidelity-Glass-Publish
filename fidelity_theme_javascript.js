/**
 * Theme Toggle Functionality
 * 
 * Allows switching between dark, light, and system preference themes
 * with localStorage persistence for user preference.
 */

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme') || 'system';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply the saved theme
    applyTheme(savedTheme, systemPrefersDark);
    
    // Set the initial toggle position
    setTogglePosition(savedTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        // Get current theme
        const currentTheme = html.getAttribute('data-theme') || 'system';
        let newTheme;
        
        // Cycle through themes
        if (currentTheme === 'dark') {
            newTheme = 'light';
        } else if (currentTheme === 'light') {
            newTheme = 'system';
        } else {
            newTheme = 'dark';
        }
        
        // Apply new theme and save preference
        applyTheme(newTheme, systemPrefersDark);
        localStorage.setItem('theme', newTheme);
        setTogglePosition(newTheme);
    });
    
    // Watch for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (html.getAttribute('data-theme') === 'system') {
            applyTheme('system', e.matches);
        }
    });
    
    /**
     * Applies the specified theme to the document
     * @param {string} theme - 'dark', 'light', or 'system'
     * @param {boolean} systemPrefersDark - Does the system prefer dark mode?
     */
    function applyTheme(theme, systemPrefersDark) {
        html.setAttribute('data-theme', theme);
        
        if (theme === 'system') {
            html.className = systemPrefersDark ? 'dark-theme' : 'light-theme';
        } else {
            html.className = theme + '-theme';
        }
    }
    
    /**
     * Sets the visual position of the theme toggle
     * @param {string} theme - Current theme
     */
    function setTogglePosition(theme) {
        const icons = themeToggle.querySelectorAll('.theme-icon');
        
        // Reset all icons
        icons.forEach(icon => {
            icon.style.opacity = '0';
            icon.style.transform = 'scale(0.8)';
        });
        
        // Show the active icon
        let activeIcon;
        if (theme === 'dark') {
            activeIcon = themeToggle.querySelector('.moon');
        } else if (theme === 'light') {
            activeIcon = themeToggle.querySelector('.sun');
        } else {
            activeIcon = themeToggle.querySelector('.system');
        }
        
        if (activeIcon) {
            activeIcon.style.opacity = '1';
            activeIcon.style.transform = 'scale(1)';
        }
    }
});