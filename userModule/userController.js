let usersArr = [];

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

async function sendData(url, type, user) {

    if (type === "PUT") {
        url += "/" + user.id_user;
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
    //let url = "http://localhost:9000/api/book/" + id;
    url += id;

    try {
        // Crear un objeto con las opciones de la petición
        let opciones = {
            method: "DELETE", // Indicar el método HTTP       // Convertir los datos a JSON y enviarlos en el cuerpo de la petición
        };
        // Esperar a que se resuelva la petición fetch
        let respuesta = await fetch(url, opciones);
        // Comprobar si la respuesta es exitosa
        if (respuesta.ok) {
            // Esperar a que se resuelva el método json
            let resultado = await respuesta.status;
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

    idBook === "" ? (method = "POST") : ((method = "PUT"), (user.id_user = id));

    sendData(user, method).then((user)=>{
        cleanForm();
        loadModule();
    })
}

export function loadForm(id) {
    document.getElementById("idFrm").value = usersArr[id]?.id_user;
    document.getElementById("userFrm").value = usersArr[id]?.name;
    document.getElementById("mailFrm").value = usersArr[id]?.email;
    document.getElementById("passFrm").value = usersArr[id]?.password;
    document.getElementById("rolFrm").value = usersArr[id]?.rol;

}

export function loadModule() {
    booksGlobal = []
    getData(url).then((books) => {
      books.forEach((element) => {
        booksGlobal.push(element);
      });
  
      document.getElementById("btnClose").click();   
  
    });
  
  }

export function cargarModulo() {
    getData("http://localhost:9000/api/user/getAll").then((users) => {
        usersArr = users;
        let userTable = document.getElementById("tbUsers");

        users.forEach((user) => {
            const newRow = document.createElement("tr");
            newRow.setAttribute("id", user.id_user)
            newRow.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.rol}</td>
      <td>${user?.status ? user.status : ""}</td>
      <td></td>
      `;

            userTable.appendChild(newRow);
        });
    });
}









