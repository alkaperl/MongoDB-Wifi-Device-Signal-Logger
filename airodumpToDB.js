// Saves initial CSV logs to MongoDB
/* 
The transfer function transfers the csv to the database,
being triggered every time there's a file rewrite
CB is no longer necessary, so we are assuming no 
parameters and nothing fancy
*/
exports.transfer = function(){
	console.log("Initiate CSV to DB");
	const initialUploadToDB = require('child_process').exec;
	initialUploadToDB('java -jar ProcessAirodumpOutput.jar -i dump-01.csv -c', 
	function (error, stdout, stderr) {
  	// We are assuming no errors	
	  if (error) {
	    console.error(`Airodump exec error: ${error}`);
	    return;
    }
    // Call is complete
	  console.log(`Airodump stdout: ${stdout}`);
	  console.log(`Airodump stderr: ${stderr}`);
  });
}
