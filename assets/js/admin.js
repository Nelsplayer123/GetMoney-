// GetMoney+ Admin Panel JavaScript

// Global variables
let allUsers = [];
let filteredUsers = [];

// Initialize admin panel when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    updateStats();
});

// Load all users from localStorage
function loadUsers() {
    try {
        allUsers = JSON.parse(localStorage.getItem('getmoney_users') || '[]');
        filteredUsers = [...allUsers];
        displayUsers();
        updateStats();
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        showNotification('Erro ao carregar usuários', 'error');
    }
}

// Display users in the table
function displayUsers() {
    const tableBody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('emptyState');
    const usersTable = document.getElementById('usersTable');

    if (filteredUsers.length === 0) {
        usersTable.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    usersTable.style.display = 'table';
    emptyState.style.display = 'none';

    tableBody.innerHTML = filteredUsers.map(user => {
        const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A';
        const isActive = user.lastLogin && isRecentLogin(user.lastLogin);
        
        return `
            <tr data-user-id="${user.id || user.phone}">
                <td>
                    <div style="font-weight: 500;">${user.name || 'N/A'}</div>
                </td>
                <td>
                    <div style="font-family: monospace;">${user.phone || 'N/A'}</div>
                </td>
                <td>${createdDate}</td>
                <td>
                    <span class="status-badge ${isActive ? 'status-active' : 'status-inactive'}">
                        ${isActive ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editUser('${user.id || user.phone}')">
                            Editar
                        </button>
                        <button class="btn-delete" onclick="deleteUser('${user.id || user.phone}')">
                            Excluir
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Update statistics cards
function updateStats() {
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(user => 
        user.lastLogin && isRecentLogin(user.lastLogin)
    ).length;
    
    const today = new Date().toDateString();
    const newUsersToday = allUsers.filter(user => 
        user.createdAt && new Date(user.createdAt).toDateString() === today
    ).length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('newUsersToday').textContent = newUsersToday;
}

// Check if last login was recent (within 30 days)
function isRecentLogin(lastLogin) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(lastLogin) > thirtyDaysAgo;
}

// Filter users based on search input
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredUsers = [...allUsers];
    } else {
        filteredUsers = allUsers.filter(user => 
            (user.name && user.name.toLowerCase().includes(searchTerm)) ||
            (user.phone && user.phone.includes(searchTerm))
        );
    }
    
    displayUsers();
}

// Edit user function
function editUser(userId) {
    const user = allUsers.find(u => (u.id || u.phone) === userId);
    if (!user) {
        showNotification('Usuário não encontrado', 'error');
        return;
    }

    // Populate modal with user data
    document.getElementById('editUserId').value = userId;
    document.getElementById('editName').value = user.name || '';
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editPassword').value = '';

    // Show modal
    document.getElementById('editModal').classList.add('active');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editUserForm').reset();
}

// Save user changes
function saveUserChanges() {
    const userId = document.getElementById('editUserId').value;
    const name = document.getElementById('editName').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const password = document.getElementById('editPassword').value.trim();

    if (!name || !phone) {
        showNotification('Nome e telefone são obrigatórios', 'error');
        return;
    }

    try {
        // Find and update user
        const userIndex = allUsers.findIndex(u => (u.id || u.phone) === userId);
        if (userIndex === -1) {
            showNotification('Usuário não encontrado', 'error');
            return;
        }

        // Update user data
        allUsers[userIndex].name = name;
        allUsers[userIndex].phone = phone;
        allUsers[userIndex].updatedAt = new Date().toISOString();
        
        // Update password if provided
        if (password) {
            allUsers[userIndex].password = password; // In a real app, this should be hashed
        }

        // Save to localStorage
        localStorage.setItem('getmoney_users', JSON.stringify(allUsers));
        
        // Refresh display
        loadUsers();
        closeEditModal();
        
        showNotification('Usuário atualizado com sucesso', 'success');
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        showNotification('Erro ao salvar alterações', 'error');
    }
}

// Delete user function
function deleteUser(userId) {
    const user = allUsers.find(u => (u.id || u.phone) === userId);
    if (!user) {
        showNotification('Usuário não encontrado', 'error');
        return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?\n\nEsta ação não pode ser desfeita.`)) {
        return;
    }

    try {
        // Remove user from array
        allUsers = allUsers.filter(u => (u.id || u.phone) !== userId);
        
        // Save to localStorage
        localStorage.setItem('getmoney_users', JSON.stringify(allUsers));
        
        // Refresh display
        loadUsers();
        
        showNotification('Usuário excluído com sucesso', 'success');
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        showNotification('Erro ao excluir usuário', 'error');
    }
}

// Export users to JSON file
function exportUsers() {
    try {
        const dataStr = JSON.stringify(allUsers, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `getmoney_users_${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Dados exportados com sucesso', 'success');
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
        showNotification('Erro ao exportar dados', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                min-width: 300px;
                max-width: 500px;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-success {
                background: #e8f5e8;
                border-left: 4px solid #2e7d32;
                color: #1b5e20;
            }
            
            .notification-error {
                background: #ffebee;
                border-left: 4px solid #d32f2f;
                color: #c62828;
            }
            
            .notification-info {
                background: var(--primary-light);
                border-left: 4px solid var(--primary);
                color: var(--primary-dark);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }
            
            .notification-message {
                flex: 1;
                font-weight: 500;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.7;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            
            .notification-close:hover {
                opacity: 1;
                background: rgba(0,0,0,0.1);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('editModal');
        if (modal.classList.contains('active')) {
            closeEditModal();
        }
    }
});

// Handle form submission
document.getElementById('editUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    saveUserChanges();
});

// Auto-refresh users every 30 seconds
setInterval(loadUsers, 30000);
