var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render(index, {});

 	res.send({"0": "Hello World"});
});

module.exports = router;
