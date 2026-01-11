$(document).ready(function() {
    // Escuchar el evento submit del formulario
    $('#loginForm').submit(function(event) {
        event.preventDefault(); // Evita que la página se recargue sola

        const email = $('#email').val();
        const password = $('#password').val();

        if (email === 'user@alke.com' && password === '123456') {
            
            // Inicializar saldo si no existe (Simulación de DB)
            if (!localStorage.getItem('walletBalance')) {
                localStorage.setItem('walletBalance', '500000'); // Saldo inicial
            }
            
            // Guardar nombre de usuario
            localStorage.setItem('userName', 'Alke User');

            // Redireccionar al menú
            window.location.href = 'menu.html';
        } else {
            alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
    });
});