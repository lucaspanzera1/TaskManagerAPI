// Configuração da API
const baseUrl = window.location.origin.includes('localhost')
  ? 'http://localhost:3000/api'
  : 'https://taskmanagerapi-production-ad12.up.railway.app/api';

const API_URL = `${baseUrl}/tarefas`;


// Elementos do DOM
const tasksList = document.getElementById('tasks-list');
const taskForm = document.getElementById('task-form');
const formTitle = document.getElementById('form-title');
const taskIdInput = document.getElementById('task-id');
const tituloInput = document.getElementById('titulo');
const descricaoInput = document.getElementById('descricao');
const statusInput = document.getElementById('status');
const prioridadeInput = document.getElementById('prioridade');
const dataVencimentoInput = document.getElementById('data_vencimento');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const newTaskBtn = document.getElementById('new-task-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Verificação de autenticação no início do app.js
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'auth.html';
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'auth.html';
    });
}

// Função auxiliar para criar headers com autenticação
function getAuthHeaders(includeContentType = false) {
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    
    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }
    
    return headers;
}

// Função auxiliar para tratar respostas não autorizadas
function handleUnauthorized() {
    alert('Sessão expirada. Faça login novamente.');
    localStorage.removeItem('token');
    window.location.href = 'auth.html';
}

// Estado da aplicação
let currentFilter = 'todos';
let editing = false;
let tasks = [];

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
    // Definir data mínima como hoje para o input de data
    const today = new Date().toISOString().split('T')[0];
    dataVencimentoInput.setAttribute('min', today);
});

function setupEventListeners() {
    taskForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    newTaskBtn.addEventListener('click', showNewTaskForm);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const status = e.target.closest('.filter-btn').dataset.status;
            setActiveFilter(status);
            if (status === 'todos') {
                renderTasks(tasks);
            } else {
                const filteredTasks = tasks.filter(task => task.status === status);
                renderTasks(filteredTasks);
            }
        });
    });
}

// Carrega tarefas da API
async function loadTasks() {
    try {
        showLoading(true);

        const response = await fetch(API_URL, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }
            throw new Error('Erro ao carregar tarefas');
        }

        const data = await response.json();
        tasks = data.data || [];
        renderTasks(tasks);
    } catch (error) {
        console.error('Erro:', error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

function showLoading(isLoading) {
    if (isLoading) {
        tasksList.innerHTML = '<p id="loading-message"><i class="fas fa-spinner fa-spin"></i> Carregando tarefas...</p>';
    }
}

function showError(message) {
    tasksList.innerHTML = `
        <div class="empty-tasks">
            <i class="fas fa-exclamation-circle"></i>
            <p>Erro ao carregar tarefas: ${message}</p>
        </div>
    `;
}

function showEmptyState() {
    tasksList.innerHTML = `
        <div class="empty-tasks">
            <i class="fas fa-clipboard-check"></i>
            <p>Nenhuma tarefa encontrada. Crie uma nova tarefa!</p>
        </div>
    `;
}

// Renderiza tarefas na interface
function renderTasks(tasksToRender) {
    if (!tasksToRender || tasksToRender.length === 0) {
        showEmptyState();
        return;
    }
    
    tasksList.innerHTML = '';
    
    // Ordenar tarefas: primeiro por prioridade (alta > média > baixa), depois por data de vencimento
    const sortedTasks = [...tasksToRender].sort((a, b) => {
        // Mapear prioridades para valores numéricos
        const priorityValues = { 'alta': 3, 'media': 2, 'baixa': 1 };
        
        // Ordenar por prioridade (decrescente)
        const priorityDiff = priorityValues[b.prioridade] - priorityValues[a.prioridade];
        
        if (priorityDiff !== 0) {
            return priorityDiff;
        }
        
        // Em caso de mesma prioridade, ordenar por data de vencimento (crescente)
        const dateA = a.data_vencimento ? new Date(a.data_vencimento) : new Date(9999, 11, 31);
        const dateB = b.data_vencimento ? new Date(b.data_vencimento) : new Date(9999, 11, 31);
        
        return dateA - dateB;
    });
    
    sortedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });
}

