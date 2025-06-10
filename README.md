# Sistema Jurídico

Sistema de gerenciamento para escritórios de advocacia, desenvolvido com tecnologias modernas e seguindo as melhores práticas de desenvolvimento.

## Funcionalidades

- Gerenciamento de processos jurídicos
- Controle de clientes
- Gerenciamento de tarefas
- Tags personalizáveis
- Geração de relatórios em PDF
- Interface moderna e responsiva
- Autenticação e autorização

## Tecnologias Utilizadas

### Backend
- Node.js com Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT para autenticação
- PDFKit para geração de relatórios

### Frontend
- React com TypeScript
- Material-UI
- React Router
- Axios
- Date-fns

### Infraestrutura
- Docker
- Docker Compose

## Requisitos

- Node.js 18 ou superior
- Docker e Docker Compose
- PostgreSQL 14 (para execução local)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/sistema-juridico.git
cd sistema-juridico
```

2. Configure as variáveis de ambiente:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Inicie os containers Docker:
```bash
docker-compose up -d
```

4. Execute as migrações do banco de dados:
```bash
docker-compose exec backend npm run prisma:migrate
```

5. Acesse a aplicação:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Desenvolvimento

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Estrutura do Projeto

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 