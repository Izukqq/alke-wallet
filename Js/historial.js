$(document).ready(function () {
  // Selector de la tabla
  const $tablaBody = $('tbody');

  // Cargar y mostrar transacciones
  function cargarTransacciones() {
    const transacciones = JSON.parse(sessionStorage.getItem('misTransacciones')) || [];
    
    $tablaBody.html('');
    
    if (transacciones.length === 0) {
      $tablaBody.html('<tr><td colspan="3" class="text-center text-muted">No hay transacciones registradas</td></tr>');
      return;
    }
    
    // Invertir transacciones para mostrar las más recientes primero
    transacciones.reverse().forEach(transaccion => {
      const esNegativo = transaccion.tipo.toLowerCase().includes('enviada') || transaccion.tipo.toLowerCase().includes('transferencia');
      const signo = esNegativo ? '-' : '+';
      const clase = esNegativo ? 'text-danger' : 'text-success';
      
      const detalle = transaccion.contacto ? `${transaccion.tipo} a ${transaccion.contacto}` : transaccion.tipo;
      
      const $fila = $('<tr>');
      $fila.html(`
        <td>${transaccion.fecha}</td>
        <td>${detalle}</td>
        <td class="text-end ${clase}">${signo}${transaccion.monto.toFixed(2)} BTC</td>
      `);
      
      $tablaBody.append($fila);
    });
  }

  // Cargar transacciones al abrir la página
  cargarTransacciones();

  // Actualizar transacciones cada 2 segundos
  setInterval(cargarTransacciones, 2000);
});
// Forzando actualizacion