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
deviceSchema.statics.addEssid = function(deviceObject, essidArray, cb) {
    essidArray.forEach(function(value, index){
        // Add to object array if applicable
        if (deviceObject.affiliatedNetworks.indexOf(value) == -1){
            deviceObject.affiliatedNetworks.push(value);
        }
        // Cb when complete
        if (index == (array.length - 1)){
            cb(deviceObject);
        }        
    });
};

// Add to time slices
// No response, time slice object provided
deviceSchema.statics.addTimeSlice = function(deviceObject, timeSliceID, cb) {
    deviceObject.timeSlices.push(timeSliceID);
    cb(deviceObject);
};

// Add to affiliated networks list
// Returns model if match found, unknown value (likely false) if not; macAddress string provided
deviceSchema.statics.checkForDevice = function(monConn, macAddress, cb) {
    monConn.db.collection('devicemodels', function(err, deviceModels){
        if (err) {
          console.log(err);
        }
        deviceModels.find({ 
          "macAddress": macAddress 
        }).toArray(function(err, value){
          cb(value);
          console.log("YESSSS:" + value);
          console.log(macAddress);
          console.log(err); 
        });
    });
};

// Generate model
var deviceModel = mongoose.model('deviceModel', deviceSchema);

// Export
module.exports = deviceModel;
