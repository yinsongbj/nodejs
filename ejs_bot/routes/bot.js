var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res, next) {
	console.log(req.query.a);
   res.render('bot',{title:'机器人投注', reqs:req.query.a});
});

module.exports = router;