var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaName = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
        collection: 'UserRegistrations'
    });


var UserRegistration = module.exports = mongoose.model('Model', schemaName);


//getUserRegistration
module.exports.getUserRegistration = function (callback) {
    UserRegistration.find(callback, function () {
    })
}