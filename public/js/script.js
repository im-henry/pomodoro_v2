if (Notification.permission === 'default') {
    Notification.requestPermission(); // Solicitar permiso si no está otorgado
}

const notifyUser = () => {
    if (Notification.permission === 'granted') {
        new Notification('¡Tiempo completado!', {
            body: 'Tu tiempo Pomodoro ha terminado.',
        });
    }
};

/**Button by: Copyright (c) 2024 by Aaron Iker (https://codepen.io/aaroniker/pen/abzOdRR) */
document.querySelectorAll('.play-pause-button').forEach(button => {
    button.addEventListener('click', e => {
        //Sound
        const audio = new Audio('media/start_button.mp3');
        audio.play().catch(error => {
        console.error("Error playing sound:", error);
        }); 

        if(button.classList.contains('playing')) {
            button.classList.remove('paused', 'playing');
            button.classList.add('paused');
        } else {
            if(button.classList.contains('paused')) {
                button.classList.remove('paused', 'playing');
                button.classList.add('playing');
            }
        }
    });
});

function pause_button() {
    const button = document.getElementById('play-timer');
    if (button) {
        if (button.classList.contains('playing')) {
            button.classList.remove('paused', 'playing');
            button.classList.add('paused');
        }
    }
}

/**Time settings buttons */
document.querySelectorAll('.button-56').forEach((button) => {
    button.addEventListener('click', () => {
        //Pass all to inactive
        document.querySelectorAll('.button-56').forEach((btn) => {
            btn.classList.remove('active');
        });
        //Sound
        const audio = new Audio('media/button.mp3');
        audio.play().catch(error => {
        console.error("Error playing sound:", error);
        }); 
        //Add active class
        button.classList.add('active');
    });
});

/**Modal Pomo Settings aria-label */
const modal = document.getElementById('pomo-settings');
const openButton = document.getElementById('modal-pomosettings');
const closeButton = document.getElementById('close-settings');

// Abrir modal
openButton.addEventListener('click', () => {
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  closeButton.focus(); // Enfocar el botón "Cerrar" dentro del modal
});

// Cerrar modal
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  openButton.focus(); // Devolver el foco al botón que abrió el modal
});

/**Pomodoro Timer */
let intervalId = null;
let isPaused = true;

/**Pomodoro Timing Settings */
let pomodoroTime = 25;
let shortRestTime = 5;
let longRestTime = 15;
let m = pomodoroTime;
let s = 0;
let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');
let mm = document.getElementById('mm');
let ss = document.getElementById('ss');
let dotM = document.querySelector('.m_dot');
let dotS = document.querySelector('.s_dot');

//Display time
document.title = `${pomodoroTime}:00 - PomoTimer`;

mm.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'stroke-dashoffset') {
        // La transición de strokeDashoffset ha terminado
        dotM.style.opacity = 1; // Muestra el dotM
    }
});
ss.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'stroke-dashoffset') {
        // La transición de strokeDashoffset ha terminado
        dotS.style.opacity = 1; // Muestra el dotM
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.set-time').addEventListener('click', () => {
        pomodoroTime = parseInt(document.getElementById('focus-time-setting').value) || 25;
        shortRestTime = parseInt(document.getElementById('short-rest-setting').value) || 5;
        longRestTime = parseInt(document.getElementById('long-rest-setting').value) || 15;

        // Guardar los valores en localStorage
        localStorage.setItem('pomodoroTime', pomodoroTime);
        localStorage.setItem('shortRestTime', shortRestTime);
        localStorage.setItem('longRestTime', longRestTime);

        console.log('Configuración guardada en localStorage:', { pomodoroTime, shortRestTime, longRestTime });

        // Simular un clic en el botón .close-and-save
        const closeButton = document.querySelector('.close-and-save');
        closeButton.click(); // Simular el clic
        console.log('Supuestamente ya hice el click...');
    });
});



//Display correct time after saving changes on settings
document.querySelector('.close-and-save').addEventListener('click', () => {
    updateDisplay();
    const mode = getCurrentMode(); 
    // Determine title based on mode
    switch (mode) {
        case 'pomodoro':
            m = pomodoroTime;
            s = 0;
            updateDisplay();
            break;
        case 'short-rest':
            m = shortRestTime;
            s = 0;
            updateDisplay();
            break;
        case 'long-rest':
            m = longRestTime;
            s = 0;
            updateDisplay();
            break;
        }
})

