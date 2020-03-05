const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const API_PORT = process.env.PORT || 3001;
const app = express();
const router = express.Router();
const path = require('path')

const config = require('./firebaseConfig');
config.firebase_connection(firebase);
const utils = require('./utils');
const teamsRoutes = require('./routes/teams/teamsRoutes')(express.Router(), firebase, utils);
const playersRoutes = require('./routes/players/playersRoutes')(express.Router(), firebase, utils);

// append /api for our http requests'
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/build')))

router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

router.get('/', function(req, res) {
    res.send("Hello main page");
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
  })

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));