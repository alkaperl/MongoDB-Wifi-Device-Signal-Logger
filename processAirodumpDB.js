// Convert the MongoDB collection of AirodumpRecords into a series of established Mac Addresss models
// Log by entry -> Log by Mac Address
var deviceModel = require('./deviceModel');
var async = require('async');
var airodumpRecord = require('./airodumpRecord');
var util = require('util');

exports.update = function(monConn, cb){
	console.log("Airodump DB process starting");
  // Fetch for each airodump record
  console.log("Airodump DB record retrieved");
  monConn.db.collection('airodumpRecord', function(err, dumpRecordCollection){
    var dumpRecordsCollected = dumpRecordCollection.find({});
    dumpRecordsCollected.forEach(function(dumpTimeSlice, index) {
      async.waterfall([
        function(callback) {
          // Check for device conflicts
          console.log("Checking device conflict");
          deviceModel.checkForDevice(monConn, dumpTimeSlice.MacAddress, function(locatedDevice){
            callback(null, dumpTimeSlice, locatedDevice);
          });
        },
        function(dumpTimeSlice, locatedDevice, callback) {
          if (locatedDevice.macAddress){
            // If conflict
            // Add time slice
            console.log(locatedDevice.macAddress);
            console.log(locatedDevice.timeSlices);
            deviceModel.addTimeSlice(locatedDevice, dumpTimeSlice._id, function(){
                console.log("Updated timeslice:" +  locatedDevice.timeSlices);
              // Add probed essids
              deviceModel.addEssid(locatedDevice, dumpTimeSlice.ProbedEssids, function(){
                console.log("Updated id:" +  locatedDevice.affiliatedNetworks);
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
              macAddress: dumpTimeSlice.macAddress,
              timeSlices: newTimeSlices,
              affiliatedNetworks: dumpTimeSlice.ProbedEssids
            }); 
            // Save device
            newDevice.save((err) => {  
              console.log("New device saved");
              if (err){
                if (err.code == 11000){
                  console.log("Duplicate device created");
                  /*
                  monConn.db.collection('deviceModels', function(err, deviceModels){
                      deviceModels.find({ 
                        macAddress: dumpTimeSlice.macAddress 
                      }, function(err, locatedDevice){
                          locatedDevice.addTimeSlice(dumpTimeSlice._id, function(){
                            // Add probed essids
                            locatedDevice.addEssid(dumpTimeSlice.ProbedEssids, function(){
                            });
                          });
                      });
                  });
                  */
                }
              } else {
                if (index === dumpRecordsCollected.length -1){
                  console.log("end");
                  cb();
                }
              }
            });
          }
          airodumpRecord.remove(dumpTimeSlice);
        }
      ]); 
    });
  }); 
};

exports.counter = function(monConn, cb){
	console.log("DB process counter launch");
  var timeout = setInterval(function(){
    cb(monConn); 
  }, 20000);
  return timeout;
};
