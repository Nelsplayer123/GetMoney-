// GetMoney+ Data Management with localStorage

// Função para inicializar o array de usuários no localStorage
function initializeUserStorage() {
    if (!localStorage.getItem('getmoney_users')) {
        localStorage.setItem('getmoney_users', JSON.stringify([]));
    }
}

// Inicializa o storage quando o arquivo é carregado
initializeUserStorage();
