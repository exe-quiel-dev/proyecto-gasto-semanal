// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}



// Classes
class Presupuesto {
    constructor( presupuesto ){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado = this.gastos.reduce( ( total, gasto )=> total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;    
    };
    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto( cantidad ){
        // Extrayendo valores
        const {presupuesto, restante} = cantidad;
        // Agregar a html
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }
    imprimirAlerta(mensaje, tipo){
        // crear div mensaje
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        // Mensaje de error
        divMensaje.textContent = mensaje;
        // Insertar en HTML
        document.querySelector('.primario').insertBefore( divMensaje, formulario);
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    mostrarGastos(gastos){
        this.limpiarHTML();
        gastos.forEach(gasto => {
            const { cantidad, nombre, id }= gasto;
            
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            nuevoGasto.innerHTML = ` ${nombre} <span class="badge badge-primary badge-pill">$${cantidad}</span> `

            const btnBorrar = document.createElement('button');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.onclick = ()=>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            gastoListado.appendChild(nuevoGasto);
        });
    }
    limpiarHTML(){
        while (gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante( restante ){
        document.querySelector('#restante').textContent = restante;
    }
    comprobarPresupuesto( presupuestoObj ){
        const { presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        if( (presupuesto / 4) > restante ){      
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if( (presupuesto / 2 ) > restante ){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
    
}
// Instanciar
const ui = new UI();
let presupuesto;

// Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');
    // console.log(Number(presupuestoUsuario));
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }
    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}

// agrega gastos

function agregarGasto(e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    // Validar
    if (nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if ( cantidad <= 0 || isNaN(cantidad)) {
       ui.imprimirAlerta('Cantidad no valida', 'error');
       return;
    }
    
    // obj gasto
    const gasto = { nombre, cantidad, id: Date.now() };
    // agrega un nuevo gasto
    presupuesto.nuevoGasto( gasto );
    ui.imprimirAlerta('Gasto agregado correctamente');
    
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    formulario.reset();
}
function eliminarGasto(id){
    // Elimina gastos del OBJ
    presupuesto.eliminarGasto(id);
    // Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}