/**Display according to the active mode*/
updateDisplay();
document.getElementById('pomodoro').addEventListener('click', () => {
    clearInterval(intervalId);
    m = pomodoroTime;
    s = 0;
    isPaused = true;
    updateDisplay();
    pause_button(); 
    const wmode = getCurrentMode(); 
    updateTabTime(wmode)
})
document.getElementById('short-rest').addEventListener('click', () => {
    clearInterval(intervalId);
    m = shortRestTime;
    s = 0;
    isPaused = true;
    updateDisplay();
    pause_button();
    const wmode = getCurrentMode(); 
    updateTabTime(wmode)
})
document.getElementById('long-rest').addEventListener('click', () => {
    clearInterval(intervalId);
    m = longRestTime;
    s = 0;
    isPaused = true;
    updateDisplay();
    pause_button();
    const wmode = getCurrentMode(); 
    updateTabTime(wmode)
})

/**Start-button logic */
let endTime; // Tiempo cuando el temporizador debe terminar

document.getElementById('play-timer').addEventListener('click', () => {
    if (isPaused) {
        // Calcular tiempo de finalización
        endTime = new Date().getTime() + (m * 60 + s) * 1000;

        // Iniciar temporizador
        intervalId = setInterval(() => {
            const now = new Date().getTime();
            const remainingTime = endTime - now;

            if (remainingTime <= 0) {
                clearInterval(intervalId);
                m = 0;
                s = 0;
                switchMode();
                newMode = getCurrentMode();
                updateTabTime(newMode);
                pause_button();
                isPaused = true;

                console.log("Reached 0!!!");
                const audio = new Audio('media/bell_sound.mp3');
                audio.play().catch(error => {
                    console.error("Error playing sound:", error);
                });
                notifyUser(); // Enviar notificación como respaldo

            } else {
                // Calcular minutos y segundos restantes
                m = Math.floor(remainingTime / (1000 * 60));
                s = Math.floor((remainingTime % (1000 * 60)) / 1000);

                // Actualizar vista
                displaym = m < 10 ? '0' + m : m;
                displays = s < 10 ? '0' + s : s;

                minutes.innerHTML = displaym + 'min';
                seconds.innerHTML = displays + 'sec';
                mm.style.strokeDashoffset = 440 - (440 * m) / 60;
                ss.style.strokeDashoffset = 440 - (440 * s) / 60;
                dotM.style.transform = `rotate(${m * 6}deg)`;
                dotS.style.transform = `rotate(${s * 6}deg)`;

                // Actualizar título de la pestaña
                const wmode = getCurrentMode();
                if (wmode === 'pomodoro') {
                    document.title = `${displaym}:${displays} - Focus Time`;
                } else {
                    document.title = `${displaym}:${displays} - Rest Time`;
                }
            }
        }, 1000);

        isPaused = false;
    } else {
        clearInterval(intervalId);
        isPaused = true;
    }
});

/**Skip button logic */
document.querySelector('.skip-button').addEventListener('click', () => {
    //Sound
    const audio = new Audio('media/skip_button.mp3');
    audio.play().catch(error => {
    console.error("Error playing sound:", error);
    }); 

    if (!isPaused) {
        isPaused = true;
        clearInterval(intervalId);
        pause_button();
        switchMode();
        const wmode = getCurrentMode(); 
        updateTabTime(wmode)
    } else {
        if (isPaused) {
        clearInterval(intervalId);
        switchMode();
        pause_button()
        const wmode = getCurrentMode(); 
        updateTabTime(wmode)
        }
    }
})

function updateDisplay() {
    //add 0 before displaying single digit
    displaym = m < 10 ? '0' + m : m;
    displays = s < 10 ? '0' + s : s;
    //set time and label
    minutes.innerHTML = displaym + 'min';
    seconds.innerHTML = displays + 'sec';
    //set time circular indicator
    mm.style.strokeDashoffset = 440 - (440 * m) / 60;
    ss.style.strokeDashoffset = 440 - (440 * s) / 60;
    //Hide dotM during animation
    dotM.style.opacity = '0';
    dotS.style.opacity = '0';
    //set dot time position indicator
    dotM.style.transform = `rotate(${m * 6}deg)`;
    dotS.style.transform = `rotate(${s * 6}deg)`;
}

/**Function for switching modes */
let pomodoroCount = 0;
let timeinFocus = 0;
function getCurrentMode() {
    const activeButton = document.querySelector('.button-56.active');
    return activeButton ? activeButton.id: "pomodoro"; //default for pomodoro if no active button
}

function switchMode() {
    const currentMode = getCurrentMode();
    if (currentMode === 'pomodoro') {
        pomodoroCount += 1;
        const pomoCounter = document.querySelector('.num-pomos');
        pomoCounter.textContent = `${pomodoroCount}`;

        const pomoTimeCounter = document.querySelector('.focus-time');
        timeinFocus += pomodoroTime;

        const hours = Math.floor(timeinFocus / 60); // Obtiene la parte entera como horas
        const minutes = timeinFocus % 60;

        pomoTimeCounter.textContent = `${hours}h ${minutes}m`;
        console.log(`pomodoroCount: ${pomodoroCount}.`);
        if (pomodoroCount % 4 === 0) {
            setMode("long-rest", longRestTime);
        } else {
            setMode("short-rest", shortRestTime);
        }
    } else {
        setMode("pomodoro", pomodoroTime);
    }
}

