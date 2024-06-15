// Select necessary DOM elements
const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");

// Retrieve todos from local storage or initialize an empty array if none exist
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
let filter = '';

// Function to display todos
showTodos();

// Function to generate HTML for a todo item based on its status and index
function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `; 
}

// Function to show all todos in the list
function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

// Function to add a new todo to the list
function addTodo(todo) {
  input.value = ""; // Clear the input field
  todosJson.unshift({ name: todo, status: "pending" }); // Add new todo to the beginning of the array
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Save todos to local storage
  showTodos(); // Update the displayed list
}

// Event listener for adding a todo when pressing Enter
input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

// Event listener for adding a todo when clicking the add button
addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

// Function to update the status of a todo when the checkbox is clicked
function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

// Function to remove a todo item
function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1); // Remove the todo from the array
  showTodos(); // Update the displayed list
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Save updated todos to local storage
}

// Event listener for filter buttons
filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos(); // Update the displayed list based on the selected filter
  });
});

// Event listener to delete all todos
deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Save empty todos array to local storage
  showTodos(); // Update the displayed list
});

// Function to get the current time in 12-hour format
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = String(now.getMinutes()).padStart(2, '0');
  let seconds = String(now.getSeconds()).padStart(2, '0');
  hours = hours % 12 === 0 ? 12 : hours % 12;

  return `${hours}:${minutes}:${seconds}`;
}

// Function to update the displayed time
function updateTime() {
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    timeElement.textContent = getCurrentTime();
  }
}

// Update the time immediately and then every second
updateTime();
setInterval(updateTime, 1000);