
let booksGlobal = [];
const URL_SERVER = "http://192.168.218.217:8080/api/"
const URL_LOCAL = "http://localhost:8080/BibliotecaUTL/api/book/"
const PUT = "PUT";
const POST = "POST";

export async function loadModule() {
  console.log("BOOK CONTROLLER FUNCTION LOAD MODULE");
  booksGlobal = [];

  try {
    let books = await getLocalData();

    books.forEach((book) => {
      booksGlobal.push(book);
    });

    loadTable(books);

    document.getElementById("btnClose").click();

  } catch (error) {
    console.error("Error loadModule Books:", error);
  }
}

export function seeBook1(idx) {
  let libro = booksGlobal[idx];

  if (libro.file === null) {
    alert("No hay libro");
    return;
  }
  // Crear un Blob a partir de la cadena base64
  let binaryPDF = atob(libro.file);
  let arrayBuffer = new ArrayBuffer(binaryPDF.length);
  let uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryPDF.length; i++) {
    uint8Array[i] = binaryPDF.charCodeAt(i);
  }
  let blob = new Blob([arrayBuffer], { type: "application/pdf" });

  // Crear una URL de datos
  let url = URL.createObjectURL(blob);

  // Abrir una nueva ventana del navegador con el PDF
  window.open(url, "_blank");

  // Limpiar la URL de datos después de abrir la ventana
  URL.revokeObjectURL(url);
}

export function cleanForm() {
  document.getElementById("idFrm").value = "";
  document.getElementById("nameFrm").value = "";
  document.getElementById("authorFrm").value = "";
  document.getElementById("universityFrm").value = "";
  document.getElementById("fileFrm").value = "";
}

