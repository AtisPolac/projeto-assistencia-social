# Modelo de Dados - Sistema de Gerenciamento de Assistência Social

## Entidades Principais

### Utilizador
- **id**: UUID (chave primária)
- **nome**: String
- **email**: String (único)
- **password**: String (hash)
- **tipo**: Enum ['admin', 'gerenciador', 'assistido']
- **ativo**: Boolean
- **data_criacao**: DateTime
- **ultimo_acesso**: DateTime
- **token_recuperacao**: String (opcional)

### Grupo
- **id**: UUID (chave primária)
- **nome**: String
- **descricao**: String
- **capacidade_maxima**: Integer
- **data_criacao**: DateTime
- **ativo**: Boolean

### GerenciadorGrupo
- **id**: UUID (chave primária)
- **id_utilizador**: UUID (chave estrangeira -> Utilizador)
- **id_grupo**: UUID (chave estrangeira -> Grupo)
- **data_atribuicao**: DateTime
- **ativo**: Boolean

### Vulneravel
- **id**: UUID (chave primária)
- **nome_completo**: String
- **cpf**: String (único)
- **data_nascimento**: Date
- **genero**: String
- **estado_civil**: String
- **endereco**: String
- **bairro**: String
- **cidade**: String
- **estado**: String
- **cep**: String
- **telefone**: String
- **email**: String (opcional)
- **situacao_emprego**: String
- **renda_familiar**: Decimal
- **num_dependentes**: Integer
- **necessidades_especiais**: Boolean
- **observacoes**: Text
- **data_cadastro**: DateTime
- **status**: Enum ['espera', 'assistido', 'concluido', 'desistente']

### Assistido
- **id**: UUID (chave primária)
- **id_vulneravel**: UUID (chave estrangeira -> Vulneravel)
- **id_grupo**: UUID (chave estrangeira -> Grupo)
- **id_gerenciador**: UUID (chave estrangeira -> Utilizador)
- **data_inicio**: DateTime
- **data_fim_prevista**: DateTime
- **data_fim_real**: DateTime (opcional)
- **motivo_saida**: Enum ['tempo_expirado', 'emprego', 'desistencia', 'outro']
- **detalhes_saida**: Text (opcional)
- **extensao_concedida**: Boolean
- **status**: Enum ['ativo', 'inativo']

### Item
- **id**: UUID (chave primária)
- **nome**: String
- **descricao**: String
- **categoria**: String
- **unidade_medida**: String
- **quantidade_atual**: Integer
- **quantidade_minima**: Integer
- **data_cadastro**: DateTime
- **ativo**: Boolean

### MovimentacaoEstoque
- **id**: UUID (chave primária)
- **id_item**: UUID (chave estrangeira -> Item)
- **tipo**: Enum ['entrada', 'saida', 'ajuste']
- **quantidade**: Integer
- **data_movimentacao**: DateTime
- **responsavel_id**: UUID (chave estrangeira -> Utilizador)
- **observacao**: Text (opcional)

### Doacao
- **id**: UUID (chave primária)
- **id_assistido**: UUID (chave estrangeira -> Assistido)
- **id_gerenciador**: UUID (chave estrangeira -> Utilizador)
- **data_doacao**: DateTime
- **observacao**: Text (opcional)
- **comprovante_gerado**: Boolean

### ItemDoacao
- **id**: UUID (chave primária)
- **id_doacao**: UUID (chave estrangeira -> Doacao)
- **id_item**: UUID (chave estrangeira -> Item)
- **quantidade**: Integer

### Comprovante
- **id**: UUID (chave primária)
- **id_doacao**: UUID (chave estrangeira -> Doacao)
- **codigo**: String (único)
- **data_geracao**: DateTime
- **assinado**: Boolean
- **url_documento**: String (opcional)

## Relacionamentos

1. **Utilizador - Grupo**:
   - Um utilizador do tipo gerenciador pode estar associado a um grupo através da tabela GerenciadorGrupo
   - Um grupo pode ter múltiplos gerenciadores

2. **Vulneravel - Assistido**:
   - Um vulnerável pode tornar-se um assistido quando apadrinhado por um gerenciador
   - Um vulnerável só pode estar associado a um assistido ativo por vez

3. **Grupo - Assistido**:
   - Um grupo pode ter múltiplos assistidos
   - Um assistido pertence a apenas um grupo

4. **Assistido - Doacao**:
   - Um assistido pode receber múltiplas doações
   - Uma doação está associada a apenas um assistido

5. **Doacao - ItemDoacao**:
   - Uma doação pode conter múltiplos itens
   - Um item de doação pertence a apenas uma doação

6. **Doacao - Comprovante**:
   - Uma doação gera um comprovante
   - Um comprovante está associado a apenas uma doação

7. **Item - MovimentacaoEstoque**:
   - Um item pode ter múltiplas movimentações de estoque
   - Uma movimentação de estoque está associada a apenas um item

8. **Item - ItemDoacao**:
   - Um item pode estar presente em múltiplas doações
   - Um item de doação refere-se a apenas um item do estoque

## Índices Recomendados

1. Índice em `Vulneravel.status` para consultas rápidas da fila de espera
2. Índice em `Assistido.data_fim_prevista` para monitorar prazos de permanência
3. Índice em `Assistido.id_grupo` para consultas de assistidos por grupo
4. Índice em `Item.quantidade_atual` para monitoramento de estoque
5. Índice em `Doacao.data_doacao` para relatórios temporais
6. Índice em `Utilizador.email` para autenticação rápida

## Regras de Integridade

1. Ao criar um assistido, o status do vulnerável deve ser atualizado para 'assistido'
2. Ao finalizar o período de um assistido, o status do vulnerável deve ser atualizado para 'concluido'
3. Ao registrar uma saída de estoque via doação, a quantidade do item deve ser decrementada
4. Um gerenciador só pode atribuir doações para assistidos do seu próprio grupo
5. A data_fim_prevista de um assistido deve ser calculada como data_inicio + 3 meses
6. Se extensao_concedida for true, a data_fim_prevista deve ser estendida por mais 1 mês
