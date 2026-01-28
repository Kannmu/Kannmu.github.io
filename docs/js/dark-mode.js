(function() {
    const toggle = document.getElementById('dark-mode-toggle');
    const root = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Apply theme on load
    if (currentTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    } else {
        root.setAttribute('data-theme', 'light');
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            const theme = root.getAttribute('data-theme');
            if (theme === 'dark') {
                root.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            root.setAttribute('data-theme', newTheme);
        }
    });
})();
