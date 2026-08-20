/*
 * Pakistan_Citizen_Portal.js
 * Extracted JavaScript from Pakistan_Citizen_Portal.html
 * Includes: Zakat Calculator logic + SPA navigation/interaction handlers
 * (Excludes the Tailwind CDN <script src> and the tailwind.config block,
 *  which are styling configuration rather than application logic.)
 */

// Micro-interaction: Zakat Calculator Logic
    document.addEventListener('DOMContentLoaded', () => {
        const goldInput = document.getElementById('zakat-gold');
        const cashInput = document.getElementById('zakat-cash');
        const liabilitiesInput = document.getElementById('zakat-liabilities');
        const totalOutput = document.getElementById('zakat-total');
        const statusOutput = document.getElementById('zakat-status');
        
        const NISAB_THRESHOLD = 135382;

        function calculateZakat() {
            const gold = parseFloat(goldInput.value) || 0;
            const cash = parseFloat(cashInput.value) || 0;
            const liabilities = parseFloat(liabilitiesInput.value) || 0;
            
            const netWorth = (gold + cash) - liabilities;
            
            if (netWorth >= NISAB_THRESHOLD) {
                const zakat = netWorth * 0.025;
                totalOutput.textContent = 'Rs. ' + zakat.toLocaleString('en-PK', { maximumFractionDigits: 0 });
                statusOutput.textContent = '2.5% of net wealth';
                statusOutput.className = 'font-label-sm text-label-sm text-on-primary-container bg-primary-container px-sm py-base rounded-full inline-block self-start mt-xs';
            } else {
                totalOutput.textContent = 'Rs. 0';
                statusOutput.textContent = 'Below Nisab Threshold';
                statusOutput.className = 'font-label-sm text-label-sm opacity-80 mt-xs';
            }
        }

        [goldInput, cashInput, liabilitiesInput].forEach(input => {
            input.addEventListener('input', calculateZakat);
        });
    });

