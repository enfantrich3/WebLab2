// подключение стилей
const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'style.css';
document.head.append(styleLink);

// создание элемента
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

// шапка
const header = createElement('header', 'header');
const headerTitle = createElement('h1', 'header__title', 'ToDo List');
const headerText = createElement('p', 'header__text', 'Список моих задач');
header.append(headerTitle, headerText);

// основная часть
const main = createElement('main', 'main');

// форма добавления задачи
const addSection = createElement('section', 'add-section');
const addTitle = createElement('h2', 'section-title', 'Новая задача');
const form = createElement('form', 'add-form');

const textInput = createElement('input', 'input add-form__text');
textInput.type = 'text';
textInput.placeholder = 'Что нужно сделать?';
textInput.required = true;

const dateInput = createElement('input', 'input add-form__date');
dateInput.type = 'date';

const addButton = createElement('button', 'btn btn--add', 'Добавить');
addButton.type = 'submit';

form.append(textInput, dateInput, addButton);
addSection.append(addTitle, form);

// поиск, фильтр и сортировка
const controls = createElement('section', 'controls');

const searchInput = createElement('input', 'input controls__search');
searchInput.type = 'search';
searchInput.placeholder = 'Поиск по названию';

const filterSelect = createElement('select', 'input controls__filter');
const filterOptions = [
  { value: 'all', text: 'Все задачи' },
  { value: 'active', text: 'Невыполненные' },
  { value: 'done', text: 'Выполненные' }
];
filterOptions.forEach(function (item) {
  const option = createElement('option', '', item.text);
  option.value = item.value;
  filterSelect.append(option);
});

const sortSelect = createElement('select', 'input controls__sort');
const sortOptions = [
  { value: 'none', text: 'Без сортировки' },
  { value: 'asc', text: 'Сначала ранние' },
  { value: 'desc', text: 'Сначала поздние' }
];
sortOptions.forEach(function (item) {
  const option = createElement('option', '', item.text);
  option.value = item.value;
  sortSelect.append(option);
});

controls.append(searchInput, filterSelect, sortSelect);

// список задач
const tasksSection = createElement('section', 'tasks');
const tasksTitle = createElement('h2', 'section-title', 'Мои задачи');
const taskList = createElement('ul', 'task-list');
const emptyText = createElement('p', 'tasks__empty', 'Задач пока нет');
tasksSection.append(tasksTitle, taskList, emptyText);

main.append(addSection, controls, tasksSection);

// подвал
const footer = createElement('footer', 'footer');
const footerText = createElement('p', 'footer__text', '© 2026 ToDo List');
footer.append(footerText);

document.body.append(header, main, footer);

// задачи
let tasks = [];
let editId = null;

// формат даты
function formatDate(date) {
  if (!date) {
    return 'Без даты';
  }
  const parts = date.split('-');
  return parts[2] + '.' + parts[1] + '.' + parts[0];
}

// создание задачи в списке
function createTaskItem(task) {
  if (task.id === editId) {
    return createEditItem(task);
  }

  const item = createElement('li', 'task');
  if (task.done) {
    item.classList.add('task--done');
  }

  const checkbox = createElement('input', 'task__checkbox');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', function () {
    toggleTask(task.id);
  });

  const info = createElement('div', 'task__info');
  const text = createElement('span', 'task__text', task.text);
  const date = createElement('time', 'task__date', formatDate(task.date));
  if (task.date) {
    date.dateTime = task.date;
  }
  info.append(text, date);

  const buttons = createElement('div', 'task__buttons');

  const editButton = createElement('button', 'btn btn--edit', 'Изменить');
  editButton.type = 'button';
  editButton.addEventListener('click', function () {
    editId = task.id;
    renderTasks();
  });

  const deleteButton = createElement('button', 'btn btn--delete', 'Удалить');
  deleteButton.type = 'button';
  deleteButton.addEventListener('click', function () {
    deleteTask(task.id);
  });

  buttons.append(editButton, deleteButton);
  item.append(checkbox, info, buttons);
  return item;
}

// задача в режиме редактирования
function createEditItem(task) {
  const item = createElement('li', 'task task--edit');

  const textField = createElement('input', 'input task__edit-text');
  textField.type = 'text';
  textField.value = task.text;

  const dateField = createElement('input', 'input task__edit-date');
  dateField.type = 'date';
  dateField.value = task.date;

  const buttons = createElement('div', 'task__buttons');

  const saveButton = createElement('button', 'btn btn--add', 'Сохранить');
  saveButton.type = 'button';
  saveButton.addEventListener('click', function () {
    saveTask(task.id, textField.value.trim(), dateField.value);
  });

  const cancelButton = createElement('button', 'btn btn--delete', 'Отмена');
  cancelButton.type = 'button';
  cancelButton.addEventListener('click', function () {
    editId = null;
    renderTasks();
  });

  buttons.append(saveButton, cancelButton);
  item.append(textField, dateField, buttons);
  return item;
}

// сохранение изменений
function saveTask(id, text, date) {
  if (text === '') {
    return;
  }

  tasks.forEach(function (task) {
    if (task.id === id) {
      task.text = text;
      task.date = date;
    }
  });

  editId = null;
  renderTasks();
}

// отметка выполнения
function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.done = !task.done;
    }
  });
  renderTasks();
}

// удаление задачи
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  renderTasks();
}

// сохранение в localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// загрузка из localStorage
function loadTasks() {
  const data = localStorage.getItem('tasks');
  if (data) {
    tasks = JSON.parse(data);
  }
}

// сортировка по дате
function sortByDate(list) {
  list.sort(function (a, b) {
    if (!a.date && !b.date) {
      return 0;
    }
    if (!a.date) {
      return 1;
    }
    if (!b.date) {
      return -1;
    }

    if (sortSelect.value === 'asc') {
      return new Date(a.date) - new Date(b.date);
    }
    return new Date(b.date) - new Date(a.date);
  });
}

// задачи для показа
function getVisibleTasks() {
  let list = tasks.slice();

  if (filterSelect.value === 'active') {
    list = list.filter(function (task) {
      return !task.done;
    });
  } else if (filterSelect.value === 'done') {
    list = list.filter(function (task) {
      return task.done;
    });
  }

  const search = searchInput.value.trim().toLowerCase();
  if (search !== '') {
    list = list.filter(function (task) {
      return task.text.toLowerCase().includes(search);
    });
  }

  if (sortSelect.value !== 'none') {
    sortByDate(list);
  }

  return list;
}

// вывод списка
function renderTasks() {
  taskList.innerHTML = '';

  const visibleTasks = getVisibleTasks();
  visibleTasks.forEach(function (task) {
    taskList.append(createTaskItem(task));
  });

  if (visibleTasks.length === 0) {
    if (tasks.length === 0) {
      emptyText.textContent = 'Задач пока нет';
    } else {
      emptyText.textContent = 'Ничего не найдено';
    }
    emptyText.style.display = 'block';
  } else {
    emptyText.style.display = 'none';
  }

  saveTasks();
}

// добавление задачи
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const text = textInput.value.trim();
  if (text === '') {
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    date: dateInput.value,
    done: false
  };

  tasks.push(task);
  form.reset();
  renderTasks();
});

sortSelect.addEventListener('change', renderTasks);
filterSelect.addEventListener('change', renderTasks);
searchInput.addEventListener('input', renderTasks);

loadTasks();
renderTasks();
