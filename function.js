const { Pool } = require('pg');
const config = require('./config.js')
const pool = new Pool(config);
pool.connect(err =>{
    if(err){
        console.log(`error al conectar a la base de datos ${err}`);
    }
})
const formatDate = (current_datetime)=>{
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
    return formatted_date;
}
function getForm  (req) {
    return new Promise((res, rej) => {
      let str = ''
      req.on('data', function (chunk) {
        str += chunk
      })
      req.on('end', function () {
        //console.log('str', str);
        const obj = JSON.parse(str)
        res(obj)
      })
    })
}
async function crearUsuario(nombre,balance){
    const client = await pool.connect();
    const agregarUsuario = await  client.query(`insert into usuarios (nombre, balance ) values ('${nombre}',${balance}) returning *`);
    client.release()
}
async function mostrarUsuario(){
    const client = await pool.connect()
    const mostrarUsuarios = await  client.query(`select * from usuarios`)
    const datos = mostrarUsuarios.rows
    client.release()
    return datos
}
async function editarUsuario(nombre,balance,id){
    const client = await pool.connect();
    const editarUsuario = await  client.query(`update usuarios set nombre='${nombre}',balance=${balance} where id=${id} returning *`)
    client.release();
}
async function eliminarUsuario(id){
    const client = await pool.connect()
    const eliminarTransferencia = await client.query(`delete from transferencias where emisor=${id} or receptor=${id}`)
    const eliminarUsuario = await client.query(`delete from usuarios where id=${id}`)
    client.release()
}
async function crearTransferencia(emisor,receptor,monto,data){
    const client = await pool.connect()
    // __________________________________________________________________________
    const emisor2 = await client.query(`select id,balance from usuarios where nombre='${emisor}'`)
    const data_emisor = emisor2.rows[0]
    const id_emisor=data_emisor.id
    const balance_emisor = data_emisor.balance
//______________________________________________________________________
    const receptor2 = await client.query(`select id,balance from usuarios where nombre='${receptor}'`)
    const data_receptor = receptor2.rows[0]
    const id_receptor= data_receptor.id
    const balance_receptor = data_receptor.balance
    console.log(balance_receptor);
    if(balance_emisor < monto||balance_emisor < 0){
        return
    }
    if(balance_emisor < 0){
        return
    }
    //se debe actualizar el monto del balance del emisor(se debe restar)
    const resta = parseInt(balance_emisor) - monto
    const suma = parseInt(balance_receptor) + parseInt(monto)
    const montoActualizarE =  await client.query(`update usuarios set balance=${resta} where id=${id_emisor}`)
    //se debe actualizar el monto de balance del receptor(se debe sumar)
    const montoActualizarR =  await client.query(`update usuarios set balance=${suma} where id=${id_receptor}`)
    

   const crearTransferencia = await client.query(`insert into transferencias (emisor, receptor, monto,fecha) values (${id_emisor},${id_receptor},${monto},'${data}')`)
    client.release()

}
async function historialTransferencias(){
    const client = await pool.connect()
    
    const mostrarUsuarios = await  client.query(`SELECT fecha, emisores.nombre as Emisor, receptores.nombre as Receptor, Monto FROM transferencias
    JOIN usuarios as emisores ON emisor=emisores.id
    join usuarios as receptores on receptor= receptores.id;`)
    let datos = mostrarUsuarios.rows
    datos = datos.map(data => Object.values(data));  
    client.release()
    return datos
}

module.exports = {getForm, crearUsuario,mostrarUsuario,editarUsuario,eliminarUsuario,crearTransferencia,historialTransferencias,formatDate}