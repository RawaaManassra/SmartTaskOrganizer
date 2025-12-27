/**
 * TaskManager - Manages all tasks
 * Design Pattern: Singleton Pattern
 * Reason: Ensures single source of truth for all task data
 * Design Pattern: Observer Pattern
 * Reason: Notifies UI automatically when tasks change
 */
class TaskManager {
    static instance = null;
    
    constructor() {
        if (TaskManager.instance) {
            return TaskManager.instance;
        }
        this.tasks = [];
        this.observers = [];
        TaskManager.instance = this;
        console.log('✅ TaskManager Singleton created');
    }
    
    static getInstance() {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager();
        }
        return TaskManager.instance;
    }
    
    // Observer Pattern Methods
    addObserver(observer) {
        this.observers.push(observer);
        console.log('✅ Observer registered');
    }
    
    notifyObservers() {
        this.observers.forEach(observer => {
            if (observer && typeof observer.update === 'function') {
                observer.update(this.tasks);
            }
        });
    }
    
    // FR1: Create new task
    createTask(title, description, deadline, priority) {
        try {
            const task = TaskFactory.createTask(title, description, deadline, priority);
            this.tasks.push(task);
            this.saveTasks();
            this.notifyObservers();
            console.log('✅ Task created:', task.title);
            return task;
        } catch (error) {
            console.error('❌ Error creating task:', error);
            throw error;
        }
    }
    
    // FR2: Update existing task
    updateTask(id, updates) {
        try {
            const task = this.tasks.find(t => t.id === id);
            if (task) {
                Object.assign(task, updates);
                this.saveTasks();
                this.notifyObservers();
                console.log('✅ Task updated');
                return task;
            }
            return null;
        } catch (error) {
            console.error('❌ Error updating task:', error);
            throw error;
        }
    }
    
    // FR3: Delete task
    deleteTask(id) {
        try {
            const index = this.tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                this.tasks.splice(index, 1);
                this.saveTasks();
                this.notifyObservers();
                console.log('✅ Task deleted');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error deleting task:', error);
            throw error;
        }
    }
    
    // FR4: Get all tasks
    getAllTasks() {
        return [...this.tasks];
    }
    
    // FR6: Mark task as completed
    markAsCompleted(id) {
        return this.updateTask(id, { status: 'Completed' });
    }
    
    markAsNotCompleted(id) {
        return this.updateTask(id, { status: 'ToDo' });
    }
    
    getTaskById(id) {
        return this.tasks.find(t => t.id === id);
    }
    
    // FR9: Load tasks from storage
    loadTasks() {
        try {
            const savedTasks = StorageManager.loadTasks();
            this.tasks = savedTasks.map(taskData => TaskFactory.fromObject(taskData));
            this.notifyObservers();
            console.log(`✅ Loaded ${this.tasks.length} tasks`);
            return this.tasks;
        } catch (error) {
            console.error('❌ Error loading tasks:', error);
            this.tasks = [];
            return [];
        }
    }
    
    // FR8: Save tasks to storage
    saveTasks() {
        return StorageManager.saveTasks(this.tasks);
    }
    
    // FR10: Export tasks
    exportTasks() {
        return StorageManager.exportToFile(this.tasks);
    }
}

console.log('✅ TaskManager class defined');