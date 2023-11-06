let usersArr = [];
let ipBack = "localhost:9000";

// Definir una función asíncrona
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

async function sendData(type, user) {
    let url;
    let urlRegister = "http://" + ipBack + "/api/user/register";
    let urlUpdate = "http://" + ipBack + "/api/user/update";

    if (type === "POST") {
        url = urlRegister;
    }

    if (type === "PUT") {
        url = urlUpdate
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

export async function deleteUser(url, id) {
    let url = "http://" + ipBack + "/api/book/";
    url += id;

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

export function save() {
    let method;
    let id = document.getElementById("idFrm").value;
    let user = document.getElementById("userFrm").value;
    let mail = document.getElementById("mailFrm").value;
    let pass = document.getElementById("passFrm").value;
    let rol = document.getElementById("rolFrm").value;

    let userObj = {};

    userObj.name = user;
    userObj.email = mail;
    userObj.pass = pass;
    userObj.rol = rol;

    idBook === "" ? (method = "POST") : ((method = "PUT"), (userObj.idUser = id));



    sendData(method, userObj).then((user) => {
        cleanForm();
        cargarModulo();
    })
}

export function loadForm(id) {
    const idFrm = document.getElementById("idFrm");
    const userFrm = document.getElementById("userFrm");
    const mailFrm = document.getElementById("mailFrm");
    const passFrm = document.getElementById("passFrm");
    const rolFrm = document.getElementById("rolFrm");

    if (idFrm) idFrm.value = usersArr[id]?.id_user;
    if (userFrm) userFrm.value = usersArr[id]?.name;
    if (mailFrm) mailFrm.value = usersArr[id]?.email;
    if (passFrm) passFrm.value = usersArr[id]?.password;
    if (rolFrm) rolFrm.value = usersArr[id]?.rol;
}

export function cargarModulo() {
    getData(`http://${ipBack}/api/user/getAll`).then((users) => {
        usersArr = users;
        let userTable = document.getElementById("tbUsers");

        if (!userTable) {
            console.error('No se encontró la tabla de usuarios');
            return;
        }

        users.forEach((user) => {
            const newRow = createUserRow(user);
            userTable.appendChild(newRow);
        });
    }).catch((error) => {
        console.error('Error al obtener los datos de los usuarios:', error);
    });
}

function createUserRow(user) {
    const newRow = document.createElement("tr");
    newRow.setAttribute("id", user.id_user);
    newRow.textContent = `
      ${user.name}
      ${user.email}
      ${user.rol}
      ${user?.status ? user.status : ""}
      `;
    return newRow;
}









