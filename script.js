document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeToggle = document.querySelector(".theme-toggle")
  const themeIcon = themeToggle.querySelector("i")

  themeToggle.addEventListener("click", () => {
    if (themeIcon.classList.contains("fa-moon")) {
      themeIcon.classList.remove("fa-moon")
      themeIcon.classList.add("fa-sun")
      document.body.classList.add("light-theme")
    } else {
      themeIcon.classList.remove("fa-sun")
      themeIcon.classList.add("fa-moon")
      document.body.classList.remove("light-theme")
    }
  })
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
      }, 700); // Faster navigation
    });
  });
  // Handle back button / page load to prevent transition showing
  window.addEventListener('pageshow', function(event) {
    // Check if the page is loaded from cache (back button) or if we have the skip flag
    if (event.persisted || 
        (performance.getEntriesByType && performance.getEntriesByType("navigation")[0].type === "back_forward") ||
        sessionStorage.getItem('skipTransition') === 'true') {
      
      // Make sure transition is hidden
      pageTransition.classList.remove('active');
      transitionIcon.classList.remove('active');
      
      // Clear the flag
      sessionStorage.removeItem('skipTransition');
    }
  });
  
  // On page load, check if we're coming back from a project page
  window.addEventListener('DOMContentLoaded', function() {
    // Hide the transition immediately when page loads
    if (sessionStorage.getItem('skipTransition') === 'true' || 
        (document.referrer && document.referrer.includes('/image_recog/') || 
         document.referrer.includes('/chatbot/') ||
         document.referrer.includes('/sentiment_analysis/') ||
         document.referrer.includes('/expert_system/'))) {
      
      pageTransition.style.display = 'none';
      
      // Remove the flag
      sessionStorage.removeItem('skipTransition');
      
      // Give a small delay and restore the display property
      setTimeout(() => {
        pageTransition.style.display = '';
      }, 50);
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for header
          behavior: "smooth",
        })
      }
    })
  })

  // Header scroll effect
  const header = document.querySelector("header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.backgroundColor = "rgba(10, 14, 23, 0.95)"
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)"
    } else {
      header.style.backgroundColor = "rgba(10, 14, 23, 0.8)"
      header.style.boxShadow = "none"
    }
  })

  // Add animation classes to elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".project-card, .about-content, .footer-content")

    elements.forEach((element, index) => {
      const elementPosition = element.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.2

      if (elementPosition < screenPosition) {
        setTimeout(() => {
          element.classList.add("fade-in")
        }, index * 100) // Stagger the animations
      }
    })
  }

  // Call once on load and then on scroll
  window.addEventListener("load", animateOnScroll)
  window.addEventListener("scroll", animateOnScroll)
})
