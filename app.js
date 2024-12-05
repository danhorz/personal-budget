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

const transacciones = [];
const historial = document.getElementById("contenido");
formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    registrarTransaccion(tipo.value, parseFloat(monto.value));
    //test

});
function registrarTransaccion(tipo, monto) {
    const fecha = new Date();
    this.fecha = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()} - ${fecha.getHours()}:${fecha.getMinutes()}`;
    let temp = new Almacenar(this.fecha, tipo, monto);
    if (monto >= 0) {
        const elemento = document.createElement("p");
        if (tipo === "ingreso") {

            elemento.textContent = this.fecha + " " + temp.tipo + " +" + temp.monto;
            transacciones.push(temp)
        } else {
            elemento.textContent = this.fecha + " " + temp.tipo + " -" + temp.monto;
            transacciones.push(temp)
        }
        historial.appendChild(elemento);

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