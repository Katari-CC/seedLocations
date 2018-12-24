const firebase = require("firebase-admin");
// const firebase = require("firebase");

var serviceAccount = require("./storymapapp-firebase-adminsdk-jfatz-22b726c073.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

var db = firebase.firestore();
// const db = firebaseAdmin.firestore();

var locationsDB = db.collection("locations");

const fs = require("fs");
const csvSync = require("csv-parser");
const file = "locations.csv";
let data = fs.readFileSync(file);

// convert CSV data into objects
const csv = require("csv-parser");
let counter = 0;

fs.createReadStream("locations.csv")
  .pipe(csv())
  .on("data", item => {
    // if (counter < 50) {
    //   console.log("title", item.title);
    //   console.log("lat", parseFloat(item.longitude));
    //   console.log("long", parseFloat(item.latitude));

    if (item.image.length > 0) {
      let data = {
        description: item.description,
        category: item.category,
        title: item.title,
        // coordinate: new firebase.firestore.GeoPoint(
        //   parseFloat(item.latitude),
        //   parseFloat(item.longitude)
        // ),
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude)
      };
      data.image = item.image.split("?")[0] + "?fit=crop&w=700&h=394";
      data.thumb = item.image.split("?")[0] + "?fit=crop&w=50&h=50";
      locationsDB.doc().set(data);
    }
    // }
  })
  .on("end", () => {
    console.log("Finished Uploading");
  });
