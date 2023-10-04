
export function findUser() {
  let user = document.getElementById("user");
  let pass = document.getElementById("password");

  let url = " http://localhost:9000/api/user";

  getUser(url, user, pass).then((userData) => {
    if (userData) {
      if (userData.name === userData && user.password === pass) {
        booksModule();
      }
    }
  });
}

// Definir una función async que tome como argumentos el user y el password
async function getUser(user, password) {
  // Crear un objeto con las propiedades user y password
  let parametros = {
    user: user,
    password: password,
  };
  // Convertir el objeto a una cadena JSON
  let body = JSON.stringify(parametros);
  // Crear una opción de solicitud con el método POST y el body
  let opciones = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: body
  };

  let url = " http://localhost:9000/api/user";

  // Usar un bloque try-catch para manejar los errores
  try {
    // Enviar la solicitud al API usando fetch y await
    let response = await fetch(url, opciones);
    // Convertir la respuesta a un objeto JSON
    let data = await response.json();
    // Mostrar los datos en la consola
    console.log(data);
    return data;
  } catch (error) {
    // Mostrar el error en la consola
    console.error(error);
  }
}

export function booksModule() {
  fetch("../bookModule/bookView.html")
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      document.getElementById("body-content").innerHTML = html;
      import("../bookModule/bookController.js").then(function (controller) {
        bookModule = controller;
        bookModule.cargarModulo();
      });
    });
}
