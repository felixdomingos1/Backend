---

# Projeto de Gerenciamento de Mensagens

Este é um projeto de gerenciamento de usuários utilizando **Node.js**, **TypeScript** e **Prisma** como ORM. O projeto segue uma estrutura limpa, utilizando repositórios, casos de uso e controladores para organizar a lógica de negócio. 

## Estrutura do Projeto

A estrutura do projeto está organizada da seguinte forma:

```
src/
│
├── config/
│   ├── auth.ts        # Configuração de autenticação
│   └── multer.ts      # Configuração para upload de arquivos
│
├── Error/
│   └── ErrorApp.ts    # Classe para tratamento de erros personalizados
│
├── middlewares/
│   ├── authUser.ts    # Middleware de autenticação de usuário
│   └── errorHandler.ts # Middleware de tratamento de erros
│
├── prismaConf/
│   └── prismaConfig.ts # Configuração do Prisma ORM
│
├── models/
│   └── usuario/
│   │   ├── repository/
│   │    │   ├── implements/
│   │   │   │   └── UsuarioRepository.ts # Implementação do repositório de usuários
│   │    │   └── IUsuarioRepository.ts    # Interface do repositório de usuários
│   │    └── useCases/
│   │        ├── createUsuario/
│   │        │   ├── CreateUsuarioController.ts
│   │        │   ├── CreateUsuarioUseCase.ts
│   │        │   └── index.ts
│   │        ├── deleteUsuario/
│   │        │   ├── DeleteUsuarioController.ts
│   │        │   ├── DeleteUsuarioUseCase.ts
│   │        │   └── index.ts
│   │        ├── getUsuario/
│   │        │   ├── GetUsuarioController.ts
│   │        │   ├── GetUsuarioUseCase.ts
│   │        │   └── index.ts
│   │        └── updateUsuario/
│   │            ├── UpdateUsuarioController.ts
│   │            ├── UpdateUsuarioUseCase.ts
│   │            └── index.ts
│   │
│   └── createSession/
│       ├── CreateSessionController.ts
│       ├── CreateSessionUseCase.ts
│       └── index.ts
|        
├── routes/
│   ├── usuarioRoutes.ts # Rotas relacionadas ao usuário
│   └── index.ts         # Arquivo de definição de rotas principais
│
├── schemas/
│   ├── createSession.ts  # Validação do schema para criação de sessão
│   └── createUsuario.ts  # Validação do schema para criação de usuário
│
├── services/
│   ├── payload.ts        # Serviço de manipulação de payloads
│   └── yup.ts            # Serviço para validações com Yup
│
├── .env                  # Variáveis de ambiente
├── app.ts                # Configuração da aplicação
└── server.ts             # Inicialização do servidor
```

## Instalação e Configuração

### Pré-requisitos

- **Node.js** (v14 ou superior)
- **Prisma** (v4 ou superior)
- Banco de Dados **MySQL** (ou outro, configurado no arquivo `.env`)

### Passos para rodar o projeto:

1. **Clone o repositório**

```bash
git clone https://github.com/felixdomingos1/Backend.git
```

2. **Instale as dependências**

```bash
npm install
or
yarn install
```

3. **Configure o Banco de Dados**

Altere as informações de conexão no arquivo `.env`.
```bash
  DATABASE_URL="mysql://user:passworld@localhost:port/your_schema"
  JWT_SECRET="you_securet_key"
  PORT=3000                       
```

4. **Execute as migrações do Prisma**

```bash
npx prisma migrate dev
```

5. **Inicie o servidor**

```bash
npm run dev
or
yarn dev
```

## Endpoints

### Usuários

Os principais endpoints relacionados aos usuários estão disponíveis na rota `/api/usuario`:

