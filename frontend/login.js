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

$(document).ready(function() {
  $('#country').select2({
    templateResult: formatCountry,
    templateSelection: formatCountry,
    minimumResultsForSearch: -1
  });
});