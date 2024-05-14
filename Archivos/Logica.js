import { initModal, cerrarModal } from "./Modal.js";
import { Anuncio } from "./Clase.js";
import { leer, escribir, jsonToObject, objectToJson, mostrarSpinner, ocultarSpinner } from "./LocalStorage.js";

document.addEventListener("DOMContentLoaded", onInit);

const KEY_STORAGE = "usuarios";
const usuarios = [];
const formulario = document.getElementById("form-usuario");

function onInit() {
    loadItems();
    //rellenarTabla();
    initModal();
    escuchandoFormulario();
}

//Funcion para cargar los item de la lista del Json
function loadItems() {
    mostrarSpinner();
    leer(KEY_STORAGE).then(str => {
        ocultarSpinner();
        const objetos = jsonToObject(str) || [];

        objetos.forEach(obj => {
            const model = new Anuncio(
                obj.id,
                obj.titulo,
                obj.precio,
                obj.color,
                obj.transaccion,
                obj.pais,
                obj.descripcion
            );
            usuarios.push(model);
        });

        rellenarTabla();
    }).catch(error => {
        console.error('Error al cargar los datos:', error);
        ocultarSpinner();
    });
}

//Funcion para crear la tabla
function rellenarTabla() {
    const tabla = document.getElementById("table-items");
    const tbody = tabla.getElementsByTagName('tbody')[0];

    limpiarTabla(tbody);
    agregarFilas(tbody);
    agregarBotonEliminar(tbody);
}

//Funcion para limpiar la tabla
function limpiarTabla(tbody) {
    tbody.innerHTML = ''; 
}

//Funcion para cargar datos en la fila
function agregarFilas(tbody) {
    const celdas = ["id", "titulo", "precio", "color", "transaccion", "pais"];

    usuarios.forEach((item, index) => {
        const nuevaFila = crearFila(item, index, celdas);
        tbody.appendChild(nuevaFila);
    });
}

//Funcion para generar las filas, tomar el array del objeto, pasarlo a string para mostrarlo
//tambien solo permite modificar las celdas titulo o precio nada mas
function crearFila(item, index, celdas) {
    const nuevaFila = document.createElement("tr");
    const radioBtn = crearRadioBtn(index);

    nuevaFila.appendChild(crearCeldaRadio(radioBtn));

    celdas.forEach((celda) => {
        const nuevaCelda = document.createElement("td");
        if (celda === "gusto") {
            nuevaCelda.textContent = Array.isArray(item[celda]) ? item[celda].join(", ") : "";
        } else {
            nuevaCelda.textContent = item[celda];
            if (celda === "titulo" || celda === "precio") {
                agregarEventoModificacion(nuevaCelda, index, celda);
            }
        }
        nuevaFila.appendChild(nuevaCelda);
    });

    return nuevaFila;
}

//Funcion para tomar el select con evento click para el indice de la fila
function crearRadioBtn(index) {
    const radioBtn = document.createElement("input");
    radioBtn.type = "radio";
    radioBtn.name = "filaSeleccionada";
    radioBtn.addEventListener("click", () => activarBotonEliminar(index));
    return radioBtn;
}

//Funcion para crear la celda del select
function crearCeldaRadio(radioBtn) {
    const celdaRadio = document.createElement("td");
    celdaRadio.appendChild(radioBtn);
    return celdaRadio;
}

//funcion para tomar el evento doble click sobre las celdas
function agregarEventoModificacion(celda, index, campo) {
    celda.addEventListener("dblclick", () => modificar(index, campo));
}

//Funcion para crear con logica el boton eliminar
function crearBotonEliminar() {
    const botonEliminar = document.createElement("button");
    estiloBoton(botonEliminar);
    botonEliminar.disabled = true;
    botonEliminar.addEventListener("click", eliminarUsuario);
    return botonEliminar;
}

//Funcion para darle estilo al boton eliminar con logica
function estiloBoton(botonEliminar) {
    botonEliminar.textContent = "Eliminar";
    botonEliminar.style.backgroundColor = "red";
    botonEliminar.style.color = "white";
    botonEliminar.style.padding = "10px 20px";
    botonEliminar.style.border = "none";
    botonEliminar.style.borderRadius = "5px";
}

