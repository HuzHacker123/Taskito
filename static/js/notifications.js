document.addEventListener('DOMContentLoaded', function() {
    // Request notification permissions when user logs in
    const requestNotificationBtn = document.getElementById('request-notifications');
    if (requestNotificationBtn) {
        requestNotificationBtn.addEventListener('click', requestNotificationPermission);
    }
    
    // Check for tasks due today and schedule notifications
    checkTasksDueToday();
});

function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
        return;
    }
    
    Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
            showSuccessMessage('Notification permission granted!');
            
            // Check for tasks due today immediately after permission is granted
            checkTasksDueToday();
        } else {
            showErrorMessage('Notification permission denied.');
        }
    });
}

function checkTasksDueToday() {
    // Get tasks data from tasks-data element
    const tasksDataElement = document.getElementById('tasks-data');
    if (!tasksDataElement) return;
    
    try {
        const tasksData = JSON.parse(tasksDataElement.dataset.tasks);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Filter tasks due today
        const tasksDueToday = tasksData.filter(task => {
            if (!task.due_date) return false;
            
            const dueDate = new Date(task.due_date);
            dueDate.setHours(0, 0, 0, 0);
            
            return dueDate.getTime() === today.getTime() && !task.completed;
        });
        
        // Schedule notifications for tasks due today
        tasksDueToday.forEach(task => {
            if (task.due_time) {
                scheduleTaskNotification(task);
            }
        });
    } catch (error) {
        console.error('Error checking tasks due today:', error);
    }
}

function scheduleTaskNotification(task) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }
    
    // Parse due time
    const [hours, minutes] = task.due_time.split(':').map(Number);
    const dueDateTime = new Date();
    dueDateTime.setHours(hours, minutes, 0, 0);
    
    // Calculate time until due
    const now = new Date();
    let timeUntilDue = dueDateTime.getTime() - now.getTime();
    
    // If the time is in the past but on the same day, don't show a notification
    if (timeUntilDue < 0) {
        return;
    }
    
    // Also schedule a notification 30 minutes before if possible
    const thirtyMinsBefore = timeUntilDue - (30 * 60 * 1000);
    if (thirtyMinsBefore > 0) {
        setTimeout(() => {
            showTaskNotification(task, true);
        }, thirtyMinsBefore);
    }
    
    // Schedule notification for exact due time
    setTimeout(() => {
        showTaskNotification(task, false);
    }, timeUntilDue);
}

function showTaskNotification(task, isReminder) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }
    
    const title = isReminder ? 
        `Reminder: ${task.title} due soon` : 
        `Task Due Now: ${task.title}`;
    
    const options = {
        body: isReminder ? 
            `Your task "${task.title}" is due in 30 minutes` : 
            `Your task "${task.title}" is due now`,
        icon: '/static/images/logo.svg',
        badge: '/static/images/badge.svg'
    };
    
    const notification = new Notification(title, options);
    
    notification.onclick = function() {
        window.focus();
        notification.close();
    };
}

function showSuccessMessage(message) {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function showErrorMessage(message) {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}
