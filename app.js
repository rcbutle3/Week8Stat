const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongodb = require('mongodb');
const mustache = require('mustache');
const models = require('./models/user');
const User = models.User;
const modelStat = require('./models/stat');
const Stat = modelStat.Stat;

const app = express();

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/test_api');

// mongoose.connect(mongoURL, {
//   useMongoClient: true
// });

// const User = require("./models/user");

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// put routes here
const rootRouter = require('./routes/index');
const apiRouter = require('./routes/api');

//
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
//
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');
//app.engine('mustache', mustacheExpress());
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'mustache')
// app.set('views', './views');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', rootRouter);
app.use('/api', apiRouter);












	//Lists all activities
  app.get('/activities', function(req, res) {
	  User.find().then(function(user) {
	    Stat.find().then(function(stat) {
	      res.render('newEntry', {user: user, stat: stat});
	    });
	  });
	});


	// Adds task
	app.post('/add_task/', function(req, res) {
	  console.log(req.body);

	  User.create(req.body).then(function(user) {
	    res.redirect('/');
	  });
	});


	//Lists stats for single activity
	app.get("/activities/:id", function  (req, res) {
	  req.session.activityid = req.params.id;
	  console.log("ID: " + req.params.id);
	  User.findOne({_id: req.params.id}).then(function(user) {
	    res.render('newEntry', {user: user});
	  });
	});


	//Update activity
	app.post("/api/activities/:id", function  (req, res) {
	  let activity = req.body.activity;
	  let id = req.params.id;
	  console.log("ID: "+req.params.id+", Activity: "+activity);
	  User.findOneAndUpdate({_id: req.params.id}, {activity: activity}).then(function(user) {
	    console.log("updated");
	    res.redirect('/activities');
	  });
	});


	//Delete activity
	app.post("/api/activities/:id/delete", function  (req, res) {
		let id = req.params.id;
	  let query = {_id:id};
	  console.log("Query: "+query);
	  User.remove(query).then(function(user) {
	    console.log("deleted");
	    res.redirect('/activities');
	  });
	});


	//Adds stat to activity
	app.post("/api/activities/:id/stats", function  (req, res) {
	  let id = req.params.id;
	  let activity = req.body.activity;
		let amount = req.body.amount;
		let newstat = {"activityId": req.body.activity, "identifier": id, "amount": req.body.amount, "create_date": req.body.date}
	  console.log(req.body);
	  console.log("ID: "+req.params.id+", Activity: "+req.body.activity+", Amount: "+req.body.amount+", Date: "+req.body.date);
	  Stat.create(newstat).then(function(user) {
	    console.log("added a stat");
	    res.redirect('/activities');
	  });
	});


	//Deletes stat
	app.post("/api/stats/:id", function  (req, res) {
		let id = req.params.id;
	  let query = {_id:id};
	  Stat.remove(query).then(function(stat) {
	    console.log("deleted stat");
	    res.redirect('/activities');
	  });
	});


	//Deletes stat by date
	app.post("/api/stat/date_delete", function  (req, res) {
	  let query = {create_date: req.body.date};
	  console.log("date: "+req.body.date);
	  Stat.remove(query).then(function(stat) {
	    res.redirect('/activities');
	  });
	});



  app.listen(3000, function () {
      console.log('Successfully started express application!')
  });
