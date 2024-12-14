let chart; // Variable global para el gráfico

// Inicializar el gráfico
function inicializarGrafico() {
    const ctx = document.getElementById('chartIngresosGastos').getContext('2d');

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Gastos'], // Etiquetas
            datasets: [{
                label: 'Monto (S/.)',
                data: [0, 0], // Inicialmente vacío
                backgroundColor: ['#4caf50', '#f44336'], // Colores
                borderColor: ['#388e3c', '#d32f2f'], // Bordes
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Actualizar los datos del gráfico
function actualizarGrafico(transacciones) {
    const totalIngresos = transacciones
        .filter(t => t.tipo === "ingreso")
        .reduce((suma, t) => suma + parseFloat(t.monto), 0);

    const totalGastos = transacciones
        .filter(t => t.tipo === "gasto")
        .reduce((suma, t) => suma + parseFloat(t.monto), 0);

    chart.data.datasets[0].data = [totalIngresos, totalGastos];
    chart.update();
}

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

const botonTodo = document.getElementById("btn-registrot");
let temp = 0;
balance.textContent = formatearMonto(temp, "S/.");
pIngresos.textContent = formatearMonto(temp, "S/.");
pGastos.textContent = formatearMonto(temp, "S/.");

document.addEventListener('DOMContentLoaded', () => {
    inicializarGrafico();
});

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
        actualizarGrafico(presupuesto.transacciones);

        // Validar la transacción antes de procesar
        if (isValidTransaction(transaccion)) {
            // Validar el presupuesto después de agregar la transacción
            if (isValidBudget(presupuesto)) {
                // Calcular y actualizar los promedios
                calcularPromedioIngresos(presupuesto.transacciones);
                calcularPromedioGastos(presupuesto.transacciones);

                // Crear elemento del historial y agregar al DOM
                const elemento = document.createElement("p");
                const botonEliminar = document.createElement("button");
                botonEliminar.textContent = "Eliminar";
                botonEliminar.classList.add("btn-eliminar");
                botonEliminar.addEventListener("click", function () {
                    presupuesto.remove(transaccion.id);
                    elemento.remove();
                    balance.textContent = formatearMonto(presupuesto.calculateTotal(), "S/.");
                    calcularPromedioIngresos(presupuesto.transacciones);
                    calcularPromedioGastos(presupuesto.transacciones);
                    actualizarGrafico(presupuesto.transacciones);
                });

                elemento.textContent = `${transaccion.getFormattedDate()} ${transaccion.getSignedAmount()} ${transaccion.tipo}`;
                elemento.appendChild(botonEliminar);
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
        actualizarGrafico(presupuesto.transacciones);
    } else {
        alert("No hay transacciones para eliminar.");
    }
});


botonOrdenar.addEventListener('click', function () {
    // Ordenamos las transacciones por tipo (ingreso/gasto) y luego, dentro de los gastos, de mayor a menor
    presupuesto.transacciones.sort((a, b) => {
        // Primero comparamos por tipo: 'ingreso' debería ir antes que 'gasto'
        if (a.tipo === 'ingreso' && b.tipo === 'gasto') return -1;
        if (a.tipo === 'gasto' && b.tipo === 'ingreso') return 1;

        // Si ambos son del mismo tipo, ordenamos los gastos de mayor a menor
        if (a.tipo === 'gasto' && b.tipo === 'gasto') {
            return b.monto - a.monto; // De mayor a menor
        }

        return 0; // Si son ingresos, no hace falta ordenar dentro de los ingresos
    });

    // Volver a llenar el historial con las transacciones ordenadas
    historial.innerHTML = ""; // Limpiamos el historial para re-agregar las transacciones ordenadas

    presupuesto.transacciones.forEach((transaccion) => {
        const elemento = document.createElement("p");
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("btn-eliminar");

        // Agregar la funcionalidad de eliminar
        botonEliminar.addEventListener("click", function () {
            presupuesto.remove(transaccion.id);
            elemento.remove();
            balance.textContent = formatearMonto(presupuesto.calculateTotal(), "S/.");
            calcularPromedioIngresos(presupuesto.transacciones);
            calcularPromedioGastos(presupuesto.transacciones);
            actualizarGrafico(presupuesto.transacciones);
        });

        elemento.textContent = `${transaccion.getFormattedDate()} ${transaccion.getSignedAmount()} ${transaccion.tipo}`;
        elemento.appendChild(botonEliminar);
        historial.appendChild(elemento);
    });

    // Actualizamos los promedios y el gráfico después de ordenar
    calcularPromedioIngresos(presupuesto.transacciones);
    calcularPromedioGastos(presupuesto.transacciones);
    actualizarGrafico(presupuesto.transacciones);
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
