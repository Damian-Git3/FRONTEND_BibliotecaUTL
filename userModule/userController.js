let usersArr = [];

// Definir una función asíncrona
async function getData(url) {
  // Esperar a que se resuelva la petición fetch
  let respuesta = await fetch(url);
  // Esperar a que se resuelva el método json
  let datos = await respuesta.json();
  // Devolver los datos
  return datos;
}

async function postDatos(url, datos) {
  try {
    // Crear un objeto con las opciones de la petición
    let opciones = {
      method: "POST", // Indicar el método HTTP
      headers: {
        "Content-Type": "application/json", // Indicar el tipo de contenido
      },
      body: JSON.stringify(datos), // Convertir los datos a JSON y enviarlos en el cuerpo de la petición
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

async function putDatos(url, datos) {
  try {
    // Crear un objeto con las opciones de la petición
    let opciones = {
      method: "PUT", // Indicar el método HTTP
      headers: {
        "Content-Type": "application/json", // Indicar el tipo de contenido        
      },
      body: JSON.stringify(datos), // Convertir los datos a JSON y enviarlos en el cuerpo de la petición
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
  let id = document.getElementById("idFrm").value;
  console.log("ID", id)
  let user = document.getElementById("userFrm").value;
  let mail = document.getElementById("mailFrm").value;
  let pass = document.getElementById("passFrm").value;
  let rol = document.getElementById("rolFrm").value;

  let userObj = {};

  

  userObj.name = user;
  userObj.email = mail;
  userObj.pass = pass;
  userObj.rol = rol;

  let url = " http://localhost:9000/api/user";

  if (id.value != null) {
    userObj.id_user = id;
  }

  if (userObj.id_user) {

    url += `${userObj.id_user} `;
    putDatos(url, userObj);
    cargarModulo();
  } else {

    postDatos(url, userObj);
    cargarModulo();
  }

}

export function loadForm(id) {
  document.getElementById("idFrm").value = usersArr[id]?.id_user;
  document.getElementById("userFrm").value = usersArr[id]?.name;
  document.getElementById("mailFrm").value = usersArr[id]?.email;
  document.getElementById("passFrm").value = usersArr[id]?.password;
  document.getElementById("rolFrm").value = usersArr[id]?.rol;

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
      <td>${user?.status ? user.status : "" }</td>
      <td></td>
      `;

      userTable.appendChild(newRow);
    });
  });
}









