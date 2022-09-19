const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server{

  constructor(){
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: '/api/auth',
      categories: '/api/categories',
      users: '/api/users'
    }

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
    this.app.use(this.paths.auth, require('../routes/auth.routes'))
    this.app.use(this.paths.users, require('../routes/users.routes'))
    this.app.use(this.paths.categories, require('../routes/categories.routes'))
  }

  lister(){
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${this.port}`)
    });
  }

}

module.exports = Server;