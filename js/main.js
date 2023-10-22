let bookModule;
let loginMod;
let userModule;
booksModule();

async function loginModule() {
  try {
    // Esperar la respuesta de la petición fetch
    let response = await fetch("../loginModule/loginView.html");
    // Esperar el texto de la respuesta
    let html = await response.text();
    // Insertar el html en el elemento con id body-content
    document.getElementById("body-content").innerHTML = html;

    loginMod = await import("../loginModule/loginController.js");
    //Llamar al método cargarModulo del módulo userModule

  } catch (error) {
    // Manejar el error
    console.error(error);
  }
}

async function usersModule() {
  try {
    // Esperar la respuesta de la petición fetch
    let response = await fetch("../userModule/userView.html");
    // Esperar el texto de la respuesta
    let html = await response.text();
    // Insertar el html en el elemento con id body-content
    document.getElementById("body-content").innerHTML = html;
    // Esperar la importación del módulo userController.js
    userModule = await import("../userModule/userController.js");
    //Llamar al método cargarModulo del módulo userModule
    userModule.cargarModulo();

  } catch (error) {
    // Manejar el error
    console.error(error);
  }
}

async function booksModule() {
  try {
    let response = await fetch("../bookModule/bookView.html");
    let html = await response.text();

    document.getElementById("body-content").innerHTML = html;

    bookModule = await import("../bookModule/bookController.js");
    //Llamar al método cargarModulo del módulo userModule
    bookModule.loadModule();

  } catch (error) {
    console.error(error);
  }
}


