$(document).ready(function() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const tableBody = $('#transactionsTableBody');

    tableBody.empty();

    if (transactions.length === 0) {
        tableBody.append('<tr><td colspan="4" class="text-center">No hay movimientos recientes.</td></tr>');
    } else {
        transactions.forEach(t => {
            const isIncome = t.type === 'Ingreso';
            const colorClass = isIncome ? 'text-success' : 'text-danger';
            const symbol = isIncome ? '+' : '-';
            const badgeClass = isIncome ? 'badge-success' : 'badge-danger';
            const icon = isIncome ? 'bi-arrow-down-left' : 'bi-arrow-up-right';

            // Lógica para mostrar detalles bancarios si existen
            let detailsHTML = '';
            if (t.recipient) {
                // Si la transacción tiene datos del destinatario (las nuevas)
                detailsHTML = `
                    <br>
                    <small class="text-muted">
                        <i class="bi bi-bank"></i> ${t.recipient.bank} &bull; ${t.recipient.type} &bull; N° ${t.recipient.number}
                    </small>
                `;
            } else if (!isIncome) {
                // Para transacciones antiguas o sin datos
                detailsHTML = '<br><small class="text-muted">Transferencia enviada</small>';
            }

            const row = `
                <tr>
                    <td class="align-middle">${t.date}</td>
                    <td class="align-middle">
                        <strong>${t.desc}</strong>
                        ${detailsHTML}
                    </td>
                    <td class="align-middle">
                        <span class="badge ${badgeClass} p-2">
                            <i class="bi ${icon}"></i> ${t.type}
                        </span>
                    </td>
                    <td class="align-middle text-right ${colorClass} font-weight-bold">
                        ${symbol}$${t.amount.toLocaleString('es-CL')}
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    }
});