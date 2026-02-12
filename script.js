const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const viewTaskCards = document.querySelector('.view-task-cards');

let taskList = JSON.parse(localStorage.getItem('tasks')) || [];

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();

  if (taskText) { 
  let newTask = {
    id: Date.now(),
    created_at: new Date().toLocaleString(),
    text: taskInput.value.trim(),
    completed: false
    };
    
    taskList.push(newTask);
    saveLocalStorage();
    renderTasks();
    taskInput.value = '';
  }
});

function renderTasks() {
  viewTaskCards.innerHTML = '';

  taskList.forEach(task => {
    const taskCard = document.createElement('article');
    const taskDone = task.completed ? 'done' : '';
    taskCard.className = `task-card ${taskDone}`;
    
    taskCard.innerHTML = `
      <div class="created-at">${task.created_at}</div>
      <div class="task-text">${task.text}</div>
      <button class="delete-btn">Delete</button>
    `;

    const textElement = taskCard.querySelector('.task-text');
    textElement.addEventListener('click', () => toggleTask(task.id));

    const deleteBtn = taskCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    viewTaskCards.appendChild(taskCard);
  });
  updateStats();
}

function deleteTask(id) {
  taskList = taskList.filter(task => task.id !== id);
  saveLocalStorage();
  renderTasks();
}

function toggleTask(id) { 
  const task = taskList.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    saveLocalStorage();
    renderTasks();
  }
}

function saveLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(taskList));
}

function updateStats() {
  const total = taskList.length;
  const completed = taskList.filter(t => t.completed).length;
  document.querySelector('.stats').innerText = `Summary tasks: ${total} | Completed: ${completed}`;
}

renderTasks();