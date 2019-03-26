# Nodejs | Firebase

## Pasos a seguir para la configuración de **Node.js**:

1. Instalamos el framework **express** para **node.js**
- `npm install -g express`
- `npm install express`

2. Instalamos el **firebase-admin**:
- `npm install firebase-admin`

3. En la consola de Firebase, creamos un proyecto y nos descargamos el archivo .json, en el apartado de servicio, pulsamos en Node.js y genera un clave privada.
  Una vez tengamos esto hecho, hacemos referencia en el código en la `serviceAccount` la ruta del archivo.
```
// inicializamos la conexion con firebase
// necesitamos json con las credenciales 
var admin = require('firebase-admin');
var serviceAccount = require('./dbfirebase.json'); //<---
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://appmessagenotification.firebaseio.com' //<---
});
```
4. El servidor recoge los tokens de los "jugadores" cuando haya algún cambio en el firebase, y les envia una notificación diciendo "Un jugador ha hecho una nueva puntuación"
```
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
....
```
5. Y por último se envía la notificación
```
....
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
```
