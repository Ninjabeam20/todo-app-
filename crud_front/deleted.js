const API = "http://localhost:5000/api/todos";

$(document).ready(async () => {
    const table = $("#deletedTable").DataTable();

    const res = await fetch(API);
    const data = await res.json();

    data.filter(t => t.is_deleted).forEach(todo => {
        table.row.add([
            todo.title,
            todo.completed ? "Yes" : "No"
        ]);
    });

    table.draw();
});
