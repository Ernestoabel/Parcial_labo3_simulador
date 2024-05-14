const delay = 3;

// Función para leer del localStorage
export function leer(clave) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const valor = JSON.parse(localStorage.getItem(clave));
            resolve(valor);
          } 
          catch (error) {
            reject(error);
          }
        }, delay * 1000);
      });
}

// Función para escribir en el localStorage
export function escribir(clave, valor) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            localStorage.setItem(clave, JSON.stringify(valor));
            resolve();
          } catch (error) {
            reject(error);
          }
        }, delay * 1000);
      });
}

export function limpiar(clave) {
    localStorage.removeItem(clave);
}

// Función para convertir de JSON string a objeto
export function jsonToObject(jsonString) {
    return JSON.parse(jsonString);
}

// Función para convertir de objeto a JSON string
export function objectToJson(objeto) {
    return JSON.stringify(objeto);
}

// Función para mostrar el spinner
export function mostrarSpinner() {
    action(true);
}

// Función para ocultar el spinner
export function ocultarSpinner() {
    action();
}




function action(visible = false) {
    const display = visible ? 'flex' : 'none';
    document.getElementById('spinner').style.display = display;
}