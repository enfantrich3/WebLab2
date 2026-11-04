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
