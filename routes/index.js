///<reference path="../typings/node/node.d.ts"/>
var express = require('express');
var router = express.Router();
var rc = require('root-require')('RenderCat');

console.log("Routes");

/* GET home page. */
router.get('/api/0.1/:module/:fn', function (req, res) {
    //  res.render('index', { title: 'Express' });
    require("root-require")("rendercat_modules/" + req.params.module)[req.params.fn](new rc.RenderCat(req, res));
});

module.exports = router;
//# sourceMappingURL=index.js.map
