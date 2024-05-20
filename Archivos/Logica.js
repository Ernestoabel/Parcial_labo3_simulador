import { initModal, cerrarModal } from "./Modal.js";
import { Planeta } from "./Clase.js";
import { leer, escribir, jsonToObject, objectToJson, mostrarSpinner, ocultarSpinner, mostrarSpinnerGiratorio, ocultarSpinnerGiratorio } from "./LocalStorage.js";

document.addEventListener("DOMContentLoaded", onInit);

const KEY_STORAGE = "Planetas";
const planetas = [];
const formulario = document.getElementById("form-planeta");

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
            const model = new Planeta(
                obj.id,
                obj.nombre,
                obj.tamanio,
                obj.masa,
                obj.tipo,
                obj.distancia,
                obj.anillo,
                obj.vida,
                obj.composicion
            );
            planetas.push(model);
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
    const celdas = ["id", "nombre", "tamanio", "masa", "tipo", "distancia", "anillo", "vida", "composicion"];

    planetas.forEach((item, index) => {
        const nuevaFila = crearFila(item, index, celdas);
        tbody.appendChild(nuevaFila);
    });
}

//Funcion para generar las filas
function crearFila(item, index, celdas) {
    const nuevaFila = document.createElement("tr");
    const radioBtn = crearRadioBtn(index);

    nuevaFila.appendChild(crearCeldaRadio(radioBtn));

    celdas.forEach((celda) => {
        const nuevaCelda = document.createElement("td");
        if (celda != null) {
            nuevaCelda.textContent = item[celda];
            agregarEventoModificacion(nuevaCelda, index, celda);
        }
        nuevaFila.appendChild(nuevaCelda);
    });

    return nuevaFila;
}

//funcion para tomar el evento doble click sobre las celdas
function agregarEventoModificacion(celda, index, campo) {
    celda.addEventListener("dblclick", () => modificar(index, campo));
}

function modificar(index, campo) {
    if (campo === "anillo" || campo === "vida") {
        modificarTrueoFalse(index, campo);
    } else if (campo === "tipo") {
        modificarTipo(index);
    } else {
        modificarCampo(index, campo);
    }
}

function modificarCampo(index, campo) {
    const nuevoValor = prompt(`Ingrese el nuevo valor para ${campo}:`);

    if (campo === "nombre") {
        const nombreValido = Planeta.validarSoloLetra(nuevoValor);
        if (!nombreValido) {
            alert("El nombre debe contener solo letras y tener un máximo de 15 caracteres.");
            return;
        }
    } else if (campo === "tamanio" || campo === "distancia") {
        const precioValido = Planeta.validarNumeroDecimal(nuevoValor);
        if (!precioValido) {
            alert("El precio tamaño ser solo números con o sin decimales.");
            return;
        }
    }

    planetas[index][campo] = nuevoValor;
    const str = objectToJson(planetas);
    guardarYRellenarTabla(str);
}

function modificarTipo(index) {
    const nuevoValor = prompt("Ingrese el nuevo valor para el tipo (ej: Rocoso, Gaseoso, Helado o Enano):");

    const tiposValidos = ["Rocoso", "Gaseoso", "Helado", "Enano"];

    if (!tiposValidos.includes(nuevoValor)) {
        alert(`El país ingresado no es válido. Los valores válidos son: ${tiposValidos.join(", ")}`);
        return;
    }

    planetas[index].tipo = nuevoValor;
    const str = objectToJson(planetas);
    guardarYRellenarTabla(str);
}

//funcion para modificar el campo puertas
function modificarTrueoFalse(index, campo) {
    const nuevoValor = prompt(`Ingrese el nuevo valor para (true o false) ${campo}:`);
    const valoresValidos = ["true", "false"];

    if (!valoresValidos.includes(nuevoValor)) {
        alert("El valor ingresado no es válido. Debe ser 'true' o 'false'.");
        return;
    }
    if(campo === "vida"){
        planetas[index]["vida"] = nuevoValor;
    }else{
        planetas[index]["anillo"] = nuevoValor;
    }

    const str = objectToJson(planetas);
    guardarYRellenarTabla(str);
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
        botonEliminar.disabled = false;
        botonEliminar.dataset.index = index;
    }
}

// Función para eliminar una fila del array planetas
function eliminarUsuario() {
    let botonEliminar = document.querySelector("#table-items button");
    if (botonEliminar) {
        let index = parseInt(botonEliminar.dataset.index);
        planetas.splice(index, 1);
        const str = objectToJson(planetas);
        guardarYRellenarTabla(str)
    }
}

//funcion para simular un peticion y esperar en la lista junto a un texto de carga
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
        const nombre = formulario.querySelector("#nombre").value;
        const tamanio = formulario.querySelector("#tamanio").value;
        const masa = formulario.querySelector("#tamanio").value;
        const tipo = formulario.querySelector("#tipo").value;
        const distancia = formulario.querySelector("#distancia").value;
        const anillo = formulario.querySelector("#anillo").checked;
        const vida = formulario.querySelector("#vida").checked;
        const composicion = formulario.querySelector("#observacion").value;

        const model = new Planeta(id, nombre, tamanio, masa, tipo, distancia, anillo, vida, composicion);

        const nombreValido = Planeta.validarSoloLetra(nombre);
        const tamanioValido = Planeta.validarNumeroDecimal(tamanio);
        const distanciaValido = Planeta.validarNumeroDecimal(distancia);

        if (!nombreValido) {
            alert("El nombre debe contener solo letras y tener un máximo de 15 caracteres.");
            return;
        } else if (!tamanioValido) {
            alert("El tamaño debe ser solo numeros con o sin decimales");
            return;
        } else if (!distanciaValido) {
            alert("La distancia debe ser solo numeros con o sin decimales");
            return;
        } else {
            planetas.push(model);
            const str = objectToJson(planetas);
            escribir(KEY_STORAGE, str)
            formulario.reset();
            cerrarModal();
            rellenarTabla();
        }
    });
}

//Funcion para obtener el ultimo ID de la lista
function obtenerUltimoId() {
    let ultimoId = 0;
    if (planetas.length > 0) {
        ultimoId = planetas[planetas.length - 1].id;
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

