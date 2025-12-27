/**
 * App - Main application controller
 * Connects Strategy Pattern with UI for sorting and filtering
 */

// Extend UIManager to use Strategy Pattern
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        // Get UI Manager instance (already created in ui.js)
        const originalUpdate = UIManager.prototype.update;
        
        // Override update method to apply strategies
        UIManager.prototype.update = function(tasks) {
            this.currentTasks = tasks;
            this.applyStrategiesAndRender();
        };
        
        // Add strategy application method
        UIManager.prototype.applyStrategiesAndRender = function() {
            let processedTasks = this.currentTasks;
            
            // Get current filter and sort selections
            const filterSelect = document.getElementById('filterBy');
            const sortSelect = document.getElementById('sortBy');
            
            if (filterSelect && sortSelect) {
                const filterType = filterSelect.value;
                const sortType = sortSelect.value;
                
                // Apply filtering strategy
                const filterStrategy = StrategyFactory.getFilterStrategy(filterType);
                const taskFilter = new TaskFilter(filterStrategy);
                processedTasks = taskFilter.filter(processedTasks);
                
                // Apply sorting strategy
                const sortStrategy = StrategyFactory.getSortStrategy(sortType);
                const taskSorter = new TaskSorter(sortStrategy);
                processedTasks = taskSorter.sort(processedTasks);
            }
            
            // Update count
            if (this.taskCountElement) {
                this.taskCountElement.textContent = processedTasks.length;
            }
            
            // Render
            if (processedTasks.length === 0) {
                this.showEmptyState();
            } else {
                this.hideEmptyState();
                this.renderTaskCards(processedTasks);
            }
        };
        
        // Add event listeners for sort and filter changes
        const sortSelect = document.getElementById('sortBy');
        const filterSelect = document.getElementById('filterBy');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                if (window.taskManager && window.taskManager.observers[0]) {
                    window.taskManager.observers[0].applyStrategiesAndRender();
                }
            });
        }
        
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                if (window.taskManager && window.taskManager.observers[0]) {
                    window.taskManager.observers[0].applyStrategiesAndRender();
                }
            });
        }
        
        console.log('✅ Strategy Pattern connected to UI');
        
        // Trigger initial render with strategies
        if (window.taskManager && window.taskManager.observers[0]) {
            window.taskManager.observers[0].applyStrategiesAndRender();
        }
    }, 100);
});
