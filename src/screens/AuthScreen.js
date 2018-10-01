import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  TextInput,
  AsyncStorage,
} from 'react-native';
import {
  Button,
  Text,
} from "native-base";
import { LoginManager,LoginButton,AccessToken,GraphRequest,GraphRequestManager} from 'react-native-fbsdk';
// import VersionNumber from 'react-native-version-number';
// import firebase from 'react-native-firebase';

// import {
//   Button,
// } from "native-base";
// import { Fonts, Colors } from '../nstants';
// import {  Button } from '../theme/cocomponents/Button';
// import { TextInput } from '../theme/components/TextInput';



const FORM_STATES = {
  LOGIN: 0,
  REGISTER: 1,
  FORGOTPASSWORD: 2,
};

export default class AuthScreen extends React.Component {
  // constructor() {
  //   super();
  //  this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  // }

  state = {
    anim: new Animated.Value(0),

    // Current visible form
    formState: FORM_STATES.LOGIN,
    isKeyboardVisible: false,
    email: false,
    password: false,
    message: '',
    private_token: '',
    userID :'',
    name : '',
    
  };

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(Platform.select({ android: 'keyboardDidShow', ios: 'keyboardWillShow' }), this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener(Platform.select({ android: 'keyboardDidHide', ios: 'keyboardWillHide' }), this._keyboardDidHide.bind(this));
  }

