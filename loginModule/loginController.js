let token = ""
const URL_SERVER = "http://192.168.218.217:8080/api/"
const URL_LOCAL = "http://localhost:8080/BibliotecaUTL/api/user/"
const PUT = "PUT";
const POST = "POST";

export async function findUser() {
  console.log("LOGIN CONTROLLER FUNCION FIND USER");
  let email = document.getElementById("user");
  let pass = document.getElementById("password");
  let userData = await login(email.value, pass.value);
  if (userData) {
    if (userData.password === pass.value) {
      localStorage.setItem('rol', userData.rol);
      await booksModule(); // Esperamos a que booksModule termine antes de continuar
    }
  }
  if (localStorage.getItem('rol') !== 'ADMINISTRADOR') {
    document.getElementById('navUser').style.display = 'none';
  }
}


export async function login(email, password) {
  console.log("LOGIN CONTROLLER FUNCION LOGIN");
  let url = URL_LOCAL +  "login";
  let loginData = {
    "email": email,
    "password": password
  };
  console.log("DATOS DE LOGIN",loginData);
  try {
    let opciones = {
      method: POST,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    }
    let response = await fetch(url, opciones);
    if (response.ok) {
      let result = await response.json();
      if (result === true) {
        console.log('Inicio de sesión exitoso');
      } else {
        console.log('Inicio de sesión fallido');
      }
      return result;
    } else {
      console.error('Error del Servidor', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
}




