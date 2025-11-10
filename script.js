// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 5%';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.padding = '1rem 5%';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Tab switching for Jobs/Freelance
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show corresponding content
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(`${tabId}-content`).classList.add('active');
    });
});

// Animation on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .news-card, .product-card, .job-card, .rental-card').forEach(card => {
    observer.observe(card);
});

// Login button functionality
const loginBtn = document.querySelector('.login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        // In a real app, this would redirect to a login page or show a login modal
        alert('Login functionality will be implemented with the backend. Redirecting to admin panel...');
        window.location.href = '/admin';
    });
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add staggered animations to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animations to news cards
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animations to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Add to cart functionality
document.querySelectorAll('.small-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const productCard = this.closest('.product-card, .job-card, .rental-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Visual feedback
        const originalText = this.textContent;
        this.textContent = 'Added!';
        this.style.backgroundColor = '#2ed573';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = '';
        }, 2000);
        
        console.log(`Added ${productName} to cart`);
    });
});