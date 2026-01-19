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

    // Actualizar saldo en pantalla si existe el elemento
    if ($saldoDisplay.length) {
      $saldoDisplay.text(nuevoSaldo.toFixed(2) + ' BTC');
    }

    if (modalTransfer) modalTransfer.hide();
    limpiarBackdrop();

    alert('Transferencia realizada con éxito! Nuevo saldo: ' + nuevoSaldo.toFixed(2) + ' BTC');
  });
});

// Actualización final v1.0