function setMode(mode, time) {
    document.querySelectorAll('.button-56').forEach((btn) => {
        btn.classList.remove('active');
    });
    document.getElementById(mode).classList.add('active');
    //Update time
    m = time;
    s = 0;
    updateDisplay();
}

/**To-Do List */
const list = document.getElementById('tasks'); // Actualizado a "tasks"
const taskNameInput = document.getElementById('new-task'); // Campo de entrada actualizado
const saveTaskButton = document.getElementById('save-task-btn'); // Botón actualizado

// Función para guardar tareas en Local Storage
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(task => {
        const taskName = task.querySelector('span').innerText;
        tasks.push({ taskName });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardar como JSON en Local Storage
}

// Cargar desde Local Storage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(({ taskName }) => {
            addTaskToList(taskName);
        });
    }
}

window.addEventListener('load', () => {
    const savedPomodoroTime = localStorage.getItem('pomodoroTime');
    const savedShortRestTime = localStorage.getItem('shortRestTime');
    const savedLongRestTime = localStorage.getItem('longRestTime');

    if (savedPomodoroTime) {
        pomodoroTime = parseInt(savedPomodoroTime);
        document.getElementById('focus-time-setting').value = pomodoroTime;
    }
    
    if (savedShortRestTime) {
        shortRestTime = parseInt(savedShortRestTime);
        document.getElementById('short-rest-setting').value = shortRestTime;
    }
    
    if (savedLongRestTime) {
        longRestTime = parseInt(savedLongRestTime);
        document.getElementById('long-rest-setting').value = longRestTime;
    }

    console.log('Configuración cargada desde localStorage:', { pomodoroTime, shortRestTime, longRestTime });

    clearInterval(intervalId);
    m = pomodoroTime;
    s = 0;
    isPaused = true;
    updateDisplay();
    pause_button(); 
    const wmode = getCurrentMode(); 
    updateTabTime(wmode)
});

// Añadir tarea a la lista y al DOM
function addTaskToList(taskName) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.innerHTML = `
        <div class="task-content">
            <span>${taskName}</span>
            <div class="dropdown">
                <button class="options-button dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="public/images/ellipsis-vertical.png" alt="task options">
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item edit-task" href="#"><img src="public/images/edit-task.png" alt="edit task">Edit task</a></li>
                    <li><a class="dropdown-item delete-task" href="#"><img src="public/images/trash.png" alt="delete task">Delete</a></li>
                </ul>
            </div>
        </div>
    `;
    list.appendChild(li);

    // Añadir funcionalidad de eliminar tarea solo al botón "Delete"
    li.querySelector('.delete-task').addEventListener('click', (event) => {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace
        li.remove(); // Elimina el elemento li de la lista
        saveTasksToLocalStorage(); // Guarda los cambios en el almacenamiento local
    });

    // Añadir funcionalidad de editar tarea
    li.querySelector('.edit-task').addEventListener('click', (event) => {
        event.preventDefault();
        const span = li.querySelector('span');
        const currentText = span.textContent;

        // Convertir el texto en un campo de entrada para editarlo
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.classList.add('edit-task-input');
        span.replaceWith(input);
        input.focus();

        // Crear el botón de guardar
        const saveButton = document.createElement('button');
        saveButton.textContent = 'SAVE';
        saveButton.classList.add('save-button');

        // Deshabilitar el dropdown y evitar que se despliegue
        const dropdown = li.querySelector('.dropdown');
        const dropdownButton = dropdown.querySelector('.options-button');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        // Deshabilitar el botón del dropdown para evitar que se despliegue
        dropdownButton.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.remove('show'); // Eliminar el show para asegurarnos de que no se despliegue
        dropdownButton.disabled = true; // Deshabilitar el botón del dropdown
        dropdown.replaceWith(saveButton); // Reemplazar el dropdown con el botón SAVE

        // Función para guardar la tarea
        const saveTask = () => {
            const newText = input.value.trim();
            if (newText) {
                const updatedSpan = document.createElement('span');
                updatedSpan.textContent = newText;
                input.replaceWith(updatedSpan); // Reemplazar el input con el nuevo texto
                saveButton.replaceWith(dropdown); // Restaurar el dropdown
                dropdownButton.disabled = false; // Habilitar el botón del dropdown
                saveTasksToLocalStorage(); // Guardar en el local storage
            } else {
                alert('Task description cannot be empty!');
                input.focus(); // Volver a enfocar el input si está vacío
            }
        };

        // Guardar al hacer clic en el botón SAVE
        saveButton.addEventListener('click', saveTask);

        // Guardar al presionar Enter
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevenir el comportamiento predeterminado
                saveTask();
            }
        });
    });
}

