document.addEventListener('DOMContentLoaded', function() {
    // Filter tasks by category
    const categoryFilters = document.querySelectorAll('.category-filter');
    if (categoryFilters) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                const categoryId = this.dataset.categoryId;
                filterTasks(categoryId, null);
            });
        });
    }

    // Filter tasks by priority
    const priorityFilters = document.querySelectorAll('.priority-filter');
    if (priorityFilters) {
        priorityFilters.forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                const priority = this.dataset.priority;
                filterTasks(null, priority);
            });
        });
    }

    // Reset filters
    const resetFilter = document.getElementById('reset-filter');
    if (resetFilter) {
        resetFilter.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/dashboard';
        });
    }

    // Add subtask field in task form
    const addSubtaskBtn = document.getElementById('add-subtask');
    if (addSubtaskBtn) {
        addSubtaskBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const subtasksInput = document.getElementById('subtasks');
            const subtaskValue = document.getElementById('new-subtask').value.trim();
            
            if (subtaskValue) {
                if (subtasksInput.value) {
                    subtasksInput.value += ', ' + subtaskValue;
                } else {
                    subtasksInput.value = subtaskValue;
                }
                
                // Add to visual list
                const subtasksList = document.getElementById('subtasks-list');
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = subtaskValue;
                subtasksList.appendChild(li);
                
                // Clear input field
                document.getElementById('new-subtask').value = '';
            }
        });
    }

    // Toggle task progress input
    const trackProgressCheckbox = document.getElementById('track_progress');
    const progressInputGroup = document.getElementById('progress-input-group');
    
    if (trackProgressCheckbox && progressInputGroup) {
        trackProgressCheckbox.addEventListener('change', function() {
            progressInputGroup.style.display = this.checked ? 'block' : 'none';
        });
        
        // Initial state
        progressInputGroup.style.display = trackProgressCheckbox.checked ? 'block' : 'none';
    }

    // Initialize progress bars
    initProgressBars();
});

function filterTasks(categoryId, priority) {
    fetch(`/api/tasks?${categoryId ? 'category_id=' + categoryId : ''}${priority ? '&priority=' + priority : ''}`)
        .then(response => response.json())
        .then(tasks => {
            const tasksList = document.getElementById('tasks-list');
            tasksList.innerHTML = '';
            
            if (tasks.length === 0) {
                tasksList.innerHTML = '<div class="alert alert-info">No tasks found matching the filter criteria.</div>';
                return;
            }
            
            tasks.forEach(task => {
                const taskElement = createTaskElement(task);
                tasksList.appendChild(taskElement);
            });
            
            // Re-initialize progress bars
            initProgressBars();
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'card mb-3 task-card';
    taskDiv.dataset.taskId = task.id;
    
    const priorityClass = task.priority === 'High' ? 'text-danger' : 
                        task.priority === 'Medium' ? 'text-warning' : 'text-success';
    
    let progressHtml = '';
    if (task.track_progress) {
        progressHtml = `
            <div class="progress mt-2" style="height: 20px;">
                <div class="progress-bar task-progress" role="progressbar" style="width: ${task.progress}%;" 
                    aria-valuenow="${task.progress}" aria-valuemin="0" aria-valuemax="100">${task.progress}%</div>
            </div>
            <div class="progress-controls mt-2 d-flex">
                <input type="range" class="form-range progress-slider" value="${task.progress}" min="0" max="100" step="5" 
                    data-task-id="${task.id}">
                <button class="btn btn-sm btn-primary ms-2 save-progress-btn" data-task-id="${task.id}">Save</button>
            </div>
        `;
    }
    
    taskDiv.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">${task.title}</h5>
            <span class="badge ${priorityClass}">${task.priority}</span>
        </div>
        <div class="card-body">
            <p class="card-text">${task.description}</p>
            <div class="task-details">
                <p><strong>Category:</strong> ${task.category || 'None'}</p>
                <p><strong>Due:</strong> ${task.due_date} at ${task.due_time}</p>
                ${task.recurring ? '<p><span class="badge bg-info">Recurring</span></p>' : ''}
            </div>
            ${progressHtml}
            <div class="btn-group mt-3">
                <a href="/edit_task/${task.id}" class="btn btn-sm btn-warning">Edit</a>
                <button class="btn btn-sm btn-success complete-task-btn" data-task-id="${task.id}">Complete</button>
                <button class="btn btn-sm btn-danger delete-task-btn" data-task-id="${task.id}">Delete</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    setTimeout(() => {
        const completeBtn = taskDiv.querySelector('.complete-task-btn');
        if (completeBtn) {
            completeBtn.addEventListener('click', function() {
                completeTask(task.id);
            });
        }
        
        const deleteBtn = taskDiv.querySelector('.delete-task-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                deleteTask(task.id);
            });
        }
        
        const progressSlider = taskDiv.querySelector('.progress-slider');
        const saveProgressBtn = taskDiv.querySelector('.save-progress-btn');
        
        if (progressSlider && saveProgressBtn) {
            progressSlider.addEventListener('input', function() {
                const progressBar = taskDiv.querySelector('.task-progress');
                progressBar.style.width = this.value + '%';
                progressBar.textContent = this.value + '%';
                progressBar.setAttribute('aria-valuenow', this.value);
            });
            
            saveProgressBtn.addEventListener('click', function() {
                updateTaskProgress(task.id, parseInt(progressSlider.value));
            });
        }
    }, 0);
    
    return taskDiv;
}

function initProgressBars() {
    document.querySelectorAll('.progress-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const taskId = this.dataset.taskId;
            const progressBar = document.querySelector(`.task-progress[data-task-id="${taskId}"]`);
            if (progressBar) {
                progressBar.style.width = this.value + '%';
                progressBar.textContent = this.value + '%';
                progressBar.setAttribute('aria-valuenow', this.value);
            }
        });
    });
    
    document.querySelectorAll('.save-progress-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.dataset.taskId;
            const slider = document.querySelector(`.progress-slider[data-task-id="${taskId}"]`);
            if (slider) {
                updateTaskProgress(taskId, parseInt(slider.value));
            }
        });
    });
    
    document.querySelectorAll('.complete-task-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.dataset.taskId;
            completeTask(taskId);
        });
    });
    
    document.querySelectorAll('.delete-task-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.dataset.taskId;
            deleteTask(taskId);
        });
    });
}

function updateTaskProgress(taskId, progress) {
    fetch(`/update_task_progress/${taskId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ progress: progress })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            const alert = document.createElement('div');
            alert.className = 'alert alert-success alert-dismissible fade show mt-2';
            alert.innerHTML = `
                Progress updated!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            
            const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
            taskCard.querySelector('.card-body').appendChild(alert);
            
            // Auto dismiss after 3 seconds
            setTimeout(() => {
                alert.remove();
            }, 3000);
        } else {
            console.error('Error updating progress:', data.error);
        }
    })
    .catch(error => {
        console.error('Error updating progress:', error);
    });
}

function completeTask(taskId) {
    if (confirm('Mark this task as completed?')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/complete_task/${taskId}`;
        
        // Create CSRF token input (if using CSRF protection)
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }
        
        document.body.appendChild(form);
        form.submit();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/delete_task/${taskId}`;
        
        // Create CSRF token input (if using CSRF protection)
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }
        
        document.body.appendChild(form);
        form.submit();
    }
}
