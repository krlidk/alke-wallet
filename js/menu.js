$(document).ready(function() {
    // Verificar si el usuario está logueado
    const user = localStorage.getItem('userName');
    if (!user) {
        window.location.href = 'login.html'; // Si no hay usuario, devolver al login
    }

    // Obtener saldo actual
    let balance = localStorage.getItem('walletBalance');
    
    // Si por alguna razón no hay saldo, poner 0
    if (!balance) balance = 0;

    $('#userBalance').text(`$${parseInt(balance).toLocaleString('es-CL')}`);
});