// Evento para el botón "Guardar tarea"
saveTaskButton.addEventListener('click', () => {
    const taskName = taskNameInput.value.trim();

    if (taskName !== '') {
        addTaskToList(taskName);
        saveTasksToLocalStorage();
        taskNameInput.value = ''; // Limpiar el campo de entrada
    } else {
        alert('Please enter a task description!');
    }
});

// Evento para detectar "Enter" dentro de #new-task
taskNameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        saveTaskButton.click(); // Simula un clic en el botón
    }
});

// Observer para detectar cambios en la lista y actualizar Local Storage
const observerCallback = (mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            saveTasksToLocalStorage();
        }
    }
};

// Evento para resetear tiempos y pomos
const resetButton = document.querySelector('.reset-progress');

resetButton.addEventListener('click', () => {
    const userConfirmedReset = confirm('Are you sure to reset your progress?');
    
    if (userConfirmedReset) {
        // Reiniciar las variables
        pomodoroCount = 0;
        timeinFocus = 0;

        // Actualizar el contador en la interfaz
        const hours = Math.floor(timeinFocus / 60); // Obtiene la parte entera como horas
        const minutes = timeinFocus % 60;
        const pomoTimeCounter = document.querySelector('.focus-time');
        pomoTimeCounter.textContent = `${hours}h ${minutes}m`;
        const pomoCounter = document.querySelector('.num-pomos');
        pomoCounter.textContent = `${pomodoroCount}`;

        // Cambiar el botón por el mensaje temporalmente
        const originalText = resetButton.textContent; // Guardar el texto original
        resetButton.textContent = "💥"; // Cambiar texto

        // Añadir una clase personalizada para simular el estado "deshabilitado"
        resetButton.classList.add('no-click'); // Esta clase solo deshabilitará la interacción visual
        resetButton.style.cursor = 'not-allowed'; // Cambia el cursor para indicar no interactuable

        // Restaurar el botón después de 2 segundos
        setTimeout(() => {
            resetButton.textContent = originalText; // Restaurar el texto original
            resetButton.classList.remove('no-click'); // Eliminar la clase personalizada
            resetButton.style.cursor = 'pointer'; // Restaurar el cursor
        }, 1000);
    }
});

const observer = new MutationObserver(observerCallback);
observer.observe(list, { childList: true });

// Cargar tareas al cargar la página
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

/** Función para actualizar tiempo en tab */
function updateTabTime(mode) {
    // Helper function to format time with leading zero
    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    // Format times
    const showPomoTime = formatTime(pomodoroTime);
    const showSRestTime = formatTime(shortRestTime);
    const showLRestTime = formatTime(longRestTime);

    // Determine title based on mode
    switch (mode) {
        case 'pomodoro':
            document.title = `${showPomoTime}:00 - Focus Time`;
            break;
        case 'short-rest':
            document.title = `${showSRestTime}:00 - Rest Time`;
            break;
        case 'long-rest':
            document.title = `${showLRestTime}:00 - Rest Time`;
            break;
        default:
            document.title = 'Pomodoro Timer';
    }
}

/** Función que ajusta la posición de #pomotimer-article */
function adjustPomotimerPosition() {
    const todoTasks = document.querySelector('.todo-tasks');
    const pomotimerArticle = document.querySelector('#pomotimer-article');
    
    // Obtener la altura de .todo-tasks
    const todoTasksHeight = todoTasks.offsetHeight;
    
    // Si la altura de .todo-tasks es mayor que 300px, ajustamos el top de #pomotimer-article
    if (todoTasksHeight > 300) {
        // Calculamos la diferencia
        const extraHeight = todoTasksHeight - 300;
        
        // Establecemos el top de #pomotimer-article
        pomotimerArticle.style.top = `${extraHeight + 730}px`;  // Sumar la diferencia a 300px (base)
    } else {
        // Si la altura es menor o igual a 300px, mantenemos el top en su valor original
        pomotimerArticle.style.top = '730px';
    }
}

// Crear un MutationObserver para detectar cambios en .todo-tasks
const observer_2 = new MutationObserver(() => {
    adjustPomotimerPosition(); // Ejecutamos la función cada vez que detectamos un cambio
});

// Configuramos el observer para observar cambios en los elementos hijos de .todo-tasks
observer_2.observe(document.querySelector('.todo-tasks'), {
    childList: true,  // Detecta adiciones o eliminaciones de tareas
    subtree: true     // Detecta cambios en los descendientes del contenedor
});

// Llamar a la función al cargar la página por si ya hay tareas
adjustPomotimerPosition();