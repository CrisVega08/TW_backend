var express = require('express');
var fs = require('fs');

var app = express();

app.get('/:tipo/:img', (req, res, next) => {

  var tipo = req.params.tipo;
  var img = req.params.img;
  console.log(tipo, img)
  var path = `uploads/${ tipo }/${ img }`;

  fs.exists(path, existe => {

    if (!existe) {
      path = 'assets/no-img.jpg';
    }
    res.sendFile(path, { root: './' });
    // res.sendFile(path, { root: __dirname });
    // res.sendFile(pah);

  });


});

module.exports = app;