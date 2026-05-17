-- ============================================================
-- TASKS + STEPS SEED
-- ============================================================

-- ============================================================
-- TRUNCATE
-- ============================================================
TRUNCATE TABLE task_members CASCADE;
TRUNCATE TABLE steps CASCADE;
TRUNCATE TABLE tasks CASCADE;


-- ============================================================
-- 30 tasks across 5 areas, no members assigned
-- ============================================================

-- ============================================================
-- IDs reference
-- ============================================================
-- AREAS:
--   AERODYNAMICS : 53a97121-49d1-4fc9-bf15-5d62751d3f54
--   DYNAMICS     : 5249ac1f-37bd-4a33-8b7a-6b58e6f07ae2
--   TELEMETRY    : 37138c7a-b670-4b1a-9091-3a73caa1aa45
--   MARKETING    : 6d67825a-7c60-4cea-9c46-fdf7b90bba6d
--   STRUCTURE    : b2e5f2e3-346a-47a4-b7fd-6f21b33ae72e
--
-- MANAGERS:
--   Bruno   (Aero)      : 00000000-0000-0000-0000-000000000002
--   Camila  (Dynamics)  : 00000000-0000-0000-0000-000000000003
--   Diego   (Telemetry) : 00000000-0000-0000-0000-000000000004
--   Elisa   (Marketing) : 00000000-0000-0000-0000-000000000005
--   Felipe  (Structure) : 00000000-0000-0000-0000-000000000006
--
-- LEADERS:
--   Gabriela (Aero)      : 00000000-0000-0000-0000-000000000007
--   Henrique (Dynamics)  : 00000000-0000-0000-0000-000000000008
--   Isabela  (Telemetry) : 00000000-0000-0000-0000-000000000009
--   Joao     (Marketing) : 00000000-0000-0000-0000-000000000010
--   Karen    (Structure) : 00000000-0000-0000-0000-000000000011
--
-- CATEGORIES:
--   Manufatura     : 10000000-0000-0000-0000-000000000001
--   Simulação      : 10000000-0000-0000-0000-000000000002
--   Manutenção     : 10000000-0000-0000-0000-000000000003
--   Soldagem       : 10000000-0000-0000-0000-000000000004
--   Setup          : 10000000-0000-0000-0000-000000000005
--   Eletrônica     : 10000000-0000-0000-0000-000000000006
--   Programação    : 10000000-0000-0000-0000-000000000007
--   Documentação   : 10000000-0000-0000-0000-000000000008
--   Reunião        : 10000000-0000-0000-0000-000000000009
--   Análise Dados  : 10000000-0000-0000-0000-000000000010
--   Design         : 10000000-0000-0000-0000-000000000011
--   Testes         : 10000000-0000-0000-0000-000000000012
--   Evento         : 10000000-0000-0000-0000-000000000013
--   Marketing      : 10000000-0000-0000-0000-000000000014
--   Patrocínio     : 10000000-0000-0000-0000-000000000015

INSERT INTO tasks (id, name, description, category_id, area_id, leader_id, manager_id, status, active, date_limit, created_at, updated_at) VALUES

-- ============================================================
-- AERODYNAMICS (6 tasks)
-- ============================================================
('20000000-0000-0000-0000-000000000001',
 'Refazer Flap da Asa Dianteira',
 'Manufaturar novo flap com inclinação entre 2 e 4 graus para otimizar downforce na entrada das curvas.',
 '10000000-0000-0000-0000-000000000001', '53a97121-49d1-4fc9-bf15-5d62751d3f54',
 '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002',
 'IN_PROGRESS', true, '2026-06-10 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000002',
 'Análise CFD do Difusor Traseiro',
 'Simular escoamento no difusor atual e propor geometria otimizada para reduzir arrasto.',
 '10000000-0000-0000-0000-000000000002', '53a97121-49d1-4fc9-bf15-5d62751d3f54',
 '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002',
 'NOT_STARTED', true, '2026-06-25 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000003',
 'Modelagem CAD da Asa Traseira',
 'Redesenhar asa traseira no SolidWorks com base nos resultados da última simulação CFD.',
 '10000000-0000-0000-0000-000000000011', '53a97121-49d1-4fc9-bf15-5d62751d3f54',
 '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002',
 'IN_REVISION', true, '2026-06-01 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000004',
 'Relatório de Coeficientes Aerodinâmicos',
 'Documentar Cl, Cd e L/D ratio obtidos nos testes de túnel de vento para submissão à SAE.',
 '10000000-0000-0000-0000-000000000008', '53a97121-49d1-4fc9-bf15-5d62751d3f54',
 '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002',
 'DONE', false, '2026-05-15 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000005',
 'Validação do Modelo CFD com Dados de Pista',
 'Comparar resultados do CFD com dados de telemetria coletados nos testes para calibrar o modelo.',
 '10000000-0000-0000-0000-000000000010', '53a97121-49d1-4fc9-bf15-5d62751d3f54',
 '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002',
 'NOT_STARTED', true, '2026-07-05 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000006',
 'Fabricação dos Endplates',
 'Cortar e lixar endplates da asa dianteira em fibra de carbono conforme modelo aprovado.',
 '10000000-0000-0000-0000-000000000001', '53a97121-49d1-4fc9-bf15-5d62751d3f54',
 '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002',
 'DONE', false, '2026-05-20 00:00:00', NOW(), NOW()),

