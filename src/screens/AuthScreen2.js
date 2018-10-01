import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  AsyncStorage,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Toast,
  Item,
  Label,
  Input,
  Body,

} from "native-base";

import Frisbee from 'frisbee';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';

const api = new Frisbee({
  baseURI: 'http://staging.koreawallpaper.com',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

const FORM_STATES = {
  GET_CODE: 0,
};

export default class AuthScreen2 extends Component {



    //Create response callback.
    _responseInfoCallback = (error, result) => {
      if (error) {
        // alert('Error fetching data: ' + error.toString());
      } else {
        console.log(result);
        // console.log(result.name);
        // console.log('resutl');
        this.setState({userID: result.id,name: result.name,email: result.email});
      }
    }
  
    componentWillMount() {
     let params = this.props.navigation.state.params;
    //  this.setState({accessToken: params.accessToken});
      const infoRequest = new GraphRequest(
        '/me?fields=id,name,email,first_name',
        null,
        this._responseInfoCallback
      );
      // Start the graph request.
      new GraphRequestManager().addRequest(infoRequest).start();
    
      
  }
  
  constructor(props) {
    super(props);
    this.state = {
      enterCode: false,
      formState: FORM_STATES.GET_CODE,
      spinner: false,
      country: {
        cca2: 'MY',
        callingCode: '60'
      }
    };
  }

  _getCode = () => {


    this.setState({ spinner: true });

    setTimeout(async () => {
      
      try {
     
        var params = {
          MobileCountry: this.state.country.callingCode,
          MobileNo: this.refs.form.getValues().UserMobile,
          // grant_type: 'password'
        };
       
        var formBody = [];
        for (var property in params) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(params[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
       
        const api_url = "http://staging.koreawallpaper.com/api/user/mobile_verification?" + formBody ;
       // console.log(api_url);
        const result = await fetch(api_url);
        const response = await result.json(); 
        console.log('api response sms', response);
       
      

        if (response.status==false) throw response.error_msg;

        this.setState({
          spinner: false,
          enterCode: true,
          verification: response.data
        });
        this.refs.form.refs.textInput.clear();

        setTimeout(() => {
          Alert.alert('Sent!', "We've sent you a verification code", [{
            text: 'OK',
            onPress: () => this.refs.form.refs.textInput.focus()
          }]);
        }, 100);

      } catch (response) {
        // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        this.setState({ spinner: false });
        setTimeout(() => {
          Alert.alert('Oops!',response);
        }, 100);
      }

    }, 100);

  }

  _verifyCode = () => {

    this.setState({ spinner: true });
    //console.log(this.refs.form.getValues());
    setTimeout(async () => {

      try {

        var data = {
          MobileCountry: this.state.country.callingCode,
          MobileNo: this.refs.form.getValues().UserMobile,
          TAC : this.refs.form.getValues().TAC,
          // UserEmail : this.state.email,
          // FacebookID : this.state.userID,
          // Name : this.state.name,
        };

        const url = "http://staging.koreawallpaper.com/api/user/mobile_verification?";
        const config = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      }
      const result = await fetch(url, config);
      const response = await result.json();

     
       if (response.status==false) throw response.error_msg;
       console.log(response);
        this.refs.form.refs.textInput.blur();
        // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        this.setState({ spinner: false });
        setTimeout(() => {
          Alert.alert('Success!', 'You have successfly verified your phone number');
          this.props.navigation.navigate("HomeMenu");
        }, 100);

     
      } catch (response) {
        console.log('response3');
        console.log(response);
        // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        this.setState({ spinner: false });
        setTimeout(() => {
          Alert.alert('Oops!', response);
        }, 100);
      }

    }, 100);

  }

  _onChangeText = (val) => {
    if (!this.state.enterCode) return;
    if (val.length === MAX_LENGTH_CODE)
    this._verifyCode();
  }

  _tryAgain = () => {
    this.refs.form.refs.textInput.clear();
    this.refs.form.refs.textInput.focus();
    this.setState({ enterCode: false });
  }
  _goBack = () => {
    LoginManager.logOut();
    this.props.navigation.navigate("AuthScreen")
   
  }

  _getSubmitAction = () => {
    if(this.state.name == ""){
      Toast.show({
        text: "Please Enter Name",
        buttonText: "Dismiss",
      })
      return false;
    }
    if(this.state.email == ""){
      Toast.show({
        text: "Please Enter email",
        buttonText: "Dismiss",
      })
      return false;
    }
    if(this.refs.form.getValues().UserMobile == ""){
      Toast.show({
        text: "Please Enter Mobile Number",
        buttonText: "Dismiss",
      })
      return false;
    }
    // if(this.refs.form.getValues().TAC == ""){
    //   Toast.show({
    //     text: "Please Enter  TAC",
    //     buttonText: "Dismiss",
    //   })
    //   return false;
    // }
    this.state.enterCode ? this._verifyCode() : this._getCode();
  }

  _changeCountry = (country) => {
    this.setState({ country });
    this.refs.form.refs.textInput.focus();
  }

  _renderFooter = () => {

    if (this.state.enterCode)
      return (
        <View>
          <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
            Enter the wrong number or need a new code?
          </Text>
        </View>
      );

    return (
      <View>
        <Text style={styles.disclaimerText}>By tapping "Next" , we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
      </View>
    );

  }
  _renderButton = () => {

    if (this.state.enterCode)
      return (
        <View>
          <Button transparent onPress={this._tryAgain}>
            <Icon name="arrow-back" style={{ color: "#000000" }} />
          </Button>
        </View>
      );

    return (
      <View>
                 <Button transparent onPress={this._goBack}>
            <Icon name="arrow-back" style={{ color: "#000000" }} />
          </Button>
      </View>
    );
    
  }

  _renderCountryPicker = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (

      <CountryPicker
        ref={'countryPicker'}
        closeable
        style={styles.countryPicker}
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        styles={countryPickerCustomStyles}
        translation='eng'/>
    );

  }

  _renderCallingCode = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );

  }

  render() {

    let headerText = `Enter Your  ${this.state.enterCode ? 'verification code' : 'Information'}`
    let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
    let textStyle = this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      fontFamily: 'Courier'
    } : {};

    return (    

      <Container style={{ backgroundColor: "#ffffff" }}>
      <Header transparent>
        <Left>
        {this._renderButton()}
        </Left>
        <Body>
        
        </Body>
        <Right>
          <Button
            hasText
            transparent
           // style={styles.button} 
            onPress={this._getSubmitAction}
          >
            <Text style={{ color: brandColor }}>Next</Text>
          </Button>
        </Right>
      </Header>

           
           <Content padder>
<Form ref={'form'} >

{this.state.enterCode !==true &&
 <View >
               <Item stackedLabel>
              <Label style={{fontWeight: 'bold'}}>How May We Address You?</Label>
               <Input 
                    style={{ fontSize: 30, height: 80,fontWeight: 'bold'}}
                    onChangeText={(name) => this.setState({name})}
                    value={this.state.name}
                 />
            </Item>
            <Item stackedLabel >
              <Label>Email</Label>
              <Input
                 style={{ fontSize: 20, height: 80,fontWeight: 'bold'}} 
                 onChangeText={(email) => this.setState({email})}
                 value={this.state.email} 
              />
            </Item>
            <Label> {'\n'}</Label>
  </View>
}

  <View style={{ flexDirection: 'row' }}>

    {this._renderCountryPicker()}
    {this._renderCallingCode()}

    <TextInput
      ref={'textInput'}
      name={this.state.enterCode ? 'TAC' : 'UserMobile' }
      type={'TextInput'}
      underlineColorAndroid={'transparent'}
      autoCapitalize={'none'}
      autoCorrect={false}
      onChangeText={this._onChangeText}
      placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Phone Number'}
    // keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
      value={this.state.enterCode}
      style={[ styles.textInput, textStyle ]}
      returnKeyType='go'
      autoFocus
      placeholderTextColor={brandColor}
      selectionColor={brandColor}
      maxLength={this.state.enterCode ? 6 : 20}
      onSubmitEditing={this._getSubmitAction}
       />
    </View>



  {this._renderFooter()}

</Form>
</Content>

<Spinner
  visible={this.state.spinner}
  textContent={'One moment...'}
  textStyle={{ color: '#fff' }} />
      </Container>
       
    );
    // }
  }

}
const brandColor = '#ff3333';

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1
  },
  header: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 22,
    margin: 20,
    color: '#4A4A4A',
  },
  form: {
    margin: 20
  },
  textInput: {   
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: brandColor
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10
  }
});