$(document).ready(function () {
  // SELECTORES
  const $inputMonto = $('#deposito-input');
  const $botonDepositar = $('#deposito-btn');

  // VARIABLES
  let saldoActual = sessionStorage.getItem('miSaldo') || 0;

  // FUNCIONES

  // Guardar transacción de depósito
  function guardarTransaccionDeposito(monto) {
    const transacciones = JSON.parse(sessionStorage.getItem('misTransacciones')) || [];
    
    const fecha = new Date();
    const fechaFormato = `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;
    
    const transaccion = {
      fecha: fechaFormato,
      tipo: 'Depósito',
      contacto: 'Mi cuenta',
      monto: monto,
      timestamp: fecha.getTime()
    };
    
    transacciones.push(transaccion);
    sessionStorage.setItem('misTransacciones', JSON.stringify(transacciones));
  }

  // EVENTOS

  // Click en botón "Realizar depósito"
  $botonDepositar.on('click', function() {
    const montoTexto = $inputMonto.val();
    const montoNumero = parseFloat(montoTexto);

    if (isNaN(montoNumero) || montoNumero <= 0) {
      alert("Por favor, ingresa un monto válido mayor a 0.");
      return;
    }

    const saldoTotal = parseFloat(saldoActual) + montoNumero;
    sessionStorage.setItem('miSaldo', saldoTotal);

    guardarTransaccionDeposito(montoNumero);

    alert(`¡Depósito exitoso! Tu nuevo saldo es: ${saldoTotal}`);
    window.location.href = 'menu.html';
  });
});
// Forzando actualizacion