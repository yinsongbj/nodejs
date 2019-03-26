var express = require('express');
var router = express.Router();
 
	var items=[{title:'文章1'},{title:'文章2'}];
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{items:items, title:'文章列表'});
});
 
router.get('/form', function(req, res, next) {
   res.render('form',{title:'文章列表',message:'fendo8888'});
});
 
router.post('/form', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;
