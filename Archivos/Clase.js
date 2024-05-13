class Usuario {
    constructor(id, nombre, apellido, gusto, genero, pais, comentario) {
      this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.gusto = gusto;
      this.genero = genero;
      this.pais = pais;
      this.comentario = comentario;
    }
    
    static validarNombreApellido(cadena) {
        const regex = /^[a-zA-Z]{1,15}$/;
        return regex.test(cadena);
    }
    
  }
  
  export { Usuario };