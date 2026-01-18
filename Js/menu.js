const correoUsuario = document.getElementById('user-email');
const saldoPantalla = document.getElementById('saldo-display');

const emailGuardado = sessionStorage.getItem('userEmail');
let saldoGuardado = sessionStorage.getItem('miSaldo');

if (!saldoGuardado) { 
    saldoGuardado = "150";
    sessionStorage.setItem('miSaldo', saldoGuardado);
}

if (!emailGuardado) {
    alert("¡Alto ahí! Debes iniciar sesión primero.");
    window.location.href = '../index.html'; 
} else {
    if (correoUsuario) {
        correoUsuario.textContent = emailGuardado;
    }
    
    if (saldoPantalla) {
        saldoPantalla.textContent = saldoGuardado + " BTC";
    }
}

const btnOjo = document.getElementById('btn-toggle-saldo');
const iconoOjo = document.getElementById('icono-ojo');

let saldoVisible = true; 

if (btnOjo) {
    btnOjo.addEventListener('click', () => {
        
        if (saldoVisible) {
            saldoPantalla.textContent = "****";
            iconoOjo.classList.remove('bi-eye-fill');
            iconoOjo.classList.add('bi-eye-slash-fill');
            saldoVisible = false;
            
        } else {
            saldoPantalla.textContent = saldoGuardado + " BTC";
            iconoOjo.classList.remove('bi-eye-slash-fill');
            iconoOjo.classList.add('bi-eye-fill');
            saldoVisible = true;
        }
        
    });
}