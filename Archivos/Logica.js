import { initModal, cerrarModal } from "./Modal.js";
import { Usuario } from "./Clase.js";
import { leer, escribir, limpiar, jsonToObject, objectToJson } from "./LocalStorage.js";

document.addEventListener("DOMContentLoaded", onInit);

const KEY_STORAGE = "usuarios";
const usuarios = [];
const formulario = document.getElementById("form-usuario");

function onInit() {
    loadItems();
    rellenarTabla();
    initModal();
    escuchandoFormulario();
}

function loadItems() {
    let str = leer(KEY_STORAGE);
    const objetos = jsonToObject(str) || [];

    objetos.forEach(obj => {
        //const gustosSeleccionados = Array.from(obj.gusto).map(input => input.value);
        const model = new Usuario(
            obj.id,
            obj.nombre,
            obj.apellido,
            obj.gusto,
            obj.genero,
            obj.pais,
            obj.comentario
        );
        console.log(typeof model.gusto)
        usuarios.push(model);
    });
}

function rellenarTabla() {
    const tabla = document.getElementById("table-items");
    let tbody = tabla.getElementsByTagName('tbody')[0];

    tbody.innerHTML = ''; // Limpiar el tbody antes de agregar nuevos datos

    const celdas = ["id", "nombre", "apellido", "gusto", "genero", "pais"];

    usuarios.forEach((item, index) => {
        let nuevaFila = document.createElement("tr");
        let radioBtn = document.createElement("input");
        let celdaRadio = document.createElement("td");

        radioBtn.type = "radio";
        radioBtn.name = "filaSeleccionada"; // Asignar el mismo nombre a todos los botones de radio para que solo se pueda seleccionar uno
        radioBtn.addEventListener("click", () => {
            activarBotonEliminar(index); // Llamar a la función activarBotonEliminar con el índice como parámetro cuando se haga clic en el botón de radio
        });

        celdaRadio.appendChild(radioBtn);
        nuevaFila.appendChild(celdaRadio);
        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            if (celda === "gusto") {
                if (Array.isArray(item[celda])) {
                    nuevaCelda.textContent = item[celda].join(", ");
                } else {
                    nuevaCelda.textContent = "";
                }
            } else {
                nuevaCelda.textContent = item[celda];
            }
            nuevaFila.appendChild(nuevaCelda);
        });

        // Agregar botón de radio a cada fila



        // Agregar la fila al tbody
        tbody.appendChild(nuevaFila);
    });

    // Agregar botón Eliminar al final de la tabla
    let filaBoton = document.createElement("tr");
    let celdaBoton = document.createElement("td");
    let botonEliminar = document.createElement("button");
    estiloBoton(botonEliminar);
    botonEliminar.disabled = true; // Desactivar el botón por defecto
    botonEliminar.addEventListener("click", () => {
        eliminarUsuario(); // Llamar a la función eliminarUsuario al hacer clic en el botón
    });
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

// Función para eliminar un usuario del array usuarios
function eliminarUsuario() {
    let botonEliminar = document.querySelector("#table-items button");
    if (botonEliminar) {
        let index = parseInt(botonEliminar.dataset.index);
        usuarios.splice(index, 1); // Eliminar el usuario en el índice guardado en el atributo data-index del botón
        const str = objectToJson(usuarios);
        escribir(KEY_STORAGE, str);
        rellenarTabla(); // Volver a rellenar la tabla para reflejar los cambios
    }
}


function escuchandoFormulario() {
    formulario.addEventListener("submit", (e) => {
        // Luego del primer parcial, comenzaremos a enviar los datos a un externo
        // evito el comportamiento que realiza por defecto
        e.preventDefault();

        const id = obtenerProximoId();
        const nombre = formulario.querySelector("#nombre").value;
        const apellido = formulario.querySelector("#apellido").value;
        const gustos = obtenerGustos();
        const genero = obtenerGenero();
        const pais = formulario.querySelector("#pais").value;
        const observacion = formulario.querySelector("#observacion").value;

        // Construir objeto Usuario
        const model = new Usuario(id, nombre, apellido, gustos, genero, pais, observacion);

        // Validar nombre y apellido
        const nombreValido = Usuario.validarNombreApellido(nombre);
        const apellidoValido = Usuario.validarNombreApellido(apellido);

        if (!nombreValido || !apellidoValido) {
            alert("El nombre y el apellido deben contener solo letras y tener un máximo de 15 caracteres.");
            return;
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
        return null; // Retornar null si no se ha seleccionado ningún género
    }
}

function obtenerUltimoId() {
    let ultimoId = 0;
    if (usuarios.length > 0) {
        ultimoId = usuarios[usuarios.length - 1].id;
        return ultimoId;
    } else {
        return 1;
    }

}

function obtenerProximoId() {
    const ultimoId = obtenerUltimoId();
    return ultimoId + 1;
}

function estiloBoton(botonEliminar) {
    botonEliminar.textContent = "Eliminar";
    botonEliminar.style.backgroundColor = "red";
    botonEliminar.style.color = "white";
    botonEliminar.style.padding = "10px 20px";
    botonEliminar.style.border = "none";
    botonEliminar.style.borderRadius = "5px";
}