-- ============================================================
-- DYNAMICS (6 tasks)
-- ============================================================
('20000000-0000-0000-0000-000000000007',
 'Calibração dos Amortecedores Traseiros',
 'Ajustar dureza e rebote dos amortecedores traseiros para o perfil do circuito de Curitiba.',
 '10000000-0000-0000-0000-000000000005', '5249ac1f-37bd-4a33-8b7a-6b58e6f07ae2',
 '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003',
 'NOT_STARTED', true, '2026-06-15 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000008',
 'Troca dos Rolamentos da Suspensão Dianteira',
 'Substituir rolamentos desgastados dos braços de suspensão dianteiros detectados na revisão.',
 '10000000-0000-0000-0000-000000000003', '5249ac1f-37bd-4a33-8b7a-6b58e6f07ae2',
 '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003',
 'DONE', false, '2026-05-10 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000009',
 'Simulação de Dinâmica Veicular no Adams',
 'Modelar comportamento do veículo em curva de alta velocidade para otimizar geometria de suspensão.',
 '10000000-0000-0000-0000-000000000002', '5249ac1f-37bd-4a33-8b7a-6b58e6f07ae2',
 '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003',
 'IN_PROGRESS', true, '2026-06-30 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000010',
 'Alinhamento e Cambagem Pós-Montagem',
 'Realizar alinhamento das rodas e ajuste de cambagem conforme valores definidos no setup base.',
 '10000000-0000-0000-0000-000000000005', '5249ac1f-37bd-4a33-8b7a-6b58e6f07ae2',
 '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003',
 'IN_REVISION', true, '2026-06-05 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000011',
 'Teste de Skidpad — Coleta de Dados',
 'Executar voltas no skidpad e registrar dados de aceleração lateral, velocidade e trajetória.',
 '10000000-0000-0000-0000-000000000012', '5249ac1f-37bd-4a33-8b7a-6b58e6f07ae2',
 '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003',
 'NOT_STARTED', true, '2026-07-10 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000012',
 'Documentação do Setup Base para Curitiba',
 'Registrar todos os parâmetros de setup aprovados para servir de referência nas próximas etapas.',
 '10000000-0000-0000-0000-000000000008', '5249ac1f-37bd-4a33-8b7a-6b58e6f07ae2',
 '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003',
 'IN_PROGRESS', true, '2026-06-20 00:00:00', NOW(), NOW()),

-- ============================================================
-- TELEMETRY (6 tasks)
-- ============================================================
('20000000-0000-0000-0000-000000000013',
 'Instalação do Sistema de Telemetria v2',
 'Substituir módulo de aquisição de dados pelo novo hardware com suporte a CAN Bus 2.0.',
 '10000000-0000-0000-0000-000000000006', '37138c7a-b670-4b1a-9091-3a73caa1aa45',
 '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004',
 'IN_REVISION', true, '2026-06-05 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000014',
 'Mapeamento do Sensor de Temperatura do Motor',
 'Configurar canal de leitura do sensor NTC no dashboard de telemetria e definir limites de alerta.',
 '10000000-0000-0000-0000-000000000006', '37138c7a-b670-4b1a-9091-3a73caa1aa45',
 '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004',
 'IN_PROGRESS', true, '2026-06-01 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000015',
 'Validação do Protocolo CAN Bus',
 'Verificar integridade da comunicação entre ECU e módulos periféricos após atualização do firmware.',
 '10000000-0000-0000-0000-000000000007', '37138c7a-b670-4b1a-9091-3a73caa1aa45',
 '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004',
 'NOT_STARTED', true, '2026-06-20 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000016',
 'Dashboard de Monitoramento em Tempo Real',
 'Desenvolver interface de visualização dos dados de telemetria para uso nos boxes durante os testes.',
 '10000000-0000-0000-0000-000000000007', '37138c7a-b670-4b1a-9091-3a73caa1aa45',
 '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004',
 'IN_PROGRESS', true, '2026-07-01 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000017',
 'Análise de Dados do Último Teste em Pista',
 'Processar e interpretar os dados coletados no teste de Curitiba, identificando anomalias e tendências.',
 '10000000-0000-0000-0000-000000000010', '37138c7a-b670-4b1a-9091-3a73caa1aa45',
 '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004',
 'DONE', false, '2026-05-18 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000018',
 'Calibração dos Sensores de Pressão',
 'Verificar e recalibrar sensores de pressão de pneu e freio com equipamento de referência certificado.',
 '10000000-0000-0000-0000-000000000006', '37138c7a-b670-4b1a-9091-3a73caa1aa45',
 '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004',
 'NOT_STARTED', true, '2026-06-28 00:00:00', NOW(), NOW()),

-- ============================================================
-- MARKETING (6 tasks)
-- ============================================================
('20000000-0000-0000-0000-000000000019',
 'Confecção do Banner para a Etapa de Londrina',
 'Criar e imprimir banner da equipe no padrão SAE Brasil para exposição no paddock.',
 '10000000-0000-0000-0000-000000000014', '6d67825a-7c60-4cea-9c46-fdf7b90bba6d',
 '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005',
 'DONE', false, '2026-05-05 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000020',
 'Atualização do Relatório Técnico para a SAE',
 'Revisar e atualizar o relatório técnico com dados da temporada conforme template SAE Brasil 2026.',
 '10000000-0000-0000-0000-000000000008', '6d67825a-7c60-4cea-9c46-fdf7b90bba6d',
 '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005',
 'IN_PROGRESS', true, '2026-06-20 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000021',
 'Produção do Vídeo Institucional',
 'Gravar e editar vídeo de 2 minutos para captação de patrocinadores na temporada 2026.',
 '10000000-0000-0000-0000-000000000014', '6d67825a-7c60-4cea-9c46-fdf7b90bba6d',
 '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005',
 'NOT_STARTED', true, '2026-07-01 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000022',
 'Prospecção de Novos Patrocinadores',
 'Mapear e contatar empresas do setor automotivo e tecnológico para proposta de patrocínio 2026.',
 '10000000-0000-0000-0000-000000000015', '6d67825a-7c60-4cea-9c46-fdf7b90bba6d',
 '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005',
 'IN_PROGRESS', true, '2026-06-30 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000023',
 'Atualização das Redes Sociais — Cobertura de Testes',
 'Produzir e publicar conteúdo fotográfico e em vídeo dos testes em pista para Instagram e LinkedIn.',
 '10000000-0000-0000-0000-000000000014', '6d67825a-7c60-4cea-9c46-fdf7b90bba6d',
 '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005',
 'IN_REVISION', true, '2026-05-30 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000024',
 'Organização da Reunião com Patrocinadores',
 'Planejar e executar evento de relacionamento com patrocinadores atuais para apresentar resultados.',
 '10000000-0000-0000-0000-000000000013', '6d67825a-7c60-4cea-9c46-fdf7b90bba6d',
 '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005',
 'NOT_STARTED', true, '2026-07-15 00:00:00', NOW(), NOW()),

