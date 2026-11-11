// Academic planner: add, complete, delete, filter. Saved in localStorage.
const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const courseInput = document.getElementById('task-course');
const dueInput = document.getElementById('task-due');
const errorBox = document.getElementById('task-error');
const list = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');

let tasks = loadTasks();   // array of {id, title, course, due, done}
let currentFilter = 'all';

function loadTasks() {
  try { return JSON.parse(localStorage.getItem('planner-tasks')) || []; }
  catch (e) { return []; }
}
function saveTasks() {
  try { localStorage.setItem('planner-tasks', JSON.stringify(tasks)); } catch (e) {}
}

function addTask(title, course, due) {
  tasks.push({ id: Date.now(), title, course, due, done: false });
  saveTasks();
  render();
}
function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) t.done = !t.done;
  saveTasks();
  render();
}
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function isOverdue(t) {
  if (!t.due || t.done) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(t.due + 'T00:00:00') < today;
}

function render() {
  list.innerHTML = '';
  const shown = tasks.filter(t =>
    currentFilter === 'all' ? true : currentFilter === 'done' ? t.done : !t.done);

  if (shown.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = tasks.length ? 'No tasks in this view.' : 'No tasks yet. Add your first one above.';
    list.appendChild(li);
  }

  shown.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task' + (t.done ? ' done' : '') + (isOverdue(t) ? ' overdue' : '');

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = t.done;
    cb.setAttribute('aria-label', 'Mark "' + t.title + '" as completed');
    cb.addEventListener('change', () => toggleTask(t.id));

    const text = document.createElement('div');
    text.className = 'text';
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = t.title;
    text.appendChild(title);
    const bits = [];
    if (t.course) bits.push(t.course);
    if (t.due) bits.push('Due ' + t.due + (isOverdue(t) ? ' (overdue)' : ''));
    if (bits.length) {
      const meta = document.createElement('span');
      meta.className = 'meta';
      meta.textContent = bits.join(', ');
      text.appendChild(meta);
    }

    const del = document.createElement('button');
    del.className = 'del';
    del.type = 'button';
    del.textContent = 'Delete';
    del.setAttribute('aria-label', 'Delete "' + t.title + '"');
    del.addEventListener('click', () => deleteTask(t.id));

    li.append(cb, text, del);
    list.appendChild(li);
  });

  const done = tasks.filter(t => t.done).length;
  document.getElementById('count-total').textContent = tasks.length;
  document.getElementById('count-done').textContent = done;
  document.getElementById('count-left').textContent = tasks.length - done;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    errorBox.textContent = 'Enter a task name before adding.';
    titleInput.classList.add('invalid');
    titleInput.focus();
    return;
  }
  errorBox.textContent = '';
  titleInput.classList.remove('invalid');
  addTask(title, courseInput.value.trim(), dueInput.value);
  form.reset();
  titleInput.focus();
});

filterButtons.forEach(btn => btn.addEventListener('click', () => {
  currentFilter = btn.dataset.filter;
  filterButtons.forEach(b => b.setAttribute('aria-pressed', b === btn));
  render();
}));

document.getElementById('clear-done').addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
});

render();
