// Constructor
function Budget() {
    // Inicializa un array vacío para las transacciones
    this.transacciones=[];
  }
  
  Budget.prototype.add=function(transaccion){
    this.transacciones.push(transaccion)
  }
  // Agrega una nueva transacción al array
  
  Budget.prototype.remove = function(id) {
    this.transacciones = this.transacciones.filter(transaccion => transaccion.id !== id);
}
  // Elimina una transacción por id
  
  Budget.prototype.calculateTotal = function() {
    return this.transacciones.reduce((total, elemento) => total + parseFloat(elemento.getSignedAmount()), 0);
};
Budget.prototype.findTransactionById = function(id) {
  return this.transacciones.find(transaccion => transaccion.id === id);
};

Budget.prototype.filterTransactionsByType = function(tipo) {
  return this.transacciones.filter(transaccion => transaccion.tipo === tipo);
};

Budget.prototype.getTotalByType = function(tipo) {
  return this.transacciones
      .filter(transaccion => transaccion.tipo === tipo)
      .reduce((total, transaccion) => total + parseFloat(transaccion.monto), 0);
};