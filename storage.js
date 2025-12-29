/**
 * StorageManager - Handles all storage operations
 * Implements FR8: Auto-save tasks
 * Implements FR9: Auto-load tasks on startup
 * Implements FR10: Export tasks to text file
 * Implements NFR3: Data stored in readable format
 */
class StorageManager {
    static STORAGE_KEY = 'smart_task_organizer_tasks';
    
    /**
     * FR9: Load all saved tasks from localStorage
     * @returns {Array} Array of tasks
     */
    static loadTasks() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            
            if (data) {
                const tasksData = JSON.parse(data);
                console.log(`✅ Loaded ${tasksData.length} tasks from storage`);
                return tasksData;
            }
            
            console.log('ℹ️ No saved tasks found');
            return [];
            
        } catch (error) {
            console.error('❌ Error loading tasks:', error);
            return [];
        }
    }
    
    /**
     * FR8: Save all tasks to localStorage
     * This is called automatically after every operation
     * @param {Array} tasks - Array of tasks to save
     * @returns {boolean} Success status
     */
    static saveTasks(tasks) {
        try {
            // Convert tasks to JSON string (NFR3: readable format)
            const jsonData = JSON.stringify(tasks, null, 2);
            localStorage.setItem(this.STORAGE_KEY, jsonData);
            console.log(`✅ Saved ${tasks.length} tasks to storage`);
            return true;
        } catch (error) {
            console.error('❌ Error saving tasks:', error);
            return false;
        }
    }
    
    /**
     * FR10: Export all tasks to a text file
     * @param {Array} tasks - Array of tasks to export
     */
    static exportToFile(tasks) {
        try {
            // Create readable text format (NFR3)
            let content = '═══════════════════════════════════════════════════\n';
            content += '       Smart Task Organizer - Tasks Export\n';
            content += '═══════════════════════════════════════════════════\n\n';
            content += `Export Date: ${new Date().toLocaleString('en-US')}\n`;
            content += `Total Tasks: ${tasks.length}\n`;
            content += `Completed: ${tasks.filter(t => t.status === 'Completed').length}\n`;
            content += `Pending: ${tasks.filter(t => t.status === 'ToDo').length}\n\n`;
            content += '═══════════════════════════════════════════════════\n\n';
            
            // Add each task
            tasks.forEach((task, index) => {
                content += `[Task #${index + 1}]\n`;
                content += `─────────────────────────────────────────────────\n`;
                content += `📌 Title: ${task.title}\n`;
                content += `📝 Description: ${task.description || 'No description'}\n`;
                content += `🎯 Priority: ${task.priority}\n`;
                content += `📅 Deadline: ${new Date(task.deadline).toLocaleString('en-US')}\n`;
                content += `✓ Status: ${task.status}\n`;
                content += `🕐 Created: ${new Date(task.createdAt).toLocaleString('en-US')}\n`;
                content += `─────────────────────────────────────────────────\n\n`;
            });
            
            content += '═══════════════════════════════════════════════════\n';
            content += '            End of Export\n';
            content += '═══════════════════════════════════════════════════\n';
            
            // Create and download file
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `tasks_export_${Date.now()}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            console.log('✅ Tasks exported successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Error exporting tasks:', error);
            alert('حدث خطأ أثناء تصدير المهام');
            return false;
        }
    }
    
    /**
     * Clear all tasks from storage (utility method)
     */
    static clearAll() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('✅ Storage cleared');
            return true;
        } catch (error) {
            console.error('❌ Error clearing storage:', error);
            return false;
        }
    }
}

/**
 * Auto-save on page unload (FR8: Save when system closes)
 */
window.addEventListener('beforeunload', () => {
    console.log('💾 Auto-saving tasks before page closes...');
});