// Constructor
function Transaction(tipo, monto) {

    this.id=Date.now()
    this.fecha = new Date()
    this.tipo = tipo;
    this.monto = parseFloat(monto).toFixed(2);
    }
    
    Transaction.prototype.getFormattedDate = function() {
      // Retorna la fecha como String en formato legible
      return this.fecha.getDate() + "/" + (this.fecha.getMonth() + 1) + "/" + this.fecha.getFullYear();
  };
  
    
    Transaction.prototype.getSignedAmount = function() {
      return this.tipo === "ingreso" ? parseFloat(this.monto) : -parseFloat(this.monto);
  };
