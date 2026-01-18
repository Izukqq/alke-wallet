const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorBox = document.getElementById('loginError');

if (!form) {
  console.warn('No se encontró el formulario loginForm en el DOM');
} else {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    if (errorBox) {
      errorBox.textContent = '';
      errorBox.classList.remove('text-danger', 'text-success');
    }

    const email = (emailInput && emailInput.value || '').trim();
    const password = passwordInput ? passwordInput.value : '';

    if (!email) {
      if (errorBox) { 
        errorBox.classList.add('text-danger'); 
        errorBox.textContent = 'Introduce tu email.'; 
      }
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (errorBox) { 
        errorBox.classList.add('text-danger'); 
        errorBox.textContent = 'Email no válido.'; 
      }
      return;
    }
    
    if (!password) {
      if (errorBox) { 
        errorBox.classList.add('text-danger'); 
        errorBox.textContent = 'Introduce tu contraseña.'; 
      }
      return;
    }
    
    if (password.length < 6) {
      if (errorBox) { 
        errorBox.classList.add('text-danger'); 
        errorBox.textContent = 'La contraseña debe tener al menos 6 caracteres.'; 
      }
      return;
    }

    sessionStorage.setItem('userEmail', email);

    if (errorBox) { 
      errorBox.classList.add('text-success'); 
      errorBox.textContent = 'Accediendo...'; 
    }
    
    setTimeout(() => { 
      window.location.href = '../html/menu.html'; 
    }, 800);
  });
}