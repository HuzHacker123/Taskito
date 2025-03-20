document.addEventListener('DOMContentLoaded', function() {
    // Add task subtask functionality
    setupSubtasks();
    
    // Category filter functionality
    setupCategoryFilter();
    
    // Priority filter functionality
    setupPriorityFilter();
    
    // Task progress handling
    setupProgressTracking();
    
    // Subtask toggling
    setupSubtaskToggle();
    
    // Task delete confirmation
    setupDeleteConfirmation();
    
    // Due date warning highlighting
    highlightDueDates();
    
    // Mobile navigation toggle
    setupMobileNav();
});

function setupSubtasks() {
    const addSubtaskBtn = document.getElementById('add-subtask-btn');
    if (!addSubtaskBtn) return;
    
    addSubtaskBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const subtasksContainer = document.getElementById('subtasks-container');
        const subtaskIndex = subtasksContainer.querySelectorAll('.subtask-item').length;
        
        // Create new subtask HTML
        const subtaskHtml = `
            <div class="subtask-item mb-2">
                <div class="input-group">
                    <input type="text" name="subtasks-${subtaskIndex}-title" id="subtasks-${subtaskIndex}-title" 
                        class="form-control" placeholder="Subtask title" required>
                    <div class="input-group-text">
                        <input type="checkbox" name="subtasks-${subtaskIndex}-is_completed" 
                            id="subtasks-${subtaskIndex}-is_completed" class="form-check-input">
                    </div>
                    <button type="button" class="btn btn-outline-danger remove-subtask-btn">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add the new subtask to the container
        subtasksContainer.insertAdjacentHTML('beforeend', subtaskHtml);
        
        // Add event listener to the new remove button
        const newRemoveBtn = subtasksContainer.lastElementChild.querySelector('.remove-subtask-btn');
        newRemoveBtn.addEventListener('click', function() {
            this.closest('.subtask-item').remove();
        });
    });
    
    // Add event listeners to existing remove buttons
    document.querySelectorAll('.remove-subtask-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.subtask-item').remove();
        });
    });
}

function setupCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;
    
    categoryFilter.addEventListener('change', function() {
        applyFilters();
    });
}

function setupPriorityFilter() {
    const priorityFilter = document.getElementById('priority-filter');
    if (!priorityFilter) return;
    
    priorityFilter.addEventListener('change', function() {
        applyFilters();
    });
}

function setupStatusFilter() {
    const statusFilter = document.getElementById('status-filter');
    if (!statusFilter) return;
    
    statusFilter.addEventListener('change', function() {
        applyFilters();
    });
}

function applyFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priorityFilter = document.getElementById('priority-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (!categoryFilter || !priorityFilter || !statusFilter) return;
    
    const filters = {
        category_id: categoryFilter.value,
        priority: priorityFilter.value,
        status: statusFilter.value
    };
    
    // Send filter request to server
    fetch('/filter_tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters)
    })
    .then(response => response.json())
    .then(tasks => {
        updateTaskList(tasks);
    })
    .catch(error => console.error('Error filtering tasks:', error));
}

function updateTaskList(tasks) {
    const taskListContainer = document.getElementById('filtered-tasks-container');
    if (!taskListContainer) return;
    
    // Clear current tasks
    taskListContainer.innerHTML = '';
    
    if (tasks.length === 0) {
        taskListContainer.innerHTML = '<div class="alert alert-info">No tasks found matching the filters</div>';
        return;
    }
    
    // Add each task
    tasks.forEach(task => {
        // Create priority badge
        let priorityBadge = '';
        if (task.priority === 3) {
            priorityBadge = '<span class="badge bg-danger">High</span>';
        } else if (task.priority === 2) {
            priorityBadge = '<span class="badge bg-warning text-dark">Medium</span>';
        } else {
            priorityBadge = '<span class="badge bg-info text-dark">Low</span>';
        }
        
        // Format date
        const dueDate = new Date(task.due_date);
        const formattedDate = dueDate.toLocaleDateString();
        
        // Create task card
        const taskHtml = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">${task.title}</h5>
                        ${priorityBadge}
                    </div>
                    <div class="mb-2">
                        <span class="badge bg-secondary">${task.category_name}</span>
                        <small class="text-muted ms-2">Due: ${formattedDate} at ${task.due_time}</small>
                    </div>
                    <div class="progress mb-2">
                        <div class="progress-bar" role="progressbar" style="width: ${task.progress}%"
                            aria-valuenow="${task.progress}" aria-valuemin="0" aria-valuemax="100">
                            ${task.progress}%
                        </div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <a href="/task/${task.id}/edit" class="btn btn-sm btn-outline-primary me-2">
                            <i class="fa fa-edit"></i> Edit
                        </a>
                        <form action="/task/${task.id}/complete" method="post" class="d-inline">
                            <button type="submit" class="btn btn-sm btn-success">
                                <i class="fa fa-check"></i> Complete
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        taskListContainer.insertAdjacentHTML('beforeend', taskHtml);
    });
}

function setupProgressTracking() {
    const progressInputs = document.querySelectorAll('.progress-range');
    if (!progressInputs.length) return;
    
    progressInputs.forEach(input => {
        const taskId = input.dataset.taskId;
        const progressValue = document.getElementById(`progress-value-${taskId}`);
        const progressBar = document.getElementById(`progress-bar-${taskId}`);
        
        // Update display on input change
        input.addEventListener('input', function() {
            const value = this.value;
            progressValue.textContent = `${value}%`;
            progressBar.style.width = `${value}%`;
            progressBar.setAttribute('aria-valuenow', value);
            
            // Update progress class based on value
            progressBar.className = 'progress-bar';
            if (value < 30) {
                progressBar.classList.add('bg-danger');
            } else if (value < 70) {
                progressBar.classList.add('bg-warning');
            } else {
                progressBar.classList.add('bg-success');
            }
        });
        
        // Save progress when input is changed
        input.addEventListener('change', function() {
            const value = this.value;
            saveTaskProgress(taskId, value);
        });
    });
}

function saveTaskProgress(taskId, progress) {
    fetch(`/task/${taskId}/progress`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress: progress })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Progress updated successfully!');
        }
    })
    .catch(error => console.error('Error updating progress:', error));
}

function setupSubtaskToggle() {
    const subtaskCheckboxes = document.querySelectorAll('.subtask-checkbox');
    if (!subtaskCheckboxes.length) return;
    
    subtaskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = this.dataset.taskId;
            const subtaskId = this.dataset.subtaskId;
            
            fetch(`/task/${taskId}/subtask/${subtaskId}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                // Update task progress
                const progressBar = document.getElementById(`progress-bar-${taskId}`);
                const progressValue = document.getElementById(`progress-value-${taskId}`);
                
                if (progressBar && progressValue) {
                    progressBar.style.width = `${data.task_progress}%`;
                    progressBar.setAttribute('aria-valuenow', data.task_progress);
                    progressValue.textContent = `${data.task_progress}%`;
                    
                    // Update progress class based on value
                    progressBar.className = 'progress-bar';
                    if (data.task_progress < 30) {
                        progressBar.classList.add('bg-danger');
                    } else if (data.task_progress < 70) {
                        progressBar.classList.add('bg-warning');
                    } else {
                        progressBar.classList.add('bg-success');
                    }
                }
                
                // Update checkbox styling
                if (data.subtask_completed) {
                    this.closest('.subtask-item').classList.add('completed-subtask');
                } else {
                    this.closest('.subtask-item').classList.remove('completed-subtask');
                }
            })
            .catch(error => console.error('Error toggling subtask:', error));
        });
    });
}

function setupDeleteConfirmation() {
    const deleteButtons = document.querySelectorAll('.delete-task-btn');
    if (!deleteButtons.length) return;
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
                e.preventDefault();
            }
        });
    });
}

function highlightDueDates() {
    const dueDates = document.querySelectorAll('.due-date');
    if (!dueDates.length) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    dueDates.forEach(element => {
        const dueDate = new Date(element.dataset.date);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
            // Overdue
            element.classList.add('text-danger', 'fw-bold');
        } else if (dueDate.getTime() === today.getTime()) {
            // Due today
            element.classList.add('text-warning', 'fw-bold');
        }
    });
}

function setupMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!toggleBtn || !sidebar) return;
    
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        document.body.classList.toggle('sidebar-open');
    });
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">Taskito</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Auto-remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}
