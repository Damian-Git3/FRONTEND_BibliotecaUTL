let usersGlobal = [];
let token = ""

let idFrm = document.getElementById("idFrm");
let userFrm = document.getElementById("userFrm");
let mailFrm = document.getElementById("mailFrm");
let passFrm = document.getElementById("passFrm");
let rolFrm = document.getElementById("rolFrm");

let tblUsers = document.getElementById("tbUsers");

const URL_SERVER = "http://192.168.218.217:8080/api/"
const URL_LOCAL = "http://localhost:8080/BibliotecaUTL/api/user/"
const PUT = "PUT";
const POST = "POST";

export function loadModule() {
  console.log("USER CONTROLLER FUNCION LOAD MODULE");
    let url = URL_LOCAL + "getAll";
    
    getData(url).then((users) => {
        usersGlobal = users;

        if (!tblUsers) {
            console.error('No se encontró la tabla de usuarios');
            return;
        }

        usersGlobal.forEach((user) => {
            const newRow = createUserRow(user);
            userTable.appendChild(newRow);
        });
    }).catch((error) => {
        console.error('Error al obtener los datos de los usuarios:', error);
    });
}

export function save() {

    // let id = document.getElementById("idFrm").value;
    // let user = document.getElementById("userFrm").value;
    // let mail = document.getElementById("mailFrm").value;
    // let pass = document.getElementById("passFrm").value;
    // let rol = document.getElementById("rolFrm").value;

    let userObj = {};
    userObj.idUser = idFrm.value;
    userObj.email = mailFrm.value;
    userObj.name = userFrm.value;
    userObj.password = passFrm.value;
    userObj.rol = rolFrm.value;

    sendData(userObj).then((user) => {
        cleanForm();
        loadModule();
    })
}

export async function deleteUser(id) {
    let url = URL_LOCAL + "delete/" + id;

    try {
        // Crear un objeto con las opciones de la petición
        let opciones = {
            method: "DELETE", // Indicar el método HTTP
        };
        // Esperar a que se resuelva la petición fetch
        let respuesta = await fetch(url, opciones);
        // Comprobar si la respuesta es exitosa
        if (respuesta.ok) {
            // Esperar a que se resuelva el método json
            let resultado = await respuesta.json();
            // Devolver el resultado
            console.log(resultado);
            return resultado;
        } else {
            // Lanzar un error con el código y el mensaje de la respuesta
            throw new Error(respuesta.status + " " + respuesta.statusText);
        }
    } catch (error) {
        // Manejar el error
        console.error(error);
    }
}

export function loadForm(id) {
    // const id = document.getElementById("idFrm");
    // const user = document.getElementById("userFrm");
    // const mail = document.getElementById("mailFrm");
    // const pass = document.getElementById("passFrm");
    // const rol = document.getElementById("rolFrm");

    if (idFrm) idFrm.value = usersGlobal[id]?.idUser;
    if (userFrm) userFrm.value = usersGlobal[id]?.name;
    if (mailFrm) mailFrm.value = usersGlobal[id]?.email;
    if (passFrm) passFrm.value = usersGlobal[id]?.password;
    if (rolFrm) rolFrm.value = usersGlobal[id]?.rol;
}



async function getData(url) {

    try {
        // Esperar a que se resuelva la petición fetch
        let respuesta = await fetch(url);
        // Esperar a que se resuelva el método json
        let datos = await respuesta.json();
        // Devolver los datos
        return datos;
    } catch (e) {
        console.log(e);
    }
}

async function sendData(user) {
    let method;
    let url;

    user.idBook === "" ? (method = POST) : (method = PUT);

    if (method === "POST") {
        url = URL_LOCAL + "register";
    }

    if (method === "PUT") {
        url = URL_LOCAL + "update";
    }

    try {
        // Crear un objeto con las opciones de la petición
        let opciones = {
            method: type, // Indicar el método HTTP
            headers: {
                "Content-Type": "application/json", // Indicar el tipo de contenido
            },
            body: JSON.stringify(user), // Convertir los datos a JSON y enviarlos en el cuerpo de la petición
        };
        // Esperar a que se resuelva la petición fetch
        let respuesta = await fetch(url, opciones);
        // Comprobar si la respuesta es exitosa
        if (respuesta.ok) {
            // Esperar a que se resuelva el método json
            let resultado = await respuesta.json();
            // Devolver el resultado
            return resultado;
        } else {
            // Lanzar un error con el código y el mensaje de la respuesta
            throw new Error(respuesta.status + " " + respuesta.statusText);
        }
    } catch (error) {
        // Manejar el error
        console.error(error);
    }
}

export async function getToken() {
    let url = URL_SERVER + "token";
    let user = {
        "usuario": "admin",
        "contrasena": "admin"
    }

    let opciones = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charsert=UTF-8",
        },
        body: user,
    }

    let response = await fetch(url, opciones);
    let token = await response.text();
    return token;
}

function cleanForm() {
    idFrm.value = "";
    userFrm.value = "";
    mailFrm.value = "";
    passFrm.value = "";
    rolFrm.value = "";
}

function createUserRow(user) {
  const newRow = document.createElement("tr");

  newRow.setAttribute("id", user.id_user);

  newRow.textContent = `${user.name} ${user.email} ${user.rol} ${user?.status ? user.status : ''}`;

  return newRow;
}







