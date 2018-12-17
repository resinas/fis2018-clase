var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
    name: String,
    phone: Number
});

contactSchema.methods.cleanup = function() {
    return {name: this.name, phone: this.phone};
}

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;