-- ============================================================
-- STRUCTURE (6 tasks)
-- ============================================================
('20000000-0000-0000-0000-000000000025',
 'Soldagem do Chassi Principal',
 'Executar soldagem dos tubos do chassi em TIG 4130 conforme projeto aprovado.',
 '10000000-0000-0000-0000-000000000004', 'b2e5f2e3-346a-47a4-b7fd-6f21b33ae72e',
 '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000006',
 'IN_PROGRESS', true, '2026-06-15 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000026',
 'Revisão Estrutural Pós-Evento',
 'Inspecionar integridade do chassi e componentes estruturais após participação na etapa de testes.',
 '10000000-0000-0000-0000-000000000003', 'b2e5f2e3-346a-47a4-b7fd-6f21b33ae72e',
 '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000006',
 'DONE', false, '2026-05-10 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000027',
 'Fabricação do Suporte do Extintor',
 'Manufaturar suporte de fixação do extintor conforme exigências do regulamento SAE 2026.',
 '10000000-0000-0000-0000-000000000001', 'b2e5f2e3-346a-47a4-b7fd-6f21b33ae72e',
 '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000006',
 'NOT_STARTED', true, '2026-07-10 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000028',
 'Análise de Fadiga do Braço de Suspensão',
 'Simular carregamento cíclico no braço de suspensão dianteiro para verificar vida útil estimada.',
 '10000000-0000-0000-0000-000000000002', 'b2e5f2e3-346a-47a4-b7fd-6f21b33ae72e',
 '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000006',
 'IN_REVISION', true, '2026-06-08 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000029',
 'Fabricação do Hoop de Proteção',
 'Construir e instalar hoop de proteção do piloto conforme requisitos de segurança da SAE.',
 '10000000-0000-0000-0000-000000000004', 'b2e5f2e3-346a-47a4-b7fd-6f21b33ae72e',
 '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000006',
 'IN_PROGRESS', true, '2026-06-25 00:00:00', NOW(), NOW()),

('20000000-0000-0000-0000-000000000030',
 'Documentação Estrutural para Design Event',
 'Preparar memorial de cálculo e relatório estrutural do chassi para apresentação no Design Event.',
 '10000000-0000-0000-0000-000000000008', 'b2e5f2e3-346a-47a4-b7fd-6f21b33ae72e',
 '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000006',
 'NOT_STARTED', true, '2026-07-20 00:00:00', NOW(), NOW());

-- ============================================================
-- STEPS
-- ============================================================
INSERT INTO steps (id, name, description, task_id, done, priority, created_at, updated_at) VALUES

-- Task 01 — Refazer Flap da Asa Dianteira (IN_PROGRESS, 5 steps, 2 done)
('30000000-0000-0000-0000-000000000001', 'Revisar geometria atual do flap', 'Levantar medidas e ângulo atual do flap montado no veículo.', '20000000-0000-0000-0000-000000000001', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000002', 'Definir novo ângulo de inclinação', 'Calcular ângulo ideal entre 2° e 4° com base nos dados do CFD.', '20000000-0000-0000-0000-000000000001', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000003', 'Cortar laminado de fibra de carbono', 'Cortar lâminas no tamanho definido pelo projeto.', '20000000-0000-0000-0000-000000000001', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000004', 'Laminação e cura em autoclave', 'Laminar o flap e curar conforme ciclo definido.', '20000000-0000-0000-0000-000000000001', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000005', 'Montagem e verificação de fixação', 'Instalar o flap e verificar torques de fixação.', '20000000-0000-0000-0000-000000000001', false, 5, NOW(), NOW()),

