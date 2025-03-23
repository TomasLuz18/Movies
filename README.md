# 🎥 Movies Web Application

Este projeto é uma aplicação web composta por duas partes: **Client** e **Server**, desenvolvidas com tecnologias baseadas em Node.js. A aplicação permite a gestão de utilizadores e o envio de notificacões por email, sendo potencialmente voltada para um sistema de gestão de filmes ou conteúdos audiovisuais.

---

## 🪧 Estrutura do Projeto

```
Movies/
├── Client/        # Aplicação frontend (ex: React ou outro framework TS)
├── Server/        # Aplicação backend em Node.js
```

---

## 🛠️ Tecnologias Utilizadas

### Backend (`/Server`)
- Node.js
- Express
- Envio de emails com SMTP
- JSON para configurações de servidor (`serverInfo.json`)

### Frontend (`/Client`)
- TypeScript (com `tsconfig.json` presente)
- Estrutura de projeto web moderna

---

## 🚀 Como Executar o Projeto

### 1. Clonar o Repositório
```bash
git clone https://github.com/teu-usuario/movies.git
cd movies
```

### 2. Instalar dependências

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
> Dependendo do framework usado (ex: React, Angular, etc):
```bash
npm start
```

---

## 📁 Configurações

O ficheiro `server/serverInfo.json` contém definições importantes:
- Porta do servidor
- Configurações de SMTP para envio de emails
- Informacões de host

---

## 📢 Funcionalidades (Backend)

- Roteamento com Express
- Manipulação de utilizadores (`users.js`)
- Configurações e informações do servidor (`serverInfo.js`)
- Envio de emails via SMTP (`SMTP.js`)

---

## 📃 Scripts Disponíveis

Verifica os ficheiros `package.json` tanto no `Client/` quanto no `Server/` para encontrar scripts como:
- `npm start`
- `npm run build`
- `npm test`

---

## 📜 Licença

Este projeto é de uso educacional. Livre para modificação, distribuição e uso não comercial.

