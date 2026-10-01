let tasks = JSON.parse(localStorage.getItem('routine_tasks')) || [];
let activeAlertTask = null;

const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskTimeInput = document.getElementById('taskTime');
const taskList = document.getElementById('taskList');

const alertModal = document.getElementById('alertModal');
const alertTaskTitle = document.getElementById('alertTaskTitle');
const completeBtn = document.getElementById('completeBtn');

// Request notification permissions
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

function updateApp() {
  localStorage.setItem('routine_tasks', JSON.stringify(tasks));
  renderTasks();
}

// Add Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskTitleInput.value;
  const time = taskTimeInput.value;

  if (!title || !time) return;

  const newTask = {
    id: Date.now(),
    title,
    time,
    completed: false,
    triggeredToday: false,
  };

  tasks.push(newTask);
  taskTitleInput.value = '';
  taskTimeInput.value = '';
  updateApp();
});

// Render Tasks
function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = `<li style="text-align:center; color:#94a3b8; font-size:0.85rem; padding: 12px;">No tasks added yet.</li>`;
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="task-info">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id})">
        <div>
          <div class="task-title">${task.title}</div>
          <div class="task-time">⏰ ${task.time}</div>
        </div>
      </div>
      <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
    `;

    taskList.appendChild(li);
  });
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  updateApp();
}

function toggleComplete(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  updateApp();
}

// Check every 5 seconds for due tasks
setInterval(() => {
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;

  tasks.forEach((task) => {
    if (!task.completed && task.time === currentTimeStr && !task.triggeredToday) {
      triggerReminder(task);
    }
  });
}, 5000);

function triggerReminder(task) {
  activeAlertTask = task;
  alertTaskTitle.textContent = `Time to: ${task.title}`;
  alertModal.classList.remove('hidden');

  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  audio.play().catch(() => {});

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Task Reminder!', { body: task.title });
  }

  task.triggeredToday = true;
  updateApp();
}

function snoozeTask(minutes) {
  if (!activeAlertTask) return;

  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);

  const snoozedHours = String(now.getHours()).padStart(2, '0');
  const snoozedMinutes = String(now.getMinutes()).padStart(2, '0');
  const snoozedTimeStr = `${snoozedHours}:${snoozedMinutes}`;

  tasks = tasks.map((t) =>
    t.id === activeAlertTask.id
      ? { ...t, time: snoozedTimeStr, triggeredToday: false }
      : t
  );

  alertModal.classList.add('hidden');
  activeAlertTask = null;
  updateApp();
}

completeBtn.addEventListener('click', () => {
  if (activeAlertTask) {
    toggleComplete(activeAlertTask.id);
    alertModal.classList.add('hidden');
    activeAlertTask = null;
  }
});

renderTasks();