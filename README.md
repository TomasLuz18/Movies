# 🎬 Movies Web Application

Este projeto é um **protótipo funcional de uma aplicação web para exploração de filmes**, que permite ao utilizador navegar por diferentes categorias, filtrar por género e ano, adicionar filmes aos favoritos e gerir a sua conta pessoal. Toda a aplicação comunica com uma **API backend desenvolvida em Node.js**, oferecendo uma experiência dinâmica e interativa.

---

## 🧱 Estrutura do Projeto

```
Movies/
├── Client/        # Aplicação frontend (ex: React ou outro framework TS)
├── Server/        # API backend em Node.js
```

---

## ⚙️ Funcionalidades

### 🎞️ Frontend (Client)
- Visualização de filmes por categoria
- Filtros por género e ano de lançamento
- Sistema de favoritos
- Autenticação e gestão de conta de utilizador
- Interface moderna e responsiva

### 🔗 Backend (Server)
- API REST em Express para fornecer dados ao frontend
- Endpoints protegidos para operações autenticadas
- Sistema de envio de emails (ex: confirmação de registo, notificações)
- Configuração centralizada via `serverInfo.json`

---

## 🛠️ Tecnologias Utilizadas

### Backend (`/Server`)
- Node.js
- Express
- SMTP para envio de emails
- JSON como formato de configuração e troca de dados

### Frontend (`/Client`)
- TypeScript
- Framework moderno 
- Gerenciador de pacotes: `npm`

---

## 🚀 Como Executar o Projeto

### 1. Clonar o Repositório
```bash
git clone https://github.com/teu-usuario/movies.git
cd movies
```

### 2. Instalar Dependências

#### Backend
```bash
cd Server
npm install
```

#### Frontend
```bash
cd ../Client
npm install
```

### 3. Executar o Servidor
```bash
cd ../Server
node build/main.js
```

### 4. Executar o Cliente
```bash
cd ../Client
npm start
```

---

## ⚙️ Configurações

O ficheiro `server/serverInfo.json` contém definições importantes:
- Porta do servidor
- SMTP (para envio de emails)
- Informações de host

---

## 📦 Scripts Disponíveis

Consulta os ficheiros `package.json` tanto em `Client/` como em `Server/` para comandos úteis como:
- `npm start`
- `npm run build`
- `npm test`

---

## 📜 Licença

Este projeto é de uso educacional. Livre para modificação, distribuição e utilização não comercial.


