
// web3引入
const Web3 = require('web3');
// 连接节点
var web3 = new Web3(new Web3.providers.HttpProvider("http://mainnet.luckywin.io"));

exports.showSign = function(req, res) {
	res.render('user/sign');
}
exports.doSign = function(req, res) {
	// for get
	var name = req.query.username;
	var email = req.query.email;
	// for post	
	var name = req.body.username;
	var email = req.body.email;
	res.send('恭喜' + name +'注册成功，你的邮箱为:'+email);
}

exports.showWeb3 = function(req, res) {
	var game_info;

	res.render('user/web3', game_info);
}
exports.doWeb3 = function(req, res){	
	// for post	
	var name = req.body.username;
	var email = req.body.email;
	web3.eth.getBalance(name, function(error, result){
		if(!error){
			var balance = web3.utils.fromWei(result);
			res.send('Account('+ name + '):' + balance);
		}else{
			console.error(error);
		}
	});
}

exports.showSign2 = function(req, res) {
	res.render('user/sign2');
}
exports.doSign2 = function(req, res) {
	var name = req.body.name;
	var result = {};
	if (!name) {
		result.code = 1;
		result.msg = '账号不能为空';
		res.send(result);
		return;
	}
	var email = req.body.email;
	if (!email) {
		result.code = 2;
		result.msg = '邮箱不能为空';
		res.send(result);
		return;
	}
	res.send({code : 0});
}
