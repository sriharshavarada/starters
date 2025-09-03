document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');
  const filters = document.querySelector('.filters');

  let currentFilter = 'all';

  // --- Event Listeners ---

  // Add task with the button
  addTaskBtn.addEventListener('click', handleAddTask);

  // Add task with the Enter key
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  });

  // Handle clicks on checkboxes and delete buttons
  taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      e.target.closest('li').remove();
      saveTasks();
    }
  });

  taskList.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      e.target.closest('li').classList.toggle('completed', e.target.checked);
      saveTasks();
      filterTasks(); // Re-apply filter after completing a task
    }
  });

  // Handle filter button clicks
  filters.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      document.querySelector('.filters button.active').classList.remove('active');
      e.target.classList.add('active');
      currentFilter = e.target.id.replace('Filter', ''); // 'all', 'active', or 'completed'
      filterTasks();
    }
  });

  // --- Core Functions ---

  function handleAddTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      createTaskElement({ text: taskText, completed: false });
      taskInput.value = '';
      saveTasks();
      filterTasks(); // Ensure new task is visible
    }
  }

  function createTaskElement(task) {
    const li = document.createElement('li');
    if (task.completed) {
      li.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  }

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
      const span = li.querySelector('span');
      const checkbox = li.querySelector('input[type="checkbox"]');
      if (span && checkbox) {
        tasks.push({ text: span.textContent, completed: checkbox.checked });
      }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTaskElement(task));
    filterTasks(); // Apply initial filter on load
  }

  function filterTasks() {
    const tasks = taskList.querySelectorAll('li');
    tasks.forEach(task => {
      switch (currentFilter) {
        case 'active':
          task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
          break;
        case 'completed':
          task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
          break;
        default: // 'all'
          task.style.display = 'flex';
          break;
      }
    });
  }

  // --- Initial Load ---
  loadTasks();
});
