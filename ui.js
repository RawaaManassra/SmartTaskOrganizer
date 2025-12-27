/**
 * UIManager - Observer Pattern implementation
 * Automatically updates UI when tasks change
 * FR4: Display all tasks
 */
class UIManager {
    constructor() {
        this.taskListElement = document.getElementById('taskList');
        this.emptyStateElement = document.getElementById('emptyState');
        this.taskCountElement = document.getElementById('taskCount');
        this.currentTasks = [];
        console.log('✅ UIManager initialized');
    }
    
    /**
     * Observer Pattern: update method called by TaskManager
     */
    update(tasks) {
        this.currentTasks = tasks;
        this.renderTasks();
    }
    
    renderTasks() {
        const tasks = this.currentTasks;
        
        // Update task count
        if (this.taskCountElement) {
            this.taskCountElement.textContent = tasks.length;
        }
        
        // Show empty state if no tasks
        if (tasks.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Hide empty state and render tasks
        this.hideEmptyState();
        this.renderTaskCards(tasks);
    }
    
    renderTaskCards(tasks) {
        if (!this.taskListElement) return;
        
        this.taskListElement.innerHTML = tasks.map(task => 
            this.createTaskCard(task)
        ).join('');
        
        this.attachEventListeners();
    }
    
    createTaskCard(task) {
        const priorityEmoji = {
            'High': '🔴',
            'Medium': '🟡',
            'Low': '🟢'
        };
        
        const isCompleted = task.status === 'Completed';
        const deadlineDate = new Date(task.deadline);
        const now = new Date();
        const isOverdue = !isCompleted && deadlineDate < now;
        
        return `
            <div class="task-card ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-id="${task.id}">
                <div class="task-header">
                    <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                    <span class="task-priority ${task.priority.toLowerCase()}">
                        ${priorityEmoji[task.priority]} ${task.priority}
                    </span>
                </div>
                
                <p class="task-description">
                    ${task.description ? this.escapeHtml(task.description) : 'No description'}
                </p>
                
                <div class="task-meta">
                    <span class="task-deadline">
                        📅 ${deadlineDate.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                    <span class="task-status ${task.status.toLowerCase()}">
                        ${task.status === 'Completed' ? '✅' : '⏳'} ${task.status}
                    </span>
                </div>
                
                ${isOverdue ? '<div class="overdue-badge">⚠️ Overdue</div>' : ''}
                
                <div class="task-actions">
                    ${!isCompleted ? `
                        <button class="btn-complete" data-id="${task.id}">
                            ✅ Complete
                        </button>
                    ` : `
                        <button class="btn-uncomplete" data-id="${task.id}">
                            ↩️ Undo
                        </button>
                    `}
                    <button class="btn-edit" data-id="${task.id}">
                        ✏️ Edit
                    </button>
                    <button class="btn-delete" data-id="${task.id}">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        // Complete button
        document.querySelectorAll('.btn-complete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (window.taskManager) {
                    window.taskManager.markAsCompleted(id);
                }
            });
        });
        
        // Uncomplete button
        document.querySelectorAll('.btn-uncomplete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (window.taskManager) {
                    window.taskManager.markAsNotCompleted(id);
                }
            });
        });
        
        // Edit button
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const task = window.taskManager.getTaskById(id);
                if (task) {
                    this.populateForm(task);
                }
            });
        });
        
        // Delete button
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this task?')) {
                    if (window.taskManager) {
                        window.taskManager.deleteTask(id);
                    }
                }
            });
        });
    }
    
    populateForm(task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskPriority').value = task.priority;
        
        // Format deadline for datetime-local input
        const deadline = new Date(task.deadline);
        const formattedDeadline = deadline.toISOString().slice(0, 16);
        document.getElementById('taskDeadline').value = formattedDeadline;
        
        // Store editing task ID
        window.editingTaskId = task.id;
        
        // Change button text
        const submitBtn = document.querySelector('#taskForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = '💾 Save Changes';
        }
        
        // Scroll to form
        document.querySelector('.add-task-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
    
    clearForm() {
        document.getElementById('taskForm').reset();
        window.editingTaskId = null;
        
        const submitBtn = document.querySelector('#taskForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Add Task';
        }
    }
    
    showEmptyState() {
        if (this.taskListElement) this.taskListElement.style.display = 'none';
        if (this.emptyStateElement) this.emptyStateElement.style.display = 'block';
    }
    
    hideEmptyState() {
        if (this.taskListElement) this.taskListElement.style.display = 'grid';
        if (this.emptyStateElement) this.emptyStateElement.style.display = 'none';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing application...');
    
    // Create TaskManager instance
    window.taskManager = TaskManager.getInstance();
    
    // Create UIManager and register as observer
    const uiManager = new UIManager();
    window.taskManager.addObserver(uiManager);
    
    // FR9: Load saved tasks
    window.taskManager.loadTasks();
    
    // Form submission handler
    const form = document.getElementById('taskForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('taskTitle').value.trim();
            const description = document.getElementById('taskDescription').value.trim();
            const deadline = document.getElementById('taskDeadline').value;
            const priority = document.getElementById('taskPriority').value;
            
            if (!title || !deadline) {
                alert('Please fill all required fields');
                return;
            }
            
            // Check if editing or creating new
            if (window.editingTaskId) {
                // Update existing task
                window.taskManager.updateTask(window.editingTaskId, {
                    title,
                    description,
                    deadline,
                    priority
                });
                window.editingTaskId = null;
            } else {
                // Create new task
                window.taskManager.createTask(title, description, deadline, priority);
            }
            
            uiManager.clearForm();
        });
    }
    
    // Export button handler
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const tasks = window.taskManager.getAllTasks();
            if (tasks.length === 0) {
                alert('No tasks to export');
                return;
            }
            window.taskManager.exportTasks();
            alert(`Exported ${tasks.length} tasks successfully!`);
        });
    }
    
    // Set default deadline to tomorrow
    const deadlineInput = document.getElementById('taskDeadline');
    if (deadlineInput && !deadlineInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        deadlineInput.value = tomorrow.toISOString().slice(0, 16);
    }
    
    console.log('✅ Application ready!');
});

// FR8: Auto-save before closing
window.addEventListener('beforeunload', () => {
    if (window.taskManager) {
        window.taskManager.saveTasks();
    }
});
