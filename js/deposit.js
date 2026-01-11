$(document).ready(function() {
    // Obtener saldo actual
    let currentBalance = parseInt(localStorage.getItem('walletBalance')) || 0;

    $('#depositForm').submit(function(event) {
        event.preventDefault();

        // Obtener monto del input
        const amount = parseInt($('#depositAmount').val());

        if (amount > 0) {
            const newBalance = currentBalance + amount;

            // Guardar nuevo saldo
            localStorage.setItem('walletBalance', newBalance);

            //Guardar transacción en historial
            saveTransaction('Depósito', amount, 'Ingreso');

            alert(`Depósito exitoso. Nuevo saldo: $${newBalance}`);
            
            // Redirigir al menú para ver el cambio
            window.location.href = 'menu.html';
        } else {
            alert('Por favor ingresa un monto válido.');
        }
    });

    // Función auxiliar para guardar en historial (simulado)
    function saveTransaction(desc, amount, type) {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.unshift({ // Agregar al principio del array
            date: new Date().toLocaleDateString(),
            desc: desc,
            amount: amount,
            type: type
        });
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
});