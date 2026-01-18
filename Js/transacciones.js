const tablaBody = document.querySelector('tbody');

function cargarTransacciones() {
    const transacciones = JSON.parse(sessionStorage.getItem('misTransacciones')) || [];
    
    tablaBody.innerHTML = '';
    
    if (transacciones.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay transacciones registradas</td></tr>';
        return;
    }
    
    transacciones.reverse().forEach(transaccion => {
        const fila = document.createElement('tr');
        
        const esNegativo = transaccion.tipo.toLowerCase().includes('enviada') || transaccion.tipo.toLowerCase().includes('transferencia');
        const signo = esNegativo ? '-' : '+';
        const clase = esNegativo ? 'text-danger' : 'text-success';
        
        const detalle = transaccion.contacto ? `${transaccion.tipo} a ${transaccion.contacto}` : transaccion.tipo;
        
        fila.innerHTML = `
            <td>${transaccion.fecha}</td>
            <td>${detalle}</td>
            <td class="text-end ${clase}">${signo}${transaccion.monto.toFixed(2)} BTC</td>
        `;
        
        tablaBody.appendChild(fila);
    });
}

cargarTransacciones();

setInterval(cargarTransacciones, 2000);