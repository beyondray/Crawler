const fs = require('fs');

module.exports = {
	readFile : function(path, recall){
		fs.readFile(path, (err, data)=>{
			if(err){
				throw err;
			}
			else{
				console.log('[file]: readFile success: '+path);	
				recall && recall(data);			
			}
		});
	},

	writeFile : function(path, data, recall){
		fs.writeFile(path, data, (err)=>{
			if(err){
				throw err;
			}
			else{
				console.log('[file]: writefile success: '+path);
				recall && recall(data);
			}
		});
	},
}