// Cria elemento HTML para uma tarefa
function createTaskElement(task) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.id = `task-${task.id}`;
    
    // Verificar se a tarefa está próxima do vencimento (até 2 dias)
    let isUrgent = false;
    let isDue = false;
    
    if (task.data_vencimento) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dueDate = new Date(task.data_vencimento);
        dueDate.setHours(0, 0, 0, 0);
        
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        isUrgent = diffDays <= 2 && diffDays >= 0 && task.status !== 'concluida';
        isDue = diffDays < 0 && task.status !== 'concluida';
    }
    
    // Definir ícones baseados no status
    const statusIcons = {
        'pendente': 'fas fa-clock',
        'em_andamento': 'fas fa-spinner fa-pulse',
        'concluida': 'fas fa-check-circle'
    };
    
    // Definir ícones baseados na prioridade
    const priorityIcons = {
        'baixa': 'fas fa-angle-down',
        'media': 'fas fa-equals',
        'alta': 'fas fa-angle-up'
    };
    
    // Formatar data se existir
    let formattedDate = '';
    let dueText = '';
    
    if (task.data_vencimento) {
        const date = new Date(task.data_vencimento);
        formattedDate = date.toLocaleDateString('pt-BR');
        
        if (isDue) {
            dueText = '<span style="color: var(--high-priority); font-weight: 500;"> (Atrasada)</span>';
        } else if (isUrgent) {
            dueText = '<span style="color: var(--medium-priority); font-weight: 500;"> (Urgente)</span>';
        }
    }
    
    taskCard.innerHTML = `
        <h3>${task.titulo}</h3>
        <div class="task-description">${task.descricao || 'Sem descrição'}</div>
        <div class="task-meta">
            <span class="status-badge status-${task.status}">
                <i class="${statusIcons[task.status]}"></i>
                ${formatStatus(task.status)}
            </span>
            <span class="priority-badge priority-${task.prioridade}">
                <i class="${priorityIcons[task.prioridade]}"></i>
                ${formatPriority(task.prioridade)}
            </span>
        </div>
        <div class="task-date">
            <i class="fas fa-calendar-day"></i>
            ${formattedDate ? `Vencimento: ${formattedDate}${dueText}` : 'Sem data de vencimento'}
        </div>
        <div class="task-actions">
            <button class="edit-btn tooltip" data-tooltip="Editar tarefa" data-id="${task.id}">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="delete-btn tooltip" data-tooltip="Excluir tarefa" data-id="${task.id}">
                <i class="fas fa-trash-alt"></i> Excluir
            </button>
        </div>
    `;
    
    // Adicionar classes especiais para destaque visual
    if (isUrgent) {
        taskCard.style.borderLeft = '4px solid var(--medium-priority)';
    } else if (isDue) {
        taskCard.style.borderLeft = '4px solid var(--high-priority)';
    } else if (task.status === 'concluida') {
        taskCard.style.borderLeft = '4px solid var(--completed-color)';
    }
    
    // Adicionar event listeners para os botões
    const editBtn = taskCard.querySelector('.edit-btn');
    const deleteBtn = taskCard.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => editTask(task));
    deleteBtn.addEventListener('click', () => confirmDeleteTask(task.id));
    
    return taskCard;
}

// Formatar texto do status
function formatStatus(status) {
    switch (status) {
        case 'pendente': return 'Pendente';
        case 'em_andamento': return 'Em andamento';
        case 'concluida': return 'Concluída';
        default: return status;
    }
}

// Formatar texto da prioridade
function formatPriority(priority) {
    switch (priority) {
        case 'baixa': return 'Baixa';
        case 'media': return 'Média';
        case 'alta': return 'Alta';
        default: return priority;
    }
}

// Mostra formulário para nova tarefa
function showNewTaskForm() {
    formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Nova Tarefa';
    resetForm();
    editing = false;
    scrollToForm();
}

// Editar tarefa
function editTask(task) {
    formTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Tarefa';
    taskIdInput.value = task.id;
    tituloInput.value = task.titulo;
    descricaoInput.value = task.descricao || '';
    statusInput.value = task.status;
    prioridadeInput.value = task.prioridade;
    
    if (task.data_vencimento) {
        // Converte para o formato esperado pelo input date: YYYY-MM-DD
        const date = new Date(task.data_vencimento);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dataVencimentoInput.value = `${year}-${month}-${day}`;
    } else {
        dataVencimentoInput.value = '';
    }
    
    editing = true;
    scrollToForm();
}

// Função para scroll até o formulário
function scrollToForm() {
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Confirmar exclusão de tarefa
function confirmDeleteTask(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        deleteTask(id);
    }
}

// Excluir tarefa
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }
            throw new Error('Erro ao excluir tarefa');
        }
        
        // Atualizar o array de tarefas
        tasks = tasks.filter(task => task.id !== id);
        
        // Remover elemento do DOM com animação
        const taskElement = document.getElementById(`task-${id}`);
        if (taskElement) {
            taskElement.style.opacity = '0';
            taskElement.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                taskElement.remove();
                
                // Se não houver mais tarefas, mostrar mensagem
                if (document.querySelectorAll('.task-card').length === 0) {
                    showEmptyState();
                }
            }, 300);
        }
        
        exibirNotificacao('Tarefa excluída com sucesso!', 'success');
    } catch (error) {
        console.error('Erro:', error);
        exibirNotificacao(`Erro ao excluir tarefa: ${error.message}`, 'error');
    }
}

// Lidar com o envio do formulário
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        titulo: tituloInput.value.trim(),
        descricao: descricaoInput.value.trim(),
        status: statusInput.value,
        prioridade: prioridadeInput.value,
        data_vencimento: dataVencimentoInput.value || null
    };
    
    // Validação básica
    if (!taskData.titulo) {
        exibirNotificacao('O título da tarefa é obrigatório!', 'error');
        tituloInput.focus();
        return;
    }
    
    if (editing) {
        await updateTask(taskIdInput.value, taskData);
    } else {
        await createTask(taskData);
    }
}

