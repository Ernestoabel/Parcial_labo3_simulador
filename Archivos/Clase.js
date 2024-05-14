class Anuncio {
    constructor(id, titulo, precio, color, transaccion, pais, descripcion) {
      this.id = id;
      this.titulo = titulo;
      this.precio = precio;
      this.color = color;
      this.transaccion = transaccion;
      this.pais = pais;
      this.descripcion = descripcion;
    }
    
    static validarNombreApellido(cadena) {
        const regex = /^[a-zA-Z]{1,15}$/;
        return regex.test(cadena);
    }

    static validarNumeroDecimal(cadena) {
      const regex = /^[0-9]+(\.[0-9]+)?$/;
      return regex.test(cadena);
  }
    
  }
  
  export { Anuncio };