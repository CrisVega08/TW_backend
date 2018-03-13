var express = require('express');

var app = express();

var Prueba = require('../models/prueba');
var Resultado = require('../models/resultado');
var Usuario = require('../models/usuario');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

  var busqueda = req.params.busqueda;
  var tabla = req.params.tabla;
  var regex = new RegExp(busqueda, 'i');

  var promesa;

  switch (tabla) {

    case 'usuarios':
      promesa = buscarUsuarios(busqueda, regex);
      break;

    case 'pruebas':
      promesa = buscarPruebas(busqueda, regex);
      break;

    case 'resultados':
      promesa = buscarResultados(busqueda, regex);
      break;

    default:
      return res.status(400).json({
        ok: false,
        mensaje: 'Los tipos de busqueda sólo son: usuarios, pruebas y resultados',
        error: { message: 'Tipo de tabla/coleccion no válido' }
      });

  }

  promesa.then(data => {

    res.status(200).json({
      ok: true,
      [tabla]: data
    });

  })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, 'i');


  Promise.all([
      buscarResultados(busqueda, regex),
      buscarPruebas(busqueda, regex),
      buscarUsuarios(busqueda, regex)
    ])
    .then(respuestas => {

      res.status(200).json({
        ok: true,
        resultados: respuestas[0],
        pruebas: respuestas[1],
        usuarios: respuestas[2]
      });
    })


});


function buscarPruebas(busqueda, regex) {

  return new Promise((resolve, reject) => {

    Prueba.find({ nombre: regex })
      .populate('usuario', 'nombre email')
      .exec((err, prueba) => {

        if (err) {
          reject('Error al cargar pruebas', err);
        } else {
          resolve(prueba)
        }
      });
  });
}

function buscarResultados(busqueda, regex) {

  return new Promise((resolve, reject) => {
    Resultado.find({ nombre: regex })
      .populate('usuario', 'nombre email')
      .populate('prueba')
      .exec((err, resultado) => {
        if (err) {
          reject('Error al cargar Resultado', err);
        } else {
          resolve(resultado)
        }
      });
  });
}

function buscarUsuarios(busqueda, regex) {

  return new Promise((resolve, reject) => {

    Usuario.find({}, 'nombre email role')
      .or([{ 'nombre': regex }, { 'email': regex }])
      .exec((err, usuarios) => {

        if (err) {
          reject('Erro al cargar usuarios', err);
        } else {
          resolve(usuarios);
        }


      })


  });
}



module.exports = app;