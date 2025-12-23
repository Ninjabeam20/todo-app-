const API = "http://localhost:5000/api/todos";

let table;
let todos = [];

$(document).ready(() => {
    table = $("#todosTable").DataTable({
        columns: [
            { data: "checkbox", orderable: false },
            { data: "title" },
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
    const res = await fetch(API);
    const data = await res.json();

    todos = data.filter(t => !t.is_deleted);

    table.clear();

    todos.forEach(todo => {
        table.row.add({
            checkbox: `<input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}" class="toggle">`,
            title: todo.completed ? `<s>${todo.title}</s>` : todo.title,
            created: moment(todo.created_at || new Date()).format("YYYY-MM-DD HH:mm"),
            action: `<button class="btn btn-sm btn-danger delete" data-id="${todo.id}">Delete</button>`
        });
    });

    table.draw();
    bindRowEvents();
}

function bindRowEvents() {
    $(".toggle").off().on("change", async function () {
        const id = $(this).data("id");
        const completed = this.checked ? 1 : 0;
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed })
        });
        loadTodos();
    });

    $(".delete").off().on("click", async function () {
        const id = $(this).data("id");
        await fetch(`${API}/${id}`, { method: "DELETE" });
        loadTodos();
    });
}

async function addTodo() {
    const title = $("#todoInput").val().trim();
    if (!title) return alert("Enter a task");

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    $("#todoInput").val("");
    loadTodos();
}
