// 1. SELECTORES: Traemos todo lo que necesitamos del HTML
const formulario = document.getElementById('form-guardar-contacto');
const listaContactos = document.getElementById('lista-contactos');
const modalElement = document.getElementById('modalContacto');
const modalBootstrap = new bootstrap.Modal(modalElement);
const btnNuevoContacto = document.getElementById('btn-nuevo-contacto');
const TRANSFER_LIMIT = 1000;

const modalTransferEl = document.getElementById('modalTransfer');
const modalTransfer = modalTransferEl ? new bootstrap.Modal(modalTransferEl) : null;
const transferContactName = document.getElementById('transfer-contact-name');
const transferLimitDisplay = document.getElementById('transfer-limit-display');
const transferAmountInput = document.getElementById('transfer-amount');
const btnConfirmTransfer = document.getElementById('btn-confirm-transfer');

let misContactos = [];
let contactoSeleccionadoIndex = null;

function cargarContactosGuardados() {
    const contactosGuardados = sessionStorage.getItem('misContactos');
    if (contactosGuardados) {
        misContactos = JSON.parse(contactosGuardados);
        mostrarContactosEnPantalla();
    }
}

cargarContactosGuardados();

btnNuevoContacto?.addEventListener('click', () => modalBootstrap.show());

formulario?.addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre-contacto').value.trim();
    const banco = document.getElementById('banco-contacto').value;
    const cbu = document.getElementById('cbu-contacto').value.trim();
    const alias = document.getElementById('alias-contacto').value.trim();

    if (!nombre || !banco || !cbu) {
        alert('Por favor completa Nombre, Banco y CBU.');
        return;
    }

    const nuevoContacto = { nombre, banco, cbu, alias };
    misContactos.push(nuevoContacto);
    sessionStorage.setItem('misContactos', JSON.stringify(misContactos));

    mostrarContactosEnPantalla();

    formulario.reset();
    modalBootstrap.hide();

    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
});

function mostrarContactosEnPantalla() {
    listaContactos.innerHTML = '';

    if (misContactos.length === 0) {
        listaContactos.innerHTML = '<p class="text-muted">No hay contactos guardados.</p>';
        return;
    }

    misContactos.forEach(function(contacto, idx) {
        const tarjeta = `
            <div class="card mb-2 p-3 shadow-sm">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0">${contacto.nombre}</h5>
                        <small class="text-muted">${contacto.banco} - ${contacto.alias}</small>
                        <br>
                        <small class="text-muted">CBU: ${contacto.cbu}</small>
                    </div>
                    <button class="btn btn-outline-primary btn-sm btn-seleccionar" data-idx="${idx}">Seleccionar</button>
                </div>
            </div>
        `;
        listaContactos.innerHTML += tarjeta;
    });

    document.querySelectorAll('.btn-seleccionar').forEach(btn => {
        btn.addEventListener('click', abrirModalTransferencia);
    });
}

function abrirModalTransferencia(e) {
    const idx = Number(e.target.getAttribute('data-idx'));
    contactoSeleccionadoIndex = idx;
    const contacto = misContactos[idx];

    transferContactName.textContent = contacto.nombre;

    const saldoActual = parseFloat(sessionStorage.getItem('miSaldo')) || 0;
    const limiteReal = Math.min(TRANSFER_LIMIT, saldoActual);
    transferLimitDisplay.textContent = `${limiteReal.toFixed(2)} BTC`;
    transferAmountInput.value = '';
    transferAmountInput.max = limiteReal;
    transferAmountInput.placeholder = `Máximo: ${limiteReal.toFixed(2)}`;

    if (modalTransfer) modalTransfer.show();
}

function guardarTransaccion(tipo, contactoNombre, monto) {
    const transacciones = JSON.parse(sessionStorage.getItem('misTransacciones')) || [];
    
    const fecha = new Date();
    const fechaFormato = `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;
    
    const transaccion = {
        fecha: fechaFormato,
        tipo: tipo,
        contacto: contactoNombre,
        monto: monto,
        timestamp: fecha.getTime()
    };
    
    transacciones.push(transaccion);
    sessionStorage.setItem('misTransacciones', JSON.stringify(transacciones));
}

btnConfirmTransfer?.addEventListener('click', function() {
    const monto = parseFloat(transferAmountInput.value);
    if (!monto || monto <= 0) {
        alert('Ingrese un monto válido mayor a 0.');
        return;
    }

    const saldoActual = parseFloat(sessionStorage.getItem('miSaldo')) || 0;
    const limiteReal = Math.min(TRANSFER_LIMIT, saldoActual);
    if (monto > limiteReal) {
        alert(`El monto supera el límite por transferencia (${limiteReal.toFixed(2)}).`);
        return;
    }

    const nuevoSaldo = saldoActual - monto;
    sessionStorage.setItem('miSaldo', nuevoSaldo.toString());

    const contacto = misContactos[contactoSeleccionadoIndex];
    guardarTransaccion('Transferencia enviada', contacto.nombre, monto);

    const saldoEl = document.getElementById('saldo-display');
    if (saldoEl) saldoEl.textContent = nuevoSaldo.toFixed(2) + ' BTC';

    if (modalTransfer) modalTransfer.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();

    alert('Transferencia realizada con éxito! Nuevo saldo: ' + nuevoSaldo.toFixed(2) + ' BTC');
});
