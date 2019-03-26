var express = require('express');
var router = express.Router();
var user = require('../controllers/user_controller.js');
var game = require('../controllers/game_controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// for games
router.get('/game', game.showGame);
router.get('/game/create', game.doCreateGame);
//router.get('/game/doBet', game.doBetGet);
router.post('/game/doBet', game.doBetPost);
router.get('/game/history', game.doGetHistory);

router.get('/users/sign', user.showSign);
//router.get('/users/do/sign', user.doSign);
router.post('/users/do/sign', user.doSign);

router.get('/users/web3', user.showWeb3);
router.post('/users/do/web3', user.doWeb3);

router.get('/users/sign2', user.showSign2);
router.post('/users/do/sign2', user.doSign2);

router.get('/about', function(req, res) {
	res.render('index', { title: 'about' });
});

router.get('/user', function(req, res) {
	res.send('respond with a resource');
});

// middleware specific to this router
router.use(function timeLog(req, res, next) {
	console.log('Time: ', Date.now());
	next();
});


module.exports = router;
