// GetMoney+ Authentication Module

document.addEventListener('DOMContentLoaded', function() {
    // Elementos para manipulação de senha
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    // Função para alternar visibilidade da senha
    function togglePasswordVisibility(passwordInput, toggle) {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggle.innerHTML = type === 'password' 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }

    // Configurar toggles de senha
    passwordToggles.forEach(toggle => {
        const passwordInput = toggle.parentElement.querySelector('input');
        toggle.addEventListener('click', () => togglePasswordVisibility(passwordInput, toggle));
    });

    // Função para mostrar notificações
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Função para validar formulário de cadastro
    function validateSignupForm(name, phone, password, confirmPassword) {
        if (!name || !phone || !password || !confirmPassword) {
            throw new Error('Todos os campos são obrigatórios');
        }

        if (password !== confirmPassword) {
            throw new Error('As senhas não conferem');
        }

        if (phone.length < 10) {
            throw new Error('Número de telefone inválido');
        }

        if (password.length < 6) {
            throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
    }

    // Manipular formulário de cadastro
    const signupForm = document.querySelector('form[action="signup"]');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value.trim();
            const phone = document.getElementById('signup-phone').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;

            try {
                validateSignupForm(name, phone, password, confirmPassword);
                
                // Verificar se o telefone já está cadastrado
                const users = JSON.parse(localStorage.getItem('getmoney_users') || '[]');
                if (users.some(user => user.phone === phone)) {
                    throw new Error('Telefone já cadastrado');
                }

                // Criar novo usuário
                const newUser = {
                    name,
                    phone,
                    password,
                    balance: 0,
                    investments: [],
                    referrals: [],
                    team: []
                };

                users.push(newUser);
                localStorage.setItem('getmoney_users', JSON.stringify(users));
                sessionStorage.setItem('logged_in_user_phone', phone);

                showNotification('Cadastro realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }

    // Manipular formulário de login
    const loginForm = document.querySelector('form[action="login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const phone = document.getElementById('login-phone').value.trim();
            const password = document.getElementById('login-password').value;

            try {
                if (!phone || !password) {
                    throw new Error('Preencha todos os campos');
                }

                const users = JSON.parse(localStorage.getItem('getmoney_users') || '[]');
                const user = users.find(u => u.phone === phone && u.password === password);

                if (!user) {
                    throw new Error('Telefone ou senha inválidos');
                }

                sessionStorage.setItem('logged_in_user_phone', phone);
                showNotification('Login realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }

    // Verificar se o usuário já está logado
    const loggedInUserPhone = sessionStorage.getItem('logged_in_user_phone');
    if (loggedInUserPhone) {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'login.html' || currentPage === 'signup.html') {
            window.location.href = 'home.html';
        }
    }
});
