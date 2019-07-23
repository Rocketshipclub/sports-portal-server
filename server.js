const express = require('express');
var cors = require('cors');
const firebase = require('firebase');
const bodyParser = require('body-parser');

const API_PORT = process.env.PORT || 3001;
const app = express();
const router = express.Router();
const path = require('path')

// append /api for our http requests
app.use('/api', router);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/build')))

const config = {
    apiKey: "AIzaSyBw_VWUrlRHsOugAs-kACcaFzTwdWmvOr0",
    authDomain: "sportaali-5536d.firebaseapp.com",
    databaseURL: "https://sportaali-5536d.firebaseio.com/",
    projectId: "sportaali-5536d",
    storageBucket: "sportaali-5536d.appspot.com",
    messagingSenderId: "950592985779"
};
firebase.initializeApp(config);

router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

router.get('/', function(req, res) {
    res.send("Hello main page");
});

router.get('/players', function (req, res) {
    firebase.database()
        .ref("/players/").orderByChild('stats/kills')
        .on('value', function(snapshot){
            var players = snapshotToArray(snapshot);
            calculateKDA(players);
            res.send(players)
        },
        function (errorObj) {
            console.log("Reading teams failed! " + errorObj.code);
            res.send("Reading teams failed! " + errorObj.code);
        });
});

router.get('/teams', function (req, res) {
    firebase.database()
        .ref("/teams/").orderByChild('stats/wins')
        .on('value', function(snapshot){
            res.send(snapshotToArray(snapshot))
        },
        function (errorObj) {
            console.log("Reading teams failed! " + errorObj.code);
            res.send("Reading teams failed! " + errorObj.code);
        })
});

router.get('/players/:name', function(req, res) {
    firebase.database().ref("/players/" + req.params.name)
        .on("value", function (snapshot) {
            res.send(snapshot.val());
    })
})

router.get('/teams/:name/', function(req, res){
    firebase.database().ref("/teams/" + req.params.name)
        .on("value", function(snapshot){
            res.send(snapshot.val());
        })
})

router.get('/teams/:name/players', async function(req, res){
    var players = [];
    var playerRef = firebase.database().ref('/players/');
    var requestedTeam = req.params.name;

    var p = playerRef.orderByChild('team').equalTo(requestedTeam);
    var snap = await p.once('value');
    snap.forEach(function(childSnapshot){
        if(childSnapshot.val().team === requestedTeam){
            players.push(childSnapshot.val());
        }
    })
    await res.send(players);
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
  })

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

function calculateKDA(players){
    for(var player of players){
        player.kda = parseFloat((player.stats.kills + player.stats.assists) / player.stats.deaths).toFixed(2);
    }
}

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));