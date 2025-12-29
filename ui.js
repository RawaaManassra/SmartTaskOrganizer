/**
 * UIManager - Manages all UI operations and updates
 * Design Pattern: Observer Pattern
 * Reason: Automatically updates UI when task data changes
 * Implements NFR1: Fast response (< 2 seconds)
 * Implements NFR2: Simple and easy to use interface
 */
class UIManager {
    constructor() {
        this.taskListElement = document.getElementById('taskList');
        this.emptyStateElement = document.getElementById('emptyState');
        this.taskCountElement = document.getElementById('taskCount');
        this.sortSelect = document.getElementById('sortBy');
        this.filterSelect = document.getElementById('filterBy');
        
        // Initialize Strategy Pattern contexts
        this.taskSorter = new TaskSorter();
        this.taskFilter = new TaskFilter();
        
        // Current tasks cache
        this.currentTasks = [];
    }
    
    /**
     * Observer Pattern: Update method called by TaskManager
     * This is the core of the Observer pattern
     */
    update(tasks) {
        this.currentTasks = tasks;
        this.renderTasks();
    }
    
    /**
     * Render all tasks with current sort and filter settings
     * Implements FR4: Display list of all tasks
     * Implements FR7: Sorting and filtering
     */
    renderTasks() {
        try {
            // Get current filter and sort strategies
            const filterType = this.filterSelect ? this.filterSelect.value : 'all';
            const sortType = this.sortSelect ? this.sortSelect.value : 'deadline';
            
            // Apply Strategy Pattern for filtering
            this.taskFilter.setStrategy(StrategyFactory.getFilterStrategy(filterType));
            let processedTasks = this.taskFilter.filter(this.currentTasks);
            
            // Apply Strategy Pattern for sorting
            this.taskSorter.setStrategy(StrategyFactory.getSortStrategy(sortType));
            processedTasks = this.taskSorter.sort(processedTasks);
            
            // Update task count
            if (this.taskCountElement) {
                this.taskCountElement.textContent = processedTasks.length;
            }
            
            // Show empty state if no tasks
            if (processedTasks.length === 0) {
                this.showEmptyState();
                return;
            }
            
            // Hide empty state and render tasks
            this.hideEmptyState();
            this.renderTaskCards(processedTasks);
            
        } catch (error) {
            console.error('❌ Error rendering tasks:', error);
        }
    }
    
    /**
     * Render individual task cards
     */
    renderTaskCards(tasks) {
        if (!this.taskListElement) return;
        
        this.taskListElement.innerHTML = tasks.map(task => 
            this.createTaskCard(task)
        ).join('');
        
        // Attach event listeners to all buttons
        this.attachCardEventListeners();
    }
    
    /**
     * Create HTML for a single task card
     */
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
            <div class="task-card ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" 
                 data-id="${task.id}">
                <div class="task-header">
                    <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                    <span class="task-priority ${task.priority.toLowerCase()}">
                        ${priorityEmoji[task.priority]} ${task.priority}
                    </span>
                </div>
                
                <p class="task-description">
                    ${task.description ? this.escapeHtml(task.description) : 'no descriotion'}
                </p>
                
                <div class="task-meta">
                    <span class="task-deadline ${isOverdue ? 'overdue-text' : ''}">
                        📅 ${deadlineDate.toLocaleString('en-US', {
                            year: 'numeric',
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
                        <button class="btn-complete" data-id="${task.id}" title="Complete task">
                            ✅ Complete
                        </button>
                    ` : `
                        <button class="btn-uncomplete" data-id="${task.id}" title="Undo completion">
                            ↩️ Undo
                        </button>
                    `}
                    <button class="btn-edit" data-id="${task.id}" title="Edit task">
                        ✏️ Edit
                    </button>
                    <button class="btn-delete" data-id="${task.id}" title="Delete task">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Attach event listeners to task card buttons
     */
    attachCardEventListeners() {
        // Complete buttons
        document.querySelectorAll('.btn-complete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                window.app.completeTask(id);
            });
        });
        
        // Uncomplete buttons
        document.querySelectorAll('.btn-uncomplete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                window.app.uncompleteTask(id);
            });
        });
        
        // Edit buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                window.app.editTask(id);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this task?')) {
                    window.app.deleteTask(id);
                }
            });
        });
    }
    
    /**
     * Show empty state message
     */
    showEmptyState() {
        if (this.taskListElement) {
            this.taskListElement.style.display = 'none';
        }
        if (this.emptyStateElement) {
            this.emptyStateElement.style.display = 'block';
        }
    }
    
    /**
     * Hide empty state message
     */
    hideEmptyState() {
        if (this.taskListElement) {
            this.taskListElement.style.display = 'grid';
        }
        if (this.emptyStateElement) {
            this.emptyStateElement.style.display = 'none';
        }
    }
    
    /**
     * Populate form with task data for editing
     * FR2: Edit task functionality
     */
    populateForm(task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskPriority').value = task.priority;
        
        // Format deadline for datetime-local input
        const deadline = new Date(task.deadline);
        const formattedDeadline = deadline.toISOString().slice(0, 16);
        document.getElementById('taskDeadline').value = formattedDeadline;
        
        // Scroll to form
        document.querySelector('.add-task-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
    
    /**
     * Clear the task form
     */
    clearForm() {
        document.getElementById('taskForm').reset();
        
        // Set default deadline to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        const formattedDate = tomorrow.toISOString().slice(0, 16);
        document.getElementById('taskDeadline').value = formattedDate;
    }
    
    /**
     * Show success message
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    /**
     * Show notification (simple alert for now)
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Update statistics display
     */
    updateStatistics(stats) {
        // Can be implemented to show stats dashboard
        console.log('Statistics:', stats);
    }
}