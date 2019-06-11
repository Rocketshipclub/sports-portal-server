const express = require('express');
var cors = require('cors');
const firebase = require('firebase');
const bodyParser = require('body-parser');

const API_PORT = 3001;
const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const config = {
    apiKey: "AIzaSyBw_VWUrlRHsOugAs-kACcaFzTwdWmvOr0",
    authDomain: "sportaali-5536d.firebaseapp.com",
    databaseURL: "https://sportaali-5536d.firebaseio.com/",
    projectId: "sportaali-5536d",
    storageBucket: "sportaali-5536d.appspot.com",
    messagingSenderId: "950592985779"
};
firebase.initializeApp(config);

router.get('/players', function (req, res) {
    var playerReference = firebase.database()
        .ref("/players/").orderByChild("stats/kills")
        .on('value', function(snapshot){
            res.send(snapshotToArray(snapshot))
        });
});

router.get('/teams', function (req, res) {
    var teamReference = firebase.database().ref("/teams/");

    teamReference.on("value", function (snapshot) {
            var snapshot = snapshot.toJSON();
            res.send(snapshot)
            teamReference.off("value");
        },
        function (errorObj) {
            console.log("Reading teams failed! " + errorObj.code);
            res.send("Reading teams failed! " + errorObj.code);
        })
});

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};


// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));