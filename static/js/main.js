document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    // --- Header Mobile Menu Toggle Logic (for index.html) ---
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            
            nav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Change hamburger icon to X
            menuToggle.innerHTML = !isExpanded ? '&times;' : '&#9776;';
        });

        // Close menu when a link is clicked (useful for anchor links on the same page)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.innerHTML = '&#9776;';
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
    
    // --- Auth Tabs Logic (for login.html) ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        // Function to switch tabs
        const switchTab = (targetTabId) => {
            // Deactivate all buttons and hide all contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));

            // Activate target button
            const targetButton = document.querySelector(`.tab-button[data-tab="${targetTabId}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }

            // Show target content
            const targetContent = document.getElementById(targetTabId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        };

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                switchTab(button.dataset.tab);
            });
        });

        // Handle initial URL hash to select the correct tab (e.g., login.html#register)
        const initialHash = window.location.hash.substring(1);
        
        // Default to 'login' if no valid hash is provided
        const defaultTab = ['login', 'register'].includes(initialHash) ? initialHash : 'login';
        
        // Ensure the correct tab is displayed on load
        switchTab(defaultTab);
    }
    
    // --- Dashboard Navigation Logic (for dashboard.html) ---
    const navLinks = document.querySelectorAll('.dashboard-nav .nav-link');
    const contentSections = document.querySelectorAll('.dashboard-content .content-section');

    if (navLinks.length > 0 && contentSections.length > 0) {
        
        const switchDashboardContent = (targetId) => {
            // Deactivate all links and hide all sections
            navLinks.forEach(link => link.classList.remove('active'));
            contentSections.forEach(section => section.classList.add('hidden'));

            // Activate target link
            const targetLink = document.querySelector(`.dashboard-nav .nav-link[data-content="${targetId}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
            }

            // Show target content
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        };

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.dataset.content;
                window.location.hash = targetId; // Update hash for deep linking
                switchDashboardContent(targetId);
            });
        });
        
        // Handle initial URL hash for dashboard
        const initialHash = window.location.hash.substring(1);
        const validSections = Array.from(contentSections).map(s => s.id);
        
        // Default to 'overview'
        const defaultSection = validSections.includes(initialHash) ? initialHash : 'overview';
        
        // Ensure the correct section is displayed on load
        // Initial setup needs to remove 'active' from all but the default, but we set it up that way in HTML anyway.
        // Let's rely on the URL hash or the default.
        
        if (defaultSection !== 'overview') {
             // If we load with a hash like #projects, we must switch the view
            switchDashboardContent(defaultSection);
        }
        
    }

// --- Project Post Form Logic (for post_project.html) ---

const budgetRadios = document.querySelectorAll('input[name="budget_type"]');
const budgetValueInput = document.getElementById('budget-value');
const budgetRangeInputs = document.querySelector('.budget-range-inputs');
const budgetMinInput = document.getElementById('budget-min');
const budgetMaxInput = document.getElementById('budget-max');

if (budgetRadios.length > 0) {
    
    const toggleBudgetFields = (type) => {
        if (type === 'fixed') {
            budgetValueInput.classList.remove('hidden');
            budgetValueInput.setAttribute('required', 'required');
            budgetValueInput.placeholder = 'Сумма';
            
            budgetRangeInputs.classList.add('hidden');
            budgetMinInput.removeAttribute('required');
            budgetMaxInput.removeAttribute('required');
        } else if (type === 'range') {
            budgetValueInput.classList.add('hidden');
            budgetValueInput.removeAttribute('required');
            
            budgetRangeInputs.classList.remove('hidden');
            budgetMinInput.setAttribute('required', 'required');
            budgetMaxInput.setAttribute('required', 'required');
        }
    };

    budgetRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            toggleBudgetFields(e.target.value);
        });
    });

    // Initialize state
    toggleBudgetFields('fixed');
}


// Skill Tagging Logic (basic implementation)
const skillsInput = document.getElementById('project-skills');
const skillsContainer = document.getElementById('skills-container');

if (skillsInput && skillsContainer) {
    
    const addSkill = (skillText) => {
        skillText = skillText.trim();
        if (skillText === '') return;
        
        // Prevent duplicates (simple check)
        const existingTags = Array.from(skillsContainer.querySelectorAll('.skill-tag')).map(t => t.textContent.trim().replace(/\s*×\s*$/, '').toLowerCase());
        if (existingTags.includes(skillText.toLowerCase())) return;
        
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.innerHTML = `${skillText} <span class="tag-remove">&times;</span>`;
        
        tag.querySelector('.tag-remove').addEventListener('click', () => {
            tag.remove();
        });
        
        skillsContainer.appendChild(tag);
    };

    skillsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const skillText = skillsInput.value.replace(',', '').trim();
            if (skillText) {
                addSkill(skillText);
                skillsInput.value = ''; // Clear input
            }
        }
    });

    // Initial load/example tags (optional, but helpful for UX)
    ['React', 'UI/UX', 'Node.js'].forEach(addSkill);
}

});