function validarValor( monto){
if(monto<=0||isNaN(monto))
return alert("Numero incorrecto o cifra baja");
}

function validarTipo(tipo,monto){
    if(tipo==="gasto"&& monto<0) return alert("Numero incorrecto");
    
}