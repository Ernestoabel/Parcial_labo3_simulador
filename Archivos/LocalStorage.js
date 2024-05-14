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

export function mostrarSpinner() {
    const loadingText = document.getElementById('loading-text');
    loadingText.style.display = 'block';
    animateLoadingText();
}

export function ocultarSpinner() {
    const loadingText = document.getElementById('loading-text');
    loadingText.style.display = 'none';
}


function animateLoadingText() {
    const loadingText = document.getElementById('loading-text');
    let counter = 0;
    const interval = setInterval(() => {
        loadingText.textContent = 'Cargando' + '.'.repeat(counter % 4);
        counter++;
    }, 500);

    // Detener la animación después de un tiempo
    setTimeout(() => {
        clearInterval(interval);
    }, 5000); // Detener después de 5 segundos (ajusta este valor según sea necesario)
}