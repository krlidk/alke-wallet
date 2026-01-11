$(document).ready(function() {
    let currentBalance = parseInt(localStorage.getItem('walletBalance')) || 0;
    
    // Variable para guardar temporalmente al destinatario seleccionado para la transacción
    let selectedRecipient = null;

    // 1. CARGA INICIAL DE CONTACTOS (Ahora son OBJETOS)
    let contacts = JSON.parse(localStorage.getItem('walletContactsObj')) || [
        { id: 1, name: "Maria Lopez", bank: "Banco Estado", type: "Cta. RUT", number: "12345678" },
        { id: 2, name: "Juan Perez", bank: "Santander", type: "Cta. Corriente", number: "09876543" },
        { id: 3, name: "Carlos Diaz", bank: "Banco de Chile", type: "Cta. Vista", number: "11223344" }
    ];

    // Función para renderizar la lista lateral
    function renderContactsSideList() {
        const listContainer = $('#contactList');
        listContainer.empty();
        
        contacts.forEach(contact => {
            // Guardamos el objeto entero en data-contact para usarlo al hacer click
            const jsonContact = JSON.stringify(contact); // Convertir a string para guardarlo en atributo HTML
            
            const item = `
                <li class="list-group-item list-group-item-action contact-item-action" style="cursor:pointer" data-contact='${jsonContact}'>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${contact.name}</strong><br>
                            <small class="text-muted">${contact.bank}</small>
                        </div>
                        <span class="badge badge-light"><i class="bi bi-chevron-right"></i></span>
                    </div>
                </li>`;
            listContainer.append(item);
        });
    }
    renderContactsSideList();

    // 2. AUTOCOMPLETAR INTELIGENTE
    $('#contactSearch').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        const suggestionsBox = $('#suggestionsList');
        suggestionsBox.empty();

        // Si borra el texto, limpiamos la selección previa
        if(value === "") {
            selectedRecipient = null;
            $('#selectedContactInfo').hide();
        }

        if (value.length > 0) {
            const matches = contacts.filter(c => c.name.toLowerCase().includes(value));

            if (matches.length > 0) {
                matches.forEach(match => {
                    const jsonMatch = JSON.stringify(match);
                    suggestionsBox.append(`
                        <a href="#" class="list-group-item list-group-item-action suggestion-item" data-contact='${jsonMatch}'>
                            <strong>${match.name}</strong> - <small>${match.bank}</small>
                        </a>
                    `);
                });
                suggestionsBox.show();
            } else {
                suggestionsBox.hide();
            }
        } else {
            suggestionsBox.hide();
        }
    });

    // Función auxiliar para seleccionar contacto (usada por Click y Autocomplete)
    function selectContact(contactObj) {
        selectedRecipient = contactObj;
        
        // Llenar input visualmente
        $('#contactSearch').val(contactObj.name);
        
        // Mostrar detalles bancarios debajo del input
        $('#infoBank').text(`${contactObj.bank} (${contactObj.type})`);
        $('#infoNum').text(contactObj.number);
        $('#selectedContactInfo').slideDown();
        
        // Ocultar sugerencias
        $('#suggestionsList').hide();
    }

    // Evento Click en Sugerencia (Buscador)
    $(document).on('click', '.suggestion-item', function(e) {
        e.preventDefault();
        const contactData = JSON.parse($(this).attr('data-contact'));
        selectContact(contactData);
    });

    // Evento Click en Lista Lateral
    $(document).on('click', '.contact-item-action', function() {
        const contactData = JSON.parse($(this).attr('data-contact'));
        selectContact(contactData);
    });

    // Ocultar sugerencias al hacer clic fuera
    $(document).click(function(e) {
        if (!$(e.target).closest('#contactSearch, #suggestionsList').length) {
            $('#suggestionsList').hide();
        }
    });

    // 3. GUARDAR NUEVO CONTACTO (Con todos los datos)
    $('#saveContactBtn').click(function() {
        const name = $('#newContactName').val().trim();
        const bank = $('#newContactBank').val();
        const type = $('#newContactType').val();
        const number = $('#newContactNumber').val().trim();

        if (name && number) {
            const newContact = {
                id: Date.now(), // ID único basado en tiempo
                name: name,
                bank: bank,
                type: type,
                number: number
            };

            contacts.push(newContact);
            localStorage.setItem('walletContactsObj', JSON.stringify(contacts));
            renderContactsSideList();
            
            // Limpieza y cierre
            $('#addContactForm')[0].reset();
            $('#addContactModal').modal('hide');
            alert(`Contacto ${name} agregado correctamente.`);
        } else {
            alert("Por favor completa el nombre y el número de cuenta.");
        }
    });

    // 4. ENVIAR DINERO (Guardando el detalle en el historial)
    $('#sendMoneyForm').submit(function(event) {
        event.preventDefault();

        const amount = parseInt($('#sendAmount').val());

        if (!selectedRecipient) {
            alert("Por favor selecciona un contacto válido de la lista o búsqueda.");
            return;
        }

        if (amount > 0 && amount <= currentBalance) {
            const newBalance = currentBalance - amount;
            localStorage.setItem('walletBalance', newBalance);

            // --- AQUÍ ESTÁ LA MAGIA DEL HISTORIAL ---
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            
            transactions.unshift({
                date: new Date().toLocaleDateString(),
                // Guardamos el objeto completo del destinatario dentro de la transacción
                recipient: selectedRecipient, 
                desc: `Transferencia a ${selectedRecipient.name}`,
                amount: amount,
                type: 'Egreso'
            });
            
            localStorage.setItem('transactions', JSON.stringify(transactions));

            alert(`Transferencia de $${amount} realizada a ${selectedRecipient.name} (${selectedRecipient.bank}).`);
            window.location.href = 'menu.html';
        } else if (amount > currentBalance) {
            alert("Fondos insuficientes.");
        } else {
            alert("Monto inválido.");
        }
    });
});