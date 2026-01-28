(function() {
    const toggle = document.getElementById('dark-mode-toggle');
    const root = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Update Giscus theme
    function updateGiscusTheme() {
        const theme = document.documentElement.getAttribute('data-theme');
        const iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe) return;
        
        const giscusTheme = theme === 'dark' ? 'dark' : 'light';
        iframe.contentWindow.postMessage({
            giscus: {
                setConfig: {
                    theme: giscusTheme
                }
            }
        }, 'https://giscus.app');
    }

    // Listen for messages from giscus to know when it's loaded
    window.addEventListener('message', (event) => {
        if (event.origin !== 'https://giscus.app') return;
        if (!(typeof event.data === 'object' && event.data.giscus)) return;
        
        // If giscus is loaded, update its theme
        updateGiscusTheme();
    });

    // Apply theme on load
    if (currentTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    } else {
        root.setAttribute('data-theme', 'light');
    }
    
    // Also try to update after a delay as a fallback
    setTimeout(updateGiscusTheme, 2000);
    setTimeout(updateGiscusTheme, 5000);

    if (toggle) {
        toggle.addEventListener('click', () => {
            const theme = root.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateGiscusTheme();
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            root.setAttribute('data-theme', newTheme);
            updateGiscusTheme();
        }
    });
})();
