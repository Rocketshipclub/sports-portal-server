exports.snapshotToArray = function(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

exports.calculateKDA = function(players) {
    const _players = [...players];
    for(var player of _players){
        player.kda = parseFloat((player.stats.kills + player.stats.assists) / player.stats.deaths).toFixed(2);
    }

    return _players;
}