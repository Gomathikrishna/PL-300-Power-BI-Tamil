// Custom JavaScript for Power BI Learning Course

(function() {
    'use strict';

    // Progress tracking functionality
    class ProgressTracker {
        constructor() {
            this.storageKey = 'powerbi-course-progress';
            this.progress = this.loadProgress();
            this.initializeProgressTracking();
        }

        loadProgress() {
            try {
                const saved = localStorage.getItem(this.storageKey);
                return saved ? JSON.parse(saved) : {};
            } catch (e) {
                console.warn('Could not load progress from localStorage:', e);
                return {};
            }
        }

        saveProgress() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
            } catch (e) {
                console.warn('Could not save progress to localStorage:', e);
            }
        }

        markComplete(lessonId) {
            this.progress[lessonId] = {
                completed: true,
                completedAt: new Date().toISOString()
            };
            this.saveProgress();
            this.updateProgressDisplay();
        }

        isComplete(lessonId) {
            return this.progress[lessonId] && this.progress[lessonId].completed;
        }

        initializeProgressTracking() {
            // Add progress checkboxes to lesson links
            document.addEventListener('DOMContentLoaded', () => {
                this.addProgressCheckboxes();
                this.updateProgressDisplay();
            });
        }

        addProgressCheckboxes() {
            const lessonLinks = document.querySelectorAll('.sidebar a[href*="/lessons/"]');
            lessonLinks.forEach(link => {
                const lessonId = this.getLessonId(link.href);
                if (lessonId) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'progress-checkbox';
                    checkbox.checked = this.isComplete(lessonId);
                    checkbox.onchange = () => {
                        if (checkbox.checked) {
                            this.markComplete(lessonId);
                        } else {
                            delete this.progress[lessonId];
                            this.saveProgress();
                            this.updateProgressDisplay();
                        }
                    };
                    
                    const container = document.createElement('span');
                    container.className = 'progress-container';
                    container.appendChild(checkbox);
                    link.parentNode.insertBefore(container, link);
                }
            });
        }

        getLessonId(url) {
            const match = url.match(/lessons\/([^\/]+)/);
            return match ? match[1] : null;
        }

        updateProgressDisplay() {
            const completed = Object.keys(this.progress).length;
            const total = document.querySelectorAll('.sidebar a[href*="/lessons/"]').length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            // Update progress indicator
            const progressIndicator = document.getElementById('course-progress');
            if (progressIndicator) {
                progressIndicator.textContent = `Progress: ${completed}/${total} (${percentage}%)`;
            }
        }
    }

    // Theme toggler
    class ThemeToggler {
        constructor() {
            this.currentTheme = this.getStoredTheme() || 'light';
            this.initializeThemeToggler();
        }

        getStoredTheme() {
            try {
                return localStorage.getItem('powerbi-course-theme');
            } catch (e) {
                return null;
            }
        }

        setStoredTheme(theme) {
            try {
                localStorage.setItem('powerbi-course-theme', theme);
            } catch (e) {
                console.warn('Could not save theme preference:', e);
            }
        }

        initializeThemeToggler() {
            document.addEventListener('DOMContentLoaded', () => {
                this.applyTheme(this.currentTheme);
                this.createThemeToggler();
            });
        }

        createThemeToggler() {
            const toggler = document.createElement('button');
            toggler.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
            toggler.className = 'theme-toggler';
            toggler.title = 'Toggle theme';
            toggler.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--theme-color);
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                cursor: pointer;
                font-size: 20px;
                z-index: 1000;
                transition: all 0.3s ease;
            `;
            
            toggler.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            document.body.appendChild(toggler);
        }

        toggleTheme() {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(this.currentTheme);
            this.setStoredTheme(this.currentTheme);
            
            const toggler = document.querySelector('.theme-toggler');
            if (toggler) {
                toggler.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
            }
        }

        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }
    }

    // Scroll to top functionality
    class ScrollToTop {
        constructor() {
            this.createScrollButton();
            this.handleScroll();
        }

        createScrollButton() {
            const button = document.createElement('button');
            button.innerHTML = '↑';
            button.className = 'scroll-to-top';
            button.title = 'Scroll to top';
            button.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            document.body.appendChild(button);
        }

        handleScroll() {
            window.addEventListener('scroll', () => {
                const button = document.querySelector('.scroll-to-top');
                if (button) {
                    if (window.pageYOffset > 300) {
                        button.classList.add('visible');
                    } else {
                        button.classList.remove('visible');
                    }
                }
            });
        }
    }

    // Enhanced search functionality
    class EnhancedSearch {
        constructor() {
            this.initializeSearch();
        }

        initializeSearch() {
            document.addEventListener('DOMContentLoaded', () => {
                this.enhanceSearchBox();
            });
        }

        enhanceSearchBox() {
            const searchBox = document.querySelector('.search input[type="search"]');
            if (searchBox) {
                searchBox.placeholder = 'Search lessons, topics, or DAX functions...';
                searchBox.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            }
        }

        handleSearch(event) {
            const query = event.target.value.toLowerCase();
            if (query.length > 2) {
                this.highlightResults(query);
            } else {
                this.clearHighlights();
            }
        }

        highlightResults(query) {
            // Implementation for highlighting search results
            console.log('Searching for:', query);
        }

        clearHighlights() {
            // Implementation for clearing highlights
            console.log('Clearing highlights');
        }

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
        }
    }

    // Video player enhancements
    class VideoEnhancements {
        constructor() {
            this.enhanceVideoLinks();
        }

        enhanceVideoLinks() {
            document.addEventListener('DOMContentLoaded', () => {
                this.wrapVideosInContainers();
                this.addVideoTimestamps();
            });
        }

        wrapVideosInContainers() {
            const videoLinks = document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
            videoLinks.forEach(link => {
                // Add video icon
                const icon = document.createElement('span');
                icon.innerHTML = '📺 ';
                link.insertBefore(icon, link.firstChild);
                
                // Add click handler for embedding
                link.addEventListener('click', (e) => {
                    if (e.ctrlKey || e.metaKey) return; // Allow opening in new tab
                    e.preventDefault();
                    this.embedVideo(link);
                });
            });
        }

        embedVideo(link) {
            const videoId = this.getYouTubeVideoId(link.href);
            if (videoId) {
                const container = document.createElement('div');
                container.className = 'video-container';
                container.innerHTML = `
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allowfullscreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                    </iframe>
                `;
                
                // Insert after the link
                link.parentNode.insertBefore(container, link.nextSibling);
            }
        }

        getYouTubeVideoId(url) {
            const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
            return match ? match[1] : null;
        }

        addVideoTimestamps() {
            // Add functionality to extract and display video timestamps
            const timestampRegex = /(\d{1,2}):(\d{2})/g;
            const textNodes = this.getTextNodes(document.body);
            
            textNodes.forEach(node => {
                if (timestampRegex.test(node.textContent)) {
                    // Implementation for clickable timestamps
                }
            });
        }

        getTextNodes(element) {
            const textNodes = [];
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }
            return textNodes;
        }
    }

    // Resource download tracker
    class DownloadTracker {
        constructor() {
            this.trackDownloads();
        }

        trackDownloads() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (link && this.isDownloadLink(link)) {
                    this.recordDownload(link);
                }
            });
        }

        isDownloadLink(link) {
            const downloadExtensions = ['.pdf', '.xlsx', '.pptx', '.zip', '.pbix'];
            return downloadExtensions.some(ext => link.href.includes(ext));
        }

        recordDownload(link) {
            console.log('Download tracked:', link.href);
            // Here you could send analytics data
        }
    }

    // Course completion certificate
    class CertificateGenerator {
        constructor() {
            this.initializeCertificate();
        }

        initializeCertificate() {
            document.addEventListener('DOMContentLoaded', () => {
                this.checkCompletion();
            });
        }

        checkCompletion() {
            const progressTracker = new ProgressTracker();
            const totalLessons = document.querySelectorAll('.sidebar a[href*="/lessons/"]').length;
            const completedLessons = Object.keys(progressTracker.progress).length;
            
            if (completedLessons >= totalLessons && totalLessons > 0) {
                this.showCertificateOption();
            }
        }

        showCertificateOption() {
            const certificateButton = document.createElement('button');
            certificateButton.textContent = '🎓 Generate Certificate';
            certificateButton.className = 'btn btn-success';
            certificateButton.onclick = () => this.generateCertificate();
            
            // Add to main content area
            const content = document.querySelector('.content');
            if (content) {
                const notification = document.createElement('div');
                notification.className = 'alert alert-success';
                notification.innerHTML = `
                    <h4>🎉 Congratulations!</h4>
                    <p>You've completed the entire Power BI Learning Course!</p>
                `;
                notification.appendChild(certificateButton);
                content.insertBefore(notification, content.firstChild);
            }
        }

        generateCertificate() {
            const userName = prompt('Enter your name for the certificate:') || 'Course Participant';
            const completionDate = new Date().toLocaleDateString();
            
            const certificateHTML = `
                <div style="
                    width: 800px;
                    height: 600px;
                    border: 10px solid #0078d4;
                    padding: 50px;
                    text-align: center;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
                    position: relative;
                ">
                    <h1 style="color: #0078d4; font-size: 48px; margin-bottom: 20px;">Certificate of Completion</h1>
                    <div style="height: 2px; background: #0078d4; margin: 20px auto; width: 200px;"></div>
                    <p style="font-size: 24px; margin: 30px 0;">This is to certify that</p>
                    <h2 style="color: #323130; font-size: 36px; margin: 20px 0; text-decoration: underline;">${userName}</h2>
                    <p style="font-size: 24px; margin: 30px 0;">has successfully completed the</p>
                    <h3 style="color: #0078d4; font-size: 32px; margin: 20px 0;">Power BI Learning Course</h3>
                    <p style="font-size: 18px; margin: 30px 0;">Covering data analysis, modeling, visualization, and Power BI best practices</p>
                    <p style="font-size: 16px; margin-top: 50px;">Completed on: ${completionDate}</p>
                    <div style="position: absolute; bottom: 20px; right: 20px; font-size: 12px; color: #605e5c;">
                        PowerBI-Learning-Course.github.io
                    </div>
                </div>
            `;
            
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <html>
                    <head><title>Power BI Course Certificate</title></head>
                    <body style="margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0;">
                        ${certificateHTML}
                        <script>
                            window.onload = function() {
                                if (confirm('Would you like to print this certificate?')) {
                                    window.print();
                                }
                            }
                        </script>
                    </body>
                </html>
            `);
        }
    }

    // Keyboard shortcuts
    class KeyboardShortcuts {
        constructor() {
            this.initializeShortcuts();
        }

        initializeShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case '/':
                            e.preventDefault();
                            this.focusSearch();
                            break;
                        case 'k':
                            e.preventDefault();
                            this.focusSearch();
                            break;
                        case 'h':
                            e.preventDefault();
                            this.goHome();
                            break;
                    }
                }
                
                // Navigation shortcuts
                switch(e.key) {
                    case 'ArrowLeft':
                        if (e.altKey) {
                            e.preventDefault();
                            this.navigatePrevious();
                        }
                        break;
                    case 'ArrowRight':
                        if (e.altKey) {
                            e.preventDefault();
                            this.navigateNext();
                        }
                        break;
                }
            });
        }

        focusSearch() {
            const searchBox = document.querySelector('.search input');
            if (searchBox) {
                searchBox.focus();
                searchBox.select();
            }
        }

        goHome() {
            window.location.hash = '#/';
        }

        navigatePrevious() {
            const prevLink = document.querySelector('.pagination-item-prev a');
            if (prevLink) {
                prevLink.click();
            }
        }

        navigateNext() {
            const nextLink = document.querySelector('.pagination-item-next a');
            if (nextLink) {
                nextLink.click();
            }
        }
    }

    // Learning analytics
    class LearningAnalytics {
        constructor() {
            this.sessionStartTime = Date.now();
            this.pageViews = [];
            this.initializeAnalytics();
        }

        initializeAnalytics() {
            this.trackPageView();
            this.trackTimeSpent();
            this.trackScrollDepth();
            
            // Send analytics on page unload
            window.addEventListener('beforeunload', () => {
                this.sendAnalytics();
            });
        }

        trackPageView() {
            const currentPage = window.location.hash || '#/';
            this.pageViews.push({
                page: currentPage,
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            });
        }

        trackTimeSpent() {
            setInterval(() => {
                const timeSpent = Date.now() - this.sessionStartTime;
                // Store time spent data
                console.log('Time spent on course:', Math.round(timeSpent / 1000 / 60), 'minutes');
            }, 60000); // Track every minute
        }

        trackScrollDepth() {
            let maxScrollDepth = 0;
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = Math.round((scrollTop / docHeight) * 100);
                
                if (scrollPercent > maxScrollDepth) {
                    maxScrollDepth = scrollPercent;
                }
            });
        }

        sendAnalytics() {
            // In a real implementation, this would send data to an analytics service
            console.log('Session analytics:', {
                duration: Date.now() - this.sessionStartTime,
                pageViews: this.pageViews.length,
                pages: this.pageViews
            });
        }
    }

    // Accessibility improvements
    class AccessibilityEnhancements {
        constructor() {
            this.enhanceAccessibility();
        }

        enhanceAccessibility() {
            document.addEventListener('DOMContentLoaded', () => {
                this.addSkipLinks();
                this.improveKeyboardNavigation();
                this.addAriaLabels();
                this.enhanceContrast();
            });
        }

        addSkipLinks() {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                z-index: 1000;
                border-radius: 4px;
            `;
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
            });
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        improveKeyboardNavigation() {
            // Ensure all interactive elements are keyboard accessible
            const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
            interactiveElements.forEach(element => {
                if (!element.tabIndex && element.tabIndex !== 0) {
                    element.tabIndex = 0;
                }
            });
        }

        addAriaLabels() {
            // Add aria-labels to elements that need them
            const buttons = document.querySelectorAll('button:not([aria-label])');
            buttons.forEach(button => {
                if (!button.textContent.trim()) {
                    button.setAttribute('aria-label', 'Button');
                }
            });
        }

        enhanceContrast() {
            // Add high contrast mode toggle
            const contrastToggle = document.createElement('button');
            contrastToggle.textContent = 'High Contrast';
            contrastToggle.className = 'contrast-toggle';
            contrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
            contrastToggle.onclick = this.toggleHighContrast;
            
            // Add to accessibility toolbar if it exists
            const toolbar = document.querySelector('.accessibility-toolbar') || document.body;
            toolbar.appendChild(contrastToggle);
        }

        toggleHighContrast() {
            document.body.classList.toggle('high-contrast');
        }
    }

    // Initialize all modules when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize all features
        new ProgressTracker();
        new ThemeToggler();
        new ScrollToTop();
        new EnhancedSearch();
        new VideoEnhancements();
        new DownloadTracker();
        new CertificateGenerator();
        new KeyboardShortcuts();
        new LearningAnalytics();
        new AccessibilityEnhancements();
        
        // Add helpful keyboard shortcuts info
        const shortcutsInfo = document.createElement('div');
        shortcutsInfo.innerHTML = `
            <details style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                <summary style="cursor: pointer; font-weight: bold;">⌨️ Keyboard Shortcuts</summary>
                <ul style="margin-top: 10px;">
                    <li><kbd>Ctrl/Cmd + /</kbd> or <kbd>Ctrl/Cmd + K</kbd> - Focus search</li>
                    <li><kbd>Ctrl/Cmd + H</kbd> - Go to home page</li>
                    <li><kbd>Alt + ←</kbd> - Previous page</li>
                    <li><kbd>Alt + →</kbd> - Next page</li>
                </ul>
            </details>
        `;
        
        const content = document.querySelector('.content');
        if (content) {
            content.appendChild(shortcutsInfo);
        }
    });

})();
