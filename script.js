document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Custom Liquid Cursor Logic
  // ==========================================================================
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  
  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;
  
  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot cursor immediately
    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }
  });

  // Smooth lagging follower cursor
  function animateFollower() {
    // Linear interpolation for smooth trailing lag
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    
    if (follower) {
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
    }
    
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states expansion
  const hoverElements = document.querySelectorAll('a, button, .filter-btn, .project-card, .form-input, .copy-btn, .timeline-item');
  hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      cursor?.classList.add('hovering');
      follower?.classList.add('hovering');
    });
    elem.addEventListener('mouseleave', () => {
      cursor?.classList.remove('hovering');
      follower?.classList.remove('hovering');
    });
  });

  // Hide custom cursor on touch/mobile screens
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice && cursor && follower) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
  }

  // ==========================================================================
  // 2. Interactive 3D Card Tilt & Specular Glare Effect
  // ==========================================================================
  const tiltCards = document.querySelectorAll('.tilt-target');
  const maxTiltDegrees = 12; // Maximum tilt angle

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      
      // Cursor coordinates relative to the card
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Normalized coordinates from -1 to 1
      const percentX = (x / rect.width) * 2 - 1;
      const percentY = (y / rect.height) * 2 - 1;
      
      // Calculate corresponding 3D rotation angles
      const rotateX = (-percentY * maxTiltDegrees).toFixed(2);
      const rotateY = (percentX * maxTiltDegrees).toFixed(2);
      
      // Update custom CSS variables for specular glare
      card.style.setProperty('--x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--y', `${(y / rect.height) * 100}%`);
      
      // Apply 3D rotation transform immediately with depth scaling
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.08s ease-out'; // Fast tracking transition
    });
    
    // Smooth reset on cursor leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'; // Snappy bounce-back
    });
  });

  // ==========================================================================
  // 3. Hero Section Depth Parallax
  // ==========================================================================
  const heroSection = document.getElementById('hero');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  const maxParallaxShift = 15; // Maximum translation in pixels

  if (heroSection) {
    window.addEventListener('mousemove', (e) => {
      // Coordinates normalized relative to window center
      const percentX = (e.clientX / window.innerWidth) * 2 - 1;
      const percentY = (e.clientY / window.innerHeight) * 2 - 1;
      
      parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-speed')) || 1;
        
        // Calculate shift based on individual speed values
        const shiftX = (percentX * speed * maxParallaxShift).toFixed(1);
        const shiftY = (percentY * speed * maxParallaxShift).toFixed(1);
        
        // Apply 3D translate translation layer
        layer.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
        layer.style.transition = 'transform 0.15s ease-out';
      });
    });
  }

  // ==========================================================================
  // 4. Scroll Reveal Animations & Skills Progress Trigger
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // If this is the skills section, animate progress bars
        if (entry.target.classList.contains('about-grid') || entry.target.id === 'about') {
          animateSkillBars();
        }
        
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });

  function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    bars.forEach(bar => {
      const percentage = bar.getAttribute('data-percent');
      bar.style.width = percentage + '%';
    });
  }

  // ==========================================================================
  // 5. Dynamic Project Filtering System
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================================================
  // 6. GitHub Setup Clipboard Copy Helper
  // ==========================================================================
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeElement = btn.closest('.terminal-step').querySelector('.step-code');
      const textToCopy = codeElement.textContent.trim();
      
      // Use navigator.clipboard to copy text
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Successful copy visual feedback
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '✓';
        btn.style.background = '#27c93f';
        btn.style.color = '#fff';
        btn.style.borderColor = '#27c93f';
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });

  // ==========================================================================
  // 7. Contact Form Submission Logic (Interactive Demo)
  // ==========================================================================
  const contactForm = document.getElementById('portfolioContactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const message = document.getElementById('formMessage').value.trim();
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      
      if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
      }
      
      // Transition button to loading state
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Sending Message...';
      submitBtn.style.opacity = '0.7';
      submitBtn.style.pointerEvents = 'none';
      
      // Simulate API request completion
      setTimeout(() => {
        // Show success banner
        formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully. I'll get back to you shortly.`;
        formFeedback.className = 'form-feedback success';
        
        // Reset form inputs
        contactForm.reset();
        
        // Reset submit button
        submitBtn.textContent = originalBtnText;
        submitBtn.style.opacity = '';
        submitBtn.style.pointerEvents = '';
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          formFeedback.className = 'form-feedback';
          formFeedback.style.display = 'none';
        }, 5000);
        
      }, 1200);
    });
  }
});
