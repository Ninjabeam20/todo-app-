// Store todos from localStorage
let todos = [];
let deletedTable;

// Initialize DataTable for deleted todos
function initializeTable() {
    deletedTable = $('#deletedTable').DataTable({
        columns: [
            { data: 'completed', orderable: false, searchable: false },
            { data: 'title' },
            { data: 'createdAt' },
            { data: 'deletedAt' }
        ],
        columnDefs: [
            { 
                targets: 0, 
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
            },
            {
                targets: 3,
                render: function(data, type, row) {
                    return moment(data).format('MMM DD, YYYY HH:mm');
                }
            }
        ],
        order: [[3, 'desc']], // Sort by deletion date, newest first
        pageLength: 10,
        responsive: true,
        rowCallback: function(row, data) {
            // Add completed-row class if todo is completed
            if (data.isCompleted) {
                $(row).addClass('completed-row');
            }
            // Add deleted-row class for visual distinction
            $(row).addClass('deleted-row');
        }
    });
}

// Load deleted todos from localStorage
function loadDeletedTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
    renderDeletedTodos();
}

// Render deleted todos in DataTable
function renderDeletedTodos() {
    // Clear existing data
    if (deletedTable) {
        deletedTable.clear();
    } else {
        initializeTable();
    }

    // Filter only deleted todos
    const deletedTodos = todos.filter(todo => todo.deleted === true);

    // Add rows to DataTable
    deletedTodos.forEach(todo => {
        const checkbox = `<input type="checkbox" class="form-check-input" data-id="${todo.id}" ${todo.completed ? 'checked' : ''} disabled>`;
        
        const rowData = {
            completed: checkbox,
            title: todo.title,
            createdAt: todo.createdAt || todo.created_at || new Date().toISOString(),
            deletedAt: todo.deletedAt || todo.deleted_at || new Date().toISOString(),
            isCompleted: todo.completed
        };
        
        deletedTable.row.add(rowData);
    });

    deletedTable.draw();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadDeletedTodos();
    
    // Search functionality - DataTables has built-in search, but we can enhance it
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            deletedTable.search(this.value).draw();
        });
        
        // Clear search on Escape key
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                this.value = '';
                deletedTable.search('').draw();
                this.blur();
            }
        });
    }
});

