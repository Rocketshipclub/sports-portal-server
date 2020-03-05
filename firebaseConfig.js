const config = {
    apiKey: "AIzaSyBw_VWUrlRHsOugAs-kACcaFzTwdWmvOr0",
    authDomain: "sportaali-5536d.firebaseapp.com",
    databaseURL: "https://sportaali-5536d.firebaseio.com/",
    projectId: "sportaali-5536d",
    storageBucket: "sportaali-5536d.appspot.com",
    messagingSenderId: "950592985779"
};

exports.firebase_connection = function(firebase){
    firebase.initializeApp(config);
}