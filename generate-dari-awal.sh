#! /bin/bash

echo "Started at" `date +"%H:%M"`

echo "Adding android"
ionic cordova platform add android

echo "Adding ionic-native"
npm install @ionic-native/core --save

echo "Adding cloud-angular"
npm i @ionic/cloud-angular

echo "Adding ng2-translate"
npm install ng2-translate --save

echo "Adding facebook connect"
ionic cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="1124368604282869" --variable APP_NAME="Tutordoors.com"
npm install --save @ionic-native/facebook

echo "Adding google login"
ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.111926407216-lngodek101j7p5afqsnp0kh7vtq1od65
npm install --save @ionic-native/google-plus

echo "Ended at" `date +"%H:%M"`
