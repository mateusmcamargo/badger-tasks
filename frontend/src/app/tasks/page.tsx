'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, UserPlus, AlertCircle, Activity, Plus, ScanEye, Flag, BookmarkCheck, ListTodo, ListChecks, Grip, ListX, ClockCheck, User } from 'lucide-react';

import styles from './tasks.module.scss';
import { Task } from '@/types/Task';

export default function TasksPage() {
    const [tasks, setTasks]           = useState<Task[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        const tasks: Task[] = [
            {
                id: '1', createdAt: '2026-04-01T08:00:00Z', updatedAt: '2026-04-20T10:00:00Z',
                name: 'Refazer Flap da Asa Dianteira',
                description: 'Manufaturar novo flap com inclinação entre 2 e 4 graus para otimizar downforce na entrada das curvas.',
                status: 'IN_PROGRESS', active: true, dateLimit: '2026-05-20T00:00:00Z',
                category:   { id: 'c1', name: 'Manufatura',     description: 'Construção e testes de peças',         createdAt: 'x', updatedAt: 'x' },
                area:       { id: 'a1', name: 'AERODYNAMICS',   description: 'Aerodinâmica e manobrabilidade.',       createdAt: 'x', updatedAt: 'x' },
                leader:     { id: 'u1', name: 'João Ferreira',  ra: '1111111', email: 'joao@alunos.utfpr.edu.br',    role: { id: 'r3', name: 'LEADER',   description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a1', name: 'AERODYNAMICS', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                manager:    { id: 'u2', name: 'Marta Oliveira', ra: '2222222', email: 'marta@alunos.utfpr.edu.br',   role: { id: 'r2', name: 'MANAGER',  description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a1', name: 'AERODYNAMICS', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                assignedTo: [
                    { "id": "u7", "name": "Carlos Mendes",   "ra": "7777777", "email": "carlos@alunos.utfpr.edu.br",  "role": { "id": "r4", "name": "MEMBER", "description": "", "createdAt": "x", "updatedAt": "x" }, "area": { "id": "a1", "name": "AERODYNAMICS", "description": "", "createdAt": "x", "updatedAt": "x" }, photoUrl: "https://i.scdn.co/image/ab6761610000e5eb5d2dd9588d60e40a1e299dae", "createdAt": "x", "updatedAt": "x" },
                    { "id": "u8", "name": "Fernanda Castro", "ra": "8888888", "email": "fernanda@alunos.utfpr.edu.br", "role": { "id": "r4", "name": "MEMBER", "description": "", "createdAt": "x", "updatedAt": "x" }, "area": { "id": "a2", "name": "DYNAMICS",     "description": "", "createdAt": "x", "updatedAt": "x" }, "createdAt": "x", "updatedAt": "x" },
                    { "id": "u9", "name": "Thiago Ribeiro",  "ra": "9999999", "email": "thiago@alunos.utfpr.edu.br",  "role": { "id": "r4", "name": "MEMBER", "description": "", "createdAt": "x", "updatedAt": "x" }, "area": { "id": "a3", "name": "TELEMETRY",   "description": "", "createdAt": "x", "updatedAt": "x" }, "createdAt": "x", "updatedAt": "x" }
                ],
                steps: [
                    { id: 's1', name: 'Modelagem CAD do flap',         description: 'Modelar geometria no Catia',       done: true,  priority: 0, createdAt: 'x', updatedAt: 'x' },
                    { id: 's2', name: 'Corte da fibra de carbono',     description: 'Cortar laminado conforme template',done: true,  priority: 1, createdAt: 'x', updatedAt: 'x' },
                    { id: 's3', name: 'Laminação e cura',              description: 'Autoclave por 4h a 120°C',         done: false, priority: 2, createdAt: 'x', updatedAt: 'x' },
                ],
            },
            {
                id: '2', createdAt: '2026-04-03T08:00:00Z', updatedAt: '2026-04-22T10:00:00Z',
                name: 'Calibração dos Amortecedores Traseiros',
                description: 'Ajustar dureza e rebote dos amortecedores traseiros para o perfil do circuito de Curitiba.',
                status: 'NOT_STARTED', active: true, dateLimit: '2026-05-28T00:00:00Z',
                category:   { id: 'c2', name: 'Setup',          description: 'Ajustes e calibrações do chassi',       createdAt: 'x', updatedAt: 'x' },
                area:       { id: 'a2', name: 'DYNAMICS',        description: 'Dinâmica e comportamento do veículo.',  createdAt: 'x', updatedAt: 'x' },
                leader:     { id: 'u3', name: 'Rafael Souza',    ra: '3333333', email: 'rafael@alunos.utfpr.edu.br',  role: { id: 'r3', name: 'LEADER',  description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a2', name: 'DYNAMICS', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                manager:    { id: 'u2', name: 'Marta Oliveira',  ra: '2222222', email: 'marta@alunos.utfpr.edu.br',   role: { id: 'r2', name: 'MANAGER', description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a2', name: 'DYNAMICS', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                assignedTo: [],
                steps: [
                    { id: 's4', name: 'Levantamento de dados da pista', description: 'Coletar logs do evento anterior',  done: false, priority: 0, createdAt: 'x', updatedAt: 'x' },
                    { id: 's5', name: 'Definir range de ajuste',        description: 'Calcular compressão ideal',        done: false, priority: 1, createdAt: 'x', updatedAt: 'x' },
                ],
            },
            {
                id: '3', createdAt: '2026-04-05T08:00:00Z', updatedAt: '2026-05-01T10:00:00Z',
                name: 'Instalação do Sistema de Telemetria v2',
                description: 'Substituir módulo de aquisição de dados pelo novo hardware com suporte a CAN Bus 2.0.',
                status: 'IN_REVISION', active: true, dateLimit: '2026-05-18T00:00:00Z',
                category:   { id: 'c3', name: 'Eletrônica',     description: 'Sistemas elétricos e eletrônicos',       createdAt: 'x', updatedAt: 'x' },
                area:       { id: 'a3', name: 'TELEMETRY',       description: 'Aquisição e análise de dados.',          createdAt: 'x', updatedAt: 'x' },
                leader:     { id: 'u4', name: 'Lucas Prado',     ra: '4444444', email: 'lucas@alunos.utfpr.edu.br',    role: { id: 'r3', name: 'LEADER',  description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a3', name: 'TELEMETRY', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                manager:    { id: 'u2', name: 'Marta Oliveira',  ra: '2222222', email: 'marta@alunos.utfpr.edu.br',    role: { id: 'r2', name: 'MANAGER', description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a3', name: 'TELEMETRY', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                assignedTo: [],
                steps: [
                    { id: 's6', name: 'Remoção do módulo antigo',   description: 'Desconectar harness e remover ECU',   done: true,  priority: 0, createdAt: 'x', updatedAt: 'x' },
                    { id: 's7', name: 'Montagem do novo módulo',    description: 'Fixar e conectar novo hardware',       done: true,  priority: 1, createdAt: 'x', updatedAt: 'x' },
                    { id: 's8', name: 'Configuração de canais CAN', description: 'Mapear sensores no software',          done: true,  priority: 2, createdAt: 'x', updatedAt: 'x' },
                    { id: 's9', name: 'Validação em bancada',       description: 'Verificar leituras com carro parado',  done: false, priority: 3, createdAt: 'x', updatedAt: 'x' },
                ],
            },
            {
                id: '4', createdAt: '2026-03-20T08:00:00Z', updatedAt: '2026-04-30T10:00:00Z',
                name: 'Confecção do Banner para a Etapa de Londrina',
                description: 'Criar e imprimir banner da equipe no padrão da SAE Brasil para exposição no paddock.',
                status: 'DONE', active: false, dateLimit: '2026-04-28T00:00:00Z',
                category:   { id: 'c4', name: 'Design',          description: 'Identidade visual e materiais gráficos', createdAt: 'x', updatedAt: 'x' },
                area:       { id: 'a4', name: 'MARKETING',        description: 'Comunicação e imagem da equipe.',        createdAt: 'x', updatedAt: 'x' },
                leader:     { id: 'u5', name: 'Ana Clara Lima',   ra: '5555555', email: 'anaclara@alunos.utfpr.edu.br', role: { id: 'r3', name: 'LEADER',  description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a4', name: 'MARKETING', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                manager:    { id: 'u2', name: 'Marta Oliveira',   ra: '2222222', email: 'marta@alunos.utfpr.edu.br',    role: { id: 'r2', name: 'MANAGER', description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a4', name: 'MARKETING', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                assignedTo: [],
                steps: [
                    { id: 's10', name: 'Briefing com o capitão',  description: 'Definir dimensões e conteúdo',          done: true,  priority: 0, createdAt: 'x', updatedAt: 'x' },
                    { id: 's11', name: 'Criação no Illustrator',  description: 'Arte final em vetor',                   done: true,  priority: 1, createdAt: 'x', updatedAt: 'x' },
                    { id: 's12', name: 'Envio para gráfica',      description: 'Aprovação e pedido de impressão',       done: true,  priority: 2, createdAt: 'x', updatedAt: 'x' },
                ],
            },
            {
                id: '5', createdAt: '2026-04-10T08:00:00Z', updatedAt: '2026-04-25T10:00:00Z',
                name: 'Reparo da Estrutura do Chassi — Seção Traseira',
                description: 'Soldar reforço nos tubos da seção traseira após inspeção identificar fadiga no material.',
                status: 'IN_PROGRESS', active: true, dateLimit: '2026-05-22T00:00:00Z',
                category:   { id: 'c5', name: 'Soldagem',        description: 'Processos de soldagem e metalurgia',     createdAt: 'x', updatedAt: 'x' },
                area:       { id: 'a5', name: 'STRUCTURE',        description: 'Chassi e integridade estrutural.',       createdAt: 'x', updatedAt: 'x' },
                leader:     { id: 'u6', name: 'Pedro Almeida',    ra: '6666666', email: 'pedro@alunos.utfpr.edu.br',    role: { id: 'r3', name: 'LEADER',  description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a5', name: 'STRUCTURE', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                manager:    { id: 'u2', name: 'Marta Oliveira',   ra: '2222222', email: 'marta@alunos.utfpr.edu.br',    role: { id: 'r2', name: 'MANAGER', description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a5', name: 'STRUCTURE', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                assignedTo: [],
                steps: [
                    { id: 's13', name: 'Inspeção por ultrassom',    description: 'Mapear extensão da fadiga',            done: true,  priority: 0, createdAt: 'x', updatedAt: 'x' },
                    { id: 's14', name: 'Corte e preparação',        description: 'Remover material comprometido',        done: true,  priority: 1, createdAt: 'x', updatedAt: 'x' },
                    { id: 's15', name: 'Soldagem TIG',              description: 'Soldar reforço em aço 4130',           done: false, priority: 2, createdAt: 'x', updatedAt: 'x' },
                    { id: 's16', name: 'Inspeção pós-solda',        description: 'Verificar cordão e geometria',         done: false, priority: 3, createdAt: 'x', updatedAt: 'x' },
                ],
            },
            {
                id: '6', createdAt: '2026-04-12T08:00:00Z', updatedAt: '2026-04-26T10:00:00Z',
                name: 'Análise CFD do Difusor Traseiro',
                description: 'Simular escoamento no difusor atual e propor geometria otimizada para reduzir arrasto.',
                status: 'NOT_STARTED', active: true, dateLimit: '2026-06-05T00:00:00Z',
                category:   { id: 'c6', name: 'Simulação',       description: 'CFD e análise computacional',             createdAt: 'x', updatedAt: 'x' },
                area:       { id: 'a1', name: 'AERODYNAMICS',    description: 'Aerodinâmica e manobrabilidade.',          createdAt: 'x', updatedAt: 'x' },
                leader:     { id: 'u1', name: 'João Ferreira',   ra: '1111111', email: 'joao@alunos.utfpr.edu.br',       role: { id: 'r3', name: 'LEADER',  description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a1', name: 'AERODYNAMICS', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                manager:    { id: 'u2', name: 'Marta Oliveira',  ra: '2222222', email: 'marta@alunos.utfpr.edu.br',      role: { id: 'r2', name: 'MANAGER', description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a1', name: 'AERODYNAMICS', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                assignedTo: [],
                steps: [
                    { id: 's17', name: 'Importar geometria CAD',    description: 'Preparar malha no ANSYS',              done: false, priority: 0, createdAt: 'x', updatedAt: 'x' },
                ],
            },
            {
                id: '7', createdAt: '2026-04-08T08:00:00Z', updatedAt: '2026-04-29T10:00:00Z',
                name: 'Atualização do Relatório Técnico para a SAE',
                description: 'Revisar e atualizar o relatório técnico com dados da temporada atual conforme template da SAE Brasil 2026.',
                status: 'IN_PROGRESS', active: true, dateLimit: '2026-05-30T00:00:00Z',
                category:   { id: 'c7', name: 'Documentação',    description: 'Relatórios e registros técnicos',         createdAt: 'x', updatedAt: 'x' },
                area:       { id: 'a4', name: 'MARKETING',        description: 'Comunicação e imagem da equipe.',         createdAt: 'x', updatedAt: 'x' },
                leader:     { id: 'u5', name: 'Ana Clara Lima',   ra: '5555555', email: 'anaclara@alunos.utfpr.edu.br',  role: { id: 'r3', name: 'LEADER',  description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a4', name: 'MARKETING', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                manager:    { id: 'u2', name: 'Marta Oliveira',   ra: '2222222', email: 'marta@alunos.utfpr.edu.br',     role: { id: 'r2', name: 'MANAGER', description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a4', name: 'MARKETING', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                assignedTo: [],
                steps: [
                    { id: 's18', name: 'Coletar dados de desempenho', description: 'Reunir logs e resultados dos testes', done: true,  priority: 0, createdAt: 'x', updatedAt: 'x' },
                    { id: 's19', name: 'Redigir seções técnicas',     description: 'Motor, chassi e aero',                done: false, priority: 1, createdAt: 'x', updatedAt: 'x' },
                    { id: 's20', name: 'Revisão do capitão',          description: 'Aprovação final antes do envio',      done: false, priority: 2, createdAt: 'x', updatedAt: 'x' },
                ],
            },
            {
                id: '8', createdAt: '2026-03-15T08:00:00Z', updatedAt: '2026-04-10T10:00:00Z',
                name: 'Troca dos Rolamentos da Suspensão Dianteira',
                description: 'Substituir rolamentos desgastados dos braços de suspensão dianteiros detectados na revisão pós-evento.',
                status: 'DONE', active: false, dateLimit: '2026-04-15T00:00:00Z',
                category:   { id: 'c8', name: 'Manutenção',      description: 'Revisão e troca de componentes',          createdAt: 'x', updatedAt: 'x' },
                area:       { id: 'a2', name: 'DYNAMICS',         description: 'Dinâmica e comportamento do veículo.',    createdAt: 'x', updatedAt: 'x' },
                leader:     { id: 'u3', name: 'Rafael Souza',     ra: '3333333', email: 'rafael@alunos.utfpr.edu.br',    role: { id: 'r3', name: 'LEADER',  description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a2', name: 'DYNAMICS', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                manager:    { id: 'u2', name: 'Marta Oliveira',   ra: '2222222', email: 'marta@alunos.utfpr.edu.br',     role: { id: 'r2', name: 'MANAGER', description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a2', name: 'DYNAMICS', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                assignedTo: [],
                steps: [
                    { id: 's21', name: 'Desmontagem da suspensão',  description: 'Remover braços e pivôs',               done: true,  priority: 0, createdAt: 'x', updatedAt: 'x' },
                    { id: 's22', name: 'Prensagem dos rolamentos',  description: 'Instalar novos rolamentos SKF',         done: true,  priority: 1, createdAt: 'x', updatedAt: 'x' },
                ],
            },
            {
                id: '9', createdAt: '2026-04-15T08:00:00Z', updatedAt: '2026-04-28T10:00:00Z',
                name: 'Mapeamento do Sensor de Temperatura do Motor',
                description: 'Configurar canal de leitura do sensor NTC no dashboard de telemetria e definir limites de alerta.',
                status: 'IN_REVISION', active: true, dateLimit: '2026-05-16T00:00:00Z',
                category:   { id: 'c3', name: 'Eletrônica',      description: 'Sistemas elétricos e eletrônicos',        createdAt: 'x', updatedAt: 'x' },
                area:       { id: 'a3', name: 'TELEMETRY',        description: 'Aquisição e análise de dados.',           createdAt: 'x', updatedAt: 'x' },
                leader:     { id: 'u4', name: 'Lucas Prado',      ra: '4444444', email: 'lucas@alunos.utfpr.edu.br',     role: { id: 'r3', name: 'LEADER',  description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a3', name: 'TELEMETRY', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                manager:    { id: 'u2', name: 'Marta Oliveira',   ra: '2222222', email: 'marta@alunos.utfpr.edu.br',     role: { id: 'r2', name: 'MANAGER', description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a3', name: 'TELEMETRY', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                assignedTo: [],
                steps: [
                    { id: 's23', name: 'Identificar pino no harness',  description: 'Rastrear fio no diagrama elétrico',  done: true,  priority: 0, createdAt: 'x', updatedAt: 'x' },
                    { id: 's24', name: 'Configurar canal no MoTeC',    description: 'Definir unidade e escala de leitura',done: true,  priority: 1, createdAt: 'x', updatedAt: 'x' },
                    { id: 's25', name: 'Validar leitura em bancada',   description: 'Comparar com termômetro de referência',done: false,priority: 2, createdAt: 'x', updatedAt: 'x' },
                ],
            },
            {
                id: '10', createdAt: '2026-04-18T08:00:00Z', updatedAt: '2026-05-02T10:00:00Z',
                name: 'Produção do Vídeo de Apresentação da Equipe',
                description: 'Gravar e editar vídeo institucional de 2 minutos para captação de patrocinadores na temporada 2026.',
                status: 'NOT_STARTED', active: true, dateLimit: '2026-06-10T00:00:00Z',
                category:   { id: 'c4', name: 'Design',           description: 'Identidade visual e materiais gráficos', createdAt: 'x', updatedAt: 'x' },
                area:       { id: 'a4', name: 'MARKETING',         description: 'Comunicação e imagem da equipe.',        createdAt: 'x', updatedAt: 'x' },
                leader:     { id: 'u5', name: 'Ana Clara Lima',    ra: '5555555', email: 'anaclara@alunos.utfpr.edu.br', role: { id: 'r3', name: 'LEADER',  description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a4', name: 'MARKETING', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                manager:    { id: 'u2', name: 'Marta Oliveira',    ra: '2222222', email: 'marta@alunos.utfpr.edu.br',    role: { id: 'r2', name: 'MANAGER', description: '', createdAt: 'x', updatedAt: 'x' }, area: { id: 'a4', name: 'MARKETING', description: '', createdAt: 'x', updatedAt: 'x' }, createdAt: 'x', updatedAt: 'x' },
                assignedTo: [],
                steps: [
                    { id: 's26', name: 'Roteiro e storyboard',     description: 'Definir cenas e narrativa',              done: false, priority: 0, createdAt: 'x', updatedAt: 'x' },
                    { id: 's27', name: 'Dia de gravação na oficina',description: 'Gravar cenas do carro e da equipe',     done: false, priority: 1, createdAt: 'x', updatedAt: 'x' },
                    { id: 's28', name: 'Edição e trilha',          description: 'Montagem no Premiere com trilha sonora', done: false, priority: 2, createdAt: 'x', updatedAt: 'x' },
                    { id: 's29', name: 'Aprovação e publicação',   description: 'Revisão final e upload no YouTube',      done: false, priority: 3, createdAt: 'x', updatedAt: 'x' },
                ],
            },
        ];

        setTimeout(() => {
            setTasks(tasks);
            setLoading(false);
        }, 800);
    }, []);

    const handleAssignTask = async (taskId: string) => {
        alert(`Associação da tarefa ${taskId} realizada com sucesso!`);
    };

    const filteredTasks = tasks.filter(t => statusFilter === 'ALL' || t.status === statusFilter);

    function statusLabel(status: Task['status']) {
        if (status === 'DONE')        return 'Concluída';
        if (status === 'IN_PROGRESS') return 'Em Progresso';
        if (status === 'IN_REVISION') return 'Em Revisão';
        return 'Pendente';
    }

    function statusClass(status: Task['status']) {
        if (status === 'DONE')        return styles.done;
        if (status === 'IN_PROGRESS') return styles.inProgress;
        if (status === 'IN_REVISION') return styles.inRevision;
        return styles.notStarted;
    }

    type TaskCardProps = {
        task: Task;
        statusLabel: (s: Task['status']) => string;
        statusClass:  (s: Task['status']) => string;
        handleAssignTask: (id: string) => void;
        viewMode?: 'column' | 'grid';
    }

    const counts = {
        ALL:         tasks.length,
        NOT_STARTED: tasks.filter(t => t.status === 'NOT_STARTED').length,
        IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        IN_REVISION: tasks.filter(t => t.status === 'IN_REVISION').length,
        DONE:        tasks.filter(t => t.status === 'DONE').length,
    };

    const columnIcon: Record<Task['status'], React.ReactNode> = {
        NOT_STARTED: <AlertCircle strokeWidth={3}/>,
        IN_PROGRESS: <Activity strokeWidth={3}/>,
        IN_REVISION: <Flag strokeWidth={3}/>,
        DONE:        <CheckCircle strokeWidth={3}/>,
    };

    function TaskCard({ task, statusLabel, statusClass, handleAssignTask, viewMode}: TaskCardProps) {
        return (
            <div className={styles.task}>
                <div className={styles.taskHeader}>
                    <div>
                        {viewMode === 'grid' && (
                            <span className={`${styles.statusBadge} ${statusClass(task.status)}`}>
                            {statusLabel(task.status)}
                        </span>
                        )}
                        {task.active && (
                            <span className={styles.activeBadge}>
                                <BookmarkCheck/>
                                Ativa
                            </span>
                        )}
                    </div>
                    
                    {viewMode === 'column' &&
                    <div className={styles.actions}>
                        <Grip/>
                    </div>
                    }
                </div>

                <div className={styles.taskMain}>
                    <div className={styles.taskInfo}>
                        <h3>{task.name}</h3>
                        <p>{task.description}</p>
                    </div>

                    <div className={styles.taskBadges}>
                        <p className={styles.taskBadge}>{task.area.name}</p>
                        <p className={styles.taskBadge}>{task.category.name}</p>
                    </div>
                        
                    <div className={styles.taskSteps}>
                        {task.status === 'DONE' ? (
                            <p className={styles.taskStepsCounter}>
                                <ListChecks strokeWidth={3}/>
                                {`Todos os passos concluídos`}
                            </p>
                        ) : task.status === 'IN_REVISION' ? (
                            <p className={styles.taskStepsCounter}>
                                <ClockCheck strokeWidth={3}/>
                                {`Em Revisão`}
                            </p>
                        ) : (
                            task.steps.filter(step => step.done).length > 0 ? (
                                <p className={styles.taskStepsCounter}>
                                    <ListTodo strokeWidth={3}/>
                                    {`${task.steps.filter(step => step.done).length} de ${task.steps.length} passos concluídos`}
                                </p>
                            ) : (
                                <p className={styles.taskStepsCounter}>
                                    <ListX strokeWidth={3}/>
                                    {`Não iniciada`}
                                </p>
                            )
                        )}
                    </div>

                    <div className={styles.taskUsers}>
                        {task.assignedTo.length > 0 ? (
                            task.assignedTo.map(user => (
                                <div key={user.id} className={styles.userAvatar} title={user.name}>
                                    {user.photoUrl ? (
                                        <img
                                            src={user.photoUrl}
                                            alt={user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                        />
                                    ) : (
                                        <span>{user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>Nenhum membro atribuído</p>
                        )}
                    </div>
                </div>
                
                <div className={styles.taskFooter}>
                    <span className={styles.taskDateLimit}>
                        Prazo: {task.dateLimit ? new Date(task.dateLimit).toLocaleDateString('pt-BR') : 'Sem prazo estipulado'}
                    </span>
                    {task.status !== 'DONE' && (
                        <button
                            onClick={() => handleAssignTask(task.id)}
                            className={styles.taskAssignButton}
                        >
                            <UserPlus/>
                            Assumir
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.tasks}>

            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.headerBranding}>
                        <img src="/badger-tasks-logo-light.png" alt="Badger Tasks"/>
                    </div>
                    <div className={styles.searchWrapper}>
                        <Search/>
                        <input
                            type="text"
                            placeholder="Buscar tarefas..."
                            autoComplete="off"
                        />
                    </div>
                    <button className={styles.headerUser}>
                        <User strokeWidth={3}/>
                    </button>
                </div>

                <div className={styles.filters}>
                    {loading ? (
                        <div className={styles.loadingFilters}>
                            <div className={styles.spinner}/>
                            <p>Carregando filtros...</p>
                        </div>
                    ) : (
                        <>
                        <button
                            onClick={() => setStatusFilter('ALL')}
                            className={`${styles.chip} ${styles.all} ${statusFilter === 'ALL' ? styles.active : ''}`}
                        >
                            <ScanEye strokeWidth={3}/>
                            Todas ({counts.ALL})
                        </button>
                        <button
                            onClick={() => setStatusFilter('NOT_STARTED')}
                            className={`${styles.chip} ${styles.notStarted} ${statusFilter === 'NOT_STARTED' ? styles.active : ''}`}
                        >
                            <AlertCircle strokeWidth={3}/>
                            Pendentes ({counts.NOT_STARTED})
                        </button>
                        <button
                            onClick={() => setStatusFilter('IN_PROGRESS')}
                            className={`${styles.chip} ${styles.inProgress} ${statusFilter === 'IN_PROGRESS' ? styles.active : ''}`}
                        >
                            <Activity strokeWidth={3}/>
                            Em Progresso ({counts.IN_PROGRESS})
                        </button>
                        <button
                            onClick={() => setStatusFilter('IN_REVISION')}
                            className={`${styles.chip} ${styles.inRevision} ${statusFilter === 'IN_REVISION' ? styles.active : ''}`}
                        >
                            <Flag strokeWidth={3}/>
                            Em revisão ({counts.IN_REVISION})
                        </button>
                        <button
                            onClick={() => setStatusFilter('DONE')}
                            className={`${styles.chip} ${styles.done} ${statusFilter === 'DONE' ? styles.active : ''}`}
                        >
                            <CheckCircle strokeWidth={3}/>
                            Concluídas ({counts.DONE})
                        </button>
                        </>
                    )}
                </div>
            </header>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Carregando tarefas...</p>
                </div>
            ) : (
                <>
                <main className={`${styles.main} ${statusFilter === 'ALL' ? styles.column : styles.grid}`}>
                    {statusFilter === 'ALL' ? (
                        <div className={styles.columns}>
                            {(['NOT_STARTED', 'IN_PROGRESS', 'IN_REVISION', 'DONE'] as Task['status'][]).map(status => (
                                <div key={status} className={styles.column}>
                                    <div className={`${styles.columnHeader} ${statusClass(status)}`}>
                                        {columnIcon[status]}
                                        {statusLabel(status)}
                                    </div>
                                    <div className={styles.columnTasks}>
                                        {tasks.filter(t => t.status === status).length === 0 ? (
                                            <div className={styles.columnEmpty}>
                                                <p>Nenhuma tarefa</p>
                                            </div>
                                        ) : (
                                            tasks.filter(t => t.status === status).map(task => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    statusLabel={statusLabel}
                                                    statusClass={statusClass}
                                                    handleAssignTask={handleAssignTask}
                                                    viewMode={'column'}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className={styles.empty}>
                            <p>Nenhuma tarefa encontrada.</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                statusLabel={statusLabel}
                                statusClass={statusClass}
                                handleAssignTask={handleAssignTask}
                                viewMode='grid'
                            />
                        ))
                    )}
                </main>

                <div className={styles.addTask}>
                    <button aria-label="Nova tarefa">
                        <Plus strokeWidth={3}/>
                    </button>
                </div>
                </>
            )}
        </div>
    );
}