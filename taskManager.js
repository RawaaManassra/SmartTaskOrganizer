/**
 * TaskManager - Central task management system
 * Design Pattern: Singleton Pattern
 * Reason: Ensures single source of truth for all tasks
 * Design Pattern: Observer Pattern
 * Reason: Notifies UI automatically when tasks change
 */
class TaskManager {
    static instance = null;
    
    constructor() {
        // Singleton: Return existing instance if already created
        if (TaskManager.instance) {
            return TaskManager.instance;
        }
        
        this.tasks = [];
        this.observers = []; // Observer pattern
        TaskManager.instance = this;
    }
    
    /**
     * Singleton: Get the single instance
     */
    static getInstance() {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager();
        }
        return TaskManager.instance;
    }
    
    // ============================================
    // OBSERVER PATTERN METHODS
    // ============================================
    
    /**
     * Register an observer to be notified of changes
     */
    addObserver(observer) {
        this.observers.push(observer);
        console.log('✅ Observer registered');
    }
    
    /**
     * Remove an observer
     */
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    
    /**
     * Notify all observers of changes
     */
    notifyObservers() {
        this.observers.forEach(observer => {
            if (observer && typeof observer.update === 'function') {
                observer.update(this.tasks);
            }
        });
    }
    
    // ============================================
    // CRUD OPERATIONS
    // ============================================
    
    /**
     * FR1: Create a new task
     * @returns {Task} Created task
     */
    createTask(title, description, deadline, priority) {
        try {
            // Validate inputs
            if (!title || !deadline || !priority) {
                throw new Error('Title, deadline, and priority are required');
            }
            
            // Create task using Factory Pattern
            const task = TaskFactory.createTask(title, description, deadline, priority);
            
            // Add to tasks array
            this.tasks.push(task);
            
            // FR8: Auto-save
            this.saveTasks();
            
            // Notify observers
            this.notifyObservers();
            
            console.log('✅ Task created:', task.title);
            return task;
            
        } catch (error) {
            console.error('❌ Error creating task:', error);
            throw error;
        }
    }
    
    /**
     * FR2: Update an existing task
     */
    updateTask(id, updates) {
        try {
            const task = this.tasks.find(t => t.id === id);
            
            if (!task) {
                throw new Error('Task not found');
            }
            
            // Update task properties
            Object.assign(task, updates);
            
            // FR8: Auto-save
            this.saveTasks();
            
            // Notify observers
            this.notifyObservers();
            
            console.log('✅ Task updated:', task.title);
            return task;
            
        } catch (error) {
            console.error('❌ Error updating task:', error);
            throw error;
        }
    }
    
    /**
     * FR3: Delete a task
     */
    deleteTask(id) {
        try {
            const index = this.tasks.findIndex(t => t.id === id);
            
            if (index === -1) {
                throw new Error('Task not found');
            }
            
            const deletedTask = this.tasks.splice(index, 1)[0];
            
            // FR8: Auto-save
            this.saveTasks();
            
            // Notify observers
            this.notifyObservers();
            
            console.log('✅ Task deleted:', deletedTask.title);
            return true;
            
        } catch (error) {
            console.error('❌ Error deleting task:', error);
            throw error;
        }
    }
    
    /**
     * FR4: Get all tasks
     */
    getAllTasks() {
        return [...this.tasks]; // Return copy
    }
    
    /**
     * Get a single task by ID
     */
    getTaskById(id) {
        return this.tasks.find(t => t.id === id);
    }
    
    /**
     * FR6: Mark task as completed
     */
    markAsCompleted(id) {
        try {
            const task = this.updateTask(id, { status: 'Completed' });
            console.log('✅ Task marked as completed:', task.title);
            return task;
        } catch (error) {
            console.error('❌ Error marking task as completed:', error);
            throw error;
        }
    }
    
    /**
     * Mark task as not completed (bonus feature)
     */
    markAsNotCompleted(id) {
        try {
            const task = this.updateTask(id, { status: 'ToDo' });
            console.log('✅ Task marked as not completed:', task.title);
            return task;
        } catch (error) {
            console.error('❌ Error marking task as not completed:', error);
            throw error;
        }
    }
    
    // ============================================
    // STORAGE OPERATIONS
    // ============================================
    
    /**
     * FR9: Load tasks from storage on startup
     */
    loadTasks() {
        try {
            const savedTasks = StorageManager.loadTasks();
            
            // Convert plain objects to Task instances
            this.tasks = savedTasks.map(taskData => 
                TaskFactory.fromObject(taskData)
            );
            
            // Notify observers
            this.notifyObservers();
            
            console.log(`✅ Loaded ${this.tasks.length} tasks`);
            return this.tasks;
            
        } catch (error) {
            console.error('❌ Error loading tasks:', error);
            this.tasks = [];
            return [];
        }
    }
    
    /**
     * FR8: Save tasks to storage
     */
    saveTasks() {
        try {
            StorageManager.saveTasks(this.tasks);
            return true;
        } catch (error) {
            console.error('❌ Error saving tasks:', error);
            return false;
        }
    }
    
    /**
     * FR10: Export tasks to file
     */
    exportTasks() {
        try {
            StorageManager.exportToFile(this.tasks);
            console.log('✅ Tasks exported successfully');
            return true;
        } catch (error) {
            console.error('❌ Error exporting tasks:', error);
            return false;
        }
    }
    
    // ============================================
    // UTILITY METHODS
    // ============================================
    
    /**
     * Get task statistics
     */
    getStatistics() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'Completed').length;
        const pending = total - completed;
        const highPriority = this.tasks.filter(t => t.priority === 'High').length;
        
        const now = new Date();
        const overdue = this.tasks.filter(t => 
            t.status !== 'Completed' && new Date(t.deadline) < now
        ).length;
        
        return {
            total,
            completed,
            pending,
            highPriority,
            overdue
        };
    }
    
    /**
     * Clear all tasks
     */
    clearAllTasks() {
        try {
            this.tasks = [];
            this.saveTasks();
            this.notifyObservers();
            console.log('✅ All tasks cleared');
            return true;
        } catch (error) {
            console.error('❌ Error clearing tasks:', error);
            return false;
        }
    }
}