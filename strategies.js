/**
 * Strategy Pattern Implementation for Sorting and Filtering
 * FR7: Sort by deadline/priority, Filter by status/priority
 * Design Pattern: Strategy Pattern
 * Reason: Flexible algorithm switching at runtime
 */

// ============================================
// SORTING STRATEGIES
// ============================================

class SortStrategy {
    sort(tasks) {
        throw new Error('sort() method must be implemented');
    }
}

class SortByDeadline extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => 
            new Date(a.deadline) - new Date(b.deadline)
        );
    }
}

class SortByPriority extends SortStrategy {
    sort(tasks) {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return [...tasks].sort((a, b) => 
            priorityOrder[a.priority] - priorityOrder[b.priority]
        );
    }
}

// ============================================
// FILTERING STRATEGIES
// ============================================

class FilterStrategy {
    filter(tasks) {
        throw new Error('filter() method must be implemented');
    }
}

class FilterAll extends FilterStrategy {
    filter(tasks) {
        return tasks;
    }
}

class FilterCompleted extends FilterStrategy {
    filter(tasks) {
        return tasks.filter(task => task.status === 'Completed');
    }
}

class FilterNotCompleted extends FilterStrategy {
    filter(tasks) {
        return tasks.filter(task => task.status !== 'Completed');
    }
}

class FilterHighPriority extends FilterStrategy {
    filter(tasks) {
        return tasks.filter(task => task.priority === 'High');
    }
}

// ============================================
// CONTEXT CLASSES
// ============================================

class TaskSorter {
    constructor(strategy = null) {
        this.strategy = strategy || new SortByDeadline();
    }
    
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    sort(tasks) {
        return this.strategy.sort(tasks);
    }
}

class TaskFilter {
    constructor(strategy = null) {
        this.strategy = strategy || new FilterAll();
    }
    
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    filter(tasks) {
        return this.strategy.filter(tasks);
    }
}

// ============================================
// STRATEGY FACTORY
// ============================================

class StrategyFactory {
    static getSortStrategy(type) {
        switch(type) {
            case 'deadline':
                return new SortByDeadline();
            case 'priority':
                return new SortByPriority();
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
            default:
                return new FilterAll();
        }
    }
}

console.log('✅ Strategy Pattern classes loaded');gi