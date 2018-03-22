var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Prueba = require('../models/prueba');

// ==========================================
// Obtener todos los pruebas
// ==========================================
app.get('/', (req, res, next) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);
  Prueba.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec(
      (err, pruebas) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando pruebas',
            errors: err
          });
        }
        Prueba.count({}, (err, conteo) => {
          res.status(200).json({
            ok: true,
            pruebas: pruebas,
            total: conteo
          });
        })

      });
});


// ==========================================
// Actualizar Prueba
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;
  var body = req.body;

  Prueba.findById(id, (err, prueba) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar entrenamiento',
        errors: err
      });
    }

    if (!prueba) {
      return res.status(400).json({
        ok: false,
        mensaje: 'La prueba con el id ' + id + ' no existe',
        errors: { message: 'No existe una prueba con ese ID' }
      });
    }
    prueba.nombre = body.nombre;
    prueba.usuario = req.usuario._id;
    prueba.secuencia = body.secuencia;
    prueba.descripcion = body.descripcion;
    prueba.save((err, pruebaGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar la prueba',
          errors: err
        });
      }
      res.status(200).json({
        ok: true,
        prueba: pruebaGuardado
      });
    });
  });
});

// ==========================================
// Crear una nueva prueba
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

  console.log(body)
  var body = req.body;
  var prueba = new Prueba({
    nombre: body.nombre,
    usuario: req.usuario._id,
    secuencia: body.secuencia,
    descripcion: body.descripcion
  });
  prueba.save((err, pruebaGuardada) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear la prueba',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      prueba: pruebaGuardada
    });
  });
});


// ============================================
//   Borrar una prueba por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;
  Prueba.findByIdAndRemove(id, (err, pruebaBorrada) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar la prueba',
        errors: err
      });
    }
    if (!pruebaBorrada) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe una prueba con ese id',
        errors: { message: 'No existe una prueba con ese id' }
      });
    }
    res.status(200).json({
      ok: true,
      prueba: pruebaBorrada
    });
  });
});


module.exports = app;