// Configuração da API
const API_URL = 'http://localhost:3000/api/tarefas';

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

// Estado da aplicação
let currentFilter = 'todos';
let editing = false;

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
});

function setupEventListeners() {
    taskForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    newTaskBtn.addEventListener('click', showNewTaskForm);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const status = e.target.dataset.status;
            setActiveFilter(status);
            loadTasks(status);
        });
    });
}

// Carrega tarefas da API
async function loadTasks(status = 'todos') {
    try {
        tasksList.innerHTML = '<p id="loading-message">Carregando tarefas...</p>';
        
        let url = API_URL;
        if (status !== 'todos') {
            url += `?status=${status}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar tarefas');
        }
        
        const data = await response.json();
        
        if (!data || !data.data || !Array.isArray(data.data)) {
            tasksList.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
            return;
        }
        
        renderTasks(data.data);
    } catch (error) {
        console.error('Erro:', error);
        tasksList.innerHTML = `<p>Erro ao carregar tarefas: ${error.message}</p>`;
    }
}

// Renderiza tarefas na interface
function renderTasks(tasks) {
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
        return;
    }
    
    tasksList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });
}

// Cria elemento HTML para uma tarefa
function createTaskElement(task) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.id = `task-${task.id}`;
    
    // Formatar data se existir
    let formattedDate = '';
    if (task.data_vencimento) {
        const date = new Date(task.data_vencimento);
        formattedDate = date.toLocaleDateString('pt-BR');
    }
    
    taskCard.innerHTML = `
        <h3>${task.titulo}</h3>
        <div class="task-info">
            <p>${task.descricao || 'Sem descrição'}</p>
            <p>
                <span class="status-badge status-${task.status}">
                    ${formatStatus(task.status)}
                </span>
                <span class="priority-badge priority-${task.prioridade}">
                    ${formatPriority(task.prioridade)}
                </span>
            </p>
            <p>Vencimento: ${formattedDate || 'Não definido'}</p>
        </div>
        <div class="task-actions">
            <button class="edit-btn" data-id="${task.id}">Editar</button>
            <button class="delete-btn" data-id="${task.id}">Excluir</button>
        </div>
    `;
    
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
    formTitle.textContent = 'Nova Tarefa';
    resetForm();
    editing = false;
    scrollToForm();
}

// Editar tarefa
function editTask(task) {
    formTitle.textContent = 'Editar Tarefa';
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
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao excluir tarefa');
        }
        
        // Remover elemento do DOM
        const taskElement = document.getElementById(`task-${id}`);
        if (taskElement) {
            taskElement.remove();
        }
        
        // Se não houver mais tarefas, mostrar mensagem
        if (tasksList.children.length === 0) {
            tasksList.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
        }
        
        alert('Tarefa excluída com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert(`Erro ao excluir tarefa: ${error.message}`);
    }
}

// Lidar com o envio do formulário
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        titulo: tituloInput.value,
        descricao: descricaoInput.value,
        status: statusInput.value,
        prioridade: prioridadeInput.value,
        data_vencimento: dataVencimentoInput.value || null
    };
    
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao criar tarefa');
        }
        
        const result = await response.json();
        
        resetForm();
        loadTasks(currentFilter);
        alert('Tarefa criada com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert(`Erro ao criar tarefa: ${error.message}`);
    }
}

// Atualizar tarefa existente
async function updateTask(id, taskData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao atualizar tarefa');
        }
        
        const result = await response.json();
        
        resetForm();
        loadTasks(currentFilter);
        alert('Tarefa atualizada com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert(`Erro ao atualizar tarefa: ${error.message}`);
    }
}

// Resetar formulário
function resetForm() {
    taskForm.reset();
    taskIdInput.value = '';
    editing = false;
    formTitle.textContent = 'Nova Tarefa';
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