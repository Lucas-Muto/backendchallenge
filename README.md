# Backend Challenge: Máquina do Tempo

## Pré-requisitos

1. Node.js (versão 18 ou superior)
2. PostgreSQL (versão 13 ou superior)
3. Git

## Como Configurar o Projeto

Siga o passo a passo abaixo para configurar e executar o projeto em sua máquina:

1. **Clone este repositório:**
```bash
git clone <url-do-repositorio>
```

2. **Acesse a pasta do projeto:**
```bash
cd backendchallenge
```

3. **Instale as dependências do projeto:**
```bash
npm install
```

4. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na raiz do projeto.
   - Adicione as seguintes informações de conexão ao banco de dados:
```env
DATABASE_URL="postgresql://<usuario>:<senha>@localhost:5432/<nome_do_banco>"
```

5. **Gere o cliente do Prisma:**
```bash
npm run prisma:generate
```

6. **Execute as migrações para criar o banco de dados:**
```bash
npm run prisma:migrate
```

7. **Inicie o servidor em modo de desenvolvimento:**
```bash
npm run dev
```

8. **Teste o funcionamento do projeto (opcional):**
```bash
npm run test
```

## Descrição do Projeto

Este projeto é um sistema backend que gerencia viajantes e valida viagens no tempo com base em regras específicas. Ele permite cadastrar viajantes e multas, verificar permissões de viagem e fornecer um CRUD completo para viajantes e infrações.

## Índice