-- Task 02 — Análise CFD do Difusor Traseiro (NOT_STARTED, 4 steps, 0 done)
('30000000-0000-0000-0000-000000000006', 'Exportar geometria do difusor do CAD', 'Exportar modelo STEP do difusor atual para uso no ANSYS.', '20000000-0000-0000-0000-000000000002', false, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000007', 'Configurar domínio e malha', 'Definir domínio de escoamento e gerar malha refinada na região do difusor.', '20000000-0000-0000-0000-000000000002', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000008', 'Executar simulação e pós-processamento', 'Rodar simulação k-ε e extrair Cl, Cd e linhas de corrente.', '20000000-0000-0000-0000-000000000002', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000009', 'Propor geometria otimizada', 'Com base nos resultados, redesenhar difusor e validar via simulação comparativa.', '20000000-0000-0000-0000-000000000002', false, 4, NOW(), NOW()),

-- Task 03 — Modelagem CAD da Asa Traseira (IN_REVISION, 6 steps, 5 done)
('30000000-0000-0000-0000-000000000010', 'Levantar requisitos de regulamento', 'Verificar dimensões máximas e restrições da asa traseira no regulamento SAE 2026.', '20000000-0000-0000-0000-000000000003', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000011', 'Esboço conceitual da geometria', 'Criar esboço 2D das seções perfis aerodinâmicos a utilizar.', '20000000-0000-0000-0000-000000000003', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000012', 'Modelagem 3D no SolidWorks', 'Construir modelo paramétrico completo da asa traseira.', '20000000-0000-0000-0000-000000000003', true,  3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000013', 'Revisão do modelo com equipe de dinâmica', 'Apresentar modelo e coletar feedback sobre interação com difusor.', '20000000-0000-0000-0000-000000000003', true,  4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000014', 'Ajustes pós-revisão', 'Incorporar alterações solicitadas na revisão.', '20000000-0000-0000-0000-000000000003', true,  5, NOW(), NOW()),
('30000000-0000-0000-0000-000000000015', 'Aprovação final do modelo', 'Submeter modelo para aprovação do gestor antes de fabricação.', '20000000-0000-0000-0000-000000000003', false, 6, NOW(), NOW()),

-- Task 04 — Relatório de Coeficientes Aerodinâmicos (DONE, 3 steps, 3 done)
('30000000-0000-0000-0000-000000000016', 'Compilar dados do túnel de vento', 'Organizar planilha com todos os resultados dos testes.', '20000000-0000-0000-0000-000000000004', true, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000017', 'Redigir relatório técnico', 'Escrever relatório no template SAE com análise dos coeficientes.', '20000000-0000-0000-0000-000000000004', true, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000018', 'Revisão e submissão', 'Revisar documento com orientador e submeter à SAE.', '20000000-0000-0000-0000-000000000004', true, 3, NOW(), NOW()),

-- Task 05 — Validação do Modelo CFD (NOT_STARTED, 5 steps, 0 done)
('30000000-0000-0000-0000-000000000019', 'Exportar dados de telemetria relevantes', 'Selecionar canais de pressão e velocidade dos testes para comparação.', '20000000-0000-0000-0000-000000000005', false, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000020', 'Definir métricas de comparação', 'Estabelecer quais grandezas serão usadas para validar o modelo.', '20000000-0000-0000-0000-000000000005', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000021', 'Rodar simulação nas condições de pista', 'Configurar CFD com velocidade e temperatura do dia do teste.', '20000000-0000-0000-0000-000000000005', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000022', 'Comparar resultados e calcular erro', 'Calcular desvio percentual entre CFD e dados reais.', '20000000-0000-0000-0000-000000000005', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000023', 'Ajustar parâmetros do modelo', 'Calibrar modelo CFD para reduzir erro abaixo de 5%.', '20000000-0000-0000-0000-000000000005', false, 5, NOW(), NOW()),

-- Task 06 — Fabricação dos Endplates (DONE, 4 steps, 4 done)
('30000000-0000-0000-0000-000000000024', 'Cortar laminado conforme molde', 'Cortar fibra de carbono no formato dos endplates.', '20000000-0000-0000-0000-000000000006', true, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000025', 'Laminação a vácuo', 'Aplicar resina epóxi e fazer laminação sob pressão de vácuo.', '20000000-0000-0000-0000-000000000006', true, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000026', 'Acabamento e furação', 'Lixar superfície e furar pontos de fixação.', '20000000-0000-0000-0000-000000000006', true, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000027', 'Instalação na asa dianteira', 'Fixar endplates e verificar alinhamento.', '20000000-0000-0000-0000-000000000006', true, 4, NOW(), NOW()),

-- Task 07 — Calibração dos Amortecedores (NOT_STARTED, 5 steps, 0 done)
('30000000-0000-0000-0000-000000000028', 'Definir perfil do circuito de Curitiba', 'Levantar características de pista: raios, lombadas e frenagens.', '20000000-0000-0000-0000-000000000007', false, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000029', 'Consultar dados históricos de setup', 'Verificar configurações usadas em edições anteriores no mesmo circuito.', '20000000-0000-0000-0000-000000000007', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000030', 'Ajustar dureza de compressão', 'Configurar cliques de compressão em bancada conforme target.', '20000000-0000-0000-0000-000000000007', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000031', 'Ajustar rebote', 'Configurar cliques de rebote e verificar simetria entre pares.', '20000000-0000-0000-0000-000000000007', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000032', 'Validar em pista', 'Realizar volta de aquecimento e coletar impressão do piloto.', '20000000-0000-0000-0000-000000000007', false, 5, NOW(), NOW()),

-- Task 08 — Troca dos Rolamentos (DONE, 4 steps, 4 done)
('30000000-0000-0000-0000-000000000033', 'Desmontar conjunto de suspensão dianteiro', 'Remover braços e manga de eixo para acesso aos rolamentos.', '20000000-0000-0000-0000-000000000008', true, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000034', 'Inspecionar e registrar desgaste', 'Fotografar e documentar condição dos rolamentos removidos.', '20000000-0000-0000-0000-000000000008', true, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000035', 'Instalar novos rolamentos', 'Prensionar rolamentos novos com ferramenta adequada.', '20000000-0000-0000-0000-000000000008', true, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000036', 'Remontar e verificar folgas', 'Remontar suspensão e checar folgas e torques finais.', '20000000-0000-0000-0000-000000000008', true, 4, NOW(), NOW()),

-- Task 09 — Simulação Adams (IN_PROGRESS, 7 steps, 3 done)
('30000000-0000-0000-0000-000000000037', 'Importar geometria da suspensão', 'Inserir coordenadas dos pontos de hardpoint no Adams/Car.', '20000000-0000-0000-0000-000000000009', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000038', 'Definir propriedades dos componentes', 'Atribuir massa, inércia e rigidez a cada componente.', '20000000-0000-0000-0000-000000000009', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000039', 'Configurar modelo de pneu', 'Importar modelo PAC2002 dos pneus Hoosier 20x7.5-13.', '20000000-0000-0000-0000-000000000009', true,  3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000040', 'Simular curva de alta velocidade', 'Rodar manobra de curva a 60 km/h e extrair dados de força.', '20000000-0000-0000-0000-000000000009', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000041', 'Analisar variação de cambagem', 'Avaliar variação de cambagem em bump/droop para otimização.', '20000000-0000-0000-0000-000000000009', false, 5, NOW(), NOW()),
('30000000-0000-0000-0000-000000000042', 'Propor ajustes de geometria', 'Sugerir alterações nos hardpoints para melhorar resposta dinâmica.', '20000000-0000-0000-0000-000000000009', false, 6, NOW(), NOW()),
('30000000-0000-0000-0000-000000000043', 'Documentar resultados', 'Compilar relatório com gráficos e recomendações.', '20000000-0000-0000-0000-000000000009', false, 7, NOW(), NOW()),

-- Task 10 — Alinhamento e Cambagem (IN_REVISION, 4 steps, 3 done)
('30000000-0000-0000-0000-000000000044', 'Posicionar veículo na plataforma', 'Nivelar e fixar o carro na plataforma de alinhamento.', '20000000-0000-0000-0000-000000000010', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000045', 'Medir cambagem atual', 'Usar placa de cambagem para medir valores atuais em cada roda.', '20000000-0000-0000-0000-000000000010', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000046', 'Ajustar conforme setup base', 'Realizar ajuste dos tirantes e verificar convergência/divergência.', '20000000-0000-0000-0000-000000000010', true,  3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000047', 'Registrar valores finais', 'Documentar valores de cambagem e toe aprovados.', '20000000-0000-0000-0000-000000000010', false, 4, NOW(), NOW()),

-- Task 11 — Teste Skidpad (NOT_STARTED, 3 steps, 0 done)
('30000000-0000-0000-0000-000000000048', 'Preparar protocolo de teste', 'Definir número de voltas, velocidade alvo e canais de aquisição.', '20000000-0000-0000-0000-000000000011', false, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000049', 'Configurar sistema de telemetria', 'Ativar canais de aceleração lateral, GPS e velocidade das rodas.', '20000000-0000-0000-0000-000000000011', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000050', 'Executar e registrar dados', 'Realizar voltas e salvar arquivos de aquisição para análise.', '20000000-0000-0000-0000-000000000011', false, 3, NOW(), NOW()),

-- Task 12 — Documentação Setup Base (IN_PROGRESS, 6 steps, 2 done)
('30000000-0000-0000-0000-000000000051', 'Compilar parâmetros aprovados em testes', 'Reunir todos os dados de setup validados em pista.', '20000000-0000-0000-0000-000000000012', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000052', 'Organizar planilha de setup base', 'Estruturar planilha com todos os parâmetros por sistema.', '20000000-0000-0000-0000-000000000012', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000053', 'Redigir manual de setup', 'Escrever documento explicativo para uso nos boxes.', '20000000-0000-0000-0000-000000000012', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000054', 'Incluir fotos e diagramas', 'Adicionar imagens ilustrativas para facilitar reprodução.', '20000000-0000-0000-0000-000000000012', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000055', 'Revisão com o líder', 'Revisar documento com Henrique antes de publicar.', '20000000-0000-0000-0000-000000000012', false, 5, NOW(), NOW()),
('30000000-0000-0000-0000-000000000056', 'Publicar no repositório da equipe', 'Fazer upload do documento no Google Drive da equipe.', '20000000-0000-0000-0000-000000000012', false, 6, NOW(), NOW()),

-- Task 13 — Instalação Telemetria v2 (IN_REVISION, 8 steps, 7 done)
('30000000-0000-0000-0000-000000000057', 'Receber e conferir hardware', 'Verificar itens recebidos contra lista de compras.', '20000000-0000-0000-0000-000000000013', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000058', 'Remover módulo antigo', 'Desinstalar hardware de aquisição anterior e preservar cabeamento.', '20000000-0000-0000-0000-000000000013', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000059', 'Instalar novo módulo', 'Fixar novo módulo e conectar ao barramento CAN.', '20000000-0000-0000-0000-000000000013', true,  3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000060', 'Configurar endereços CAN', 'Definir IDs de cada dispositivo no barramento CAN Bus 2.0.', '20000000-0000-0000-0000-000000000013', true,  4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000061', 'Testar comunicação com ECU', 'Verificar troca de mensagens entre módulo e ECU com analisador CAN.', '20000000-0000-0000-0000-000000000013', true,  5, NOW(), NOW()),
('30000000-0000-0000-0000-000000000062', 'Testar aquisição de todos os sensores', 'Confirmar leitura correta de cada canal de sensor conectado.', '20000000-0000-0000-0000-000000000013', true,  6, NOW(), NOW()),
('30000000-0000-0000-0000-000000000063', 'Validar dados em movimento', 'Registrar dados durante deslocamento no pátio e verificar integridade.', '20000000-0000-0000-0000-000000000013', true,  7, NOW(), NOW()),
('30000000-0000-0000-0000-000000000064', 'Aprovar instalação e documentar', 'Gestor aprova instalação e equipe registra configuração final.', '20000000-0000-0000-0000-000000000013', false, 8, NOW(), NOW()),

-- Task 14 — Mapeamento Sensor de Temperatura (IN_PROGRESS, 5 steps, 2 done)
('30000000-0000-0000-0000-000000000065', 'Identificar canal de leitura no módulo', 'Localizar entrada analógica disponível para o sensor NTC.', '20000000-0000-0000-0000-000000000014', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000066', 'Configurar curva de calibração', 'Inserir tabela tensão-temperatura do sensor na ECU.', '20000000-0000-0000-0000-000000000014', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000067', 'Criar canal no dashboard', 'Adicionar widget de temperatura no layout do dashboard.', '20000000-0000-0000-0000-000000000014', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000068', 'Definir limites de alerta', 'Configurar alarmes visuais e sonoros para temperatura crítica.', '20000000-0000-0000-0000-000000000014', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000069', 'Validar em bancada com fonte de calor', 'Aquecer sensor e confirmar leitura correta no dashboard.', '20000000-0000-0000-0000-000000000014', false, 5, NOW(), NOW()),

-- Task 15 — Validação CAN Bus (NOT_STARTED, 4 steps, 0 done)
('30000000-0000-0000-0000-000000000070', 'Mapear todos os dispositivos do barramento', 'Listar IDs e taxas de transmissão de cada nó CAN.', '20000000-0000-0000-0000-000000000015', false, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000071', 'Capturar tráfego com analisador CAN', 'Registrar mensagens com PEAK PCAN-USB e verificar IDs.', '20000000-0000-0000-0000-000000000015', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000072', 'Identificar erros de comunicação', 'Analisar log e identificar colisões ou mensagens ausentes.', '20000000-0000-0000-0000-000000000015', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000073', 'Corrigir e re-validar', 'Aplicar correções e confirmar comunicação estável por 30 minutos.', '20000000-0000-0000-0000-000000000015', false, 4, NOW(), NOW()),

-- Task 16 — Dashboard Tempo Real (IN_PROGRESS, 6 steps, 1 done)
('30000000-0000-0000-0000-000000000074', 'Definir layout e widgets necessários', 'Reunir com equipe e listar dados prioritários a exibir.', '20000000-0000-0000-0000-000000000016', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000075', 'Configurar conexão com módulo de telemetria', 'Implementar recepção dos dados via CAN ou serial no software.', '20000000-0000-0000-0000-000000000016', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000076', 'Desenvolver widgets de dados críticos', 'Criar displays de RPM, temperatura, velocidade e G-forces.', '20000000-0000-0000-0000-000000000016', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000077', 'Implementar alertas visuais', 'Configurar mudança de cor e pop-up para valores fora do range.', '20000000-0000-0000-0000-000000000016', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000078', 'Testar com dados simulados', 'Usar gerador de mensagens CAN para validar todos os widgets.', '20000000-0000-0000-0000-000000000016', false, 5, NOW(), NOW()),
('30000000-0000-0000-0000-000000000079', 'Teste em pista no modo boxes', 'Validar dashboard durante sessão de pista com a equipe.', '20000000-0000-0000-0000-000000000016', false, 6, NOW(), NOW()),

-- Task 17 — Análise de Dados do Teste (DONE, 5 steps, 5 done)
('30000000-0000-0000-0000-000000000080', 'Importar arquivos de aquisição', 'Carregar logs do teste no MoTeC i2 Pro.', '20000000-0000-0000-0000-000000000017', true, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000081', 'Sincronizar dados de GPS e sensores', 'Alinhar temporalmente todos os canais com referência GPS.', '20000000-0000-0000-0000-000000000017', true, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000082', 'Identificar anomalias', 'Filtrar picos e ruídos, identificar eventos fora do padrão.', '20000000-0000-0000-0000-000000000017', true, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000083', 'Gerar relatório de desempenho', 'Compilar gráficos de velocidade, G-force e temperatura por setor.', '20000000-0000-0000-0000-000000000017', true, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000084', 'Apresentar resultados para a equipe', 'Apresentar achados e recomendações em reunião de debriefing.', '20000000-0000-0000-0000-000000000017', true, 5, NOW(), NOW()),

-- Task 18 — Calibração Sensores de Pressão (NOT_STARTED, 4 steps, 0 done)
('30000000-0000-0000-0000-000000000085', 'Separar sensores para calibração', 'Remover sensores de pressão de pneu e freio do veículo.', '20000000-0000-0000-0000-000000000018', false, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000086', 'Conectar ao equipamento de referência', 'Usar calibrador de pressão certificado como referência.', '20000000-0000-0000-0000-000000000018', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000087', 'Gerar curva de calibração', 'Registrar leituras em múltiplos pontos de pressão.', '20000000-0000-0000-0000-000000000018', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000088', 'Atualizar parâmetros na ECU', 'Inserir coeficientes da nova curva na configuração do sistema.', '20000000-0000-0000-0000-000000000018', false, 4, NOW(), NOW()),

-- Task 19 — Banner Londrina (DONE, 3 steps, 3 done)
('30000000-0000-0000-0000-000000000089', 'Criar arte no padrão SAE', 'Desenvolver layout do banner seguindo guia de identidade visual.', '20000000-0000-0000-0000-000000000019', true, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000090', 'Aprovação interna da arte', 'Coletar aprovação do gestor antes de enviar para impressão.', '20000000-0000-0000-0000-000000000019', true, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000091', 'Enviar para impressão e retirar', 'Contratar gráfica, acompanhar prazo e retirar banner.', '20000000-0000-0000-0000-000000000019', true, 3, NOW(), NOW()),

-- Task 20 — Relatório Técnico SAE (IN_PROGRESS, 7 steps, 3 done)
('30000000-0000-0000-0000-000000000092', 'Baixar template SAE 2026', 'Obter template oficial no portal da SAE Brasil.', '20000000-0000-0000-0000-000000000020', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000093', 'Levantar dados técnicos atualizados', 'Compilar massa, potência, dimensões e resultados de cada sistema.', '20000000-0000-0000-0000-000000000020', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000094', 'Redigir seção de aerodinâmica', 'Descrever conceito aerodinâmico e resultados CFD.', '20000000-0000-0000-0000-000000000020', true,  3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000095', 'Redigir seção de dinâmica', 'Descrever geometria de suspensão, setup e resultados de testes.', '20000000-0000-0000-0000-000000000020', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000096', 'Redigir seção de eletrônica', 'Descrever arquitetura do sistema de telemetria.', '20000000-0000-0000-0000-000000000020', false, 5, NOW(), NOW()),
('30000000-0000-0000-0000-000000000097', 'Revisão geral do documento', 'Revisar coerência, formatação e referências bibliográficas.', '20000000-0000-0000-0000-000000000020', false, 6, NOW(), NOW()),
('30000000-0000-0000-0000-000000000098', 'Submeter no portal SAE', 'Fazer upload do PDF final no sistema da SAE Brasil.', '20000000-0000-0000-0000-000000000020', false, 7, NOW(), NOW()),

-- Task 21 — Vídeo Institucional (NOT_STARTED, 5 steps, 0 done)
('30000000-0000-0000-0000-000000000099', 'Elaborar roteiro', 'Escrever script do vídeo destacando diferenciais da equipe.', '20000000-0000-0000-0000-000000000021', false, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000100', 'Agendar sessão de filmagem', 'Definir data, local e equipe responsável pela gravação.', '20000000-0000-0000-0000-000000000021', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000101', 'Realizar gravações', 'Filmar cenas do veículo, oficina e membros da equipe.', '20000000-0000-0000-0000-000000000021', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000102', 'Editar vídeo', 'Montar sequência, inserir trilha e legendas.', '20000000-0000-0000-0000-000000000021', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000103', 'Aprovação e publicação', 'Submeter para aprovação e publicar nos canais da equipe.', '20000000-0000-0000-0000-000000000021', false, 5, NOW(), NOW()),

-- Task 22 — Prospecção de Patrocinadores (IN_PROGRESS, 6 steps, 2 done)
('30000000-0000-0000-0000-000000000104', 'Mapear empresas-alvo', 'Listar empresas do setor automotivo e tecnológico para contato.', '20000000-0000-0000-0000-000000000022', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000105', 'Preparar material de apresentação', 'Atualizar deck de patrocínio com resultados e métricas atuais.', '20000000-0000-0000-0000-000000000022', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000106', 'Enviar proposta inicial por e-mail', 'Disparar e-mails personalizados para contatos das empresas-alvo.', '20000000-0000-0000-0000-000000000022', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000107', 'Fazer follow-up', 'Contatar por telefone ou LinkedIn após 1 semana sem resposta.', '20000000-0000-0000-0000-000000000022', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000108', 'Agendar reuniões com interessados', 'Marcar calls ou reuniões presenciais com leads qualificados.', '20000000-0000-0000-0000-000000000022', false, 5, NOW(), NOW()),
('30000000-0000-0000-0000-000000000109', 'Fechar contratos de patrocínio', 'Assinar termos e registrar patrocinadores no sistema.', '20000000-0000-0000-0000-000000000022', false, 6, NOW(), NOW()),

-- Task 23 — Redes Sociais — Cobertura Testes (IN_REVISION, 4 steps, 3 done)
('30000000-0000-0000-0000-000000000110', 'Fotografar testes em pista', 'Cobrir sessão fotográfica durante dia de testes.', '20000000-0000-0000-0000-000000000023', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000111', 'Gravar vídeos e reels', 'Capturar material em vídeo para stories e reels do Instagram.', '20000000-0000-0000-0000-000000000023', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000112', 'Editar e legendar conteúdo', 'Editar fotos e vídeos e adicionar legendas e hashtags.', '20000000-0000-0000-0000-000000000023', true,  3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000113', 'Publicar e monitorar engajamento', 'Publicar nos canais e acompanhar curtidas, comentários e alcance.', '20000000-0000-0000-0000-000000000023', false, 4, NOW(), NOW()),

-- Task 24 — Reunião com Patrocinadores (NOT_STARTED, 5 steps, 0 done)
('30000000-0000-0000-0000-000000000114', 'Definir pauta e formato do evento', 'Decidir se será presencial ou remoto e listar tópicos da agenda.', '20000000-0000-0000-0000-000000000024', false, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000115', 'Convidar patrocinadores', 'Enviar convites formais com antecedência mínima de 15 dias.', '20000000-0000-0000-0000-000000000024', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000116', 'Preparar apresentação de resultados', 'Montar slides com resultados da temporada e próximos objetivos.', '20000000-0000-0000-0000-000000000024', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000117', 'Realizar o evento', 'Conduzir reunião e registrar presença e feedback.', '20000000-0000-0000-0000-000000000024', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000118', 'Enviar relatório pós-evento', 'Encaminhar agradecimento e resumo do encontro por e-mail.', '20000000-0000-0000-0000-000000000024', false, 5, NOW(), NOW()),

-- Task 25 — Soldagem do Chassi (IN_PROGRESS, 8 steps, 4 done)
('30000000-0000-0000-0000-000000000119', 'Preparar tubos conforme projeto', 'Cortar e escarfar tubos 4130 nas dimensões do projeto.', '20000000-0000-0000-0000-000000000025', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000120', 'Fixar tubos no gabarito', 'Posicionar e pontear tubos no gabarito de soldagem.', '20000000-0000-0000-0000-000000000025', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000121', 'Soldar main hoop', 'Soldar arco principal em TIG com passes de raiz e acabamento.', '20000000-0000-0000-0000-000000000025', true,  3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000122', 'Soldar front bulkhead', 'Soldar antepara dianteira e verificar perpendicularidade.', '20000000-0000-0000-0000-000000000025', true,  4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000123', 'Soldar chassis lateral', 'Soldar longarinas laterais e triangulações.', '20000000-0000-0000-0000-000000000025', false, 5, NOW(), NOW()),
('30000000-0000-0000-0000-000000000124', 'Inspecionar cordões de solda', 'Inspecionar visualmente e com líquido penetrante.', '20000000-0000-0000-0000-000000000025', false, 6, NOW(), NOW()),
('30000000-0000-0000-0000-000000000125', 'Verificar dimensões finais', 'Medir chassi finalizado e comparar com projeto.', '20000000-0000-0000-0000-000000000025', false, 7, NOW(), NOW()),
('30000000-0000-0000-0000-000000000126', 'Registrar e aprovar', 'Fotografar e obter aprovação do gestor para seguir para pintura.', '20000000-0000-0000-0000-000000000025', false, 8, NOW(), NOW()),

-- Task 26 — Revisão Estrutural Pós-Evento (DONE, 5 steps, 5 done)
('30000000-0000-0000-0000-000000000127', 'Inspecionar chassi visualmente', 'Verificar amassados, trincas e deformações visíveis.', '20000000-0000-0000-0000-000000000026', true, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000128', 'Inspecionar suspensão e direção', 'Verificar braços, ball joints e coluna de direção.', '20000000-0000-0000-0000-000000000026', true, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000129', 'Verificar sistema de freios', 'Inspecionar discos, pastilhas e mangueiras de freio.', '20000000-0000-0000-0000-000000000026', true, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000130', 'Documentar não-conformidades', 'Registrar todos os itens que precisam de atenção.', '20000000-0000-0000-0000-000000000026', true, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000131', 'Emitir relatório de revisão', 'Gerar relatório final com status de cada sistema inspecionado.', '20000000-0000-0000-0000-000000000026', true, 5, NOW(), NOW()),

-- Task 27 — Suporte do Extintor (NOT_STARTED, 4 steps, 0 done)
('30000000-0000-0000-0000-000000000132', 'Verificar requisitos do regulamento', 'Consultar seção de segurança do regulamento SAE 2026.', '20000000-0000-0000-0000-000000000027', false, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000133', 'Modelar suporte no CAD', 'Projetar suporte em SolidWorks respeitando envelope de instalação.', '20000000-0000-0000-0000-000000000027', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000134', 'Fabricar em alumínio 6061', 'Usinar ou dobrar chapa conforme projeto aprovado.', '20000000-0000-0000-0000-000000000027', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000135', 'Instalar e verificar acesso rápido', 'Fixar suporte e confirmar que extintor é acessível em menos de 3 segundos.', '20000000-0000-0000-0000-000000000027', false, 4, NOW(), NOW()),

-- Task 28 — Análise de Fadiga (IN_REVISION, 6 steps, 5 done)
('30000000-0000-0000-0000-000000000136', 'Definir perfil de carregamento', 'Estimar cargas de fadiga com base nos dados de telemetria.', '20000000-0000-0000-0000-000000000028', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000137', 'Modelar braço de suspensão no FEA', 'Importar geometria e aplicar condições de contorno no ANSYS.', '20000000-0000-0000-0000-000000000028', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000138', 'Simular carregamento cíclico', 'Rodar análise de fadiga com curva S-N do material.', '20000000-0000-0000-0000-000000000028', true,  3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000139', 'Verificar fator de segurança', 'Avaliar se fator de segurança atende mínimo de 2.0 exigido.', '20000000-0000-0000-0000-000000000028', true,  4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000140', 'Documentar resultados', 'Gerar relatório com gráficos de tensão e vida útil estimada.', '20000000-0000-0000-0000-000000000028', true,  5, NOW(), NOW()),
('30000000-0000-0000-0000-000000000141', 'Aprovação do gestor', 'Submeter relatório para aprovação antes de fabricar peça definitiva.', '20000000-0000-0000-0000-000000000028', false, 6, NOW(), NOW()),

-- Task 29 — Hoop de Proteção (IN_PROGRESS, 5 steps, 2 done)
('30000000-0000-0000-0000-000000000142', 'Verificar requisitos de segurança SAE', 'Consultar seção de roll hoops no regulamento 2026.', '20000000-0000-0000-0000-000000000029', true,  1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000143', 'Calcular resistência estrutural', 'Dimensionar seção do tubo para resistir às cargas de capotamento.', '20000000-0000-0000-0000-000000000029', true,  2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000144', 'Dobrar tubo conforme projeto', 'Dobrar tubo 4130 no ângulo especificado com dobradeira CNC.', '20000000-0000-0000-0000-000000000029', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000145', 'Soldar e inspecionar', 'Soldar hoop ao chassi e inspecionar com líquido penetrante.', '20000000-0000-0000-0000-000000000029', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000146', 'Teste de carga e aprovação', 'Aplicar carga de teste e registrar deformação máxima.', '20000000-0000-0000-0000-000000000029', false, 5, NOW(), NOW()),

-- Task 30 — Documentação Design Event (NOT_STARTED, 7 steps, 0 done)
('30000000-0000-0000-0000-000000000147', 'Baixar template do Design Event SAE', 'Obter template e rubrica de avaliação no portal SAE Brasil.', '20000000-0000-0000-0000-000000000030', false, 1, NOW(), NOW()),
('30000000-0000-0000-0000-000000000148', 'Redigir memorial de cálculo estrutural', 'Documentar cálculos de dimensionamento do chassi e componentes.', '20000000-0000-0000-0000-000000000030', false, 2, NOW(), NOW()),
('30000000-0000-0000-0000-000000000149', 'Incluir resultados de FEA', 'Inserir imagens e gráficos das simulações estruturais realizadas.', '20000000-0000-0000-0000-000000000030', false, 3, NOW(), NOW()),
('30000000-0000-0000-0000-000000000150', 'Documentar processo de soldagem', 'Registrar procedimentos, consumíveis e parâmetros de soldagem.', '20000000-0000-0000-0000-000000000030', false, 4, NOW(), NOW()),
('30000000-0000-0000-0000-000000000151', 'Preparar apresentação oral', 'Montar slides para defesa presencial no Design Event.', '20000000-0000-0000-0000-000000000030', false, 5, NOW(), NOW()),
('30000000-0000-0000-0000-000000000152', 'Revisão com orientador', 'Revisar documento e apresentação com professor orientador.', '20000000-0000-0000-0000-000000000030', false, 6, NOW(), NOW()),
('30000000-0000-0000-0000-000000000153', 'Submeter documentação no portal', 'Fazer upload do PDF final dentro do prazo estabelecido.', '20000000-0000-0000-0000-000000000030', false, 7, NOW(), NOW());