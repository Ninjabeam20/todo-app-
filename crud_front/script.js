const API = "http://localhost:5000/api/todos";

let table;
let todos = [];
let userId = null;

$(document).ready(() => {
    userId = localStorage.getItem("userId");
    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    table = $("#todosTable").DataTable({
        columns: [
            { data: "checkbox", orderable: false },
            { data: "title" },
            { data: "priority", orderable: false },
            { data: "created" },
            { data: "action", orderable: false }
        ]
    });

    loadTodos();

    $("#addBtn").on("click", addTodo);
    $("#todoInput").on("keypress", e => {
        if (e.key === "Enter") addTodo();
    });
});

async function loadTodos() {
    const res = await fetch(`${API}?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();

    todos = data.filter(t => !t.is_deleted);

    table.clear();

    todos.forEach(todo => {
        const priority = (todo.priority || "medium").toLowerCase();
        const priorityBadge = getPriorityBadge(priority);
        
        table.row.add({
            checkbox: `<input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}" class="toggle">`,
            title: todo.completed ? `<s>${todo.title}</s>` : todo.title,
            priority: priorityBadge,
            created: moment(todo.created_at || new Date()).format("YYYY-MM-DD HH:mm"),
            action: `<button class="btn btn-sm btn-danger delete" data-id="${todo.id}">Delete</button>`
        });
    });

    table.draw();
    bindRowEvents();
}

function bindRowEvents() {
    $(".toggle").off().on("change", async function () {//toggle class,off()is used to remove old event listerner ,on is when there is any change tdone to the chceckbox
        const id = $(this).data("id");
        const completed = this.checked ? 1 : 0;
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed, userId })
        });
        loadTodos();
    });

    $(".delete").off().on("click", async function () {
        const id = $(this).data("id");
        await fetch(`${API}/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });
        loadTodos();
    });
}

function getPriorityBadge(priority) {
    const p = priority.toLowerCase();
    if (p === "high") {
        return '<span class="badge bg-danger">High</span>';
    } else if (p === "low") {
        return '<span class="badge bg-success">Low</span>';
    } else {
        return '<span class="badge bg-warning text-dark">Medium</span>';
    }
}

async function addTodo() {
    const title = $("#todoInput").val().trim();
    if (!title) return alert("Enter a task");

    const priority = $("#prioritySelect").val();

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority, userId })
    });

    $("#todoInput").val("");
    $("#prioritySelect").val("medium");
    loadTodos();
}