- [Requisitos do Projeto](#requisitos-do-projeto)
  - [Requisitos Funcionais](#requisitos-funcionais)
  - [Requisitos Não Funcionais](#requisitos-não-funcionais)
- [Casos de Uso do Sistema](#casos-de-uso-do-sistema)
  - [UC1: Cadastrar Viajante](#uc1-cadastrar-viajante)
  - [UC2: Consultar Viajante](#uc2-consultar-viajante)
  - [UC3: Validar Viagem](#uc3-validar-viagem)
  - [UC4: Registrar Multa](#uc4-registrar-multa)
  - [UC5: Listar Multas de um Viajante](#uc5-listar-multas-de-um-viajante)
  - [UC6: Atualizar Dados de Viajante](#uc6-atualizar-dados-de-viajante)
  - [UC7: Remover Viajante](#uc7-remover-viajante)
  - [UC8: Registrar Logs de Sistema](#uc8-registrar-logs-de-sistema)
  - [UC9: Gerenciar Multas](#uc9-gerenciar-multas)
  - [UC10: Gerenciar Fiscais](#uc10-gerenciar-fiscais)
- [Dependências e Tecnologias](#dependências-e-tecnologias)
- [Testes Automatizados](#testes-automatizados)

## Requisitos do Projeto

### Requisitos Funcionais

1. **Cadastro de Viajantes**: Permitir o cadastro de viajantes com nome, data de nascimento e número de passaporte.
2. **Consulta de Viajantes**: Permitir a consulta de viajantes pelo número de passaporte.
3. **Validação de Viagem**:
   - A data de viagem não pode ser anterior à data de nascimento do viajante.
   - O viajante não pode ter mais de 12 pontos acumulados por multas nos últimos 12 meses.
   - O viajante não pode ter multas registradas um ano antes ou depois do período de viagem.
4. **Cadastro de Multas**: Permitir o registro de multas com descrição, gravidade e data.
5. **CRUD Completo**: Disponibilizar operações completas (criar, ler, atualizar e deletar) para viajantes e multas.
6. **Logs de Utilização**: Registrar logs detalhados das operações realizadas no sistema.
7. **Autenticação**: Implementar autenticação de usuários para fiscais.

## Dependências e Tecnologias

### Backend
- `express`: Framework web para criar APIs
- `@prisma/client`: Cliente Prisma para integração com o banco de dados
- `bcryptjs`: Biblioteca para hashing de senhas
- `jsonwebtoken`: Gerar e validar tokens JWT
- `http-status-codes`: Utilitário para trabalhar com códigos HTTP

### Desenvolvimento
- `jest`: Framework para testes automatizados
- `nodemon`: Reinício automático do servidor durante o desenvolvimento
- `prisma`: ORM para gerenciar o banco de dados
- `supertest`: Utilitário para testar endpoints HTTP
- `cross-env`: Configuração de variáveis de ambiente

## Casos de Uso do Sistema

### UC1: Cadastrar Viajante
Permite o cadastro de um novo viajante no sistema.
- **Ator**: Fiscal
- **Pré-condições**: Fiscal autenticado no sistema
- **Fluxo principal**:
  1. Fiscal fornece dados do viajante
  2. Sistema valida os dados
  3. Sistema registra novo viajante

### UC2: Consultar Viajante
Permite consultar dados de um viajante específico.
- **Ator**: Fiscal
- **Pré-condições**: Fiscal autenticado no sistema
- **Fluxo principal**:
  1. Fiscal informa número do passaporte
  2. Sistema retorna dados do viajante

### UC3: Validar Viagem
Valida se um viajante pode realizar uma viagem no tempo.
- **Ator**: Fiscal
- **Pré-condições**: Viajante cadastrado no sistema
- **Fluxo principal**:
  1. Sistema verifica regras de viagem
  2. Sistema retorna resultado da validação

### UC4: Registrar Multa
Permite registrar uma multa para um viajante.
- **Ator**: Fiscal
- **Pré-condições**: Viajante cadastrado no sistema
- **Fluxo principal**:
  1. Fiscal fornece dados da multa
  2. Sistema registra multa para o viajante

### UC5: Listar Multas de um Viajante
Lista todas as multas associadas a um viajante.
- **Ator**: Fiscal
- **Pré-condições**: Viajante cadastrado no sistema
- **Fluxo principal**:
  1. Sistema retorna lista de multas do viajante

### UC6: Atualizar Dados de Viajante
Permite atualizar informações de um viajante.
- **Ator**: Fiscal
- **Pré-condições**: Viajante cadastrado no sistema
- **Fluxo principal**:
  1. Fiscal fornece novos dados
  2. Sistema atualiza cadastro

### UC7: Remover Viajante
Permite remover um viajante do sistema.
- **Ator**: Fiscal
- **Pré-condições**: Viajante cadastrado no sistema
- **Fluxo principal**:
  1. Sistema remove viajante e dados associados

### UC8: Registrar Logs de Sistema
Registra todas as operações realizadas no sistema.
- **Ator**: Sistema
- **Pré-condições**: Nenhuma
- **Fluxo principal**:
  1. Sistema registra operação realizada
  2. Sistema armazena log com timestamp

### UC9: Gerenciar Multas
Permite a gestão completa das multas registradas no sistema.
- **Ator**: Fiscal
- **Pré-condições**: Fiscal autenticado no sistema
- **Fluxo principal**:
  1. Atualizar dados da multa
     - Fiscal seleciona multa existente
     - Fiscal fornece novos dados
     - Sistema valida e atualiza informações
  2. Remover multa
     - Fiscal seleciona multa existente
     - Sistema remove multa do registro
     - Sistema atualiza pontuação do viajante

### UC10: Gerenciar Fiscais
Permite o gerenciamento de usuários fiscais no sistema.
- **Ator**: Administrador do Sistema
- **Pré-condições**: Administrador autenticado
- **Fluxo principal**:
  1. Cadastrar novo fiscal
     - Administrador fornece dados do fiscal
     - Sistema valida e cria credenciais
  2. Autenticar fiscal
     - Fiscal fornece credenciais
     - Sistema valida e gera token de acesso
  3. Gerenciar permissões
     - Administrador define níveis de acesso
     - Sistema atualiza permissões

## Testes Automatizados
O sistema inclui uma suíte completa de testes automatizados para garantir sua qualidade e funcionamento.

### Tipos de Testes
1. **Testes de API**
   - Validação de endpoints
   - Validação de regras de negócio
   - Fluxos básicos de usuário

2. **Testes de Autenticação**
   - Validação de tokens JWT
   - Verificação de permissões de acesso

### Cobertura Atual
- Testes automatizados dos principais endpoints
- Validação das regras de negócio críticas
- Autenticação e autorização básica
