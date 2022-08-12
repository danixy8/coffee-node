const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server{

  constructor(){
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = '/api/users';

    //conectar a DB
    this.conectarDB()

    //Middlewares
    this.middlewares()

    //rutas
    this.routes();
  }

  async conectarDB(){
    await dbConnection()
  }

  middlewares(){

    //cors
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio Publico
    this.app.use(express.static('public'));
  
  }

  routes(){
    this.app.use(this.userPath, require('../routes/users.routes'))
  }

  lister(){
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${this.port}`)
    });
  }

}

module.exports = Server;