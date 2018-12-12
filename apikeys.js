var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uuidv4 = require('uuid/v4');
var SALT_WORK_FACTOR = 10;

var apiKeySchema = new mongoose.Schema({
    user: String,
    password: String,
    apikey: String
});

// Bcrypt middleware
apiKeySchema.pre('save', function(next) {
	var user = this;
    user.apikey = uuidv4();

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
            user.password = hash;
			next();
		});
	});
});

// Password verification
apiKeySchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

var ApiKey = mongoose.model('ApiKey', apiKeySchema);

module.exports = ApiKey;