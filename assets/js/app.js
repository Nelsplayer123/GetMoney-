// App initialization and global functions

document.addEventListener("DOMContentLoaded", async () => {
    // Initialize app
    initializeApp();
    
    // Check if user is logged in
    const loggedInUserPhone = sessionStorage.getItem('logged_in_user_phone');
    if (loggedInUserPhone) {
        const users = JSON.parse(localStorage.getItem('getmoney_users') || '[]');
        const currentUser = users.find(user => user.phone === loggedInUserPhone);
        
        if (currentUser) {
            updateUserUI(currentUser);
        } else {
            // User not found in database
            sessionStorage.removeItem('logged_in_user_phone');
            window.location.href = 'login.html';
        }
    } else {
        // Redirect to login if not logged in (except for login and signup pages)
        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        if (!['login.html', 'signup.html'].includes(currentPage)) {
            window.location.href = 'login.html';
        }
    }
});

function initializeApp() {
    console.log("App initialized");
    setupNavigation();
    setupInvestmentButtons();
    setupNotificationSystem();
    setupLogoutButton();
    setupTabs();
}

function setupNavigation() {
    // Add active class to current page in bottom navigation
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function setupInvestmentButtons() {
    // Add click handlers for investment buttons (if they exist on the page)
    const investButtons = document.querySelectorAll('.investment-card button');
    investButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const plan = button.getAttribute('data-plan');
            const value = parseFloat(button.getAttribute('data-value'));
            showNotification(`Investimento de R$${value.toFixed(2).replace('.', ',')} no plano ${plan} realizado com sucesso!`, 'success');
            
            const loggedInUserPhone = sessionStorage.getItem('logged_in_user_phone');
            if (loggedInUserPhone) {
                try {
                    const users = JSON.parse(localStorage.getItem('getmoney_users') || '[]');
                    const userIndex = users.findIndex(user => user.phone === loggedInUserPhone);
                    
                    if (userIndex !== -1) {
                        users[userIndex].investments = users[userIndex].investments || [];
                        users[userIndex].investments.push({ plan, value, date: new Date().toISOString() });
                        localStorage.setItem('getmoney_users', JSON.stringify(users));
                        updateUserUI(users[userIndex]);
                    }
                } catch (error) {
                    console.error("Error updating investments:", error);
                    showNotification("Erro ao atualizar investimento", 'error');
                }
            }
        });
    });
}

function setupLogoutButton() {
    // Procura por qualquer elemento que tenha a palavra "Sair" no texto
    const logoutButtons = document.querySelectorAll('a, button, [role="button"]');
    logoutButtons.forEach(button => {
        if (button.textContent.trim().toLowerCase().includes('sair')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('logged_in_user_phone');
                window.location.href = 'login.html';
            });
        }
    });
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            tabContents[index].classList.add('active');
        });
    });
}

function setupNotificationSystem() {
    // Setup notification container if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
}

function showNotification(message, type = 'info') {
    const container = document.querySelector('.notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} fade-in`;
    
    const icon = document.createElement('div');
    icon.className = 'notification-icon';
    icon.innerHTML = type === 'success' ? 
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="M22 4L12 14.01l-3-3"></path></svg>` :
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    
    const content = document.createElement('div');
    content.className = 'notification-content';
    content.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(content);
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function updateUserUI(user) {
    // Update user initial in avatar
    const userInitialElements = document.querySelectorAll('#user-initial, #user-avatar-initial');
    if (userInitialElements.length > 0 && user.name) {
        const initial = user.name.charAt(0).toUpperCase();
        userInitialElements.forEach(el => el.textContent = initial);
    }
    
    // Update user info in profile page if available
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
        userNameEl.textContent = user.name || 'Usuário';
    }
    const userPhoneEl = document.getElementById('user-phone');
    if (userPhoneEl) {
        userPhoneEl.textContent = user.phone || '+55 (XX) XXXXX-XXXX';
    }
    
    // Update user balance on home page
    const userBalanceEl = document.getElementById('user-balance');
    if (userBalanceEl) {
        userBalanceEl.textContent = `R$ ${(user.balance || 0).toFixed(2).replace('.', ',')}`;    
    }
    
    // Update investment list on home page
    const investmentListEl = document.getElementById('investment-list');
    if (investmentListEl) {
        if (user.investments && user.investments.length > 0) {
            investmentListEl.innerHTML = '';
            user.investments.forEach(investment => {
                const investmentItem = document.createElement('div');
                investmentItem.className = 'investment-item';
                investmentItem.innerHTML = `
                    <h4 style="margin: 0;">Plano: ${investment.plan}</h4>
                    <p style="color: var(--text-light); margin: var(--spacing-xs) 0 0;">Valor: R$ ${investment.value.toFixed(2).replace('.', ',')}</p>
                `;
                investmentListEl.appendChild(investmentItem);
            });
        } else {
            investmentListEl.innerHTML = '<p class="text-center" style="color: var(--text-light);">Você não possui investimentos ativos no momento.</p>';
        }
    }
}