export function save() {
  let method;
  let idBook = document.getElementById("idFrm").value;
  let nameBook = document.getElementById("nameFrm").value;
  let authorBook = document.getElementById("authorFrm").value;
  let universityBook = document.getElementById("universityFrm").value;
  let inputFile = document.getElementById("fileFrm");

  let book = {};

  book.name = nameBook;
  book.author = authorBook;
  book.university = universityBook;

  cargarLibro(inputFile)
    .then((base64String) => {
      idBook === "" ? (method = POST) : ((method = PUT), (book.idBook = idBook));

      book.file = base64String;

      sendData(book, method).then((book) => {
        cleanForm();
        loadModule();
      });

    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function filterTable() {
  // Declare variables
  var input, filter, table, tr, td, i, j, txtValue;
  input = document.getElementById("txtSearch");
  filter = input.value.toUpperCase();
  table = document.getElementById("tbBooks");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows
  for (i = 0; i < tr.length; i++) {
    // Check if the <tr> is part of the <thead>
    if (tr[i].parentNode.nodeName !== "THEAD") {
      // Get all the <td> elements in the current <tr>
      td = tr[i].getElementsByTagName("td");
      // Initialize a variable to check if any <td> contains the filter value
      var rowMatchesFilter = false;

      // Loop through all the <td> elements in the current <tr>
      for (j = 0; j < td.length; j++) {
        txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          // If any <td> contains the filter value, set the flag to true
          rowMatchesFilter = true;
          break; // No need to continue checking other <td>s in this row
        }
      }

      // Show or hide the row based on whether any <td> matched the filter
      if (rowMatchesFilter) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

export function edit(idx) {
  document.getElementById("btnForm").click();
  document.getElementById("idFrm").value = booksGlobal[idx].idBook;
  document.getElementById("nameFrm").value = booksGlobal[idx].name;
  document.getElementById("authorFrm").value = booksGlobal[idx].author;
  document.getElementById("universityFrm").value = booksGlobal[idx].university;
}

async function getLocalData() {

  let url = URL_LOCAL + "getAll";

  try {
    //SERVIDOR LOCAL--------------------------------------------------------------
    let options = {
      method: POST,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(filtro)
    };

    // Esperar a que se resuelva la petición fetch
    let response = await fetch(url, options);
    console.log("Response Get Books", response);

    // Esperar a que se resuelva el método json
    let books = await response.json();

    // Devolver los datos    
    return books;

  } catch (e) {
    return e;
  }
}

async function sendData(book) {
  let url = "http://192.168.218.217:8080/api/book/";
  let method;

  method = book?.idBook? PUT : POST; 

  let options = {
    method: method, // Indicar el método HTTP
    headers: {
      "Content-Type": "application/json",
    },
    body: bookObject
  };

  try {

    let response = await fetch(url, options);

    let resultado = await response.json();
    return resultado;
  } catch (error) {
    // Manejar el error
    console.error(error);
  }
}

export async function remove(id) {

  let url = URL_LOCAL + "delete/" + id;

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

function cargarLibro(objetoInputFile) {
  return new Promise((resolve, reject) => {
    // Revisamos que el usuario haya seleccionado un archivo
    if (objetoInputFile.files && objetoInputFile.files[0]) {
      // Ayuda a leer la imagen del input file
      let reader = new FileReader();

      // Agregamos un oyente al lector del archivo para que,
      // en cuanto el usuario cargue una imagen, esta se lea
      // y se convierta de forma automática en una cadena de Base64
      reader.onload = function (e) {
        // El contenido del archivo después de haberlo leído. Son datos binarios
        let libroB64 = e.target.result;

        // Se pone la Base64 del libro
        // Resolvemos la promesa con la cadena Base64
        resolve(libroB64.substring(libroB64.indexOf(",") + 1));
      };

      // Leemos el archivo que seleccionó el usuario y lo
      // convertimos en una cadena de Base64
      reader.readAsDataURL(objetoInputFile.files[0]);
    } else {
      // Si no se seleccionó ningún archivo, rechazamos la promesa con un mensaje de error
      reject(new Error("No se seleccionó ningún archivo"));
    }
  });
}

function loadTable(books) {
  let bookTable = document.getElementById("tbBooks");
  bookTable.innerHTML = "";

  let rol = localStorage.getItem('rol');

  books.forEach((book, idx) => {
    let newRow = document.createElement("tr");

    let buttons = `
            <button class="btn btn-sm btn-primary fa-regular fa-eye" onclick="bookModule.seeBook1(${idx})"></button>
        `;

    if (rol === "ADMINISTRADOR") {
      buttons += `
                <button class="btn btn-sm btn-warning fa-solid fa-pen-to-square" onclick="bookModule.edit(${idx})"></button>
                <button class="btn btn-sm btn-danger fa-solid fa-trash-can" onclick="bookModule.remove(${idx})"></button>
            `;
    }

    newRow.innerHTML = `
          <td>${book?.idBook}</td>
          <td>${book?.author}</td>
          <td>${book?.name}</td>
          <td>${book?.tema}</td>
          <td>${book?.university}</td>
          <td class="text-center"><span class="badge bg-success">${book?.status ? book?.status : "Activo"}</span></td>
          <td>${buttons}</td>            
        `;

    bookTable.insertAdjacentHTML("beforeend", newRow.outerHTML);
  });
}

//#region FUNCIONES SIN USAR POR EL MOMENTO(PENDIENTES DE PROBAR)
function refrescarLista() {
  let filtro = document.getElementById("txtSearch").value;

  let busqueda = {
    filtro: filtro
  };

  let token = localStorage.getItem("token");
  console.log(token.substring(1, token.length - 1));
  let url = URL_SERVER + "buscar-libro";

  let opciones = {
    method: POST,
    headers: {
      "Authorization": token.substring(1, token.length - 1),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(busqueda)
  };

  fetch(url, opciones)
    .then((respuesta) => respuesta.json())
    .then((libros) => {
      loadTable(libros);
    });
}

function seeBook2(idBook) {
  let binaryData = atob(booksGlobal[idBook].file);

  // Crea un Blob a partir de los datos binarios
  let blob = new Blob(
    [new Uint8Array(binaryData.length).map((_, i) => binaryData.charCodeAt(i))],
    {
      type: "application/pdf",
    }
  );

  // Crea una URL del Blob
  let blobUrl = URL.createObjectURL(blob);

  // Abre una nueva ventana o pestaña y muestra el PDF
  window.open(blobUrl, "_blank");
}

//#endregion

//#region FUNCIONES PARA CONECTAR SERVIDOR CENTRAL
async function transformToLocalBooks(booksServer) {
  let books;

  booksServer.forEach(book => {
    let bookLocal;
    if (book.universidad_id !== "21002103") {
      bookLocal = {
        idBook: {
          universidad_id: book.universidad_id,
          universidad_libro_id: book.universidad_libro_id
        },
        libroBase64: "",
        author: "",
        name: book.libro_nombre,
        university: book.nombre_universidad,
      }

      books.push(bookLocal);
    }

  });

  return books;

}

async function getServerData() {

  let url = URL_SERVER + "buscar-libro";

  let options = {
    method: POST,
    headers: {
      "Authorization": token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(filtro)
  };

  let filtro = {
    filtro: ""
  }

  try {

    // Esperar a que se resuelva la petición fetch
    let response = await fetch(url, options);
    // Esperar a que se resuelva el método json
    let books = await response.json();

    if (datosWithToken !== null) {
      books = await transformToLocalBooks(datosWithToken);
    }


    return books;
  } catch (error) {
    return error;
  }
}

async function recLibroCentral(idUniversidad, idLibro) {
  let url = URL_SERVER + "buscar-libro";

  let opciones = {
    method: POST,
    headers: {
      "Authorization": token.substring(1, token.length - 1),
      "Content-Type": "application/json"
    }
  };

  let respuesta = await fetch(url, opciones);
  let libro = await respuesta.json();

  /* Ejemplo de respuesta del servidor central
  respuesta = {
    "libro_nombre": "string",
    "libro_base64": {
        "url_llamada":"url_llamada",
        "message":"libro_base64"
    },
    "tema": "string"
  } */

  return libro.libro_base64.message;
}
//#endregion