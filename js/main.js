const URL_LOCAL = "http://localhost:8080/BibliotecaUTL/";
localStorage.clear();

hideNavBar();
loadLoginModule();

async function login() {
  console.log("Iniciando sesión");
  let email = getEmail();
  let pass = getPassword();

  try {
    let userValid = await validateUser(email, pass);
    console.log("Validando: ", userValid);

    if (userValid) {
      if (userValid.login === true) {
        localStorage.setItem('rol', userValid.rol.toUpperCase());
        showNavBar();
        await loadBookModule();
        let token = getToken();
        if (token) {
          console.log("Token: ", token);
        } else {
          console.error("No se pudo obtener el token");
        }
      } else {
        console.error("El usuario no está autorizado para acceder");
      }
    } else {
      console.error("No se pudo validar el usuario");
    }
  } catch (error) {
    console.error("Error al intentar hacer login: ", error);
  }
}

async function validateUser(email, pass) {
  let logMod = await getLoginModule();
  return await logMod.login(email, pass);
}

function showNavBar() {
  document.getElementById("navBar").classList.remove("d-none");
}

function loadBookModule() {
  getBookModule().loadModule();
}

function getToken() {
  return getUserModule().getToken();
}

function loadLoginModule() {
  getLoginModule();
}

function loadUserModule() {
  let userMod = getUserModule();
  userMod.loadModule();

}

function hideNavBar() {
  document.getElementById("navBar").classList.add("d-none");
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function getEmail() {
  return document.getElementById("email").value;
}

function getPassword() {
  return document.getElementById("password").value;
}

async function getLoginModule() {
  try {
    // Esperar la respuesta de la petición fetch
    let response = await fetch(URL_LOCAL + 'loginModule/loginView.html');

    // Verificar si la petición fue exitosa
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Esperar el texto de la respuesta
    let html = await response.text();

    // Insertar el html en el elemento body-content
    document.getElementById("body-content").innerHTML = html;

    let loginMod = await import(URL_LOCAL + "loginModule/loginController.js");
    //Llamar al método cargarModulo del módulo userModule      
    return loginMod;

  } catch (error) {
    // Manejar el error
    console.error(error);
  }
}

async function getUserModule() {
  try {
    // Esperar la respuesta de la petición fetch
    let response = await fetch(URL_LOCAL + "userModule/userView.html");
    // Esperar el texto de la respuesta
    let html = await response.text();
    // Insertar el html en el elemento con id body-content
    document.getElementById("body-content").innerHTML = html;
    // Esperar la importación del módulo userController.js
    let userMod = await import(URL_LOCAL + "userModule/userController.js");
    //Llamar al método cargarModulo del módulo userModule
    return userMod;

  } catch (error) {
    // Manejar el error
    console.error(error);
  }
}

async function getBookModule() {
  try {
    let response = await fetch(URL_LOCAL + "bookModule/bookView.html");

    let html = await response.text();

    document.getElementById("body-content").innerHTML = html;

    let bookMod = await import(URL_LOCAL + "bookModule/bookController.js");
    //Llamar al método cargarModulo del módulo userModule
    return bookMod;

  } catch (error) {
    console.error(error);
  }
}