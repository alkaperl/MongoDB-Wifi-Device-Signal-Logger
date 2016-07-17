// Grab all modules + reqs + intialization
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema for per device
var deviceSchema = new Schema({
    // Use mac address as prime id
    macAddress: {
        type: String,
        required: true,
        unique: true
    },
    // Array of time slice IDs
	timeSlices:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'timeSliceModel'
	}],
    // List of networks previously attempted to be
    // connected to, via list of probed essids
    affiliatedNetworks: [String]
}, {
    timestamps: true
});

// Add to affiliated networks list
// No response, array of affiliated networks provided
deviceSchema.methods.addEssid = function(essidArray, cb) {
    essidArray.forEach(function(value, index){
        // Add to object array if applicable
        if (this.affiliatedNetworks.indexOf(value) == -1){
            this.affiliatedNetworks.push(value);
        }
        // Cb when complete
        if (index == (array.length - 1)){
            cb();
        }        
    });
};

// Add to time slices
// No response, time slice object provided
deviceSchema.methods.addTimeSlice = function(timeSliceID, cb) {
    this.timeSlices.push(timeSliceID);
    cb();
};

// Add to affiliated networks list
// Returns model if match found, unknown value (likely false) if not; macAddress string provided
deviceSchema.statics.checkForDevice = function(macAddress, cb) {
    return this.model('deviceModel').find({ 
        macAddress: this.macAddress 
    }, cb);
};

// Generate model
var deviceModel = mongoose.model('deviceModel', deviceSchema);

// Export
module.exports = deviceModel;
