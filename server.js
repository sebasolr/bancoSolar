const express = require('express');
const {getForm, crearUsuario, mostrarUsuario,editarUsuario,eliminarUsuario,crearTransferencia,historialTransferencias,formatDate  } = require('./function.js')

const app = express();




app.use(express.static('public'));
// generamos las rutas solicitadas

app.get('/',async (req,res)=>{

})
app.post('/usuario',async (req,res)=>{
    const datos = await getForm(req);
    const nombre = datos.nombre;
    const balance = datos.balance;
    await crearUsuario(nombre,balance)
    res.end()
})
app.get('/usuarios',async (req,res)=>{
  const datos = await mostrarUsuario()
    res.json(datos)
    
})
app.put('/usuario',async (req,res)=>{
    const id = req.query.id;
    const datos = await getForm(req)
    const nombre = datos.name;
    const balance = datos.balance;
    editarUsuario(nombre,balance,id)
    res.end()
})
app.delete('/usuario',async (req,res)=>{
    const id = req.query.id;
    eliminarUsuario(id)
    res.end()
})
app.post('/transferencia',async (req,res)=>{
    const datos = await getForm(req)
    const emisor = datos.emisor;
    const receptor = datos.receptor;
    const monto = datos.monto
    
    //-------------------------- sacar esta funcion fea
    var date = new Date();


    await crearTransferencia(emisor,receptor,monto,formatDate(date))
    res.end() 

})

app.get('/transferencias',async (req,res)=>{
    let datos =await  historialTransferencias()
    res.json(datos).redirect
    
})
app.get('/*',(req,res)=>{
    res.send('pagina NO implementada')
})
app.listen(3000, ()=>{
    console.log('servidor en linea!');
})