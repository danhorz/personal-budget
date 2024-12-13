function isValidTransaction(transaction) {
    // Verificar que la transacción tenga un tipo válido (ingreso o gasto)
    const tiposValidos = ["ingreso", "gasto"];
    if (!transaction.tipo || !tiposValidos.includes(transaction.tipo)) {
        alert("Tipo de transacción no válido.");
        return false;
    }

    // Verificar que el monto sea un número mayor que 0
    if (isNaN(transaction.monto) || transaction.monto <= 0) {
        alert("Monto de transacción inválido.");
        return false;
    }

    return true;
}


function isValidBudget(budget) {
    // Verificar que el presupuesto sea una instancia de Budget
    if (!(budget instanceof Budget)) {
        alert("El presupuesto no es válido.");
        return false;
    }

    // Verificar que el presupuesto tenga al menos un objeto de transacción
    if (!Array.isArray(budget.transacciones) || budget.transacciones.length === 0) {
        alert("El presupuesto debe tener al menos una transacción.");
        return false;
    }

    return true;
}
