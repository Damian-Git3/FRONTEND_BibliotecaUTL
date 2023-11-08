
let loginModule;
let bookModule;
let userModule;

ocultarNavBar()
getLoginModule()

function hideNavBar() {
    document.getElementById("navBar").classList.add("d-none");
}

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
                document.getElementById("navBar").classList.remove("d-none");
                loginModule.getToken();
                getBookModule();
            }
        }
    });
    
}

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

        loginModule = await import("../loginModule/loginController.js");
        //Llamar al método cargarModulo del módulo userModule      
        

    } catch (error) {
        // Manejar el error
        console.error(error);
    }
}

async function getUserModule() {
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
        userModule.loadModule();

    } catch (error) {
        // Manejar el error
        console.error(error);
    }
}

async function getBookModule() {
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