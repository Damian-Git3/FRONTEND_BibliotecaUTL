let ipBack = "localhost:9000";

export function findUser() {
    let email = document.getElementById("user");
    let pass = document.getElementById("password");

    login(email, pass).then((userData) => {
        if (userData) {
            if (userData.email === userData && user.password === pass) {
                localStorage.setItem('rol', userData.rol);
                
                booksModule();
            }
        }
    });
    
    if (localStorage.getItem('rol') !== 'ADMINISTRADOR') {
        document.getElementById('navUser').style.display = 'none';
    }
}

// Definir una función async que tome como argumentos el user y el password
/* async function getUser(user, password) {
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
} */

async function login(email, password) {

    let url = " http://" + ipBack + "/api/user/login";
    let loginData = {
        "email": email,
        "password": password
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const result = await response.json();
            if (result === true) {
                console.log('Inicio de sesión exitoso');
            } else {
                console.log('Inicio de sesión fallido');
            }
        } else {
            console.error('Error al realizar la solicitud:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
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

export function usersModule() {
    fetch("../userModule/userView.html")
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            document.getElementById("body-content").innerHTML = html;
            import("../userModule/userController.js").then(function (controller) {
                userModule = controller;
                userModule.cargarModulo();
            });
        });
}
