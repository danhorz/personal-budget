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

        let transaccion = new Transaction(tipo.value, montoNumerico);


        if (isValidTransaction(transaccion)) {

            if (isValidBudget(presupuesto)) {

                presupuesto.add(transaccion);

                calcularPromedioIngresos(presupuesto.transacciones);
                calcularPromedioGastos(presupuesto.transacciones);

                const elemento = document.createElement("p");
                elemento.textContent = `${transaccion.getFormattedDate()} ${transaccion.getSignedAmount()} ${transaccion.tipo}`;
                historial.appendChild(elemento);

                balance.textContent = formatearMonto(presupuesto.calculateTotal(), "S/.");
            } else {
                console.log("Presupuesto no válido");
            }
        } else {
            console.log("Transacción no válida");
        }
    } else {
        alert("Por favor, ingrese un monto válido.");
    }
}


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
