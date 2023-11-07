let token = ""
const URL_SERVER = "http://192.168.218.217:8080/api/"
const URL_LOCAL = "http://localhost:8080/BibliotecaUTL/api/user/"
const PUT = "PUT";
const POST = "POST";

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

async function login(email, password) {

    let url = URL_LOCAL +  "login";
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



