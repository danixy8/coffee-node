const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');
const fileUpload = require('express-fileupload');

class Server{

  constructor(){
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      search: '/api/search',
      users: '/api/users',
      uploads: '/api/uploads'
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

    //Carga de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    }));
  
  }

  routes(){
    this.app.use(this.paths.auth, require('../routes/auth.routes')),
    this.app.use(this.paths.categories, require('../routes/categories.routes')),
    this.app.use(this.paths.products, require('../routes/products.routes')),
    this.app.use(this.paths.search, require('../routes/search.routes')),
    this.app.use(this.paths.users, require('../routes/users.routes')),
    this.app.use(this.paths.uploads, require('../routes/uploads.routes'))
  }

  lister(){
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${this.port}`)
    });
  }

}

module.exports = Server;