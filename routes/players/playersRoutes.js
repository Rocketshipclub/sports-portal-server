module.exports = (router, firebase, utils) =>  {

    router.get('/', function (req, res) {
        firebase.database()
            .ref("/players/").orderByChild('stats/kills')
            .on('value', function(snapshot){
                var players = utils.snapshotToArray(snapshot);
                utils.calculateKDA(players);
                res.send(players)
            },
            function (errorObj) {
                console.log("Reading players failed! " + errorObj.code);
                res.send("Reading players failed! " + errorObj.code);
            });
    });

    router.get('/:name', function(req, res) {
        firebase.database().ref("/players/" + req.params.name)
            .on("value", function (snapshot) {
                res.send(snapshot.val());
        },
        function (errorObj) {
                console.log("Reading players failed! " + errorObj.code);
                res.send("Reading players failed! " + errorObj.code);
        });
    })

    return router;
}