$(document).ready(function () {
  // Seleccionar elementos del DOM
  const $form = $('#loginForm');
  const $emailInput = $('#email');
  const $passwordInput = $('#password');
  const $errorBox = $('#loginError');

  // Escuchar el evento submit del formulario
  $form.on('submit', function (event) {
    event.preventDefault();
    
    // Limpiar errores previos
    $errorBox.text('').removeClass('text-danger text-success');

    // Obtener y limpiar valores
    const email = $emailInput.val().trim();
    const password = $passwordInput.val();

    // Validación 1: Email vacío
    if (!email) {
      $errorBox.addClass('text-danger').text('Introduce tu email.');
      return;
    }
    
    // Validación 2: Formato de email válido
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $errorBox.addClass('text-danger').text('Email no válido.');
      return;
    }
    
    // Validación 3: Contraseña vacía
    if (!password) {
      $errorBox.addClass('text-danger').text('Introduce tu contraseña.');
      return;
    }
    
    // Validación 4: Contraseña con mínimo 6 caracteres
    if (password.length < 6) {
      $errorBox.addClass('text-danger').text('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Si todas las validaciones pasaron: guardar email y redirigir
    sessionStorage.setItem('userEmail', email);
    $errorBox.addClass('text-success').text('Accediendo...');
    
    // Esperar 800ms antes de redirigir a menu.html
    setTimeout(() => { 
      window.location.href = '../html/menu.html'; 
    }, 800);
  });
});