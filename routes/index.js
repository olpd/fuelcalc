var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Hello World!'});
});

/* GET fuellist. */
router.get('/fuelcalc', function (req, res, next) {

    var db = req.db;
    db.view('all', 'by_id', function(err, body) {
        if (!err) {
            // yey!
            var rows = body.rows;
            res.render('fuelcalc', {"fuelEntryList": rows});
        } else {
	    res.send({msg:err});
	}
    });

});

/* GET fuellist. */
router.get('/fuelcalc/entries', function (req, res, next) {
    var db = req.db;
    db.view('all', 'by_id', function(err, body) {

        if (!err) {
            // yey!
            var rows = body.rows;
            var fuelEntries = new Array(rows.length);

            for (var i = 0; i < body.rows.length; i++) {
                fuelEntries[i] = rows[i].value;
            }
            fuelEntries.sort(function(a, b) {
                return a.km - b.km;
            })
            res.json(fuelEntries);

        }
    });



});

/* POST fuellist. */
router.post('/fuelcalc/entries', function (req, res, next) {
    var db = req.db;
    //var collection = db.get('fuelcollection');

    // clean inputs:
    var km = req.body.km;
    var fuel = req.body.fuel;

    var regex = new RegExp('^[0-9]+$');

    if (km.match(regex) && fuel.match(regex)) {
        var newFuelEntry = {
            km: km,
            fuel: fuel,
            date: req.body.date,
            drivingStyle: req.body.drivingStyle
        }

        db.insert(newFuelEntry, function(err, body){
            res.send((err === null) ? {msg: ''} : {msg: err});
        });

    } else {
        res.send({msg: 'There were non-digit symbols in the input!'});

    }


});

/* DELETE fuelentry */
router.delete('/fuelcalc/deleteentry/:id/:rev', function (req, res) {
    var db = req.db;

    db.destroy(req.params.id, req.params.rev, function(err, body) {
        res.send((err === null) ? {msg: ''} : {msg: 'Error: ' + err});
    });
});


module.exports = router;
