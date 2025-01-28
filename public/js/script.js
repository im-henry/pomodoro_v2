if (Notification.permission === 'default') {
    Notification.requestPermission(); // Solicitar permiso si no está otorgado
}

/**Button by: Copyright (c) 2024 by Aaron Iker (https://codepen.io/aaroniker/pen/abzOdRR) */
document.querySelectorAll('.play-pause-button').forEach(button => {
    button.addEventListener('click', e => {
        /**Sound
        const audio = new Audio('./media/start_button.mp3');
        audio.play().catch(error => {
        console.error("Error playing sound:", error);
        }); */

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

