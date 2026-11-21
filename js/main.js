/**
 * Application Main Controller
 * Handles theme toggling, interactive components, modal case studies,
 * lead generation form, copy clipboard, and smooth UI feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initDevWorkspaceTabs();
  initTechFilters();
  initProjectFilters();
  initCaseStudyModal();
  initServicePrefills();
  initCopyEmail();
  initContactForm();
  initScrollspy();
  initScrollToTop();
});

/* ==========================================================================
   THEME TOGGLER (DARK AS DEFAULT)
   ========================================================================== */

function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('portfolio_theme');
  
  // Default is dark theme
  const currentTheme = storedTheme || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme} theme`);
    });
  }
}

/* ==========================================================================
   NAVIGATION & MOBILE MENU
   ========================================================================== */

function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   HERO DEV WORKSPACE INTERACTIVE TABS
   ========================================================================== */

function initDevWorkspaceTabs() {
  const tabs = document.querySelectorAll('.workspace-tab');
  const panes = document.querySelectorAll('.code-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePane = document.getElementById(targetPaneId);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   TECHNOLOGY STACK FILTERING
   ========================================================================== */

function initTechFilters() {
  const filterTabs = document.querySelectorAll('.tech-filter-tab');
  const techCards = document.querySelectorAll('.tech-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      techCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   PROJECT FILTERING
   ========================================================================== */

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-case-study');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   CASE STUDY TECHNICAL DEEP DIVE MODAL
   ========================================================================== */

function initCaseStudyModal() {
  const modalBackdrop = document.getElementById('case-study-modal');
  const modalContentContainer = document.getElementById('modal-dynamic-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const deepDiveBtns = document.querySelectorAll('.btn-deep-dive');

  if (!modalBackdrop || !modalContentContainer) return;

  deepDiveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const project = PORTFOLIO_DATA.projects[projectId];

      if (!project) return;

      renderProjectModalContent(project, modalContentContainer);
      openModal(modalBackdrop);
    });
  });

  // Close triggers
  modalCloseBtn?.addEventListener('click', () => closeModal(modalBackdrop));

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal(modalBackdrop);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal(modalBackdrop);
    }
  });
}

function openModal(modal) {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const closeBtn = modal.querySelector('.modal-close-btn');
  closeBtn?.focus();
}

function closeModal(modal) {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function renderProjectModalContent(project, container) {
  const dbRows = project.architecture.databaseSummary.map(item => `
    <tr>
      <td><code>${escapeHtml(item.table)}</code></td>
      <td>${escapeHtml(item.purpose)}</td>
    </tr>
  `).join('');

  const endpointList = project.architecture.keyEndpoints.map(ep => `
    <div>• ${escapeHtml(ep)}</div>
  `).join('');

  container.innerHTML = `
    <div class="modal-project-badge">${escapeHtml(project.categoryLabel)}</div>
    <h3 style="font-size: 1.65rem; margin-top: 0.5rem; margin-bottom: 1rem;">${escapeHtml(project.title)} — Architecture Deep Dive</h3>
    
    <div class="project-problem-box" style="margin-bottom: 1.5rem;">
      <div class="project-problem-label">Architectural Pattern</div>
      <div class="project-problem-text">${escapeHtml(project.architecture.pattern)}</div>
    </div>

    <div class="modal-section-title">Database Schema & Entity Relations</div>
    <table class="modal-schema-table">
      <thead>
        <tr>
          <th style="width: 35%;">Entity / Table</th>
          <th>Role & Responsibility</th>
        </tr>
      </thead>
      <tbody>
        ${dbRows}
      </tbody>
    </table>

    <div class="modal-section-title">Security & Authorization Architecture</div>
    <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
      ${escapeHtml(project.architecture.security)}
    </p>

    <div class="modal-section-title">Key REST & Transactional Handlers</div>
    <div class="modal-code-block">
      ${endpointList}
    </div>

    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
      <a href="#contact" class="btn btn-primary" onclick="handleModalContactClick('${escapeHtml(project.title)}')">
        Discuss Similar Project
      </a>
      <button class="btn btn-secondary" onclick="document.getElementById('case-study-modal').classList.remove('open'); document.body.style.overflow='';">
        Close Inspector
      </button>
    </div>
  `;
}

window.handleModalContactClick = function(projectTitle) {
  const modalBackdrop = document.getElementById('case-study-modal');
  if (modalBackdrop) closeModal(modalBackdrop);

  const descField = document.getElementById('project-description');
  if (descField) {
    descField.value = `Hi, I am interested in building a solution similar to your "${projectTitle}" project. Here are our high-level requirements:\n- \n- `;
    descField.focus();
  }
};

/* ==========================================================================
   SERVICE CARD "DISCUSS YOUR PROJECT" PRE-FILL
   ========================================================================== */

function initServicePrefills() {
  const serviceCtas = document.querySelectorAll('.service-cta-link');
  const projectTypeSelect = document.getElementById('project-type');

  serviceCtas.forEach(cta => {
    cta.addEventListener('click', (e) => {
      const serviceType = cta.getAttribute('data-service-type');
      if (serviceType && projectTypeSelect) {
        projectTypeSelect.value = serviceType;
      }
      
      const descField = document.getElementById('project-description');
      if (descField && !descField.value) {
        descField.placeholder = `Tell me about your ${serviceType} requirements, timeline, and key goals...`;
      }
    });
  });
}

/* ==========================================================================
   COPY EMAIL TO CLIPBOARD WITH FEEDBACK
   ========================================================================== */

function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.btn-copy-email');
  const emailToCopy = "contact.developer.pro@gmail.com"; // Professional contact address

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for older contexts
          const textArea = document.createElement("textarea");
          textArea.value = emailToCopy;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;color:#10b981;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg> Copied!
        `;
        showToast("Email address copied to clipboard!");

        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 3000);
      } catch (err) {
        showToast("Press Ctrl+C to copy: " + emailToCopy);
      }
    });
  });
}

