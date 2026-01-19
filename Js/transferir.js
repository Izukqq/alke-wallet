<<<<<<< HEAD
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
=======
$(document).ready(function () {
  // SELECTORES
  const $formulario = $('#form-guardar-contacto');
  const $listaContactos = $('#lista-contactos');
  const $modalElement = $('#modalContacto');
  const $btnNuevoContacto = $('#btn-nuevo-contacto');
  const $modalTransferElement = $('#modalTransfer');
  const $transferContactName = $('#transfer-contact-name');
  const $transferLimitDisplay = $('#transfer-limit-display');
  const $transferAmountInput = $('#transfer-amount');
  const $btnConfirmTransfer = $('#btn-confirm-transfer');
  const $saldoDisplay = $('#saldo-display');
  const $inputBusqueda = $('input[placeholder="Buscar contacto o cuenta..."]');

  // Inicializar modales de Bootstrap
  const modalBootstrap = new bootstrap.Modal($modalElement[0]);
  const modalTransfer = $modalTransferElement.length > 0 ? new bootstrap.Modal($modalTransferElement[0]) : null;

  // VARIABLES
  const TRANSFER_LIMIT = 1000;
  let misContactos = [];
  let contactoSeleccionadoIndex = null;
  let contactosFiltrados = [];

  // FUNCIONES

  // Cargar contactos guardados en sessionStorage
  function cargarContactosGuardados() {
    const contactosGuardados = sessionStorage.getItem('misContactos');
    if (contactosGuardados) {
      misContactos = JSON.parse(contactosGuardados);
      contactosFiltrados = [...misContactos];
      mostrarContactosEnPantalla();
    }
  }

  // Filtrar contactos por búsqueda
  function filtrarContactos(termino) {
    termino = termino.toLowerCase().trim();
    
    if (!termino) {
      contactosFiltrados = [...misContactos];
    } else {
      contactosFiltrados = misContactos.filter(contacto => 
        contacto.nombre.toLowerCase().includes(termino) ||
        contacto.alias.toLowerCase().includes(termino) ||
        contacto.cbu.toLowerCase().includes(termino) ||
        contacto.banco.toLowerCase().includes(termino)
      );
    }
    
    mostrarContactosEnPantalla();
  }

  // Mostrar contactos en la pantalla
  function mostrarContactosEnPantalla() {
    $listaContactos.html('');

    if (contactosFiltrados.length === 0) {
      $listaContactos.html('<p class="text-muted text-center">No hay contactos guardados.</p>');
      return;
    }

    contactosFiltrados.forEach(function(contacto) {
      // Encontrar el índice real del contacto en misContactos
      const realIdx = misContactos.indexOf(contacto);
      
      const tarjeta = `
        <div class="card mb-2 p-3 shadow-sm">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-0">${contacto.nombre}</h5>
              <small class="text-muted">${contacto.banco} - ${contacto.alias}</small>
              <br>
              <small class="text-muted">CBU: ${contacto.cbu}</small>
            </div>
            <button class="btn btn-outline-primary btn-sm btn-seleccionar" data-idx="${realIdx}">Seleccionar</button>
          </div>
        </div>
      `;
      $listaContactos.append(tarjeta);
    });

    // Agregar event listeners a botones de seleccionar
    $('.btn-seleccionar').on('click', abrirModalTransferencia);
  }

  // Abrir modal de transferencia
  function abrirModalTransferencia(e) {
    const idx = Number($(e.target).attr('data-idx'));
    contactoSeleccionadoIndex = idx;
    const contacto = misContactos[idx];

    $transferContactName.text(contacto.nombre);

    const saldoActual = parseFloat(sessionStorage.getItem('miSaldo')) || 0;
    const limiteReal = Math.min(TRANSFER_LIMIT, saldoActual);
    $transferLimitDisplay.text(`${limiteReal.toFixed(2)} BTC`);
    $transferAmountInput.val('');
    $transferAmountInput.attr('max', limiteReal);
    $transferAmountInput.attr('placeholder', `Máximo: ${limiteReal.toFixed(2)}`);

    if (modalTransfer) modalTransfer.show();
  }

  // Guardar transacción en sessionStorage
  function guardarTransaccion(tipo, contactoNombre, monto) {
>>>>>>> feature/transacciones
    const transacciones = JSON.parse(sessionStorage.getItem('misTransacciones')) || [];
    
    const fecha = new Date();
    const fechaFormato = `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;
    
    const transaccion = {
<<<<<<< HEAD
        fecha: fechaFormato,
        tipo: tipo,
        contacto: contactoNombre,
        monto: monto,
        timestamp: fecha.getTime()
=======
      fecha: fechaFormato,
      tipo: tipo,
      contacto: contactoNombre,
      monto: monto,
      timestamp: fecha.getTime()
>>>>>>> feature/transacciones
    };
    
    transacciones.push(transaccion);
    sessionStorage.setItem('misTransacciones', JSON.stringify(transacciones));
<<<<<<< HEAD
}

btnConfirmTransfer?.addEventListener('click', function() {
    const monto = parseFloat(transferAmountInput.value);
    if (!monto || monto <= 0) {
        alert('Ingrese un monto válido mayor a 0.');
        return;
=======
  }

  // Limpiar backdrop del modal
  function limpiarBackdrop() {
    const $backdrop = $('.modal-backdrop');
    if ($backdrop.length) $backdrop.remove();
  }

  // EVENTOS

  // Cargar contactos al abrir la página
  cargarContactosGuardados();

  // Click en botón "Nuevo Contacto"
  $btnNuevoContacto.on('click', function () {
    modalBootstrap.show();
  });

  // Submit del formulario de nuevo contacto
  $formulario.on('submit', function(e) {
    e.preventDefault();

    const nombre = $('#nombre-contacto').val().trim();
    const banco = $('#banco-contacto').val();
    const cbu = $('#cbu-contacto').val().trim();
    const alias = $('#alias-contacto').val().trim();

    if (!nombre || !banco || !cbu) {
      alert('Por favor completa Nombre, Banco y CBU.');
      return;
    }

    const nuevoContacto = { nombre, banco, cbu, alias };
    misContactos.push(nuevoContacto);
    contactosFiltrados = [...misContactos];
    sessionStorage.setItem('misContactos', JSON.stringify(misContactos));

    mostrarContactosEnPantalla();
    $formulario[0].reset();
    $inputBusqueda.val('');
    modalBootstrap.hide();
    limpiarBackdrop();
  });

  // Evento de búsqueda en tiempo real
  $inputBusqueda.on('keyup', function() {
    const termino = $(this).val();
    filtrarContactos(termino);
  });

  // Click en botón "Confirmar transferencia"
  $btnConfirmTransfer.on('click', function() {
    const monto = parseFloat($transferAmountInput.val());
    if (!monto || monto <= 0) {
      alert('Ingrese un monto válido mayor a 0.');
      return;
>>>>>>> feature/transacciones
    }

    const saldoActual = parseFloat(sessionStorage.getItem('miSaldo')) || 0;
    const limiteReal = Math.min(TRANSFER_LIMIT, saldoActual);
    if (monto > limiteReal) {
<<<<<<< HEAD
        alert(`El monto supera el límite por transferencia (${limiteReal.toFixed(2)}).`);
        return;
=======
      alert(`El monto supera el límite por transferencia (${limiteReal.toFixed(2)}).`);
      return;
>>>>>>> feature/transacciones
    }

    const nuevoSaldo = saldoActual - monto;
    sessionStorage.setItem('miSaldo', nuevoSaldo.toString());

    const contacto = misContactos[contactoSeleccionadoIndex];
    guardarTransaccion('Transferencia enviada', contacto.nombre, monto);

<<<<<<< HEAD
    const saldoEl = document.getElementById('saldo-display');
    if (saldoEl) saldoEl.textContent = nuevoSaldo.toFixed(2) + ' BTC';

    if (modalTransfer) modalTransfer.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();

    alert('Transferencia realizada con éxito! Nuevo saldo: ' + nuevoSaldo.toFixed(2) + ' BTC');
});
=======
    // Actualizar saldo en pantalla si existe el elemento
    if ($saldoDisplay.length) {
      $saldoDisplay.text(nuevoSaldo.toFixed(2) + ' BTC');
    }

    if (modalTransfer) modalTransfer.hide();
    limpiarBackdrop();

    alert('Transferencia realizada con éxito! Nuevo saldo: ' + nuevoSaldo.toFixed(2) + ' BTC');
  });
});


>>>>>>> feature/transacciones
