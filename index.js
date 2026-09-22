

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// selecting elements


const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const formBtn = document.querySelector("#form-btn")
const todoList = document.querySelector("#todo-list");
const taskCount = document.querySelector("#task-count");
const completeCount = document.querySelector("#complete-count");
const cancelBtn = document.querySelector("#cancel-btn");


// all event listners are done here


let isEdit = null;
// adding
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let todoValue = todoInput.value.trim();

    if(todoValue.trim() === "") return;

    if (isEdit) {
        updateEdit(todoValue);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    else {
        const newtodo = {
            id: Date.now(),
            text: todoValue,
            isCompleted: false
        }

        todos.push(newtodo);
        localStorage.setItem("todos", JSON.stringify(todos))
        addTodo(newtodo);
    }

    todoInput.value = ""
    isEdit = null;

});


// event delegation  

todoList.addEventListener("click", (e) => {
    let action = e.target.dataset.action
    let li = e.target.closest("li")
    let id = li?.dataset?.id

    if (action === "delete") {
        deleteTodo(e, id);
    }

    if (action === "edit") {
        editTodo(id);
    }

    if (action === "toggle") {



        todos = todos.map((todo) => {
            if (todo.id === Number(id)) {
                return {
                    ...todo,
                    isCompleted: !todo.isCompleted
                }
            }
            return todo;
        })

        localStorage.setItem("todos", JSON.stringify(todos))
        renderTodo();


    }
})

cancelBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    isEdit = null;
    todoInput.value = "";
    formBtn.textContent = "ADD";

    formBtn.className = "bg-purple-500 hover:bg-purple-600 px-5 py-3 rounded-lg text-white font-bold tracking-widest cursor-pointer";
    cancelBtn.classList.toggle("hidden");
})

// sare functions yaha likhe hai

// adding operation

function renderTodo() {
    todoList.innerHTML = "";
    todos.forEach(todo => {
        addTodo(todo);
    })

}

function addTodo(todo) {
    let li = document.createElement("li");


    // <li class="border border-gray-300 flex gap-2 p-3 bg-pink-100 rounded-xl items-center shadow-md"></li>

    li.dataset.id = todo.id;
    li.className = "border border-gray-300 flex gap-2 p-3 bg-pink-100 rounded-xl items-center shadow-md"

    li.innerHTML = `
                <input data-action ="toggle" type="checkbox" class="h-4 w-4 accent-purple-500 cursor-pointer" ${todo.isCompleted ? "checked" : ""}>
                <p class="flex-1 ${todo.isCompleted ? "line-through text-gray-500" : ""} ">${todo.text}</p>

                <div class="flex gap-2">
                    <button data-action = "edit" class="border border-amber-400 px-3 py-1 text-xs text-amber-600 bg-amber-200 rounded-lg cursor-pointer">Edit</button>
                    
                    <button data-action = "delete" class="border border-red-400 px-3 text-xs text-red-500 bg-pink-200 rounded-lg cursor-pointer">Delete</button>
                </div>`

    todoList.append(li)
    taskCount.textContent = `TASKS (${todos.length})`;
    completeCount.textContent = `COMPLETED : ${todos.filter(todo =>todo.isCompleted).length}`
}

// delete operation
function deleteTodo(e, id) {
    e.target.closest("li").remove();

    todos = todos.filter((todo) => {
        if (todo.id !== Number(id)) {
            return todo;
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos))
    renderTodo()
}

// edit operation

function editTodo(id) {
    isEdit = Number(id);

    currTodo = todos.find((todo) => {
        if (todo.id === isEdit) {
            return todo
        }
    })
    cancelBtn.classList.toggle("hidden");
    todoInput.value = currTodo.text;
    formBtn.textContent = "UPDATE";
    formBtn.className = "bg-amber-400 hover:bg-amber-700 px-5 py-3 rounded-lg text-white font-bold tracking-widest cursor-pointer"
}

function updateEdit(todoValue) {
    todos = todos.map((todo) => {
        if (todo.id === isEdit) {
            return {
                ...todo,
                text: todoValue
            }
        }
        return todo
    })
    formBtn.textContent = "ADD";

    formBtn.className = "bg-purple-500 hover:bg-purple-600 px-5 py-3 rounded-lg text-white font-bold tracking-widest cursor-pointer";
    cancelBtn.classList.toggle("hidden");
    renderTodo()


}

renderTodo()
