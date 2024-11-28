# Backend Challenge: Máquina do Tempo

## Descrição do Projeto
Este projeto é um sistema backend que gerencia viajantes e valida viagens no tempo com base em regras específicas. Ele permite cadastrar viajantes e multas, verificar permissões de viagem e fornecer um CRUD completo para viajantes e infrações.

## Requisitos
### Requisitos Funcionais
- RF1 - Cadastro de Viajantes: Permitir o cadastro de viajantes com nome, data de nascimento e número de passaporte.
- RF2 - Consulta de Viajantes: Permitir a consulta de viajantes pelo número de passaporte.
- RF3 - Validação de Viagem: Implementar regras para validação de viagens:

  - RF3.1: A data de viagem não pode ser anterior à data de nascimento do viajante.
  - RF3.2: O viajante não pode ter mais de 12 pontos acumulados por multas nos últimos 12 meses.
  - RF3.3: O viajante não pode ter multas registradas um ano antes ou depois do período de viagem.
- RF4 - Cadastro de Multas: Permitir o registro de multas com descrição, gravidade e data.
- RF5 - CRUD Completo: Disponibilizar operações completas (criar, ler, atualizar e deletar) para viajantes e multas.
- RF6 - Logs de Utilização: Registrar logs detalhados das operações realizadas no sistema.
- RF7 - Autenticação: Implementar autenticação de usuários para fiscais.

### Requisitos Não Funcionais
- RNF1 - Banco de Dados: Migrar para PostgreSQL com integridade referencial e performance otimizada.
- RNF2 - Segurança: Implementar autenticação.
- RNF3 - Testes: O sistema deve implementar testes automatizados.

## Casos de Uso do Sistema
### UC1 - Cadastrar Viajante

**Descrição:** Permitir que o sistema receba informações de novos viajantes para posterior consulta e validação de viagens.


**Atores Envolvidos:** Fiscais

**Fluxo Principal:**
1. O fiscal informa o nome, data de nascimento e número do passaporte.
2. O sistema verifica se todos os dados obrigatórios foram fornecidos.
3. O sistema registra o viajante na base de dados e retorna uma confirmação.

**Fluxo Alternativo:**
- Dados obrigatórios ausentes: O sistema retorna um erro informando quais campos estão faltando.


### UC2 - Consultar Viajante

**Descrição:** Permitir que o sistema exiba informações sobre um viajante com base no número do passaporte.

**Atores Envolvidos:** Fiscais

**Fluxo Principal:**
1. O fiscal informa o número do passaporte do viajante.
2. O sistema busca o viajante na base de dados.
3. O sistema retorna as informações do viajante.

**Fluxo Alternativo:**
- Viajante não encontrado: O sistema retorna uma mensagem de erro indicando que o viajante não foi localizado.


### UC3 - Validar Viagem

**Descrição:** Verificar se um viajante está apto para realizar uma viagem no tempo com base em regras definidas.

**Atores Envolvidos:** Fiscais

**Fluxo Principal:**
1. O fiscal informa o número do passaporte do viajante, a data de início e a data de destino.
2. O sistema busca o viajante e verifica:
    - A data de destino é anterior à data de nascimento?
    - O viajante tem mais de 12 pontos acumulados por multas nos últimos 12 meses?
    - Há multas registradas um ano antes ou depois do período de viagem?
3. Se todas as condições forem atendidas, o sistema permite a viagem.

**Fluxo Alternativo:**
- Qualquer regra não atendida: O sistema retorna um erro detalhando o motivo do bloqueio.


### UC4 - Registrar Multa

**Descrição:** Registrar infrações cometidas por viajantes.

**Atores Envolvidos:** Fiscais

**Fluxo Principal:**
1. O fiscal informa o número do passaporte, a descrição da multa, a gravidade (leve, média ou grave) e a data.
2. O sistema valida os dados e registra a multa.
3. O sistema retorna uma confirmação do registro.

**Fluxo Alternativo:**
- Dados incompletos: O sistema retorna um erro informando os campos ausentes.


### UC5 - Listar Multas de um Viajante

**Descrição:** Exibir todas as infrações cometidas por um viajante específico.

**Atores Envolvidos:** Fiscais

**Fluxo Principal:**
1. O fiscal informa o número do passaporte do viajante.
2. O sistema busca e retorna todas as infrações associadas ao viajante.


### UC6 - Atualizar Dados de Viajante

**Descrição:** Permitir a atualização de informações de um viajante cadastrado.

**Atores Envolvidos:** Fiscais

**Fluxo Principal:**
1. O fiscal informa o número do passaporte do viajante e os novos dados.
2. O sistema verifica a existência do viajante e atualiza os dados fornecidos.
3. O sistema retorna uma mensagem de confirmação.

**Fluxo Alternativo:**
- Viajante não encontrado: O sistema retorna uma mensagem de erro.


### UC7 - Remover Viajante

**Descrição:** Permitir que um viajante seja removido da base de dados.

**Atores Envolvidos:** Fiscais

**Fluxo Principal:**
1. O fiscal informa o número do passaporte do viajante.
2. O sistema verifica a existência do viajante.
3. O sistema remove o viajante da base de dados e retorna uma mensagem de confirmação.

**Fluxo Alternativo:**
- Viajante não encontrado: O sistema retorna uma mensagem de erro.


### UC8 - Registrar Logs de Sistema

**Descrição:** Registrar logs de todas as ações realizadas no sistema para fins de auditoria.

**Atores Envolvidos:** Sistema

**Fluxo Principal:**
1. Cada operação realizada no sistema é registrada com data, hora, operação e usuário responsável.
2. Os logs ficam disponíveis para auditorias futuras.