  componentDidMount() {
    Animated.timing(this.state.anim, { toValue: 3000, duration: 3000 }).start();
    this.checklogin();
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ isKeyboardVisible: true });
  }

  _keyboardDidHide() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ isKeyboardVisible: false });
  }

  _fbAuth() {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      function(result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log('Login success with permissions: '
            +result.grantedPermissions.toString());
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      }
    );
  }
  _goBack = () => {
    LoginManager.logOut();
    this.props.navigation.navigate("AuthScreen")
   
  }
  _proceedFunction = () => {
    if (this.state.formState === FORM_STATES.LOGIN) {
      if(this.state.email == ""){
        this.setState({ message: "Please fill in email address." });
        return false;
      }
      var params = {
        email: this.state.email,
        password: this.state.password,
        // grant_type: 'password'
      };
      var formBody = [];
      for (var property in params) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(params[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      var proceed = false;
      fetch("http://staging.koreawallpaper.com/api/user/auth", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.status) {
            this.setState({ message: response.error_msg });
          }
          else {
            // console.log(response.data.Token);
            // console.log(response.data.FirstName);
            // console.log(response.data.LastName);
            // console.log(response.data.Email);
            // console.log(response.data.MobileNo);
            // console.log("Sucess");;

            // AsyncStorage.multiSet([
            //   ["private_token", response.data.Token],
            //   ["first_name", response.data.FirstName],
            //   ["last_name", response.data.LastName],
            //   ["email", response.data.Email],
            //   ["mobile_no", response.data.MobileNo]
            // ]);
            AsyncStorage.setItem("private_token", response.data.Token);

            this.setState({ isLoggingIn: true, });
            proceed = true;
          }
        })
        .then(() => {
          // this.setState({ isLoggingIn: false })
          if (proceed) this.checklogin();
        })
        .done();
    } else {

      // alert("Register");
    }
  }
  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      transform: [{
        translateY: anim.interpolate({
          inputRange: [delay, Math.min(delay + 500, 3000)],
          outputRange: [from, 0],
          extrapolate: 'clamp',
        }),
      }],
    };
  }

  handleFacebookLogin = () => {
  
    LoginManager.logInWithReadPermissions(['public_profile','email']) 
    .then((result) => {
      if (result.isCancelled) {
        
        this._goBack();
            alert('Login was cancelled');
            
          } else {
             AccessToken.getCurrentAccessToken().then(
              (data) => {
                const infoRequest = new GraphRequest(
                  '/me?fields=id,name,email,first_name',
                  null,
                  this._responseInfoCallback
                );
                 console.log('accesstoken ',data.accessToken);
                   console.log(data);
                 // AsyncStorage.setItem("accessToken", data.accessToken);
                
                 new GraphRequestManager().addRequest(infoRequest).start();
                this.props.navigation.navigate({ routeName: 'AuthScreen2', params: { accessToken: data.accessToken } });
              }
            )
          }
       })
       .then((error) => {  
       // alert('Login failed with error: ' + error);
          });
  }

  checklogin = async () => {
    try {
      let private_token = await AsyncStorage.getItem('accessToken');
      // alert(private_token);
      if (private_token != null || private_token == 'undefined') {
        this.props.navigation.navigate("HomeMenu");
      }
      // alert(private_token);
    } catch (error) {
      console.log(error);
    }
  }


  render() {

    const TopComponent = Platform.select({ ios: KeyboardAvoidingView, android: View });
    const isRegister = this.state.formState === FORM_STATES.REGISTER;
    // const { navigate} = this.props.navigation;
    

    return (
      <View style={[styles.container, {
        // paddingTop: this.state.isKeyboardVisible ? 150 : 0,
        // paddingBottom: this.state.isKeyboardVisible ? 0 : 0,
        paddingHorizontal: 30,

      }]}>
        {/* <ImageBackground
          // source={require('../../assets/images/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        > */}

        <View style={[styles.section, { paddingTop: 15 }]}>
          <Animated.Image
            resizeMode="contain"
            style={[styles.logo, this.state.isKeyboardVisible && { height: 90 }, this.fadeIn(0)]}
            source={require('../../assets/logo.png')}
          />
        </View>
        <Animated.View style={[styles.section, styles.middle, this.fadeIn(700, -20)]}>

          <Animated.View style={[styles.section, styles.bottom, this.fadeIn(700, -20)]}>

       
            {!this.state.isKeyboardVisible && (

              <View style={styles.socialLoginContainer}>

                <Button
                  style={styles.socialButton}
                  bordered
                  rounded
                  // icon={require('../../assets/images/facebook.png')}
                  onPress={this.handleFacebookLogin}
                >
                  <Text>
                    {this.state.formState === FORM_STATES.LOGIN ? 'Login With Facebook' : 'Sign Up with Facebook'}

                  </Text>
                </Button>
              </View>
              )}

            {/* {!this.state.isKeyboardVisible && (

              <View style={styles.socialLoginContainer}>

        
               <LoginButton
         
                onLoginFinished={
                  (error, result) => {
                    if (error) {
                      alert("login has error: " + result.error);
                    } else if (result.isCancelled) {
                      alert("login is cancelled.");
                    } else { 
                      AccessToken.getCurrentAccessToken().then(
                        (data) => {
                          const infoRequest = new GraphRequest(
                            '/me?fields=id,name,email',
                            null,
                            this._responseInfoCallback
                          );
                          // console.log(data.accessToken);
                         // AsyncStorage.setItem("access_token", data.accessToken);
                          // Start the graph request.
                             console.log(data.accessToken);
                            AsyncStorage.setItem("accessToken", data.accessToken);
                          
                           new GraphRequestManager().addRequest(infoRequest).start();
                           this.props.navigation.navigate({ routeName: 'AuthScreen2', params: { accessToken: data.accessToken } });

                        }
                      )
                    }
                  }
                }
               />

               
              </View>
            )} */}
            
            <Text> {'\n'}</Text>
              <Text style={{ height: 20}}>----------  OR  ----------</Text>
            {!this.state.isKeyboardVisible && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AuthScreen2');
                }}
                style={{ paddingTop: 30, flexDirection: 'row' }}
              >
                {/* <Text >Or   </Text> */}
                <Text  style={{ color: "#0000ff" }}>   Use Your Mobile Number</Text>
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity onPress={this.displayData}><Text>tryitout</Text></TouchableOpacity> */}
           
          </Animated.View>
        </Animated.View>
        {/* </ImageBackground> */}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingHorizontal: 30,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 2,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  bottom: {
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: Platform.OS === 'android' ? 30 : 0,
  },
  // last: {
  //   justifyContent: 'flex-end',
  // },
  textInput: {
    alignSelf: 'stretch',
    marginTop: 5,
  },
  logo: {
    height: 150,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
  },
  socialButtonCenter: {
    marginLeft: 10,
    marginRight: 10,
  },
});
