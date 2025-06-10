# Sistema Jurídico - Gestão de Escritórios de Advocacia

Sistema completo para gestão de escritórios de advocacia, desenvolvido com tecnologias modernas e foco em usabilidade.

## Funcionalidades Principais

- Gestão completa de processos jurídicos
- Cadastro e gestão de clientes
- Sistema de etiquetas personalizáveis
- Relatórios com gráficos e exportação em PDF/Excel
- Dashboard personalizado
- Gestão de tarefas
- Integração com APIs de tribunais (via n8n)

## Requisitos

- Docker
- Docker Compose
- Node.js 18+ (para desenvolvimento local)

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd legal-system
```

2. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env` em cada diretório (frontend e backend)
   - Ajuste as variáveis conforme necessário

3. Inicie o sistema:
```bash
docker-compose up -d
```

O sistema estará disponível em:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- PostgreSQL: localhost:5432

## Estrutura do Projeto

```
legal-system/
├── frontend/           # Aplicação Next.js
├── backend/           # API Node.js/Express
└── docs/             # Documentação
```

## Desenvolvimento

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Banco de Dados

O sistema utiliza PostgreSQL como banco de dados principal. As migrações são executadas automaticamente durante a inicialização do backend.

## Integração com n8n

Para configurar a integração com n8n:

1. Instale o n8n localmente ou use a versão cloud
2. Configure os webhooks necessários no n8n
3. Configure as credenciais de API no painel administrativo do sistema

## Segurança

- Todas as senhas são hasheadas usando bcrypt
- Autenticação via JWT
- Proteção contra CSRF
- Validação de dados com Zod
- Sanitização de inputs

## Suporte

Para suporte técnico ou dúvidas, entre em contato através de [EMAIL_SUPORTE].

## Licença

Este projeto está sob a licença [TIPO_DE_LICENCA]. 