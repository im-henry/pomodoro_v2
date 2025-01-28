if (Notification.permission === 'default') {
    Notification.requestPermission(); // Solicitar permiso si no está otorgado
}

/**Button by: Copyright (c) 2024 by Aaron Iker (https://codepen.io/aaroniker/pen/abzOdRR) 
document.querySelectorAll('.play-pause-button').forEach(button => {
    button.addEventListener('click', e => {
        //Sound
        const audio = new Audio('./media/start_button.mp3');
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
});*/

// Crea un contexto de audio global
let audioContext;

document.querySelectorAll('.play-pause-button').forEach(button => {
    button.addEventListener('click', e => {
        // Si el contexto de audio no está desbloqueado, desbloquéalo
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            unlockAudioContext(audioContext);
        }



        // Maneja las clases del botón
        if (button.classList.contains('playing')) {
            button.classList.remove('paused', 'playing');
            button.classList.add('paused');
        } else {
            if (button.classList.contains('paused')) {
                button.classList.remove('paused', 'playing');
                button.classList.add('playing');
            }
        }
    });
});

// Función para desbloquear el AudioContext
function unlockAudioContext(audioContext) {
    // Crea un buffer vacío
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    // Reproduce el buffer vacío como parte de la interacción del usuario
    source.start ? source.start(0) : source.noteOn(0);

    console.log("AudioContext desbloqueado");
}