// Criar nova tarefa
async function createTask(taskData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(true),
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }
            throw new Error('Erro ao criar tarefa');
        }
        
        const result = await response.json();
        
        // Adicionar a nova tarefa ao array e à DOM
        if (result.data) {
            tasks.push(result.data);
            
            // Se o filtro atual inclui a nova tarefa, renderizar
            if (currentFilter === 'todos' || currentFilter === result.data.status) {
                renderTasks(tasks.filter(task => 
                    currentFilter === 'todos' || task.status === currentFilter
                ));
            }
        }
        
        resetForm();
        exibirNotificacao('Tarefa criada com sucesso!', 'success');
        
        // Scroll para a lista de tarefas
        document.querySelector('.tasks-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro:', error);
        exibirNotificacao(`Erro ao criar tarefa: ${error.message}`, 'error');
    }
}

// Atualizar tarefa existente
async function updateTask(id, taskData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(true),
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }
            throw new Error('Erro ao atualizar tarefa');
        }
        
        const result = await response.json();
        
        // Atualizar o array de tarefas
        if (result.data) {
            const index = tasks.findIndex(task => task.id === id);
            if (index !== -1) {
                tasks[index] = result.data;
            }
            
            // Renderizar tarefas de acordo com o filtro atual
            renderTasks(tasks.filter(task => 
                currentFilter === 'todos' || task.status === currentFilter
            ));
        }
        
        resetForm();
        exibirNotificacao('Tarefa atualizada com sucesso!', 'success');
        
        // Scroll para a tarefa atualizada
        const taskElement = document.getElementById(`task-${id}`);
        if (taskElement) {
            taskElement.scrollIntoView({ behavior: 'smooth' });
            // Destacar brevemente a tarefa atualizada
            taskElement.classList.add('highlight');
            setTimeout(() => {
                taskElement.classList.remove('highlight');
            }, 2000);
        }
    } catch (error) {
        console.error('Erro:', error);
        exibirNotificacao(`Erro ao atualizar tarefa: ${error.message}`, 'error');
    }
}

// Resetar formulário
function resetForm() {
    taskForm.reset();
    taskIdInput.value = '';
    editing = false;
    formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Nova Tarefa';
}

// Definir filtro ativo
function setActiveFilter(status) {
    currentFilter = status;
    
    filterBtns.forEach(btn => {
        if (btn.dataset.status === status) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Sistema de notificações
function exibirNotificacao(mensagem, tipo = 'info') {
    // Verificar se já existe contêiner de notificações
    let notifContainer = document.getElementById('notif-container');
    
    if (!notifContainer) {
        notifContainer = document.createElement('div');
        notifContainer.id = 'notif-container';
        notifContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notifContainer);
    }
    
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notification ${tipo}`;
    
    // Definir ícone baseado no tipo
    let icon = 'info-circle';
    if (tipo === 'success') icon = 'check-circle';
    if (tipo === 'error') icon = 'exclamation-circle';
    if (tipo === 'warning') icon = 'exclamation-triangle';
    
    notificacao.style.cssText = `
        padding: 15px 20px;
        border-radius: 8px;
        background-color: white;
        color: var(--text-color);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out forwards;
        position: relative;
        border-left: 4px solid ${tipo === 'success' ? 'var(--completed-color)' : 
                              tipo === 'error' ? 'var(--high-priority)' : 
                              tipo === 'warning' ? 'var(--pending-color)' : 
                              'var(--in-progress-color)'};
    `;
    
    notificacao.innerHTML = `
        <i class="fas fa-${icon}" style="margin-right: 12px; font-size: 18px; color: ${
            tipo === 'success' ? 'var(--completed-color)' : 
            tipo === 'error' ? 'var(--high-priority)' : 
            tipo === 'warning' ? 'var(--pending-color)' : 
            'var(--in-progress-color)'
        };"></i>
        <p style="flex: 1; margin: 0;">${mensagem}</p>
        <button class="close-btn" style="background: none; border: none; cursor: pointer; font-size: 16px; color: var(--text-secondary);">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar evento de fechar
    const closeBtn = notificacao.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        removerNotificacao(notificacao);
    });
    
    // Adicionar ao contêiner e configurar para desaparecer automaticamente
    notifContainer.appendChild(notificacao);
    
    // Desaparecer após 5 segundos (5000ms)
    setTimeout(() => {
        removerNotificacao(notificacao);
    }, 5000);
}

// Função para remover notificação com animação
function removerNotificacao(notificacao) {
    notificacao.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => {
        notificacao.remove();
    }, 300);
}

// Adicionar estilos para as animações
const styleElement = document.createElement('style');
styleElement.textContent = `
    @keyframes slideIn {
        from { transform: translateX(110%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(110%); opacity: 0; }
    }
    
    .task-card {
        transition: opacity 0.3s ease, transform 0.3s ease, border-left-color 0.3s ease;
    }
    
    .highlight {
        animation: highlight 2s ease;
    }
    
    @keyframes highlight {
        0%, 100% { background-color: transparent; }
        50% { background-color: rgba(67, 97, 238, 0.1); }
    }
`;