import React from "react";
import Setup from "./src/boot/setup";

////test fcm token firebase
import firebase from 'react-native-firebase';

firebase.messaging().getToken()
  .then(fcmToken => {
    if (fcmToken) {
      console.log(fcmToken);
     
      // user has a device token
    } else {
      console.log('no token');
      // user doesn't have a device token yet
    } 
  });
  firebase.messaging().hasPermission()
  .then(enabled => {
    if (enabled) {
      // user has permissions
      console.log('user has permission');
    } else {
      // user doesn't have permission
      console.log('user not have permission');
    } 
  });
  //end

  firebase.messaging().requestPermission()
  .then(() => {
    // User has authorised  
  })
  .catch(error => {
    // User has rejected permissions  
  });
  
export default class App extends React.Component {
  render() {
    return <Setup />;
  }
}
