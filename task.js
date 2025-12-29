/**
 * Task Class - Represents a single task
 * Implements FR1: Task creation with title, description, deadline, priority
 * Implements FR5: Default status is 'ToDo'
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
 * Reason: Centralizes task creation logic and ensures consistent object creation
 */
class TaskFactory {
    /**
     * Creates a new task with a unique ID
     * @param {string} title - Task title
     * @param {string} description - Task description
     * @param {string} deadline - Task deadline
     * @param {string} priority - Task priority (High/Medium/Low)
     * @returns {Task} New task instance
     */
    static createTask(title, description, deadline, priority) {
        // Generate unique ID using timestamp
        const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return new Task(id, title, description, deadline, priority);
    }
    
    /**
     * Recreates a task from stored data (for loading from storage)
     * @param {Object} taskData - Task data object
     * @returns {Task} Task instance
     */
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