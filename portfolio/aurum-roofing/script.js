/* =====================================================
   AURUM ROOFING - JavaScript
   Minimal interactions and animations
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ----- Mobile Menu Toggle -----
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav__overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

  function openMobileMenu() {
    if (menuToggle) menuToggle.classList.add('active');
    if (mobileNav) mobileNav.classList.add('active');
    if (mobileNavOverlay) mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (menuToggle) menuToggle.classList.remove('active');
    if (mobileNav) mobileNav.classList.remove('active');
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      if (mobileNav && mobileNav.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(function(link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // ----- Sticky Header -----
  const header = document.querySelector('.header');

  function handleScroll() {
    if (!header) return;
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ----- Smooth Scroll for Anchor Links -----
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ----- Lightbox -----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__prev');
  const lightboxNext = document.querySelector('.lightbox__next');
  const projectCards = document.querySelectorAll('.project-card');

  let currentImageIndex = 0;
  const projectImages = [];

  // Collect all project images
  projectCards.forEach(function(card, index) {
    const img = card.querySelector('img');
    if (img) {
      projectImages.push({
        src: img.src,
        alt: img.alt
      });

      card.addEventListener('click', function() {
        currentImageIndex = index;
        openLightbox(img.src, img.alt);
      });
    }
  });

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Project image';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrevImage() {
    if (projectImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
    if (lightboxImg) {
      lightboxImg.src = projectImages[currentImageIndex].src;
      lightboxImg.alt = projectImages[currentImageIndex].alt;
    }
  }

  function showNextImage() {
    if (projectImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % projectImages.length;
    if (lightboxImg) {
      lightboxImg.src = projectImages[currentImageIndex].src;
      lightboxImg.alt = projectImages[currentImageIndex].alt;
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrevImage);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', showNextImage);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    }
  });

  // ----- Reviews Slider -----
  const reviewsTrack = document.querySelector('.reviews__track');
  const reviewDots = document.querySelectorAll('.reviews__dot');
  let currentReview = 0;

  function showReview(index) {
    if (!reviewsTrack) return;

    currentReview = index;
    reviewsTrack.style.transform = `translateX(-${index * 100}%)`;

    reviewDots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  reviewDots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      showReview(index);
    });
  });

  // Auto-advance reviews every 6 seconds
  if (reviewDots.length > 0) {
    setInterval(function() {
      const nextIndex = (currentReview + 1) % reviewDots.length;
      showReview(nextIndex);
    }, 6000);
  }

  // ----- Projects Filter -----
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Update active state
      filterButtons.forEach(function(b) {
        b.classList.remove('active');
      });
      this.classList.add('active');

      const filter = this.dataset.filter;

      projectCards.forEach(function(card) {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ----- Form Validation -----
  const quoteForm = document.getElementById('quote-form');

  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      const requiredFields = quoteForm.querySelectorAll('[required]');

      // Clear previous errors
      quoteForm.querySelectorAll('.form-group').forEach(function(group) {
        group.classList.remove('error');
      });

      // Validate required fields
      requiredFields.forEach(function(field) {
        const formGroup = field.closest('.form-group');

        if (!field.value.trim()) {
          isValid = false;
          if (formGroup) {
            formGroup.classList.add('error');
          }
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            if (formGroup) {
              formGroup.classList.add('error');
            }
          }
        }

        // Phone validation (UK format)
        if (field.type === 'tel' && field.value.trim()) {
          const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            if (formGroup) {
              formGroup.classList.add('error');
            }
          }
        }
      });

      // Check consent checkbox
      const consentCheckbox = quoteForm.querySelector('input[type="checkbox"]');
      if (consentCheckbox && !consentCheckbox.checked) {
        isValid = false;
        alert('Please agree to our Privacy Policy to submit the form.');
      }

      if (isValid) {
        // Submit to Formspree
        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';

        if (submitBtn) {
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
        }

        // Actually submit the form
        const formData = new FormData(quoteForm);

        fetch(quoteForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(function(response) {
          if (response.ok) {
            alert('Thank you for your enquiry! We will contact you within 24 hours.');
            quoteForm.reset();
          } else {
            alert('There was an error. Please try again or contact us directly.');
          }
        })
        .catch(function(error) {
          alert('There was an error. Please try again or contact us directly.');
        })
        .finally(function() {
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }
        });
      }
    });

    // Real-time validation feedback
    quoteForm.querySelectorAll('input, select, textarea').forEach(function(field) {
      field.addEventListener('blur', function() {
        const formGroup = this.closest('.form-group');
        if (formGroup && this.required && !this.value.trim()) {
          formGroup.classList.add('error');
        } else if (formGroup) {
          formGroup.classList.remove('error');
        }
      });

      field.addEventListener('input', function() {
        const formGroup = this.closest('.form-group');
        if (formGroup && this.value.trim()) {
          formGroup.classList.remove('error');
        }
      });
    });
  }

  // ----- Scroll Animations -----
  const animatedElements = document.querySelectorAll('[data-animate]');

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && animatedElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // If reduced motion or no elements, show everything
    animatedElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // ----- Parallax Effect on Hero (subtle) -----
  const heroBackground = document.querySelector('.hero__background');

  if (heroBackground && !prefersReducedMotion) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      heroBackground.style.transform = `translateY(${rate}px)`;
    }, { passive: true });
  }

  // ----- Phone Link Click Tracking (for analytics) -----
  document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
    link.addEventListener('click', function() {
      // Track phone clicks (integrate with Google Analytics)
      if (typeof gtag === 'function') {
        gtag('event', 'click', {
          'event_category': 'Contact',
          'event_label': 'Phone Call',
          'value': 1
        });
      }
    });
  });

  // ----- Email Link Click Tracking -----
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
    link.addEventListener('click', function() {
      if (typeof gtag === 'function') {
        gtag('event', 'click', {
          'event_category': 'Contact',
          'event_label': 'Email',
          'value': 1
        });
      }
    });
  });

  console.log('Aurum Roofing: All scripts loaded successfully.');
});
