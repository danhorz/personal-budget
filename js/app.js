// Crear instancias globales
var presupuesto = new Budget();
const formulario = document.getElementById('formulario');
const monto = document.getElementById('input-monto');
const tipo = document.getElementById('tipo');
const botonOrdenar = document.getElementById('btn-ordenar');
const balance = document.getElementById("contenido-balance");
const pIngresos = document.getElementById("contenido-Promedio-Ingresos");
const pGastos = document.getElementById("contenido-Promedio-Gastos");
const historial = document.getElementById("contenido");
const botonUltimo=document.getElementById("btn-registrof");
const botonTodo=document.getElementById("btn-registrot")
let temp = 0;
balance.textContent = formatearMonto(temp, "S/.");
pIngresos.textContent = formatearMonto(temp, "S/.");
pGastos.textContent = formatearMonto(temp, "S/.");

formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    handleSubmit(parseFloat(monto.value));
});

function handleSubmit(valorMonto) {
    const montoNumerico = parseFloat(valorMonto);
    if (montoNumerico > 0) {
        // Crear la nueva transacción
        let transaccion = new Transaction(tipo.value, montoNumerico);

        // Agregar la transacción al presupuesto primero
        presupuesto.add(transaccion);

        // Validar la transacción antes de procesar
        if (isValidTransaction(transaccion)) {
            // Validar el presupuesto después de agregar la transacción
            if (isValidBudget(presupuesto)) {
                // Calcular y actualizar los promedios
                calcularPromedioIngresos(presupuesto.transacciones);
                calcularPromedioGastos(presupuesto.transacciones);

                // Crear elemento del historial y agregar al DOM
                const elemento = document.createElement("p");
                elemento.textContent = `${transaccion.getFormattedDate()} ${transaccion.getSignedAmount()} ${transaccion.tipo}`;
                historial.appendChild(elemento);

                // Actualizar balance
                balance.textContent = formatearMonto(presupuesto.calculateTotal(), "S/.");
            }
        }
    } else {
        alert("Por favor, ingrese un monto válido.");
    }
}
botonTodo.addEventListener('click', function () {
    if (presupuesto.transacciones.length > 0) {
        presupuesto.transacciones = [];

        // Actualizar DOM
        historial.innerHTML = "";
        balance.textContent = formatearMonto(0, "S/.");
        pIngresos.textContent = formatearMonto(0, "S/.");
        pGastos.textContent = formatearMonto(0, "S/.");
    } else {
        alert("No hay transacciones para eliminar.");
    }
});

botonUltimo.addEventListener('click', function () {
    if (presupuesto.transacciones.length > 0) {
        
        const ultimaTransaccion = presupuesto.transacciones[presupuesto.transacciones.length - 1];
        presupuesto.remove(ultimaTransaccion.id);

        // Actualizar DOM
        historial.removeChild(historial.lastChild);
        balance.textContent = formatearMonto(presupuesto.calculateTotal(), "S/.");
        calcularPromedioIngresos(presupuesto.transacciones);
        calcularPromedioGastos(presupuesto.transacciones);
    } else {
        alert("No hay transacciones para eliminar.");
    }
});

botonOrdenar.addEventListener('click', function () {
    historial.innerHTML = "";

    presupuesto.transacciones.sort((a, b) => a.monto - b.monto);

    presupuesto.transacciones.forEach((transaccion) => {
        const elemento = document.createElement("p");
        elemento.textContent = `${transaccion.getFormattedDate()} ${transaccion.getSignedAmount()} ${transaccion.tipo}`;
        historial.appendChild(elemento);
    });
});

function calcularPromedioIngresos(transacciones) {
    const ingresos = transacciones.filter(t => t.tipo === "ingreso");
    const totalIngresos = ingresos.reduce((suma, ingreso) => suma + parseFloat(ingreso.monto), 0);
    const promedioIngresos = ingresos.length > 0 ? totalIngresos / ingresos.length : 0;
    pIngresos.textContent = formatearMonto(promedioIngresos, "S/.");
}

function calcularPromedioGastos(transacciones) {
    const gastos = transacciones.filter(t => t.tipo === "gasto");
    const totalGastos = gastos.reduce((suma, gasto) => suma + parseFloat(gasto.monto), 0);
    const promedioGastos = gastos.length > 0 ? totalGastos / gastos.length : 0;
    pGastos.textContent = formatearMonto(promedioGastos, "S/.");
}

function formatearMonto(monto, moneda) {
    return `${moneda} ${monto.toFixed(2)}`;
}
