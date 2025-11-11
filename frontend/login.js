let nombre = document.getElementById("full-name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let rePass = document.getElementById("re-password");
let cond = document.getElementById("agree-rules");
let boton = document.querySelector(".submit-btn");
let select = document.getElementById("country");

let contraseñaCorrecta = false;
let emailValido = false;
let condAcceptadas = false;

password.addEventListener("blur", comprobadorContraseña);
rePass.addEventListener("blur", comprobadorContraseña);
email.addEventListener("blur", checkEmail);
cond.addEventListener("change", checkCheck);

function comprobadorContraseña() {
  if (password.value === rePass.value && password.value.length > 0) {
    contraseñaCorrecta = true;
  } else {
    contraseñaCorrecta = false;
    if (rePass.value.length > 0 && password.value !== rePass.value) {
      alert("La contraseña introducida no es correcta");
    }
  }
  botonDesbloqueado();
}

const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function checkEmail() {
  emailValido = regExp.test(email.value);
  botonDesbloqueado();
}

function checkCheck() {
  condAcceptadas = cond.checked;
  botonDesbloqueado();
}

function botonDesbloqueado() {
  if (contraseñaCorrecta && emailValido && condAcceptadas && nombre.value.trim() !== "") {
    boton.disabled = false;
  } else {
    boton.disabled = true;
  }
}

function formatCountry(country) {
  if (!country.id) return country.text;
  const imgUrl = $(country.element).data('image');
  if (!imgUrl) return country.text;
  const $country = $(`<span><img src="${imgUrl}" style="width:24px; height:16px; margin-right:8px;" /> ${country.text}</span>`);
  return $country;
}

const paises = [
  { codigo: "ES", nombre: "España", bandera: "https://flagcdn.com/es.svg" },
  { codigo: "FR", nombre: "Francia", bandera: "https://flagcdn.com/fr.svg" },
  { codigo: "IT", nombre: "Italia", bandera: "https://flagcdn.com/it.svg" },
  { codigo: "DE", nombre: "Alemania", bandera: "https://flagcdn.com/de.svg" },
  { codigo: "GB", nombre: "Reino Unido", bandera: "https://flagcdn.com/gb.svg" }
];

const opcionInicial = document.createElement("option");
opcionInicial.value = "";
opcionInicial.textContent = "Tu País";
opcionInicial.disabled = true;
opcionInicial.selected = true;
select.appendChild(opcionInicial);

paises.forEach(pais => {
  const opcion = document.createElement("option");
  opcion.value = pais.codigo;
  opcion.textContent = pais.nombre;
  opcion.setAttribute("data-image", pais.bandera);
  select.appendChild(opcion);
});

$(document).ready(function () {
  $('#country').select2({
    templateResult: formatCountry,
    templateSelection: formatCountry,
    minimumResultsForSearch: -1
  });
});

// --- LOGIN ---
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que recargue la página

    const emailAddress = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch('https://casinoa-d.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress, password })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar info del usuario en el navegador
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userSaldo', data.saldo);

        // Redirigir a la página principal
        window.location.href = 'main.html';
      } else {
        alert(data.message || 'Email o contraseña incorrectos');
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
      console.error(error);
    }
  });
}

// --- REGISTRO ---
const registerForm = document.getElementById('register-form');

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que recargue la página

    const fullName = nombre.value;
    const emailAddress = email.value;
    const pass = password.value;
    const country = select.value;
    const agreeRules = cond.checked;

    try {
      const response = await fetch('https://casinoa-d.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, emailAddress, password: pass, country, agreeRules })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar info del usuario en el navegador
        localStorage.setItem('userName', fullName);
        localStorage.setItem('userSaldo', data.saldo || 999999);

        // Redirigir a la página principal
        window.location.href = 'main.html';
      } else {
        alert(data.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
      console.error(error);
    }
  });
}