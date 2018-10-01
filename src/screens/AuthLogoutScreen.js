import React from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';
import {
  Button,
  Text,
} from "native-base";
import { LoginManager } from 'react-native-fbsdk';

export default class AuthLogoutScreen extends React.Component {

  componentWillMount() {
  }
  async clearAllSession() {
    try {
      await AsyncStorage.clear();
      LoginManager.logOut();
      this.props.navigation.navigate("AuthScreen");
      // return true;
    }
    catch(exception) {
      return false;
    }
  }
  render() {
    this.clearAllSession();
    
    // 
    return (
      <View style={[styles.container, {
        // paddingTop: this.state.isKeyboardVisible ? 150 : 0,
        // paddingBottom: this.state.isKeyboardVisible ? 0 : 0,
        paddingHorizontal: 30,

      }]}>

      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
});
