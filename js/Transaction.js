// Constructor
function Transaction(tipo, monto, descripcion = "") {
  this.id = Date.now();
  this.fecha = new Date();
  this.tipo = tipo;
  this.monto = parseFloat(monto).toFixed(2);
  this.descripcion = descripcion.trim(); // Asegurar que la descripción no tenga espacios extra
}

    
    Transaction.prototype.getFormattedDate = function() {
      // Retorna la fecha como String en formato legible
      return this.fecha.getDate() + "/" + (this.fecha.getMonth() + 1) + "/" + this.fecha.getFullYear();
  };
  
    
    Transaction.prototype.getSignedAmount = function() {
      return this.tipo === "ingreso" ? parseFloat(this.monto) : -parseFloat(this.monto);
  };

  Transaction.prototype.updateCategories = function(nuevaCategoria) {
    return this.transacciones.map(transaccion => ({ ...transaccion, categoria: nuevaCategoria }));
};

Transaction.prototype.hasTransactionsOverAmount = function(monto) {
    return this.transacciones.some(transaccion => parseFloat(transaccion.monto) > monto);
};

Transaction.prototype.areAllTransactionsValid = function() {
    return this.transacciones.every(transaccion => parseFloat(transaccion.monto) > 0);
};

Transaction.prototype.formatDescription = function(descripcion) {
    return descripcion.trim();
};

Transaction.prototype.getTransactionType = function(tipo) {
    return tipo.toLowerCase();
};

Transaction.prototype.splitTags = function(tags) {
    return tags.split(",").map(tag => tag.trim());
};