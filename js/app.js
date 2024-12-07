class Almacenar {
    constructor(fecha, tipo, monto) {
        this.fecha = fecha;
        this.tipo = tipo;
        this.monto = monto;
    }
}
const formulario = document.getElementById('formulario');
const monto = document.getElementById('input-monto');
const tipo = document.getElementById('tipo');
const botonOrdenar = document.getElementById('btn-ordenar');
const balance = document.getElementById("contenido-balance");
const pIngresos=document.getElementById("contenido-Promedio-Ingresos");
const pGastos=document.getElementById("contenido-Promedio-Gastos");
const transacciones = [];
const historial = document.getElementById("contenido");
//temporal=0
let temp = 0;
balance.textContent = formatearMonto(temp, "S/.")
pIngresos.textContent=formatearMonto(temp, "S/.")
pGastos.textContent=formatearMonto(temp, "S/.")

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    registrarTransaccion(tipo.value, parseFloat(monto.value));

});
function registrarTransaccion(tipo, monto) {
    const fecha = new Date();
    this.fecha = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()} - ${fecha.getHours()}:${fecha.getMinutes()}`;
    let temp = new Almacenar(this.fecha, tipo, monto);
    if (monto > 0) {
        const elemento = document.createElement("p");
        if (tipo === "ingreso") {

            elemento.textContent = this.fecha + " " + temp.tipo + " +" + temp.monto;
            transacciones.push(temp)
        } //gasto
        else {
            if (temp >= 0) {
                elemento.textContent = this.fecha + " " + temp.tipo + " -" + temp.monto;
                transacciones.push(temp)
            } else {
                alert("ingrese un ingreso");
            }


        }
        historial.appendChild(elemento);

        //
        balance.textContent = formatearMonto(calcularBalance(transacciones), "S/.")


    }
    else {
        validarValor(monto);

    }
}
botonOrdenar.addEventListener('click', function () {
    historial.innerHTML = "";

    transacciones.sort((a, b) => {

        if (a.tipo > b.tipo) return 1;
        if (a.tipo < b.tipo) return -1;
        return b.monto - a.monto;
    });
    transacciones.forEach((transaccion) => {
        const elemento = document.createElement("p");
        if (transaccion.tipo === "ingreso") {
            elemento.textContent = `${transaccion.fecha}: ${transaccion.tipo}: +${transaccion.monto}`;
        } else {
            elemento.textContent = `${transaccion.fecha}: ${transaccion.tipo}: -${transaccion.monto}`;
        }
        historial.appendChild(elemento);
    });

})