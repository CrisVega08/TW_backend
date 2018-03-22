var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var resultadoSchema = new Schema({
  tiempo: { type: String, required: [true, 'Tiempo es necesario'] },
  errores: { type: Number, required: [true, 'Errores es necesario'] },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  prueba: {
    type: Schema.Types.ObjectId,
    ref: 'Prueba',
    required: [true, 'El id prueba es un campo obligatorio ']
  },
  entreGolpes: { type: Array }
});


module.exports = mongoose.model('Resultado', resultadoSchema);