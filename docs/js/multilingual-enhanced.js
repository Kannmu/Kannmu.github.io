/**
 * Enhanced Multilingual System with IP Geolocation Detection
 * Features: Auto language detection, beautiful UI, multiple language support
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Supported languages with their configurations
        languages: {
            'zh': {
                name: '中文',
                nativeName: '简体中文',
                flag: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjREUyOTEwIi8+CjxwYXRoIGQ9Ik00IDMuNUw1IDJMNiAzLjVMNSA1TDQgMy41WiIgZmlsbD0iI0ZGREUwMCIvPgo8cGF0aCBkPSJNNy41IDJMOCAyLjVMNy41IDNMNyAyLjVMNy41IDJaIiBmaWxsPSIjRkZERTAwIi8+CjxwYXRoIGQ9Ik03LjUgNEw4IDQuNUw3LjUgNUw3IDQuNUw3LjUgNFoiIGZpbGw9IiNGRkRFMDAiLz4KPHBhdGggZD0iTTcuNSA2TDggNi41TDcuNSA3TDcgNi41TDcuNSA2WiIgZmlsbD0iI0ZGREUwMCIvPgo8cGF0aCBkPSJNNy41IDhMOCA4LjVMNy41IDlMNyA4LjVMNy41IDhaIiBmaWxsPSIjRkZERTAwIi8+Cjwvc3ZnPgo=',
                code: 'zh-CN'
            },
            'en': {
                name: 'English',
                nativeName: 'English',
                flag: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDEyMTY5Ii8+CjxwYXRoIGQ9Ik0wIDBoMjR2MS4yM0gwVjB6bTAgMi40NmgyNHYxLjIzSDBWMi40NnptMCAyLjQ2aDI0djEuMjNIMFY0Ljkyem0wIDIuNDZoMjR2MS4yM0gwVjcuMzh6bTAgMi40NmgyNHYxLjIzSDBWOS44NHptMCAyLjQ2aDI0VjE2SDBWMTIuM3oiIGZpbGw9IiNGRkZGRkYiLz4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjgiIGZpbGw9IiMwMTIxNjkiLz4KPHBhdGggZD0iTTAgMGgxdjFIMFYwem0yIDBoMXYxSDJWMHptMiAwaDFWMUg0VjB6bTIgMGgxdjFINlYwem0yIDBoMXYxSDhWMHoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTEgMWgxdjFIMVYxem0yIDBoMXYxSDNWMXptMiAwaDFWMUg1VjF6bTIgMGgxdjFIN1YxeiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K',
                code: 'en-US'
            },
            'ja': {
                name: '日本語',
                nativeName: '日本語',
                flag: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNCIgZmlsbD0iI0JDMDAyRCIvPgo8L3N2Zz4K',
                code: 'ja-JP'
            },
            'fr': {
                name: 'Français',
                nativeName: 'Français',
                flag: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iMTYiIGZpbGw9IiMwMDIzOTUiLz4KPHJlY3QgeD0iOCIgd2lkdGg9IjgiIGhlaWdodD0iMTYiIGZpbGw9IiNGRkZGRkYiLz4KPHJlY3QgeD0iMTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRUQyOTM5Ii8+Cjwvc3ZnPgo=',
                code: 'fr-FR'
            },
            'es': {
                name: 'Español',
                nativeName: 'Español',
                flag: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNBQTAwMDAiLz4KPHJlY3QgeT0iNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIGZpbGw9IiNGRkJGMDAiLz4KPHJlY3QgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSI0IiBmaWxsPSIjQUEwMDAwIi8+Cjwvc3ZnPgo=',
                code: 'es-ES'
            },
            'ru': {
                name: 'Русский',
                nativeName: 'Русский',
                flag: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjUuMzMiIGZpbGw9IiNGRkZGRkYiLz4KPHJlY3QgeT0iNS4zMyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjUuMzMiIGZpbGw9IiMwMDM5QTYiLz4KPHJlY3QgeT0iMTAuNjciIHdpZHRoPSIyNCIgaGVpZ2h0PSI1LjMzIiBmaWxsPSIjRDUyQjFFIi8+Cjwvc3ZnPgo=',
                code: 'ru-RU'
            },
            'de': {
                name: 'Deutsch',
                nativeName: 'Deutsch',
                flag: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjUuMzMiIGZpbGw9IiMwMDAiLz4KPHJlY3QgeT0iNS4zMyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjUuMzMiIGZpbGw9IiNERDAwM0YiLz4KPHJlY3QgeT0iMTAuNjciIHdpZHRoPSIyNCIgaGVpZ2h0PSI1LjMzIiBmaWxsPSIjRkZDRTAwIi8+Cjwvc3ZnPgo=',
                code: 'de-DE'
            }
        },
        
        // IP Geolocation APIs with fallback strategy
        geoApis: [
            {
                url: 'https://ipapi.co/json/',
                parser: (data) => data.country_code
            },
            {
                url: 'https://ipinfo.io/json',
                parser: (data) => data.country
            },
            {
                url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
                parser: (data) => data.country_code2
            }
        ],
        
        // Country to language mapping
        countryToLang: {
            'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'MO': 'zh', 'SG': 'zh',
            'US': 'en', 'GB': 'en', 'AU': 'en', 'CA': 'en', 'NZ': 'en', 'IE': 'en', 'ZA': 'en',
            'JP': 'ja',
            'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'LU': 'fr', 'MC': 'fr',
            'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es', 'VE': 'es', 'CL': 'es',
            'RU': 'ru', 'BY': 'ru', 'KZ': 'ru', 'KG': 'ru',
            'DE': 'de', 'AT': 'de'
        },
        
        // Storage keys
        storageKeys: {
            language: 'preferred_language',
            autoDetected: 'auto_detected_language'
        }
    };

    // Utility functions
    const Utils = {
        // Get stored language preference
        getStoredLanguage() {
            return localStorage.getItem(CONFIG.storageKeys.language);
        },
        
        // Store language preference
        setStoredLanguage(lang) {
            localStorage.setItem(CONFIG.storageKeys.language, lang);
        },
        
        // Get browser language
        getBrowserLanguage() {
            const lang = navigator.language || navigator.userLanguage;
            const langCode = lang.split('-')[0];
            return CONFIG.languages[langCode] ? langCode : 'en';
        },
        
        // Debounce function
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Create element with attributes
        createElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else {
                    element.appendChild(child);
                }
            });
            return element;
        }
    };

    // IP Geolocation Detection
    class GeoDetector {
        static async detectCountry() {
            for (const api of CONFIG.geoApis) {
                try {
                    const response = await fetch(api.url, {
                        method: 'GET',
                        timeout: 5000
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        const country = api.parser(data);
                        if (country) {
                            console.log(`Detected country: ${country} via ${api.url}`);
                            return country.toUpperCase();
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to detect location via ${api.url}:`, error);
                }
            }
            return null;
        }
        
        static async detectLanguage() {
            const country = await this.detectCountry();
            if (country && CONFIG.countryToLang[country]) {
                const detectedLang = CONFIG.countryToLang[country];
                localStorage.setItem(CONFIG.storageKeys.autoDetected, detectedLang);
                return detectedLang;
            }
            return Utils.getBrowserLanguage();
        }
    }

    // Enhanced Language Selector UI
    class LanguageSelector {
        constructor() {
            this.currentLanguage = 'zh';
            this.isOpen = false;
            this.container = null;
            this.init();
        }
        
        async init() {
            await this.detectInitialLanguage();
            this.createSelector();
            this.bindEvents();
            this.updateDisplay();
        }
        
        async detectInitialLanguage() {
            // Priority: stored preference > IP detection > browser language
            const storedLang = this.getLanguagePreference();
            if (storedLang && CONFIG.languages[storedLang]) {
                this.currentLanguage = storedLang;
                return;
            }
            
            try {
                const detectedLang = await GeoDetector.detectLanguage();
                this.currentLanguage = detectedLang;
                this.saveLanguagePreference(detectedLang);
            } catch (error) {
                console.warn('Language detection failed, using browser language');
                this.currentLanguage = Utils.getBrowserLanguage();
                this.saveLanguagePreference(this.currentLanguage);
            }
        }
        
        createSelector() {
            // Create main container
            this.container = Utils.createElement('div', {
                className: 'multilingual-selector',
                id: 'multilingual-selector'
            });
            
            // Create trigger button
            const trigger = Utils.createElement('button', {
                className: 'lang-trigger',
                type: 'button',
                'aria-label': 'Select Language',
                'aria-expanded': 'false'
            });
            
            const currentLang = CONFIG.languages[this.currentLanguage];
            trigger.innerHTML = `
                <img src="${currentLang.flag}" alt="${currentLang.name}" class="lang-flag">
                <span class="lang-name">${currentLang.name}</span>
                <svg class="lang-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            // Create dropdown menu
            const dropdown = Utils.createElement('div', {
                className: 'lang-dropdown',
                role: 'menu'
            });
            
            // Create language options
            Object.entries(CONFIG.languages).forEach(([code, lang]) => {
                const option = Utils.createElement('button', {
                    className: `lang-option ${code === this.currentLanguage ? 'active' : ''}`,
                    type: 'button',
                    'data-lang': code,
                    role: 'menuitem'
                });
                
                option.innerHTML = `
                    <img src="${lang.flag}" alt="${lang.name}" class="lang-flag">
                    <span class="lang-name">${lang.name}</span>
                    <span class="lang-native">${lang.nativeName}</span>
                `;
                
                dropdown.appendChild(option);
            });
            
            this.container.appendChild(trigger);
            this.container.appendChild(dropdown);
            
            // Add to navigation
            this.addToNavigation();
        }
        
        addToNavigation() {
            const navRight = document.querySelector('.navbar-nav.navbar-right');
            if (navRight) {
                // Create language selector list item
                const langLi = Utils.createElement('li', {
                    className: 'nav-language-selector'
                });
                langLi.appendChild(this.container);
                
                // Insert before search icon
                const searchLi = navRight.querySelector('.search-icon');
                if (searchLi) {
                    navRight.insertBefore(langLi, searchLi);
                } else {
                    navRight.appendChild(langLi);
                }
            }
        }
        
        bindEvents() {
            const trigger = this.container.querySelector('.lang-trigger');
            const dropdown = this.container.querySelector('.lang-dropdown');
            const options = dropdown.querySelectorAll('.lang-option');
            
            // Toggle dropdown
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown();
            });
            
            // Add aria-label for accessibility
            trigger.setAttribute('aria-label', '选择语言');
            dropdown.setAttribute('aria-label', '语言选项');
            
            // Language selection
            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = option.dataset.lang;
                    this.changeLanguage(lang);
                });
                
                // Add accessibility attributes
                const langConfig = CONFIG.languages[option.dataset.lang];
                if (langConfig) {
                    option.setAttribute('aria-label', `切换到${langConfig.name}`);
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.container.contains(e.target)) {
                    this.closeDropdown();
                }
            });
            
            // Close all other dropdowns when opening this one
            trigger.addEventListener('click', () => {
                this.closeOtherDropdowns();
            });
            
            // Keyboard navigation
            this.container.addEventListener('keydown', (e) => {
                this.handleKeyboard(e);
            });
            
            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeDropdown();
                    trigger.focus();
                }
            });
        }
        
        toggleDropdown() {
            if (this.isOpen) {
                this.closeDropdown();
            } else {
                this.openDropdown();
            }
        }
        
        openDropdown() {
            this.isOpen = true;
            this.container.classList.add('open');
            this.container.querySelector('.lang-trigger').setAttribute('aria-expanded', 'true');
            
            // Focus active option or first option
            const activeOption = this.container.querySelector('.lang-option.active');
            const firstOption = this.container.querySelector('.lang-option');
            const targetOption = activeOption || firstOption;
            
            if (targetOption) {
                setTimeout(() => {
                    targetOption.focus();
                }, 100); // Wait for animation to complete
            }
        }
        
        closeDropdown() {
            this.isOpen = false;
            this.container.classList.remove('open');
            this.container.querySelector('.lang-trigger').setAttribute('aria-expanded', 'false');
        }
        
        handleKeyboard(e) {
            if (!this.isOpen) return;
            
            const options = Array.from(this.container.querySelectorAll('.lang-option'));
            const currentIndex = options.findIndex(option => option === document.activeElement);
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % options.length;
                    options[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
                    options[prevIndex].focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (document.activeElement.classList.contains('lang-option')) {
                        document.activeElement.click();
                    }
                    break;
            }
        }
        
        changeLanguage(newLang) {
            if (newLang === this.currentLanguage) {
                this.closeDropdown();
                return;
            }
            
            // Show loading state
            this.showLoadingState();
            
            try {
                this.currentLanguage = newLang;
                Utils.setStoredLanguage(newLang);
                
                // Save language preference with expiry
                this.saveLanguagePreference(newLang);
                
                // Update UI
                this.updateDisplay();
                this.closeDropdown();
                
                // Trigger language change event
                this.triggerLanguageChange(newLang);
                
                this.hideLoadingState();
            } catch (error) {
                console.error('Language switch failed:', error);
                this.hideLoadingState();
                this.showErrorMessage('语言切换失败，请重试');
            }
        }
        
        updateDisplay() {
            const trigger = this.container.querySelector('.lang-trigger');
            const currentLang = CONFIG.languages[this.currentLanguage];
            
            trigger.innerHTML = `
                <img src="${currentLang.flag}" alt="${currentLang.name}" class="lang-flag">
                <span class="lang-name">${currentLang.name}</span>
                <svg class="lang-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            // Update accessibility attributes
            trigger.setAttribute('aria-label', `当前语言: ${currentLang.name}`);
            
            // Update active state in dropdown
            const options = this.container.querySelectorAll('.lang-option');
            options.forEach(option => {
                const isActive = option.dataset.lang === this.currentLanguage;
                option.classList.toggle('active', isActive);
                option.setAttribute('aria-selected', isActive.toString());
            });
        }
        
        showLoadingState() {
            this.container.classList.add('loading');
            const trigger = this.container.querySelector('.lang-trigger');
            if (trigger) {
                trigger.setAttribute('aria-busy', 'true');
            }
        }
        
        hideLoadingState() {
            this.container.classList.remove('loading');
            const trigger = this.container.querySelector('.lang-trigger');
            if (trigger) {
                trigger.setAttribute('aria-busy', 'false');
            }
        }
        
        showErrorMessage(message) {
            // Create temporary error notification
            const errorDiv = document.createElement('div');
            errorDiv.className = 'multilingual-error-message';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                z-index: 10000;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            
            document.body.appendChild(errorDiv);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 3000);
        }
        
        saveLanguagePreference(langCode) {
            try {
                const STORAGE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
                const expiryTime = Date.now() + STORAGE_DURATION;
                localStorage.setItem('kannmu_preferred_language', langCode);
                localStorage.setItem('kannmu_language_expiry', expiryTime.toString());
                console.log('Language preference saved:', langCode);
            } catch (error) {
                console.warn('Failed to save language preference:', error);
            }
        }
        
        getLanguagePreference() {
            try {
                const expiryTime = localStorage.getItem('kannmu_language_expiry');
                if (expiryTime && Date.now() > parseInt(expiryTime)) {
                    // Preference expired, clear storage
                    localStorage.removeItem('kannmu_preferred_language');
                    localStorage.removeItem('kannmu_language_expiry');
                    return null;
                }
                return localStorage.getItem('kannmu_preferred_language');
            } catch (error) {
                console.warn('Failed to read language preference:', error);
                return null;
            }
        }
        
        triggerLanguageChange(newLang) {
            // Get translate.js language code
            const translateCode = this.getTranslateLanguageCode(newLang);
            
            // Integrate with translate.js translation system
            if (window.translate && typeof window.translate.changeLanguage === 'function') {
                // Use translate.js for translation
                window.translate.changeLanguage(translateCode);
            } else if (window.translate && typeof window.translate.execute === 'function') {
                // Alternative translate.js API
                window.translate.language.setLocal(translateCode);
                window.translate.execute();
            } else {
                // Fallback: update translate.js configuration if available
                if (window.translate && window.translate.language) {
                    window.translate.language.setLocal(translateCode);
                    if (window.translate.execute) {
                        window.translate.execute();
                    }
                }
            }
            
            // Compatibility with existing system
            if (typeof window.onLanChange === 'function') {
                const langIndex = newLang === 'zh' ? 0 : 1;
                window.onLanChange(langIndex);
            }
            
            // Custom event for other integrations
            const event = new CustomEvent('languageChanged', {
                detail: {
                    language: newLang,
                    translateCode: translateCode,
                    languageConfig: CONFIG.languages[newLang]
                }
            });
            document.dispatchEvent(event);
        }
        
        getTranslateLanguageCode(langCode) {
            // Map our language codes to translate.js language codes
            const languageMap = {
                'zh': 'chinese_simplified',
                'en': 'english',
                'ja': 'japanese',
                'fr': 'french',
                'es': 'spanish',
                'ru': 'russian',
                'de': 'german'
            };
            return languageMap[langCode] || 'english';
        }
    }

    // CSS Styles removed and moved to multilingual-enhanced.css
    
    // Initialize the system
    function init() {
        // Initialize language selector when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new LanguageSelector();
            });
        } else {
            new LanguageSelector();
        }
    }

    // Export for global access
    window.MultilingualSystem = {
        CONFIG,
        Utils,
        GeoDetector,
        LanguageSelector,
        init
    };

    // Auto-initialize
    init();

})();