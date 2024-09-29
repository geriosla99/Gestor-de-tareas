document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    async function loadTasks() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/tasks');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const tasks = await response.json();
            updateTaskList(tasks); // Actualizar la lista de tareas
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
        }
    }
    
    function updateTaskList(tasks) {
        taskList.innerHTML = ''; // Limpiar la lista antes de volver a llenarla
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.name;

            // Crear un botón para eliminar la tarea
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = () => deleteTask(task.id); // Llamar a la función deleteTask con el ID de la tarea

            // Crear un botón para editar la tarea
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => editTask(task.id, task.name); // Llamar a la función editTask

            li.appendChild(editButton); // Añadir el botón de editar al elemento de la lista
            li.appendChild(deleteButton); // Añadir el botón de eliminar al elemento de la lista
            taskList.appendChild(li);
        });
    }
    
    async function addTask(event) {
        event.preventDefault(); // Prevenir la recarga de la página
        const taskName = taskInput.value;

        if (taskName) {
            try {
                const response = await fetch('http://127.0.0.1:5000/add_task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ task: taskName })
                });
                if (!response.ok) {
                    throw new Error('Error al agregar la tarea: ' + response.statusText);
                }

                loadTasks(); // Recargar la lista de tareas después de agregar una nueva
                taskInput.value = ''; // Limpiar el campo de entrada
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function deleteTask(taskId) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/delete_task/${taskId}`, {
                method: 'DELETE' // Usar método DELETE
            });
            if (!response.ok) {
                throw new Error('Error al eliminar la tarea: ' + response.statusText);
            }
            loadTasks(); // Recargar la lista de tareas después de eliminar
        } catch (error) {
            console.error(error);
        }
    }

    async function editTask(taskId, currentName) {
        const newName = prompt('Edita la tarea:', currentName); // Mostrar un cuadro de entrada para editar

        if (newName) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/edit_task/${taskId}`, {
                    method: 'PUT', // Usar método PUT para actualizar
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ task: newName })
                });
                if (!response.ok) {
                    throw new Error('Error al editar la tarea: ' + response.statusText);
                }
                loadTasks(); // Recargar la lista de tareas después de editar
            } catch (error) {
                console.error(error);
            }
        }
    }

    // Configurar el evento para el formulario después de que el DOM esté cargado
    document.getElementById('taskForm').addEventListener('submit', addTask);
    loadTasks(); // Cargar las tareas cuando la página esté lista
});
