
console.log("HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

ocultarNavBar()
getLoginModule()

function ocultarNavBar() {
    document.getElementById("navBar").classList.add("d-none");
}

/**
 * Carga el módulo de inicio de sesión.
 * @async
 * @function loginModule
 * @throws {Error} Si hay un error al cargar el módulo.
 * @returns {Promise<void>}
 */
async function getLoginModule() {
    try {
        // Esperar la respuesta de la petición fetch
        let response = await fetch("../loginModule/loginView.html");

        // Verificar si la petición fue exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Esperar el texto de la respuesta
        let html = await response.text();

        // Insertar el html en el elemento body-content
        document.getElementById("body-content").innerHTML = html;

        // loginMod = await import("../loginModule/loginController.js");
        // //Llamar al método cargarModulo del módulo userModule      
        // return loginMod;

    } catch (error) {
        // Manejar el error
        console.error(error);
    }
}

/**
 * Carga el módulo de usuarios, importando userView.html y userController.js, y llamando al método cargarModulo del módulo userController.
 * @async
 * @function usersModule
 * @throws {Error} Si ocurre un error al cargar el módulo de usuarios.
 * @returns {Promise<void>}
 */
async function getModule() {
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

/**
 * Carga el módulo de libros y llama al método cargarModulo del módulo bookController.
 * @async
 * @function booksModule
 * @returns {Promise<void>}
 */
async function getModule() {
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

/**
 * Clears the localStorage and redirects the user to the index page.
 * @function logout
 * @returns {void}
 */
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function login() {
    let email = document.getElementById("email");
    let pass = document.getElementById("password");

    loginMod.login(email, pass).then((userValid) => {
        if (userValid) {
            if (userValid.login === true) {
                localStorage.setItem('rol', userValid.rol.UPPERCASE());

                booksModule();
            }
        }
    });

    if (localStorage.getItem('rol') !== 'ADMINISTRADOR') {
        document.getElementById('navUser').style.display = 'none';
    }
}

