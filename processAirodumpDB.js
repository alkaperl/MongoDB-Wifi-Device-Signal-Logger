// Convert the MongoDB collection of AirodumpRecords into a series of established Mac Addresss models
// Log by entry -> Log by Mac Address
var deviceModel = require('./deviceModel');
var async = require('async');
var timeSliceModel = require('./timeSliceModel');

exports.update = function(cb){
	console.log("Airodump DB process starting");
	async.waterfall([
    function(callback) {
    	// Fetch for each airodump record
    	console.log("Airodump DB record retrieved");
			timeSliceModel.find().forEach(function(dumpTimeSlice) {
				callback(null, dumpTimeSlice);
			});
    },
    function(dumpTimeSlice, callback) {
    	// Check for device conflicts
    	console.log("Checking device conflict");
			deviceModel.checkForDevice(dumpTimeSlice.MacAddress, function(locatedDevice){
				callback(null, dumpTimeSlice, locatedDevice);
      });
    },
    function(dumpTimeSlice, locatedDevice, callback) {
    	if (locatedDevice){
    	console.log("Device located");
    	// If conflict
    		// Add time slice
				locatedDevice.addTimeSlice(dumpTimeSlice._id, function(){
					// Add probed essids
					locatedDevice.addEssid(dumpTimeSlice.ProbedEssids, function(){
						cb();
					});
				});
			} else {
				console.log("No device located");
			// If no conflict
				// Generate new time slices
				var newTimeSlices = [];
				newTimeSlices.push(dumpTimeSlice);
				// Build new device
				var newDevice = new deviceModel({
		      MacAddress: dumpTimeSlice.MacAddress,
		      timeSlices: newTimeSlices,
		      affiliatedNetworks: dumpTimeSlice.ProbedEssids
		    }); 
		    // Save device
    		newDevice.save((err) => {  
    			console.log("New device saved");
    			if (err){
    				console.log(err);
    			} else {
    				cb();
    			}
    		});
			}

			timeSliceModel.remove(dumpTimeSlice);
    }
	]); 
};

exports.counter = function(cb){
	console.log("DB process counter launch");
  var timeout = setInterval(cb, 20000);
  return timeout;
};
