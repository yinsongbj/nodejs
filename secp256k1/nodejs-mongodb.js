var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://106.75.27.25:27017';

var insertData = function(dbo, callback) { 
	//连接到表 
	var collection = dbo.collection('test');
	//插入数据
	var data = [{"name":'wilson001',"age":21},{"name":'wilson002',"age":22}];
	collection.insert(data, function(err, result) { 
		if(err)
		{
			console.log('Error:'+ err);
			return;
		} 
		callback(result);
	});
}

MongoClient.connect(DB_CONN_STR, { useNewUrlParser: true }, function(err, db) {
	console.log(db + "连接成功！");

	var dbo = db.db('GameJapandice');	
	for (var i = 0; i <1000; i++) {
		insertData(dbo, function(result) {
			console.log(result);
			db.close();
		});	
	}
});