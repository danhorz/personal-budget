const calcularBalance = (transacciones) => {
    return transacciones.reduce((total, trans) => {
        // Verificar si la transacción es "gasto" o "ingreso"
        if (trans.tipo === 'gasto') {
            return total - trans.monto; // Restar si es gasto
        } else {
            return total + trans.monto; // Sumar si es ingreso
        }
    }, 0); // Iniciar el total en 0
}
function formatearMonto(monto, moneda){
return moneda+" "+monto;
}