//Funcion para agregar el boton eliminar a una celda de la tabla
function agregarBotonEliminar(tbody) {
    const filaBoton = document.createElement("tr");
    const celdaBoton = document.createElement("td");
    const botonEliminar = crearBotonEliminar();

    celdaBoton.appendChild(botonEliminar);
    filaBoton.appendChild(celdaBoton);
    tbody.appendChild(filaBoton);
}

// Función para activar el botón Eliminar cuando se selecciona una fila
function activarBotonEliminar(index) {
    let botonEliminar = document.querySelector("#table-items button");
    if (botonEliminar) {
        botonEliminar.disabled = false; // Activar el botón Eliminar
        botonEliminar.dataset.index = index; // Guardar el índice del usuario seleccionado en el atributo data-index del botón
    }
}

//funcion para modificar los item de la lista
function modificar(index, campo) {
    const nuevoValor = prompt(`Ingrese el nuevo valor para ${campo}:`);
    if (nuevoValor !== null) {
        usuarios[index][campo] = nuevoValor;
        const str = objectToJson(usuarios);
        guardarYRellenarTabla(str);
    }
}

// Función para eliminar un usuario del array usuarios
function eliminarUsuario() {
    let botonEliminar = document.querySelector("#table-items button");
    if (botonEliminar) {
        let index = parseInt(botonEliminar.dataset.index);
        usuarios.splice(index, 1); 
        const str = objectToJson(usuarios);
        guardarYRellenarTabla(str)
    }
}

//funcion para guardar modificaciones en la lista junto a un texto de carga
function guardarYRellenarTabla(str) {
    mostrarSpinner();
    escribir(KEY_STORAGE, str)
    .then(() => {
        ocultarSpinner();
        rellenarTabla();
    })
    .catch(error => {
        ocultarSpinner();
        console.error('Error al guardar los datos:', error);
    });
}

//Funcion submit del boton enviar en el modal para cargar un nuevo item a la lista
function escuchandoFormulario() {
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = obtenerProximoId();
        const titulo = formulario.querySelector("#nombre").value;
        const precio = formulario.querySelector("#apellido").value;
        const color = obtenerGustos();
        const transaccion = obtenerGenero();
        const pais = formulario.querySelector("#pais").value;
        const descripcion = formulario.querySelector("#observacion").value;

        const model = new Anuncio(id, titulo, precio, color, transaccion, pais, descripcion);

        const nombreValido = Anuncio.validarNombreApellido(titulo);
        const precioValido = Anuncio.validarNumeroDecimal(precio);

        if (!nombreValido) {
            alert("El titulo debe contener solo letras y tener un máximo de 15 caracteres.");
            return;
        } else if (!precioValido) {
            alert("El precio deben ser solo numeros con o sin decimales");
        } else {
            usuarios.push(model);
            const str = objectToJson(usuarios);
            escribir(KEY_STORAGE, str);
            formulario.reset();
            cerrarModal();
            rellenarTabla();
        }
    });
}

// Función para obtener los gustos seleccionados
function obtenerGustos() {
    const gustosSeleccionados = [];
    const checkboxes = document.querySelectorAll('input[name="gusto"]:checked');
    checkboxes.forEach((checkbox) => {
        gustosSeleccionados.push(checkbox.value);
    });
    return gustosSeleccionados;
}

// Función para obtener el género seleccionado
function obtenerGenero() {
    const radioButtons = document.querySelectorAll('input[name="genero"]:checked');
    if (radioButtons.length > 0) {
        return radioButtons[0].value;
    } else {
        return null; 
    }
}

//Funcion para obtener el ultimo ID de la lista
function obtenerUltimoId() {
    let ultimoId = 0;
    if (usuarios.length > 0) {
        ultimoId = usuarios[usuarios.length - 1].id;
        return ultimoId;
    } else {
        return 0;
    }

}

//Funcion para sumar 1 al ultimo id encontrado
function obtenerProximoId() {
    const ultimoId = obtenerUltimoId();
    return ultimoId + 1;
}

