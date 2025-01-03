/**Button by: Copyright (c) 2024 by Aaron Iker (https://codepen.io/aaroniker/pen/abzOdRR) */
document.querySelectorAll('.play-pause-button').forEach(button => {
    button.addEventListener('click', e => {
        if(button.classList.contains('playing')) {
            button.classList.remove('paused', 'playing');
            button.classList.add('paused');
        } else {
            if(button.classList.contains('paused')) {
                button.classList.add('playing');
            }
        }
        if(!button.classList.contains('paused')) {
            button.classList.add('paused');
        }
    });
});

/**Time settings buttons */
document.querySelectorAll('.button-56').forEach((button) => {
    button.addEventListener('click', () => {
        //Pass all to inactive
        document.querySelectorAll('.button-56').forEach((btn) => {
            btn.classList.remove('active');
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

let m = 25;
let s = 0;

let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');

let mm = document.getElementById('mm');
let ss = document.getElementById('ss');

let dotM = document.querySelector('.m_dot');
let dotS = document.querySelector('.s_dot');

mm.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'stroke-dashoffset') {
        // La transición de strokeDashoffset ha terminado
        dotM.style.opacity = 1; // Muestra el dotM
    }
});

//Display by defect
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

/**Pomodoro Timing Settings */
let pomodoroTime = 25;
let shortRestTime = 5;
let longRestTime = 15;

document.querySelector('.set-time').addEventListener('click', () => {
    pomodoroTime = parseInt(document.getElementById('focus-time-setting').value) || 25;
    shortRestTime = parseInt(document.getElementById('short-rest-setting').value) || 5;
    longRestTime = parseInt(document.getElementById('long-rest-setting').value) || 15;
})

/**Display according to the active mode*/
updateDisplay();

document.getElementById('pomodoro').addEventListener('click', () => {
    m = pomodoroTime;
    s = 0;
    updateDisplay();
})
document.getElementById('short-rest').addEventListener('click', () => {
    m = shortRestTime;
    s = 0;
    updateDisplay();
})
document.getElementById('long-rest').addEventListener('click', () => {
    m = longRestTime;
    s = 0;
    updateDisplay();
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

    // Wait for the circular indicator's transition to finish (assuming CSS transition duration is 0.5s)
    setTimeout(() => {
        // Set dot time position indicator
        dotM.style.transform = `rotate(${m * 6}deg)`;
        dotS.style.transform = `rotate(${s * 6}deg)`;

        //Show dot after animation
        dotM.style.opacity = '1';
    }, 500); // Adjust this timeout duration to match the CSS transition time
}

/**Start-button logic */
document.querySelector('.start-stop-button').addEventListener('click', () => {
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

        }, 1000);

        isPaused = false;
        
    } else {
        //if not in pause, stop the timer
        clearInterval(intervalId);
        isPaused = true;
       
    }
});

/**Pomodoro Resting Times Logic + Counters */






