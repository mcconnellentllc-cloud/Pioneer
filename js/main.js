/**
 * Pioneer - McConnell Enterprises
 * Refined Interactions
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavbar();
        initSmoothScroll();
        initMobileMenu();
        initScrollAnimations();
    }

    /**
     * Navbar scroll behavior
     */
    function initNavbar() {
        var navbar = document.querySelector('.navbar');
        if (!navbar) return;

        var scrollThreshold = 80;

        function updateNavbar() {
            if (window.scrollY > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', throttle(updateNavbar, 16));
        updateNavbar();
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        var links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                if (href === '#') return;

                var target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                var headerOffset = 100;
                var elementPosition = target.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                closeMobileMenu();
            });
        });
    }

    /**
     * Mobile menu toggle
     */
    function initMobileMenu() {
        var menuBtn = document.querySelector('.mobile-menu-btn');
        var navLinks = document.querySelector('.nav-links');

        if (!menuBtn || !navLinks) return;

        menuBtn.addEventListener('click', function() {
            var isOpen = navLinks.classList.contains('mobile-open');

            if (isOpen) {
                closeMobileMenu();
            } else {
                navLinks.classList.add('mobile-open');
                menuBtn.classList.add('active');
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'rgba(10, 22, 40, 0.98)';
                navLinks.style.padding = '24px';
                navLinks.style.gap = '24px';
            }
        });
    }

    function closeMobileMenu() {
        var menuBtn = document.querySelector('.mobile-menu-btn');
        var navLinks = document.querySelector('.nav-links');

        if (!navLinks) return;

        navLinks.classList.remove('mobile-open');
        if (menuBtn) menuBtn.classList.remove('active');

        if (window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        } else {
            navLinks.removeAttribute('style');
        }
    }

    /**
     * Scroll-triggered animations
     */
    function initScrollAnimations() {
        var animatedElements = document.querySelectorAll(
            'section, .expertise-item, .principle'
        );

        if (!('IntersectionObserver' in window)) {
            animatedElements.forEach(function(el) {
                el.classList.add('visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-up', 'visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        animatedElements.forEach(function(el) {
            el.classList.add('fade-up');
            observer.observe(el);
        });
    }

    /**
     * Throttle utility
     */
    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    /**
     * Handle window resize
     */
    window.addEventListener('resize', function() {
        var navLinks = document.querySelector('.nav-links');
        if (window.innerWidth > 768 && navLinks) {
            navLinks.removeAttribute('style');
            navLinks.classList.remove('mobile-open');
        }
    });

})();
