/**
 * Task Class - Represents a single task
 * FR1: Task with title, description, deadline, priority
 * FR5: Default status is 'ToDo'
 */
class Task {
    constructor(id, title, description, deadline, priority) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.priority = priority; // High, Medium, Low
        this.status = 'ToDo'; // FR5: Default status
        this.createdAt = new Date().toISOString();
    }
}

/**
 * TaskFactory - Factory Pattern for creating tasks
 * Design Pattern: Factory Pattern
 * Reason: Centralizes task creation and ensures consistent object creation
 */
class TaskFactory {
    static createTask(title, description, deadline, priority) {
        const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return new Task(id, title, description, deadline, priority);
    }
    
    static fromObject(taskData) {
        const task = new Task(
            taskData.id,
            taskData.title,
            taskData.description,
            taskData.deadline,
            taskData.priority
        );
        task.status = taskData.status;
        task.createdAt = taskData.createdAt;
        return task;
    }
}

// Test the factory
console.log('✅ Task Factory initialized');