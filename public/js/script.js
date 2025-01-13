/**Button by: Copyright (c) 2024 by Aaron Iker (https://codepen.io/aaroniker/pen/abzOdRR) */
document.querySelectorAll('.play-pause-button').forEach(button => {
    button.addEventListener('click', e => {
        //Sound
        const audio = new Audio('public/media/start_button.mp3');
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
        const audio = new Audio('public/media/button.mp3');
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

document.querySelector('.set-time').addEventListener('click', () => {
    pomodoroTime = parseInt(document.getElementById('focus-time-setting').value) || 25;
    shortRestTime = parseInt(document.getElementById('short-rest-setting').value) || 5;
    longRestTime = parseInt(document.getElementById('long-rest-setting').value) || 15;
})

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
document.getElementById('play-timer').addEventListener('click', () => {
    if (isPaused) {
        //Start timer
        intervalId = setInterval(() => {
            s--;
            if (s < 0) {
                s = 59;
                m--;
                if (m < 0) {
                    m = 0;
                    s = 0;
                    clearInterval(intervalId);
                    switchMode();

                    // AGREGAR AQUÍ FUNCIÓN
                    newMode = getCurrentMode();
                    updateTabTime(newMode);

                    pause_button();
                    isPaused=true;
                    console.log("Reached 0!!!");
                    const audio = new Audio('public/media/bell_sound.mp3');
                    audio.play().catch(error => {
                        console.error("Error playing sound:", error);
                    });                    
                }
            }
            /**Update view*/
            //add 0 before displaying single digit
            displaym = m < 10 ? '0' + m : m;
            displays = s < 10 ? '0' + s : s;
            //set time and label
            minutes.innerHTML = displaym + 'min';
            seconds.innerHTML = displays + 'sec';
            //set time circular indicator
            mm.style.strokeDashoffset = 440 - (440*m)/60;
            ss.style.strokeDashoffset = 440 - (440*s)/60;
            //set dot time position indicator
            dotM.style.transform = `rotate(${m * 6}deg)`;
            dotS.style.transform = `rotate(${s * 6}deg)`;
            // add time on tab
            const wmode = getCurrentMode();
            /** Función para actualizar tiempo en tab */
            if (wmode === 'pomodoro') {
                document.title = `${displaym}:${displays} - Focus Time`;
            } else {
                document.title = `${displaym}:${displays} - Rest Time`;
            }           
        }, 100);
        isPaused = false;
        
    } else {
        //if not in pause, stop the timer
        clearInterval(intervalId);
        isPaused = true;
    }
});

/**Skip button logic */
document.querySelector('.skip-button').addEventListener('click', () => {
    //Sound
    const audio = new Audio('public/media/skip_button.mp3');
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
function getCurrentMode() {
    const activeButton = document.querySelector('.button-56.active');
    return activeButton ? activeButton.id: "pomodoro"; //default for pomodoro if no active button
}

function switchMode() {
    const currentMode = getCurrentMode();
    if (currentMode === 'pomodoro') {
        const pomoCounter = document.querySelector('.num-pomos');
        pomoCounter.textContent = `${pomodoroCount}`;

        pomodoroCount++;
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

// Cargar tareas desde Local Storage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(({ taskName }) => {
            addTaskToList(taskName);
        });
    }
}

// Añadir tarea a la lista y al DOM
function addTaskToList(taskName) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.innerHTML = `
        <div class="task-content">
            <span>${taskName}</span>
            <button class="delete-task-btn">❌</button>
        </div>
    `;
    list.appendChild(li);

    // Añadir funcionalidad de eliminar tarea
    li.querySelector('.delete-task-btn').addEventListener('click', () => {
        li.remove();
        saveTasksToLocalStorage();
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