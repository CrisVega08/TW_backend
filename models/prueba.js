var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var pruebaSchema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  descripcion: { type: String, required: [true, 'la descripción es necesaria'] },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  img: { type: String, required: false },
  secuencia: { type: Array, required: [true, 'La secuencia es obligatoria'] }
}, { collection: 'pruebas' });

module.exports = mongoose.model('Prueba', pruebaSchema);