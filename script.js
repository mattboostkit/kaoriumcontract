// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll handling
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    const navContainer = document.querySelector('.nav-container');
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (navLinksContainer.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const navHeight = navContainer ? navContainer.offsetHeight : 0;
                    const targetPosition = targetSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Active section highlighting
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Add shadow to nav on scroll
        if (window.scrollY > 10) {
            navContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navContainer.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    }
    
    // Scroll animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger animations for children elements
                const children = entry.target.querySelectorAll('.fade-in-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Apply fade-in animation to sections
    sections.forEach(section => {
        section.classList.add('fade-in');
        fadeInObserver.observe(section);
    });
    
    // Apply subtle fade-in animations to grid items
    const gridItems = document.querySelectorAll('.tech-item, .response-item, .payment-item, .timeline-item');
    gridItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        item.style.transitionDelay = `${Math.min(index * 0.03, 0.3)}s`;
    });
    
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    gridItems.forEach(item => {
        gridObserver.observe(item);
    });
    
    
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', updateActiveLink);
    updateActiveLink();
});

// Add fade-in styles dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in-child {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in-child.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);