- **POST** `/api/usuario/register`: Criação de um novo usuário
```json
{
  "name": "Felix Domingos",
  "email": "felix@gmail.com",
  "password": "12345612",
  "role": "ADMIN"
}
```
- **GET** `/api/usuario/null`: Listagem de usuários
```json
[
  {
    "id": 5,
    "name": "Natan Caboco",
    "email": "jsx@gmail.com",
    "password_hash": "$2b$08$6KdqflQ74SMMWBEp83WhreeZyorTeQ5/cbunNurnKH8Ejea0u19uu",
    "balance": 0,
    "role": "ADMIN",
    "createdAt": "2024-09-10T16:12:32.322Z",
    "contacts": [],
    "entities": [],
    "groups": [],
    "packages": [],
    "transfersReceived": [],
    "transfersSent": [],
    "_count": {
      "entities": 0,
      "packages": 0,
      "contacts": 0,
      "groups": 0,
      "transfersSent": 0,
      "transfersReceived": 0
    }
  }
]
```

- **GET** `/api/usuario/get/:id`: Obtenção de detalhes de um usuário por ID
    - **Exemplo**: `GET /api/usuario/get/8`
```json
{
  "id": 8,
  "name": "Felix Domingos",
  "email": "felix@gmail.com",
  "password_hash": "$2b$08$RpZ/F03QGUVJUyURVWhzdOYcmYuiDwrGAevXUVulxMCmtuPLNVYUS",
  "balance": 0,
  "role": "ADMIN",
  "createdAt": "2024-09-10T16:54:55.398Z",
  "contacts": [],
  "entities": [],
  "groups": [],
  "packages": [],
  "transfersReceived": [],
  "transfersSent": [],
  "_count": {
    "entities": 0,
    "packages": 0,
    "contacts": 0,
    "groups": 0,
    "transfersSent": 0,
    "transfersReceived": 0
  }
}
```

- **PUT** `/api/usuario/update/:id`: Atualização de um usuário
- **DELETE** `/api/usuario/delete/:id`: Exclusão de um usuário

### Contatos

Os endpoints relacionados aos contatos estão disponíveis na rota `/api/contato`:

- **POST** `/api/contato`: Criação de um novo contato
```json
{
  "name": "João Silva",
  "phone": "+244912345678",
  "comment": "Contato importante para o projeto"
}
```

- **GET** `/api/contato`: Listagem de todos os contatos
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "phone": "+244912345678",
    "comment": "Contato importante para o projeto"
  },
  {
    "id": 2,
    "name": "Maria Oliveira",
    "phone": "+244912349999",
    "comment": "Contato para urgências"
  }
]
```

- **GET** `/api/contato/:id`: Obtenção de detalhes de um contato por ID
- **PUT** `/api/contato/:id`: Atualização de um contato
- **DELETE** `/api/contato/:id`: Exclusão de um contato

### Grupos

Os endpoints relacionados aos grupos estão disponíveis na rota `/api/grupo`:

- **POST** `/api/grupo`: Criação de um novo grupo de contatos
```json
{
  "name": "Equipe de Desenvolvimento",
  "contacts": [1, 2]
}
```

- **GET** `/api/grupo`: Listagem de todos os grupos
- **GET** `/api/grupo/:id`: Obtenção de detalhes de um grupo por ID
- **PUT** `/api/grupo/:id`: Atualização de um grupo
- **DELETE** `/api/grupo/:id`: Exclusão de um grupo

## Funcionalidades

- **Criação de Usuários**: Com validação de e-mail e criptografia de senha.
- **Gestão de Contatos**: Adicionar, editar, listar e remover contatos com nome, telefone e comentário.
- **Criação de Grupos**: Grupos de contatos podem ser criados para facilitar o envio em massa de mensagens.
- **Autenticação**: Middleware que verifica o token JWT.
- **Validação**: Utilização da biblioteca **Yup** para validação de dados de entrada.
  
## Tratamento de Erros

Os erros são tratados utilizando a classe `ErrorApp`, garantindo que respostas padronizadas sejam enviadas em caso de falhas.

## Tecnologias Utilizadas

- **Node.js** para o backend.
- **TypeScript** para tipagem estática.
- **Express** para o gerenciamento de rotas e middlewares.
- **Prisma** como ORM para gerenciamento do banco de dados.
- **Bcrypt** para criptografia de senhas.
- **Yup** para

 Minhas Redes Socias.
 
- **GitHub:** [Meu Github](https://github.com/felixdomingos1)
- **Linkedin:** [Meu Linkedin](https://www.linkedin.com/in/f%C3%A9lixdomingos/)

  Feito Por 😎😏 Félix Domingos
---
