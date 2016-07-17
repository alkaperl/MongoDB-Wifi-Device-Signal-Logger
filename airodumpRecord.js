// Grab all modules + reqs + intialization
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceModel = require('./deviceModel');

// Schema for timeSliceSchema
var timeSliceSchema = new Schema({
    // _id used to affiliate with device model
    // MacAddress relate to device model
    MacAddress: {
        type: String,
        ref: 'deviceModel'
    },
	FirstSeen:{
        type: String
	},
    LastSeen: {
        type: String
    },
    // Power used to for triangulating
    Power: {
        type: String
    },
    NumPackets: {
        type: String
    },
    Bssid: {
        type: String
    },
    // Wifis attempted to be connected to
    ProbedEssids: [String]
}, {
    timestamps: true
});

var collectionName = "airodumpRecord"

// Generate model
var airodumpRecord = mongoose.model('timeSliceModel', timeSliceSchema, collectionName);

// Export
module.exports = airodumpRecord;
