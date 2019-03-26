// imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// inicializamos la conexion con firebase
// necesitamos json con las credenciales 
var admin = require('firebase-admin');
var serviceAccount = require('./dbfirebase.json');
admin.initializeApp({

    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://appmessagenotification.firebaseio.com'
});

var db = admin.database();
var ref = db.ref("/dispositivos");
var mapScore = new Map();

var token=null;

//cuando se realiza algún cambio en el firebase, se envia una notificaciona los juegadores
ref.on("child_changed", function(snapshot) {
    
    var tokenJugadores=null;

    ref.on('value',function(snapshot){
           //recojo los token de los jugadores de la base de datos
          snapshot.forEach(function (snap) {
                mapScore.set(snap.key,snap.val());
                console.log("Usuario: "+snap.key," yakata: "+snap.val().yakata," token: "+snap.val().token)
                
                //paso los tokens a una variable
                tokenJugadores=snap.val().token;
            });
    

        let msg = "Un jugador ha hecho un nueva puntuación";
      
        //paso los token una variable
        var registrationToken = tokenJugadores;
       
    
        //creo el cuerpo de la notificacion
        var message = {
            data:{
                msg:msg
            },
            notification:{
                "title":"JUEGO YAKATA",
                "body": msg
            },
            token: registrationToken
        };
    
        //se envía la notificacion
        admin.messaging().send(message)
            .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
    
    });

    
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});


/*
//especificamos el subdirectorio donde se encuentran las páginas estáticas
app.use(express.static(__dirname + '/html'));

//extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/enviar', (req, res) => {                                         // <form action="enviar"
    let token = req.body.token; // son lo que yo puse en el formulario html -> <input name="token"
    let msg = req.body.msg; // son lo que yo puse ene le formulario html -> <input name="msg"
    let pagina = '<!doctype html><html><head></head><body>';
    pagina += `<p>(${token}/${msg}) Enviado </p>`; // lo que mete en token(de arriba), lo mete en ${token}
    pagina += '</body></html>';
    res.send(pagina);
    
    var registrationToken = token;

    // Creamos el cuerpo de la notificación
    var message = {
        notification:{
            "title":"Notificación desde NodeJS",
            "body": msg
        },
        token: registrationToken
    };

    //Envío de la notificación
    admin.messaging().send(message)
        .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });
    
    //Envío de la página
    res.send(pagina);
    
});

app.get('/mostrar', (req, res) => {
    let pagina = '<!doctype html><html><head></head><body>';
    pagina += 'Muestro<br>';
    pagina += '<div id="resultado">' + resultado + '</div>';
    pagina += '<p>...</p>';
    pagina += '</body></html>';
    res.send(pagina);
});
**/

var server = app.listen(8080, () => {
    console.log('Servidor web iniciado');
});

