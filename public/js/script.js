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
let m = 25;
let s = 1;

//
document.querySelector('.set-time').addEventListener('click', function() {
    const focusTimeValue = document.getElementById('focus-time-setting').value;
  
    console.log('Focus time obtained:' + focusTimeValue);
    m = parseInt(focusTimeValue, 10);
    s = 1;
    console.log('m changed to ${m} and s changed to 0');
  });

let intervalId = setInterval(() => {
    let minutes = document.getElementById('minutes');
    let seconds = document.getElementById('seconds');

    let mm = document.getElementById('mm');
    let ss = document.getElementById('ss');

    let dotM = document.querySelector('.m_dot');
    let dotS = document.querySelector('.s_dot');
    
    s--;
    if (s < 0) {
        s = 59;
        m--;
        if (m < 0) {
            m = 0;
        }
    }

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

    //stop clock when reaching limit
    if (displaym === '00' && displays === '00') {
        clearInterval(intervalId);
        var duration = 3.5 * 1000;

    }
}, 1000);

