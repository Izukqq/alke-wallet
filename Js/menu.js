$(document).ready(function () {
  // Seleccionar elementos del DOM
  const $userEmail = $('#user-email');
  const $saldoPantalla = $('#saldo-display');
  const $btnOjo = $('#btn-toggle-saldo');
  const $iconoOjo = $('#icono-ojo');

  // Obtener datos del sessionStorage
  const emailGuardado = sessionStorage.getItem('userEmail');
  let saldoGuardado = sessionStorage.getItem('miSaldo');

  // Ya que no hay saldo, establecer valor por defecto (150 BTC ojalá jajaja)
  if (!saldoGuardado) {
    saldoGuardado = "150";
    sessionStorage.setItem('miSaldo', saldoGuardado);
  }

  //  si no hay email, enviar a login (obligar a que se loguee)
  if (!emailGuardado) {
    alert("¡Alto ahí! Debes iniciar sesión primero.");
    window.location.href = '../html/login.html'; 
  } else {
    // Mostrar email del usuario
    $userEmail.text(emailGuardado);
    
    // Mostrar saldo inicial
    $saldoPantalla.text(saldoGuardado + " BTC");
  }

  // Controlar si el saldo está visible
  let saldoVisible = true;

  
  $btnOjo.on('click', function () {
    if (saldoVisible) {
      // Ocultar saldo
      $saldoPantalla.text('****');
      $iconoOjo.removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
      saldoVisible = false;
    } else {
      // Mostrar saldo
      $saldoPantalla.text(saldoGuardado + " BTC");
      $iconoOjo.removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
      saldoVisible = true;
    }
  });
});
// Forzando actualizacion