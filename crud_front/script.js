// Store todos in localStorage
let todos = [];
let todosTable;

// Initialize DataTable
function initializeTable() {
    todosTable = $('#todosTable').DataTable({
        columns: [
            { data: 'completed', orderable: false, searchable: false },
            { data: 'title' },
            { data: 'createdAt' },
            { data: 'actions', orderable: false, searchable: false }
        ],
        columnDefs: [
            { 
                targets: [0, 3], 
                className: 'text-center',
                width: '100px'
            },
            {
                targets: 1,
                render: function(data, type, row) {
                    if (row.isCompleted) {
                        return '<span class="completed-task">' + data + '</span>';
                    }
                    return data;
                }
            },
            {
                targets: 2,
                render: function(data, type, row) {
                    return moment(data).format('MMM DD, YYYY HH:mm');
                }
            }
        ],
        order: [[2, 'desc']], // Sort by creation date, newest first
        pageLength: 10,
        responsive: true,
        rowCallback: function(row, data) {
            // Add completed-row class if todo is completed
            if (data.isCompleted) {
                $(row).addClass('completed-row');
            }
        }
    });
}

// Load todos from localStorage
function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
    renderTodos();
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Render todos in DataTable
function renderTodos() {
    // Clear existing data
    if (todosTable) {
        todosTable.clear();
    } else {
        initializeTable();
    }

    // Filter out deleted todos
    const activeTodos = todos.filter(todo => !todo.deleted);

    // Add rows to DataTable
    activeTodos.forEach(todo => {
        const checkbox = `<input type="checkbox" class="form-check-input todo-checkbox" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>`;
        const deleteBtn = `<button class="btn btn-danger btn-sm delete-btn" data-id="${todo.id}">Delete</button>`;
        
        const rowData = {
            completed: checkbox,
            title: todo.title,
            createdAt: todo.createdAt,
            actions: deleteBtn,
            isCompleted: todo.completed // Store completion status for rowCallback
        };
        
        todosTable.row.add(rowData);
    });

    todosTable.draw();
    
    // Attach event listeners after drawing
    attachEventListeners();
}

// Attach event listeners to checkboxes and delete buttons
function attachEventListeners() {
    // Checkbox change event
    $('.todo-checkbox').off('change').on('change', function() {
        const todoId = parseInt($(this).data('id'));
        toggleTodo(todoId, $(this).is(':checked'));
    });

    // Delete button click event
    $('.delete-btn').off('click').on('click', function() {
        const todoId = parseInt($(this).data('id'));
        deleteTodo(todoId);
    });
}

// Add new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();

    if (!title) {
        alert('Please enter a task');
        return;
    }

    const newTodo = {
        id: Date.now(), // Use timestamp as unique ID
        title: title,
        completed: false,
        deleted: false,
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();
    
    // Clear input
    input.value = '';
    input.focus();
}

// Toggle todo completion status
function toggleTodo(id, completed) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = completed;
        saveTodos();
        renderTodos();
    }
}

// Delete todo
function deleteTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.deleted = true;
        todo.deletedAt = new Date().toISOString(); // Store deletion timestamp
        saveTodos();
        renderTodos();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadTodos();
    
    // Add button click
    document.getElementById('addBtn').addEventListener('click', addTodo);
    
    // Enter key press in input
    document.getElementById('todoInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTodo();
        }
    });
});
