var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var pruebaSchema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  secuencia: { type: Array, required: [true, 'La secuencia es obligatoria'] }
}, { collection: 'pruebas' });

module.exports = mongoose.model('Prueba', pruebaSchema);