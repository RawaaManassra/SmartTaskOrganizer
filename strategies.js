/**
 * Strategy Pattern Implementation
 * Implements FR7: Sorting and Filtering strategies
 * Design Pattern: Strategy Pattern
 * Reason: Allows flexible switching between different sorting/filtering algorithms
 */

// ============================================
// SORTING STRATEGIES
// ============================================

/**
 * Base Sort Strategy
 */
class SortStrategy {
    sort(tasks) {
        throw new Error('sort() method must be implemented');
    }
}

/**
 * FR7: Sort by Deadline
 */
class SortByDeadline extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => {
            const dateA = new Date(a.deadline);
            const dateB = new Date(b.deadline);
            return dateA - dateB;
        });
    }
}

/**
 * FR7: Sort by Priority
 * Priority order: High > Medium > Low
 */
class SortByPriority extends SortStrategy {
    sort(tasks) {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return [...tasks].sort((a, b) => {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }
}

/**
 * Sort by Creation Date (newest first)
 */
class SortByCreationDate extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
        });
    }
}

// ============================================
// FILTERING STRATEGIES
// ============================================

/**
 * Base Filter Strategy
 */
class FilterStrategy {
    filter(tasks) {
        throw new Error('filter() method must be implemented');
    }
}

/**
 * FR7: Show all tasks
 */
class FilterAll extends FilterStrategy {
    filter(tasks) {
        return tasks;
    }
}

/**
 * FR7: Show only completed tasks
 */
class FilterCompleted extends FilterStrategy {
    filter(tasks) {
        return tasks.filter(task => task.status === 'Completed');
    }
}

/**
 * FR7: Show only not-completed tasks
 */
class FilterNotCompleted extends FilterStrategy {
    filter(tasks) {
        return tasks.filter(task => task.status !== 'Completed');
    }
}

/**
 * FR7: Show only high priority tasks
 */
class FilterHighPriority extends FilterStrategy {
    filter(tasks) {
        return tasks.filter(task => task.priority === 'High');
    }
}

/**
 * Filter overdue tasks
 */
class FilterOverdue extends FilterStrategy {
    filter(tasks) {
        const now = new Date();
        return tasks.filter(task => {
            return task.status !== 'Completed' && new Date(task.deadline) < now;
        });
    }
}

// ============================================
// CONTEXT CLASSES
// ============================================

/**
 * TaskSorter - Context for sorting strategies
 */
class TaskSorter {
    constructor(strategy = null) {
        this.strategy = strategy || new SortByDeadline();
    }
    
    /**
     * Change sorting strategy at runtime
     */
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    /**
     * Execute the sorting
     */
    sort(tasks) {
        if (!this.strategy) {
            return tasks;
        }
        return this.strategy.sort(tasks);
    }
}

/**
 * TaskFilter - Context for filtering strategies
 */
class TaskFilter {
    constructor(strategy = null) {
        this.strategy = strategy || new FilterAll();
    }
    
    /**
     * Change filtering strategy at runtime
     */
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    /**
     * Execute the filtering
     */
    filter(tasks) {
        if (!this.strategy) {
            return tasks;
        }
        return this.strategy.filter(tasks);
    }
}

/**
 * Strategy Factory - Helper to create strategies from strings
 */
class StrategyFactory {
    static getSortStrategy(type) {
        switch(type) {
            case 'deadline':
                return new SortByDeadline();
            case 'priority':
                return new SortByPriority();
            case 'created':
                return new SortByCreationDate();
            default:
                return new SortByDeadline();
        }
    }
    
    static getFilterStrategy(type) {
        switch(type) {
            case 'all':
                return new FilterAll();
            case 'completed':
                return new FilterCompleted();
            case 'notCompleted':
                return new FilterNotCompleted();
            case 'highPriority':
                return new FilterHighPriority();
            case 'overdue':
                return new FilterOverdue();
            default:
                return new FilterAll();
        }
    }
}