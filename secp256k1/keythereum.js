var keythereum = require("keythereum");

var password ="win123456";
var datadir = "./";
var address = "0x501db9fd32061bab4308c1bd5009524dd8facd55";

// Synchronous
var keyObject = keythereum.importFromFile(address, datadir);
console.log(keyObject);

while(1){
	var password = getPassword();
	try{
		console.log("password:" + password);
		var privateKey = keythereum.recover(password, keyObject);
		console.log(privateKey.toString('hex'));
		console.log("password:" + password);
		break;
	}catch(e){
		console.log("bad password.");
		//console.log(e);		
	}
}

function getPassword(){
	return "win1234567";
}