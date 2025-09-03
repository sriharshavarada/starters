document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');

  loadTasks();

  addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      createTaskElement({ text: taskText, completed: false });
      taskInput.value = '';
      saveTasks();
    }
  });

  taskList.addEventListener('click', (e) => {
    // Traverse up to find the LI parent if a span is clicked
    const targetLi = e.target.closest('li');
    if (targetLi) {
        if (e.target.classList.contains('delete-btn')) {
            targetLi.remove();
        } else {
            targetLi.classList.toggle('completed');
        }
        saveTasks();
    }
  });

  function createTaskElement(task) {
    const li = document.createElement('li');
    if (task.completed) {
      li.classList.add('completed');
    }

    const span = document.createElement('span');
    span.textContent = task.text;
    li.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  }

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
      const span = li.querySelector('span');
      if (span) {
          const text = span.textContent;
          tasks.push({ text: text, completed: li.classList.contains('completed') });
      }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
      tasks.forEach(task => createTaskElement(task));
    }
  }
});
