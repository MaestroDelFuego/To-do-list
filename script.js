document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const newTaskInput = document.getElementById('new-task');
    const endDateInput = document.getElementById('end-date');
    const todoList = document.getElementById('todo-list');

    // Load tasks from localStorage
    loadTasks();

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(newTaskInput.value, endDateInput.value);
        newTaskInput.value = '';
        endDateInput.value = '';
    });

    function addTask(taskText, endDate, completed = false) {
        const li = document.createElement('li');
        if (completed) {
            li.classList.add('completed');
        }

        // Format the date
        const formattedDate = new Date(endDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const taskContent = document.createElement('span');
        taskContent.textContent = `${taskText} (Due: ${formattedDate})`;
        li.appendChild(taskContent);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('task-buttons');

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
            checkOverdueTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            li.remove();
            saveTasks();
            checkOverdueTasks();
        });

        buttonsContainer.appendChild(completeButton);
        buttonsContainer.appendChild(deleteButton);
        li.appendChild(buttonsContainer);

        todoList.appendChild(li);

        // Save tasks to localStorage
        saveTasks();
        checkOverdueTasks();
    }

    function saveTasks() {
        const tasks = [];
        todoList.querySelectorAll('li').forEach((li) => {
            const taskContent = li.querySelector('span').textContent;
            const taskText = taskContent.match(/^(.*)\s\(Due:/)[1];
            const endDate = taskContent.match(/\(Due:\s(.*)\)$/)[1];
            tasks.push({
                text: taskText,
                endDate: new Date(endDate.split('/').reverse().join('-')).toISOString().split('T')[0],
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach((task) => addTask(task.text, task.endDate, task.completed));
        }
    }

    function checkOverdueTasks() {
        const currentDate = new Date().toISOString().split('T')[0];
        todoList.querySelectorAll('li').forEach((li) => {
            const taskContent = li.querySelector('span').textContent;
            const endDate = taskContent.match(/\(Due:\s(.*)\)$/)[1];
            const endDateFormatted = endDate.split('/').reverse().join('-');
            if (new Date(endDateFormatted) < new Date(currentDate) && !li.classList.contains('completed')) {
                li.classList.add('overdue');
            } else {
                li.classList.remove('overdue');
            }
        });
    }
});
