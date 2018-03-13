var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var resultadoSchema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  tiempo: { type: String, required: false },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  prueba: {
    type: Schema.Types.ObjectId,
    ref: 'Prueba',
    required: [true, 'El id prueba es un campo obligatorio ']
  },
  entreGolpes: { type: Array }
});


module.exports = mongoose.model('Resultado', resultadoSchema);