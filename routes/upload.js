var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

const Usuario = require('../models/usuario');
const Prueba = require('../models/prueba')
  // default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
  console.log(req.params)
  var tipo = req.params.tipo;
  var id = req.params.id;

  // tipos de colección
  console.log(tipo);
  var tiposValidos = ['usuarios', 'pruebas'];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Tipo de colección no es válida',
      errors: { message: 'Tipo de colección no es válida' }
    });
  }


  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No selecciono nada',
      errors: { message: 'Debe de seleccionar una imagen' }
    });
  }

  // Obtener nombre del archivo
  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split('.');
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // Sólo estas extensiones aceptamos
  var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Extension no válida',
      errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
    });
  }

  // Nombre de archivo personalizado
  // 12312312312-123.png
  var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;


  // Mover el archivo del temporal a un path
  var path = `./uploads/${ tipo }/${ nombreArchivo }`;

  archivo.mv(path, err => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al mover archivo',
        errors: err
      });
    }

    subirPorTipo(tipo, id, nombreArchivo, res);
  })
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

  if (tipo === 'usuarios') {
    Usuario.findById(id, (err, usuario) => {
      if (!usuario) {
        return res.status(400).json({
          ok: true,
          mensaje: 'Usuario no existe',
          errors: { message: 'Usuario no existe' }
        });
      }
      var pathViejo = './uploads/usuarios/' + usuario.img;

      // Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }
      usuario.img = nombreArchivo;
      usuario.save((err, usuarioActualizado) => {

        usuarioActualizado.password = ':)';

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de usuario actualizada',
          usuario: usuarioActualizado
        });
      })
    });
  }
  if (tipo === 'pruebas') {
    Prueba.findById(id, (err, prueba) => {
      if (!prueba) {
        return res.status(400).json({
          ok: true,
          mensaje: 'prueba no existe',
          errors: { message: 'prueba no existe' }
        });
      }
      var pathViejo = './uploads/pruebas/' + prueba.img;

      // Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }
      prueba.img = nombreArchivo;
      prueba.save((err, pruebaActualizado) => {

        pruebaActualizado.password = ':)';

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de prueba actualizada',
          prueba: pruebaActualizado
        });
      })
    });
  }

}



module.exports = app;