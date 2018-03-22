var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Resultado = require('../models/resultado');

// ==========================================
// Obtener todos los resultados
// ==========================================
app.get('/', (req, res, next) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Resultado.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('prueba')
    .exec(
      (err, resultados) => {

        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando resultado',
            errors: err
          });
        }

        Resultado.count({}, (err, conteo) => {
          res.status(200).json({
            ok: true,
            resultados: resultados,
            total: conteo
          });

        })

      });
});


// ==========================================
// Actualizar resultado
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;
  var body = req.body;

  Resultado.findById(id, (err, resul) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar resultado',
        errors: err
      });
    }
    if (!resul) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El resultado con el id ' + id + ' no existe',
        errors: { message: 'No existe un resultado con ese ID' }
      });
    }
    // resul.nombre = body.nombre;
    resul.usuario = body.usuario;
    resul.prueba = body.prueba;
    resul.tiempo = body.tiempo;
    resul.errores = body.errores;
    resul.entreGolpes = body.entreGolpes;

    resul.save((err, resulGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar resultado',
          errors: err
        });
      }
      res.status(200).json({
        ok: true,
        resultado: resulGuardado
      });
    });
  });
});



// ==========================================
// Crear un nuevo resultado
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

  var body = req.body;

  var resultado = new Resultado({
    tiempo: body.tiempo,
    usuario: body.usuario,
    prueba: body.prueba,
    errores: body.errores,
    entreGolpes: body.entreGolpes
  });

  resultado.save((err, resultadoGuardado) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear resultado',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      resultado: resultadoGuardado
    });


  });

});


// ============================================
//   Borrar un resultado por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;

  Resultado.findByIdAndRemove(id, (err, resultadoBorrado) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error borrar resultado',
        errors: err
      });
    }

    if (!resultadoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe un resultado con ese id',
        errors: { message: 'No existe un resultado con ese id' }
      });
    }

    res.status(200).json({
      ok: true,
      resultado: resultadoBorrado
    });

  });

});


module.exports = app;