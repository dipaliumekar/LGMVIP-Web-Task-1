const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const completedTasksList = document.getElementById("completedTasks");



addBtn.addEventListener("click", addTask);

function addTask() {
  const taskText = todoInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const listItem = document.createElement("li");
  listItem.innerHTML = `
      <input type="checkbox">
      <input type="text" class="taskInput" value="${taskText}">
      <button class="deleteBtn"><span class="deleteIcon"><i class='fas fa-trash' style=color:white;></span></i>
  </button>
  `;

  todoList.appendChild(listItem);
  todoInput.value = "";

  const deleteBtn = listItem.querySelector(".deleteBtn");
  deleteBtn.addEventListener("click", deleteTask);

  const taskInput = listItem.querySelector(".taskInput");
  taskInput.addEventListener("click", enableEdit);

  saveTasksToLocalStorage();
}

function enableEdit(event) {
  const taskInput = event.target;
  taskInput.readOnly = false;
  taskInput.focus();

  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      taskInput.blur();
    }
  });


  taskInput.addEventListener("blur", function () {
    taskInput.readOnly = true;

    saveTasksToLocalStorage();
  });
}

function deleteTask(event) {
  const listItem = event.target.closest("li");
  const listContainer = listItem.parentElement;

  listContainer.removeChild(listItem);

  saveTasksToLocalStorage();
}

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const listItem = checkbox.parentElement;

  if (checkbox.checked) {
    
    completedTasksList.appendChild(listItem);
  } else {

    todoList.appendChild(listItem);
  }

  saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
  const tasks = [];
  const taskItems = document.querySelectorAll("#todoList li");
  const CompletedtaskItems = document.querySelectorAll("#completedTasks li");

  taskItems.forEach((item) => {
    const taskText = item.querySelector(".taskInput").value;
    const isCompleted = item.querySelector('input[type="checkbox"]').checked;
    tasks.push({ text: taskText, completed: isCompleted });
  });

  CompletedtaskItems.forEach((item) => {
    const taskText = item.querySelector(".taskInput").value;
    const isCompleted = item.querySelector('input[type="checkbox"]').checked;
    tasks.push({ text: taskText, completed: isCompleted });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasksJSON = localStorage.getItem("tasks");

  if (tasksJSON) {
    const tasks = JSON.parse(tasksJSON);

    todoList.innerHTML = "";
    completedTasksList.innerHTML = "";

    tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <input type="text" class="taskInput" value="${task.text}">
                <button class="deleteBtn"><i class='fas fa-trash' style=color:white;></i></button>
            `;

      if (task.completed) {
        
        listItem.classList.add("completed-task");
        completedTasksList.appendChild(listItem);
      } else {
        
        listItem.classList.add("pending-task");
        todoList.appendChild(listItem);
      }

      const deleteBtn = listItem.querySelector(".deleteBtn");
      deleteBtn.addEventListener("click", deleteTask);

      const taskInput = listItem.querySelector(".taskInput");
      taskInput.addEventListener("click", enableEdit);
    });
  }
}
todoList.addEventListener("change", handleCheckboxChange);
completedTasksList.addEventListener("change", handleCheckboxChange);
