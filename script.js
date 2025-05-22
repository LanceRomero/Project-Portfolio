document.addEventListener("DOMContentLoaded", () => {
  // Project cards transition effect
  const pageTransition = document.querySelector('.page-transition');
  const transitionIcon = document.querySelector('.transition-icon');
  
  // Handle project links with transition animation
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const href = this.getAttribute('href');
      const projectCard = this.closest('.project-card');
      const projectIcon = projectCard.querySelector('.project-icon');
      
      // Get the icon src
      const iconSrc = projectIcon.getAttribute('src');
      
      // Set the transition icon
      transitionIcon.setAttribute('src', iconSrc);
      
      // Start the transition
      pageTransition.classList.add('active');
      
      // After a small delay, animate the icon
      setTimeout(() => {
        transitionIcon.classList.add('active');
      }, 50);
      
      // After transition completes, navigate to the page
      setTimeout(() => {
        sessionStorage.setItem('comingFromTransition', 'true');
        window.location.href = href;
      }, 700);
    });
  });

  // Handle back button / page load
  window.addEventListener('pageshow', function(event) {
    if (event.persisted || 
        (performance.getEntriesByType && performance.getEntriesByType("navigation")[0].type === "back_forward") ||
        sessionStorage.getItem('skipTransition') === 'true') {
      
      pageTransition.classList.remove('active');
      transitionIcon.classList.remove('active');
      sessionStorage.removeItem('skipTransition');
    }
  });
  
  // Check if coming back from project page
  window.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('skipTransition') === 'true' || 
        (document.referrer && document.referrer.includes('/image_recog/') || 
         document.referrer.includes('/chatbot/') ||
         document.referrer.includes('/sentiment_analysis/') ||
         document.referrer.includes('/expert_system/'))) {
      
      pageTransition.style.display = 'none';
      sessionStorage.removeItem('skipTransition');
      
      setTimeout(() => {
        pageTransition.style.display = '';
      }, 50);
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.backgroundColor = "rgba(10, 14, 23, 0.95)";
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.backgroundColor = "rgba(10, 14, 23, 0.8)";
      header.style.boxShadow = "none";
    }
  });

  // Mobile menu functionality
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const menuLinks = document.querySelectorAll('nav ul li a');

  function toggleMobileMenu() {
    nav.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
  }

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking on a link
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Add animation classes on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".project-card, .about-content, .footer-content");
    elements.forEach((element, index) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;

      if (elementPosition < screenPosition) {
        setTimeout(() => {
          element.classList.add("fade-in");
        }, index * 100);
      }
    });
  };

  window.addEventListener("load", animateOnScroll);
  window.addEventListener("scroll", animateOnScroll);
});
