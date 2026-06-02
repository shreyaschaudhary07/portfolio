document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Custom Cursor Logic
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
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    if (follower) {
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
    }
    
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states expansion
  const hoverElements = document.querySelectorAll('a, button, .filter-btn, .project-card, .form-input, .copy-btn');
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
  // 2. Scroll Reveal Animations & Skills Progress Trigger
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
  // 3. Dynamic Project Filtering System
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
  // 4. GitHub Setup Clipboard Copy Helper
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
  // 5. Contact Form Submission Logic (Interactive Demo)
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
