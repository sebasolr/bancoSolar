const express = require('express');
// funciones
const {getForm, crearUsuario, mostrarUsuario,editarUsuario,eliminarUsuario,crearTransferencia,historialTransferencias,formatDate} = require('./function.js')
//aplicacion web
const app = express();
//pagina principal
app.use(express.static('public'));
// generamos las rutas solicitadas
app.get('/',async (req,res)=>{

})
app.post('/usuario',async (req,res)=>{
    const datos = await getForm(req);
    const nombre = datos.nombre;
    const balance = datos.balance;
    console.log(balance);
    if(isNaN(balance) || !balance){
       console.log('error');
    }else{await crearUsuario(nombre.trim(),balance)
    }
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
    
    
    var date = new Date();


    await crearTransferencia(emisor,receptor,monto,formatDate(date))
    res.json({}) 

})

app.get('/transferencias',async (req,res)=>{
    let datos =await  historialTransferencias()
    res.json(datos)
    
})
app.get('/*',(req,res)=>{
    res.send('pagina NO implementada')
})
app.listen(3000, ()=>{
    console.log('servidor en linea!');
})