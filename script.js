document.addEventListener('DOMContentLoaded', function() {
    // --- Element Selectors ---
    const authScreen = document.getElementById('auth-screen');
    const onboardingScreen = document.getElementById('onboarding-screen');
    const appScreen = document.getElementById('app');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtnProfile = document.getElementById('logout-btn-profile');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    
    // Onboarding selectors
    const onboardingSteps = document.querySelectorAll('.onboarding-step');
    const onboardingNextBtn = document.querySelector('.onboarding-next-btn');
    const onboardingBackBtn = document.querySelector('.onboarding-back-btn');
    const onboardingSkipBtn = document.querySelector('.onboarding-skip-btn');
    const progressBar = document.getElementById('progress-bar');
    let currentStep = 0;

    // --- App Flow ---
    function showAuth() {
        onboardingScreen.classList.add('hidden');
        appScreen.classList.add('hidden');
        appScreen.classList.remove('md:flex');
        authScreen.classList.remove('hidden');
        window.location.hash = '';
    }

    function showOnboarding() {
        authScreen.classList.add('hidden');
        appScreen.classList.add('hidden');
        onboardingScreen.classList.remove('hidden');
        onboardingScreen.classList.add('flex');
        updateOnboardingStep();
    }

    function showApp() {
        onboardingScreen.classList.add('hidden');
        onboardingScreen.classList.remove('flex');
        authScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
        appScreen.classList.add('md:flex');
        showScreen(window.location.hash || '#home');
    }

    if (loginBtn) loginBtn.addEventListener('click', showOnboarding);
    if (signupBtn) signupBtn.addEventListener('click', showOnboarding);
    if (logoutBtnProfile) logoutBtnProfile.addEventListener('click', showAuth);
    if (onboardingSkipBtn) onboardingSkipBtn.addEventListener('click', showApp);

    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-view').classList.add('hidden');
            document.getElementById('signup-view').classList.remove('hidden');
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signup-view').classList.add('hidden');
            document.getElementById('login-view').classList.remove('hidden');
        });
    }

    // --- Onboarding Logic ---
    function updateOnboardingStep() {
        onboardingSteps.forEach((step, index) => {
            step.classList.toggle('hidden', index !== currentStep);
        });
        const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        onboardingBackBtn.classList.toggle('invisible', currentStep === 0);

        if (currentStep === onboardingSteps.length - 1) {
            onboardingNextBtn.textContent = 'Finish';
        } else {
            onboardingNextBtn.textContent = 'Next';
        }
    }

    if (onboardingNextBtn) {
        onboardingNextBtn.addEventListener('click', () => {
            if (currentStep < onboardingSteps.length - 1) {
                currentStep++;
                updateOnboardingStep();
            } else {
                showApp(); // Finish onboarding
            }
        });
    }

    if (onboardingBackBtn) {
        onboardingBackBtn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateOnboardingStep();
            }
        });
    }
    
    document.querySelectorAll('.goal-option').forEach(option => {
        option.addEventListener('click', function() {
            if (this.parentElement.parentElement.id === 'step-4') {
                 this.parentElement.querySelectorAll('.goal-option').forEach(opt => opt.classList.remove('selected'));
            }
            this.classList.toggle('selected');
        });
    });

    // --- Main App Navigation ---
    function showScreen(hash) {
        const targetId = hash ? hash.substring(1) : 'home';
        const mainContentArea = document.querySelector('main');

        if (mainContentArea.offsetHeight > 0) {
            mainContentArea.style.minHeight = `${mainContentArea.offsetHeight}px`;
        }

        document.querySelectorAll('#app .screen').forEach(s => s.classList.add('hidden'));
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
        } else {
            document.getElementById('home').classList.remove('hidden');
        }

        document.querySelectorAll('.nav-link').forEach(link => {
             const isActive = link.getAttribute('href') === `#${targetId}`;
             link.classList.toggle('bg-purple-50', isActive);
             link.classList.toggle('text-[var(--primary)]', isActive);
             link.classList.toggle('font-semibold', isActive);
        });

        mainContentArea.style.minHeight = '0px';
    }
    
    document.querySelectorAll('.nav-link, .nav-link-from-card').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = link.getAttribute('href');
        });
    });

    window.addEventListener('hashchange', () => showScreen(window.location.hash));
    
    // Appointment tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const tab = this.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.toggle('hidden', content.id !== tab);
            });
        });
    });

    // Consultation filters
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;
            document.querySelectorAll('.professional-card').forEach(card => {
                if (filter === 'all' || card.dataset.type === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Initial check
    if (window.location.hash && window.location.hash !== '#') {
        showApp();
    } else {
        showAuth();
    }
});
