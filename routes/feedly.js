var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('feedly');

  var url = "http://cloud.feedly.com/v3/search/feeds?query=javascript";

  var req = require('request');
  req.get(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      res.render('index', { title: 'Feedly' })
    } else {
      console.log(response.statusCode);
    }
  });
});

module.exports = router;
