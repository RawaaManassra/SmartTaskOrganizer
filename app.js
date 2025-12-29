/**
 * App - Main Application Controller
 * Orchestrates all components and handles user interactions
 * Implements all Functional Requirements (FR1-FR10)
 * Implements NFR1: Response time < 2 seconds
 */
class App {
    constructor() {
        console.log('🚀 Initializing Smart Task Organizer...');
        
        // Get Singleton instance of TaskManager
        this.taskManager = TaskManager.getInstance();
        
        // Create UI Manager (Observer)
        this.uiManager = new UIManager();
        
        // Register UI Manager as observer
        this.taskManager.addObserver(this.uiManager);
        
        // Track editing state
        this.editingTaskId = null;
        
        // Initialize application
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        console.log('⚙️ Setting up application...');
        
        // FR9: Load saved tasks on startup
        this.loadInitialTasks();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Set default deadline to tomorrow
        this.setDefaultDeadline();
        
        console.log('✅ Application ready!');
    }
    
    /**
     * FR9: Load tasks from storage on startup
     */
    loadInitialTasks() {
        try {
            this.taskManager.loadTasks();
            console.log('✅ Initial tasks loaded');
        } catch (error) {
            console.error('❌ Error loading initial tasks:', error);
            this.uiManager.showError('حدث خطأ في تحميل المهام');
        }
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Task form submission (FR1: Create task)
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        
        // Sort dropdown (FR7: Sorting)
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.uiManager.renderTasks();
            });
        }
        
        // Filter dropdown (FR7: Filtering)
        const filterSelect = document.getElementById('filterBy');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                this.uiManager.renderTasks();
            });
        }
        
        // Export button (FR10: Export tasks)
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.handleExport();
            });
        }
        
        console.log('✅ Event listeners attached');
    }
    
    /**
     * Handle task form submission
     * FR1: Create task OR FR2: Update task
     */
    handleFormSubmit() {
        try {
            // Get form values
            const title = document.getElementById('taskTitle').value.trim();
            const description = document.getElementById('taskDescription').value.trim();
            const deadline = document.getElementById('taskDeadline').value;
            const priority = document.getElementById('taskPriority').value;
            
            // Validate
            if (!title || !deadline || !priority) {
                this.uiManager.showError('Please fill all required fields');
                return;
            }
            
            // Check if editing or creating
            if (this.editingTaskId) {
                // FR2: Update existing task
                this.updateTask(this.editingTaskId, {
                    title,
                    description,
                    deadline,
                    priority
                });
                this.editingTaskId = null;
            } else {
                // FR1: Create new task
                this.createTask(title, description, deadline, priority);
            }
            
            // Clear form
            this.uiManager.clearForm();
            this.setDefaultDeadline();
            
        } catch (error) {
            console.error('❌ Error handling form submit:', error);
            this.uiManager.showError('Error saving task');
        }
    }
    
    /**
     * FR1: Create a new task
     */
    createTask(title, description, deadline, priority) {
        try {
            this.taskManager.createTask(title, description, deadline, priority);
            this.uiManager.showSuccess('✅ Task added successfully');
            console.log('✅ Task created successfully');
        } catch (error) {
            console.error('❌ Error creating task:', error);
            this.uiManager.showError('Failed to create task');
            throw error;
        }
    }
    
    /**
     * FR2: Update an existing task
     */
    updateTask(id, updates) {
        try {
            this.taskManager.updateTask(id, updates);
            this.uiManager.showSuccess('✅ Task updated successfully');
            console.log('✅ Task updated successfully');
        } catch (error) {
            console.error('❌ Error updating task:', error);
            this.uiManager.showError('Failed to update task');
            throw error;
        }
    }
    
    /**
     * FR3: Delete a task
     */
    deleteTask(id) {
        try {
            this.taskManager.deleteTask(id);
            this.uiManager.showSuccess('✅ Task deleted successfully');
            console.log('✅ Task deleted successfully');
            
            // Clear editing state if deleting the task being edited
            if (this.editingTaskId === id) {
                this.editingTaskId = null;
                this.uiManager.clearForm();
            }
        } catch (error) {
            console.error('❌ Error deleting task:', error);
            this.uiManager.showError('Failed to delete task');
        }
    }
    
    /**
     * FR6: Mark task as completed
     */
    completeTask(id) {
        try {
            this.taskManager.markAsCompleted(id);
            this.uiManager.showSuccess('✅ Task completed');
            console.log('✅ Task marked as completed');
        } catch (error) {
            console.error('❌ Error completing task:', error);
            this.uiManager.showError('Failed to complete task');
        }
    }
    
    /**
     * Mark task as not completed (bonus feature)
     */
    uncompleteTask(id) {
        try {
            this.taskManager.markAsNotCompleted(id);
            this.uiManager.showSuccess('✅ Task marked as incomplete');
            console.log('✅ Task marked as not completed');
        } catch (error) {
            console.error('❌ Error uncompleting task:', error);
            this.uiManager.showError('Failed to mark task as incomplete');
        }
    }
    
    /**
     * FR2: Prepare to edit a task
     */
    editTask(id) {
        try {
            const task = this.taskManager.getTaskById(id);
            if (!task) {
                throw new Error('Task not found');
            }
            
            // Set editing mode
            this.editingTaskId = id;
            
            // Populate form with task data
            this.uiManager.populateForm(task);
            
            // Change button text
            const submitBtn = document.querySelector('#taskForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = '💾 Save Changes';
                submitBtn.classList.add('editing');
            }
            
            console.log('✏️ Editing task:', task.title);
            
        } catch (error) {
            console.error('❌ Error preparing edit:', error);
            this.uiManager.showError('Failed to load task for editing');
        }
    }
    
    /**
     * FR10: Export all tasks to file
     */
    handleExport() {
        try {
            const tasks = this.taskManager.getAllTasks();
            
            if (tasks.length === 0) {
                this.uiManager.showError('No tasks to export');
                return;
            }
            
            this.taskManager.exportTasks();
            this.uiManager.showSuccess(`✅ Exported ${tasks.length} tasks successfully`);
            
        } catch (error) {
            console.error('❌ Error exporting tasks:', error);
            this.uiManager.showError('Failed to export tasks');
        }
    }
    
    /**
     * Set default deadline to tomorrow at noon
     */
    setDefaultDeadline() {
        const deadlineInput = document.getElementById('taskDeadline');
        if (deadlineInput && !deadlineInput.value) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(12, 0, 0, 0);
            deadlineInput.value = tomorrow.toISOString().slice(0, 16);
        }
    }
    
    /**
     * Get application statistics
     */
    getStatistics() {
        return this.taskManager.getStatistics();
    }
}

/**
 * Initialize app when DOM is ready
 * FR9: Auto-load on startup
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');
    
    // Create global app instance
    window.app = new App();
    
    // Log statistics
    const stats = window.app.getStatistics();
    console.log('📊 Statistics:', stats);
});

/**
 * FR8: Auto-save before page closes
 */
window.addEventListener('beforeunload', () => {
    console.log('💾 Saving tasks before closing...');
    if (window.app && window.app.taskManager) {
        window.app.taskManager.saveTasks();
    }
});

/**
 * Handle online/offline status
 */
window.addEventListener('online', () => {
    console.log('🌐 Back online');
});

window.addEventListener('offline', () => {
    console.log('📡 Offline mode - using local storage');
});