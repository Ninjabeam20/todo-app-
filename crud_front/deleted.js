const API = "http://localhost:5000/api/todos";

let userId = null;

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

$(document).ready(async () => {
    userId = localStorage.getItem("userId");
    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    const table = $("#deletedTable").DataTable({
        columns: [
            { data: "title" },
            { data: "priority", orderable: false },
            { data: "completed" }
        ]
    });

    const res = await fetch(`${API}?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();

    const deletedTodos = data.filter(t => t.is_deleted);
    
    deletedTodos.forEach(todo => {
        const priority = (todo.priority || "medium").toLowerCase();
        const priorityBadge = getPriorityBadge(priority);
        
        table.row.add({
            title: todo.title,
            priority: priorityBadge,
            completed: todo.completed ? "Yes" : "No"
        });
    });

    table.draw();
});
