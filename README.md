# GetMoney+ - Plataforma de Investimentos Inteligentes

Bem-vindo ao **GetMoney+**, uma plataforma de investimentos financeiros projetada para ajudar você a alcançar seus objetivos financeiros com inteligência e segurança.

## Visão Geral

GetMoney+ é uma aplicação web progressiva (PWA) que oferece uma experiência de usuário moderna, acessível e otimizada para dispositivos móveis. Nosso objetivo é fornecer uma interface intuitiva para investimentos, com ferramentas de recomendação, gerenciamento de equipe e perfil de usuário.

## Estrutura do Projeto

O projeto segue uma arquitetura modular para melhor organização e escalabilidade:

- **assets/**: Recursos estáticos como CSS, JavaScript e SVGs.
  - **css/**: Estilos globais e específicos (`variables.css`, `main.css`, `auth.css`, `components.css`).
  - **js/**: Módulos JavaScript (`auth.js`, `app.js`, `database.js`).
  - **svg/**: Ícones e logotipos no formato SVG.
- **/*.html**: Páginas principais da aplicação (`login.html`, `signup.html`, `home.html`, `invest.html`, `recommend.html`, `team.html`, `user.html`).
- **manifest.json**: Configuração do PWA para instalação e experiência nativa.
- **sw.js**: Service Worker para suporte offline e caching.

## Funcionalidades Principais

- **Autenticação Segura**: Login e cadastro com validação robusta e integração futura com Firebase Auth.
- **Dashboard Personalizado**: Visão geral de saldo, investimentos e ações rápidas.
- **Investimentos Inteligentes**: Catálogo de opções de investimento com informações detalhadas.
- **Sistema de Indicação**: Ganhe bônus ao convidar amigos com código único.
- **Navegação Intuitiva**: Menu inferior responsivo para acesso rápido às seções.
- **Suporte Offline**: Funcionalidade básica disponível mesmo sem conexão graças ao PWA.

## Paleta de Cores

A interface do GetMoney+ utiliza uma paleta de cores profissional e vibrante:

- **Primário**: `#FFC107` (Amarelo vibrante)
- **Secundário**: `#1A237E` (Azul profundo para contraste)
- **Texto**: `#212121` (Escuro) e `#757575` (Claro)
- **Fundo**: `#FFFFFF` (Branco) com suporte a modo escuro

## Como Usar

1. **Acesse a Plataforma**: Abra `login.html` em seu navegador ou instale como PWA.
2. **Credenciais de Teste**:
   - Usuário: `demo`
   - Senha: `password123`
3. **Explore as Funcionalidades**: Navegue pelo dashboard, opções de investimento e sistema de indicação.

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível.
- **CSS3**: Estilização moderna com variáveis, animações e design responsivo.
- **JavaScript**: Interatividade e lógica da aplicação.
- **Firebase (em breve)**: Autenticação e banco de dados em tempo real.
- **PWA**: Progressive Web App para experiência nativa e offline.

## Acessibilidade

Nosso design segue as diretrizes de acessibilidade WCAG:
- Suporte a leitores de tela com ARIA labels.
- Navegação por teclado implementada.
- Contraste de cores otimizado.

## Segurança

- Conexão segura simulada (CSP implementado).
- Integração futura com Firebase Authentication para login seguro.
- Validação de formulários no frontend e (em breve) no backend.

## Desenvolvimento

Para contribuir ou personalizar o projeto:

1. Clone este repositório (ou acesse os arquivos localmente).
2. Modifique os arquivos em `assets/` para alterar estilos ou lógica.
3. Teste localmente abrindo os arquivos HTML em um navegador.

## Próximos Passos

- Integração completa com Firebase para autenticação e dados.
- Implementação de API para dados reais de investimento.
- Melhorias no sistema de recomendação com base em IA.
- Expansão do sistema de equipe e bônus.

## Contato

Para suporte ou sugestões, entre em contato com nossa equipe através do menu de suporte na aplicação.

---

© 2023 GetMoney+ | Investindo no seu futuro