/* ==========================================================================
   CONTACT FORM VALIDATION & LEAD GENERATION
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('lead-contact-form');
  if (!form) return;

  const nameInput = document.getElementById('client-name');
  const emailInput = document.getElementById('client-email');
  const projectTypeSelect = document.getElementById('project-type');
  const budgetSelect = document.getElementById('budget-range');
  const descriptionInput = document.getElementById('project-description');
  const submitBtn = document.getElementById('contact-submit-btn');
  const feedbackBanner = document.getElementById('form-feedback-banner');
  const charCounter = document.getElementById('char-count');

  // Character counter
  if (descriptionInput && charCounter) {
    descriptionInput.addEventListener('input', () => {
      charCounter.textContent = `${descriptionInput.value.length} characters`;
    });
  }

  // Real-time validation
  function validateField(input, errorElementId, validatorFn, errorMsg) {
    const errorEl = document.getElementById(errorElementId);
    const isValid = validatorFn(input.value.trim());

    if (!isValid) {
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.classList.add('visible');
      }
      input.style.borderColor = 'var(--accent-crimson)';
      return false;
    } else {
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
      input.style.borderColor = 'var(--border-medium)';
      return true;
    }
  }

  const isNotEmpty = val => val.length > 0;
  const isValidEmail = val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isSufficientDesc = val => val.length >= 15;

  nameInput?.addEventListener('blur', () => validateField(nameInput, 'name-error', isNotEmpty, 'Please enter your name.'));
  emailInput?.addEventListener('blur', () => validateField(emailInput, 'email-error', isValidEmail, 'Please enter a valid email address.'));
  descriptionInput?.addEventListener('blur', () => validateField(descriptionInput, 'desc-error', isSufficientDesc, 'Please provide at least 15 characters describing your project.'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, 'name-error', isNotEmpty, 'Please enter your name.');
    const isEmailValid = validateField(emailInput, 'email-error', isValidEmail, 'Please enter a valid email address.');
    const isDescValid = validateField(descriptionInput, 'desc-error', isSufficientDesc, 'Please provide at least 15 characters describing your project.');

    if (!isNameValid || !isEmailValid || !isDescValid) {
      showToast("Please fill out all required fields correctly.");
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      projectType: projectTypeSelect?.value || 'General Inquiry',
      budget: budgetSelect?.value || 'Not specified',
      description: descriptionInput.value.trim(),
      submittedAt: new Date().toISOString()
    };

    // Button loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner" style="display:inline-block;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></span>
        Processing Inquiry...
      `;
    }

    /*
     * BACKEND INTEGRATION NOTE:
     * In a live production environment, connect this to your Spring Boot REST backend:
     * fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
     * or third-party email providers such as Formspree, Resend, or EmailJS.
     */
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Inquiry Sent Successfully!</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        `;
      }

      if (feedbackBanner) {
        feedbackBanner.className = 'form-feedback-banner success';
        feedbackBanner.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;color:#10b981;flex-shrink:0;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div>
            <strong>Thank you, ${escapeHtml(payload.name)}!</strong> Your project inquiry has been received. I will review your requirements and respond within 24 hours.
          </div>
        `;
        feedbackBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Configure instant Mailto fallback button
      const mailtoFallbackBtn = document.getElementById('fallback-mailto-btn');
      if (mailtoFallbackBtn) {
        const mailtoSubject = encodeURIComponent(`Project Inquiry: ${payload.projectType} - from ${payload.name}`);
        const mailtoBody = encodeURIComponent(`Hello,\n\nMy name is ${payload.name}.\nEmail: ${payload.email}\nProject Type: ${payload.projectType}\nEstimated Budget: ${payload.budget}\n\nProject Overview:\n${payload.description}\n\nLooking forward to speaking with you!`);
        mailtoFallbackBtn.href = `mailto:contact.developer.pro@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      }

      // Configure instant WhatsApp fallback button
      const waFallbackBtn = document.getElementById('fallback-wa-btn');
      if (waFallbackBtn) {
        const waText = encodeURIComponent(`Hello, I'd like to discuss a project:\n*Name:* ${payload.name}\n*Type:* ${payload.projectType}\n*Budget:* ${payload.budget}\n*Details:* ${payload.description}`);
        waFallbackBtn.href = `https://wa.me/?text=${waText}`;
      }

      showToast("Project inquiry drafted and validated!");
      form.reset();
      if (charCounter) charCounter.textContent = '0 characters';
    }, 700);
  });
}

/* ==========================================================================
   SCROLLSPY ACTIVE SECTION TRACKER
   ========================================================================== */

function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   SCROLL TO TOP BUTTON
   ========================================================================== */

function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
