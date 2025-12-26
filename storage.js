/**
 * StorageManager - Handles localStorage operations
 * FR8: Auto-save tasks
 * FR9: Auto-load tasks on startup
 * FR10: Export tasks to text file
 * NFR3: Data stored in readable format
 */
class StorageManager {
    static STORAGE_KEY = 'smart_task_organizer_tasks';
    
    /**
     * FR9: Load tasks from localStorage
     */
    static loadTasks() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                const tasks = JSON.parse(data);
                console.log(`✅ Loaded ${tasks.length} tasks from storage`);
                return tasks;
            }
            console.log('ℹ️ No saved tasks found');
            return [];
        } catch (error) {
            console.error('❌ Error loading tasks:', error);
            return [];
        }
    }
    
    /**
     * FR8: Save tasks to localStorage
     */
    static saveTasks(tasks) {
        try {
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
     * FR10: Export tasks to text file
     */
    static exportToFile(tasks) {
        try {
            let content = '═══════════════════════════════════════════════════\n';
            content += '       Smart Task Organizer - Tasks Export\n';
            content += '═══════════════════════════════════════════════════\n\n';
            content += `Export Date: ${new Date().toLocaleString('en-US')}\n`;
            content += `Total Tasks: ${tasks.length}\n`;
            content += `Completed: ${tasks.filter(t => t.status === 'Completed').length}\n`;
            content += `Pending: ${tasks.filter(t => t.status === 'ToDo').length}\n\n`;
            
            tasks.forEach((task, index) => {
                content += `[Task #${index + 1}]\n`;
                content += `Title: ${task.title}\n`;
                content += `Description: ${task.description || 'No description'}\n`;
                content += `Priority: ${task.priority}\n`;
                content += `Deadline: ${new Date(task.deadline).toLocaleString('en-US')}\n`;
                content += `Status: ${task.status}\n`;
                content += `Created: ${new Date(task.createdAt).toLocaleString('en-US')}\n\n`;
            });
            
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
            return false;
        }
    }
}

console.log('✅ StorageManager initialized');