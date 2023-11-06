let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bml2ZXJzaWRhZF9pZCI6IjIxMDAyMTAzIiwibm9tYnJlIjoiVVRMX0ZFUiIsImdydXBvIjoiSURHUzcwMiIsImlhdCI6MTY5NzA3NzYxMiwiZXhwIjoxNjk3MDgxMjEyfQ.O39bMKNJ79-wwWKLpEZ5odSJBtmu4-LVgEAGFugn-Jo"
let booksGlobal = [];
const URL_SERVER = "http://192.168.218.217:8080/api/"
const BOOK_API = "book/"
const USER_API = "user/"
const PUT = "PUT";
const POST = "POST";

// Definir una función asíncrona
async function getData(url) {

    let filtro = {
        filtro: ""
    }

    try {
        // Incluir el token en el header
        let opciones = {
            method: POST,
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filtro)
        };
        // Esperar a que se resuelva la petición fetch
        let respuesta = await fetch(url, opciones);
        // Esperar a que se resuelva el método json
        let datos = await respuesta.json();
        // Devolver los datos
        return datos;
    } catch (e) {
        console.log(e);
    }
}

async function sendData(url, type, book) {

    if (type === "PUT") {
        url += "/" + book.id_book;
    }

    try {
        // Crear un objeto con las opciones de la petición
        let opciones = {
            method: type, // Indicar el método HTTP
            headers: {
                "Content-Type": "application/json", // Indicar el tipo de contenido
            },
            body: JSON.stringify(book), // Convertir los datos a JSON y enviarlos en el cuerpo de la petición
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

export async function deleteBook(id) {
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

export function loadModule() {
    booksGlobal = []
    let url = URL_SERVER + "buscar-libro"
    console.log(url);
    getData(url).then((books) => {
        books.forEach((element) => {
            booksGlobal.push(element);
        });
        console.log("Books", books);

        loadTable(books);
        document.getElementById("btnClose").click();

    });

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
            idBook === "" ? (method = "POST") : ((method = "PUT"), (book.id_book = idBook));

            book.file = base64String;

            sendData(book, method).then((book) => {
                cleanForm();
                loadModule();
            });

            //console.log("Cadena Base64 del libro:", base64String);
            // Puedes hacer algo con la cadena Base64 aquí, como enviarla al servidor o mostrarla en la página.
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}



export function seeBook1(idx) {
    let libro = booksGlobal[idx];

    if (libro.file === null) {
        alert("No hay libro");
        return;
    }
    // Crear un Blob a partir de la cadena base64
    const binaryPDF = atob(libro.file);
    const arrayBuffer = new ArrayBuffer(binaryPDF.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryPDF.length; i++) {
        uint8Array[i] = binaryPDF.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });

    // Crear una URL de datos
    const url = URL.createObjectURL(blob);

    // Abrir una nueva ventana del navegador con el PDF
    window.open(url, "_blank");

    // Limpiar la URL de datos después de abrir la ventana
    URL.revokeObjectURL(url);
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

export function cleanForm() {
    document.getElementById("idFrm").value = "";
    document.getElementById("nameFrm").value = "";
    document.getElementById("authorFrm").value = "";
    document.getElementById("universityFrm").value = "";
    document.getElementById("fileFrm").value = "";
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

export function filterTable2() {
    // Declare variables
    const input = document.getElementById("txtSearch");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("tbBooks");
    const tr = table.getElementsByTagName("tr");

    // Loop through all table rows
    for (let i = 0; i < tr.length; i++) {
        // Check if the <tr> is part of the <thead>
        if (tr[i].parentNode.nodeName !== "THEAD") {
            // Get all the <td> elements in the current <tr>
            const td = tr[i].getElementsByTagName("td");

            // Check if any <td> contains the filter value
            const rowMatchesFilter = Array.from(td).some((cell) => {
                const txtValue = cell.textContent || cell.innerText;
                return txtValue.toUpperCase().includes(filter);
            });

            // Show or hide the row based on whether any <td> matched the filter
            tr[i].style.display = rowMatchesFilter ? "" : "none";
        }
    }
}

export function editBook(idx) {
    document.getElementById("btnForm").click();
    document.getElementById("idFrm").value = booksGlobal[idx].id_book;
    document.getElementById("nameFrm").value = booksGlobal[idx].name;
    document.getElementById("authorFrm").value = booksGlobal[idx].author;
    document.getElementById("universityFrm").value = booksGlobal[idx].university;
}

export function seeBook2(idBook) {
    const binaryData = atob(booksGlobal[idBook].file);

    // Crea un Blob a partir de los datos binarios
    const blob = new Blob(
        [new Uint8Array(binaryData.length).map((_, i) => binaryData.charCodeAt(i))],
        {
            type: "application/pdf",
        }
    );

    // Crea una URL del Blob
    const blobUrl = URL.createObjectURL(blob);

    // Abre una nueva ventana o pestaña y muestra el PDF
    window.open(blobUrl, "_blank");
}

function loadTable(books) {
    let bookTable = document.getElementById("tbBooks");
    bookTable.innerHTML = "";

    const role = localStorage.getItem('rol');

    books.forEach((book, idx) => {
        const newRow = document.createElement("tr");
        newRow.setAttribute("id", book.id);

        let buttons = `
            <button class="btn btn-sm btn-primary fa-regular fa-eye" onclick="bookModule.seeBook1(${idx})"></button>
        `;

        if (role === "ADMINISTRADOR") {
            buttons += `
                <button class="btn btn-sm btn-warning fa-solid fa-pen-to-square" onclick="bookModule.editBook(${idx})"></button>
                <button class="btn btn-sm btn-danger fa-solid fa-trash-can" onclick="bookModule.deleteBook(${idx})"></button>
            `;
        }

        newRow.innerHTML = `
          <td>${book?.universidad_id}</td>
          <td>${book?.universidad_libro_id}</td>
          <td>${book?.libro_nombre}</td>
          <td>${book?.tema}</td>
          <td>${book?.nombre_universidad}</td>
          <td class="text-center"><span class="badge bg-success">${book?.status ? book?.status : "Activo"}</span></td>
          <td>${buttons}</td>            
        `;

        bookTable.insertAdjacentHTML("beforeend", newRow.outerHTML);
    });
}

function loadTable2(books) {
    const bookTable = document.getElementById("tbBooks");

    // Clear the table
    while (bookTable.firstChild) {
        bookTable.firstChild.remove();
    }

    books.forEach((book, idx) => {
        const newRow = document.createElement("tr");
        newRow.setAttribute("id", book.id);

        // Create and append each cell
        ["universidad_id", "universidad_libro_id", "libro_nombre", "tema", "nombre_universidad"].forEach((property) => {
            const newCell = document.createElement("td");
            newCell.textContent = book[property];
            newRow.appendChild(newCell);
        });

        // Create and append the status cell
        const statusCell = document.createElement("td");
        statusCell.className = "text-center";
        const statusBadge = document.createElement("span");
        statusBadge.className = "badge bg-success";
        statusBadge.textContent = book.status ? book.status : "Activo";
        statusCell.appendChild(statusBadge);
        newRow.appendChild(statusCell);

        // Create and append the action buttons
        const actionCell = document.createElement("td");
        ["seeBook1", "editBook", "deleteBook"].forEach((action, i) => {
            const actionButton = document.createElement("button");
            actionButton.className = `btn btn-sm ${["btn-primary fa-regular fa-eye", "btn-warning fa-solid fa-pen-to-square", "btn-danger fa-solid fa-trash-can"][i]}`;
            actionButton.onclick = () => bookModule[action](idx);
            actionCell.appendChild(actionButton);
        });
        newRow.appendChild(actionCell);

        // Append the row to the table
        bookTable.appendChild(newRow);
    });
}