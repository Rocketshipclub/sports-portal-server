module.exports = (router, firebase, utils) => {
    router.get('/', function (req, res) {
        firebase.database()
            .ref("/teams/").orderByChild('stats/wins')
            .on('value', function(snapshot){
                res.send(utils.snapshotToArray(snapshot))
            },
            function (errorObj) {
                console.log("Reading teams failed! " + errorObj.code);
                res.send("Reading teams failed! " + errorObj.code);
            })
    });
    
    router.get('/:name/', function(req, res){
        firebase.database().ref("/teams/" + req.params.name)
            .on("value", function(snapshot){
                res.send(snapshot.val());
            },
            function (errorObj) {
                console.log("Reading teams failed! " + errorObj.code);
                res.send("Reading teams failed! " + errorObj.code);
            })
    })
    
    router.get('/:name/players', async function(req, res){
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

    return router;
}