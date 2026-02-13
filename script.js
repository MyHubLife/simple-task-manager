const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const viewTaskCards = document.querySelector('.view-task-cards');

let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
let searchTerm ='';

const fetchQuote = async () => {
  try {
    const response = await fetch('https://api.allorigins.win/get?url=https://zenquotes.io/api/random');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    const quoteData = JSON.parse(data.contents);
    console.log("Ось що прийшло з сервера:", quoteData);
    // Var 1 - simple
    // const text = quoteData[0].q;
    // const author = quoteData[0].a;
    // document.getElementById('quote').textContent = `"${text}" — ${author}`;
    
    // var 2 - destructuring assignment
    // const { q: text, a: author } = quoteData[0];
    // document.getElementById('quote').textContent = `"${text}" — ${author}`;
    
    // var 3 - destructuring assignment + array destructuring
    const [firstQuote] = quoteData;
    const { q: text, a: author } = firstQuote;
    document.getElementById('quote').textContent = `"${text}" — ${author}`;
  } catch (error) {
    console.error('Error fetching quote:', error);
    document.getElementById(`quote`).textContent = 'Stay positive even without a quote!';
  }
}
fetchQuote();

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

const renderTasks = () => {
  viewTaskCards.innerHTML = '';

  const filteredTasks = taskList.filter(task => 
    task.text.toLowerCase().includes(searchTerm)
  );
  filteredTasks.forEach(({id, created_at, text, completed}) => {
    const taskCard = document.createElement('article');
    const taskDone = completed ? 'done' : '';
    taskCard.className = `task-card ${taskDone}`;
  
  // OLD version without search
  // taskList.forEach(({id, created_at, text, completed}) => {
  //   const taskCard = document.createElement('article');
  //   const taskDone = completed ? 'done' : '';
  //   taskCard.className = `task-card ${taskDone}`;
    
    taskCard.innerHTML = `
      <div class="created-at">${created_at}</div>
      <div class="task-text">${text}</div>
      <button class="delete-btn">Delete</button>
    `;

    const textElement = taskCard.querySelector('.task-text');
    textElement.addEventListener('click', () => toggleTask(id));

    const deleteBtn = taskCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(id));

    viewTaskCards.appendChild(taskCard);
  });
  updateStats();
}

// const renderTasks = () => {
//   viewTaskCards.innerHTML = '';

//   taskList.forEach(task => {
//     const taskCard = document.createElement('article');
//     const taskDone = task.completed ? 'done' : '';
//     taskCard.className = `task-card ${taskDone}`;

//     taskCard.innerHTML = `
//       <div class="created-at">${task.created_at}</div>
//       <div class="task-text">${task.text}</div>
//       <button class="delete-btn">Delete</button>
//     `;

//     const textElement = taskCard.querySelector('.task-text');
//     textElement.addEventListener('click', () => toggleTask(task.id));

//     const deleteBtn = taskCard.querySelector('.delete-btn');
//     deleteBtn.addEventListener('click', () => deleteTask(task.id));

//     viewTaskCards.appendChild(taskCard);
//   });
//   updateStats();
// }

const deleteTask = (id) => {
  taskList = taskList.filter(task => task.id !== id);
  saveLocalStorage();
  renderTasks();
}

const toggleTask = (id) => { 
  taskList = taskList.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
  saveLocalStorage();
  renderTasks();

  // const task = taskList.find(task => task.id === id);
  // if (task) {
  //   task.completed = !task.completed;
  //   saveLocalStorage();
  //   renderTasks();
  // }
}

const saveLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(taskList));
}

const updateStats = () => {
  const total = taskList.length;
  const completed = taskList.filter(t => t.completed).length;
  document.querySelector('.stats').innerText = `Summary tasks: ${total} | Completed: ${completed}`;
}

// function fetchQuoteOld() {
//   fetch('https://api.allorigins.win/get?url=https://zenquotes.io/api/random')
//     .then(response => response.json())
//     .then(data => {
//       const quoteData = JSON.parse(data.contents); // бо цей API повертає дані специфічно
//       const text = quoteData[0].q;
//       const author = quoteData[0].a;
//       document.getElementById('quote').textContent = `"${text}" — ${author}`;
//     });
// }

document.getElementById('searchInput').addEventListener('input', (e) => {
  searchTerm = e.target.value.toLowerCase();
  renderTasks();
});

renderTasks();