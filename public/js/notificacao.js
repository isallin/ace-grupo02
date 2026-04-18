{
    const notificationContainer = document.getElementById('notification-container');
    window.notificacao = function(titulo, subtitulo, cor) {
        const toast = document.createElement('div');
        toast.className = 'notification';
        toast.style.backgroundColor = `#${cor}`;
        
        toast.innerHTML = `
            <h4>${titulo}</h4>
            <p>${subtitulo}</p>
        `;

        notificationContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => toast.remove(), 500);
        }, 5000);

        toast.onclick = () => toast.remove();
    };
}