// Convert the MongoDB collection of AirodumpRecords into a series of established Mac Addresss models
// Log by entry -> Log by Mac Address
var async = require('async');
var util = require('util');

// Load db object models
var deviceModel = require('./deviceModel');
var airodumpRecord = require('./airodumpRecord');

exports.update = function(monConn, cb){
	console.log("Airodump DB processing starting");
  // Load the device models collection
  var deviceModels;
  monConn.db.collection('devicemodels', function(err, deviceModelsRaw){
    deviceModels = deviceModelsRaw;
  });

  // Load the airodumpRecord models collection
  var dumpRecordCollection;
  monConn.db.collection('airodumpRecord', function(err, dumpRecordCollection){
    var dumpRecordsCollected = dumpRecordCollection.find({});
  });

  // Begin processing database
  // DB processing waterfall function for each airodumpRecord
  dumpRecordsCollected.forEach(function(dumpTimeSlice, index) {
    async.waterfall([
      function(callback) {
        // Check for device conflicts
        console.log("Checking device conflict");
        deviceModel.checkForDevice(monConn, dumpTimeSlice.macAddress, function(locatedDevice){
          callback(null, dumpTimeSlice, locatedDevice[0]);
        });
      }, handleRecord
    ]); 
  });
};

// Counter for periodic db updates
exports.counter = function(monConn, cb){
	console.log("DB process counter launch");
  var timeout = setInterval(function(){
    cb(monConn, function(){}); 
  }, 20000);
  return timeout;
};

function handleRecord(dumpTimeSlice, locatedDevice, callback) {
  // Create or update device
  if (locatedDevice){
    // If there is an exiting device, add airodumpRecord to it
    deviceModel.addTimeSlice(locatedDevice, dumpTimeSlice._id, function(locatedDevice){
      // Add probed essids
      deviceModel.addEssid(locatedDevice, dumpTimeSlice.probedEssids, function(locatedDevice){
        // Save updated model
        deviceModels.update({
          "macAddress": dumpTimeSlice.macAddress
        }, locatedDevice, true);
        callback();
      });
    });
  } else {
    saveNewDevice(dumpTimeSlice, dumpRecordsCollected, function(err){
      if (index === dumpRecordsCollected.length -1){
        console.log("DB processing complete");
        waterfallCB();
      } else {
        callback(err);
      }
    })
  }
  // Delete the airodumpRecord file
  airodumpRecord.remove(dumpTimeSlice);
}

function saveNewDevice(dumpTimeSlice, dumpRecordsCollected, cb){
  console.log("No device located");
  // Generate new device if it doesn't exist
  // Generate new time slice array
  var newTimeSlices = [];
  newTimeSlices.push(dumpTimeSlice);
  // Meanwhile, no need to do same for affiliatedNetworks, 
  // probedEssids is already array
  // Build new device
  var newDevice = new deviceModel({
    macAddress: dumpTimeSlice.macAddress,
    timeSlices: newTimeSlices,
    affiliatedNetworks: dumpTimeSlice.ProbedEssids
  }); 
  // Save new device
  newDevice.save((err) => {  
    if (err){
      if (err.code == 11000){
        console.log("Duplicate device created");
      }
    } else {
      console.log("New device saved");
    }
    cb(err);
  });
}