// Navigation Routing Function
    // navHighlightPath lets a sub-flow (like the CNIC application form)
    // render as its own page-view while keeping its parent nav item
    // ("Services") highlighted in the sidebar.
    function navigateTo(targetPath, navHighlightPath) {
      const highlightPath = navHighlightPath || targetPath;

      // Hide all page views
      const pages = document.querySelectorAll('.page-view');
      pages.forEach(page => page.classList.remove('active'));

      // Find target page
      const activePage = document.getElementById(targetPath);
      if (activePage) {
        activePage.classList.add('active');
      } else {
        document.getElementById('dashboard').classList.add('active');
      }

      // Update Active Navigation Item styling
      const navLinks = document.querySelectorAll('#app-nav .nav-link');
      navLinks.forEach(link => {
        if (link.getAttribute('data-path') === highlightPath) {
          link.className = "nav-link flex items-center px-sm py-md rounded-xl transition-all bg-primary-container text-on-primary-container font-semibold";
          link.setAttribute('aria-current', 'page');
        } else {
          link.className = "nav-link flex items-center px-sm py-md rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md";
          link.removeAttribute('aria-current');
        }
      });

      // Scroll smoothly back to top on page switch
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Opens the New CNIC Application sub-flow from the Services page
    // while keeping "Services" highlighted in the sidebar nav.
    function openNewCnicApplication() {
      navigateTo('cnic-application', 'services');
    }

    // Saves a draft of the New CNIC Application form (Step 1).
    // In this prototype the draft is simulated (no backend); values
    // simply remain in the form fields so the user can keep editing.
    function saveCnicDraft() {
      const msg = document.getElementById('cnic-form-msg');
      msg.textContent = 'Draft saved. You can safely leave and resume this application anytime.';
      msg.className = 'font-label-sm text-label-sm text-primary';
      msg.classList.remove('hidden');
    }

    // Validates Step 1 of the New CNIC Application and, if complete,
    // simulates submission by generating a reference number.
    function submitCnicStep1() {
      const fullName = document.getElementById('cnic-fullName').value.trim();
      const dob = document.getElementById('cnic-dob').value;
      const genderSelected = document.querySelector('.cnic-gender-input:checked');
      const address = document.getElementById('cnic-address').value.trim();
      const msg = document.getElementById('cnic-form-msg');

      if (!fullName || !dob || !genderSelected || !address) {
        msg.textContent = 'Please fill in Full Name, Date of Birth, Gender, and Present Address before proceeding.';
        msg.className = 'font-label-sm text-label-sm text-error';
        msg.classList.remove('hidden');
        return;
      }

      const referenceId = 'CNIC-' + Math.floor(100000 + Math.random() * 900000);
      msg.textContent = 'Step 1 complete. Application Reference: ' + referenceId + '. (Steps 2-4 — Family, Documents, Review — continue this same flow in a full build.)';
      msg.className = 'font-label-sm text-label-sm text-primary';
      msg.classList.remove('hidden');
      alert('Personal Information saved successfully!\n\nApplication Reference: ' + referenceId + '\n\nThis prototype currently implements Step 1 only.');
    }

    // Tab Switcher for Document Checklist (Passport / CNIC Page)
    document.addEventListener('DOMContentLoaded', () => {
      // Set initial view from hash or default to dashboard
      const currentHash = window.location.hash.replace('#', '') || 'dashboard';
      navigateTo(currentHash);

      // Listen for Hash Changes
      window.addEventListener('hashchange', () => {
        const path = window.location.hash.replace('#', '') || 'dashboard';
        navigateTo(path);
      });

      // Interactive Checkboxes logic
      document.querySelectorAll('.toggle-check').forEach(el => {
        el.addEventListener('click', function() {
          this.classList.toggle('bg-primary/10');
          this.classList.toggle('border-primary');
          this.classList.toggle('border-outline-variant');
          const check = this.querySelector('span');
          if (check) check.classList.toggle('hidden');
        });
      });

      // Wizard Tab Switching Logic
      const tabs = document.querySelectorAll('#wizard-tabs .wizard-tab-btn');
      tabs.forEach(tab => {
        tab.addEventListener('click', function() {
          const targetId = this.getAttribute('data-target');

          // Reset button styles
          tabs.forEach(t => {
            t.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm', 'shadow-primary/20');
            t.classList.add('bg-surface-container', 'text-on-surface-variant');
          });

          // Highlight selected button
          this.classList.add('bg-primary', 'text-on-primary', 'shadow-sm', 'shadow-primary/20');
          this.classList.remove('bg-surface-container', 'text-on-surface-variant');

          // Toggle visible content
          document.querySelectorAll('.wizard-content').forEach(content => {
            if (content.id === targetId) {
              content.classList.remove('hidden');
            } else {
              content.classList.add('hidden');
            }
          });
        });
      });
    });

    // Dashboard Search Handler
    function handleDashboardSearch() {
      const query = document.getElementById('dashboard-search-input').value.toLowerCase();
      if (!query.trim()) return;

      if (query.includes('passport') || query.includes('cnic') || query.includes('renew')) {
        navigateTo('services');
      } else if (query.includes('women') || query.includes('safety') || query.includes('police')) {
        navigateTo('women-safety');
      } else if (query.includes('job') || query.includes('skill') || query.includes('work')) {
        navigateTo('jobs-skills');
      } else if (query.includes('zakat') || query.includes('welfare') || query.includes('ehsaas')) {
        navigateTo('welfare-zakat');
      } else if (query.includes('tutor') || query.includes('mechanic') || query.includes('maid') || query.includes('provider') || query.includes('taxi') || query.includes('doctor') || query.includes('nurse') || query.includes('car wash')) {
        navigateTo('citizen-services');
      } else {
        alert("Searching for: " + query + "\nRedirecting to Public Services.");
        navigateTo('services');
      }
    }

    // Tracking Application Status
    function trackApplication() {
      const trackingId = document.getElementById('cnic-tracking-input').value;
      const resultMsg = document.getElementById('tracking-result-msg');
      if (trackingId.trim() === '') {
        alert('Please enter a valid Tracking ID.');
        return;
      }
      resultMsg.innerText = "Status for ID (" + trackingId + "): In Processing at NADRA Regional Office.";
      resultMsg.classList.remove('hidden');
    }

    // Emergency Call Handler
    function triggerEmergencyCall(number, serviceName) {
      const confirmCall = confirm("Are you sure you want to dial " + serviceName + " (" + number + ")?");
      if (confirmCall) {
        window.location.href = "tel:" + number;
      }
    }

    // Generic Action & Dialog Trigger
    function triggerAction(actionName) {
      alert("Launching " + actionName + " module...");
    }

    // Download PDF Action Simulator
    function downloadChecklist(type) {
      alert("Preparing PDF Checklist for " + type + ". Download will start automatically.");
    }

    // Directions Handler
    function getDirections(locationName) {
      alert("Opening Navigation directions to " + locationName + "...");
    }

    // Complaint Counter Increment
    function createNewComplaint() {
      const totalCount = document.getElementById('total-complaints-count');
      const inProgressCount = document.getElementById('in-progress-count');

      let currentTotal = parseInt(totalCount.innerText);
      let currentInProgress = parseInt(inProgressCount.innerText);

      totalCount.innerText = currentTotal + 1;
      inProgressCount.innerText = currentInProgress + 1;

      alert("Complaint Form Initiated. Complaint ID #" + Math.floor(100000 + Math.random() * 900000) + " generated.");
        }
