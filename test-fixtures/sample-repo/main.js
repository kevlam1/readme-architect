import { nanoid } from 'nanoid';

const KEY = 'sample-todos';

export function loadTodos() {
  return JSON.parse(localStorage.getItem(KEY) ?? '[]');
}

export function addTodo(text) {
  const todos = loadTodos();
  todos.push({ id: nanoid(), text });
  localStorage.setItem(KEY, JSON.stringify(todos));
}
