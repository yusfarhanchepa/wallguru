import React from "react";
import { StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 320,
  }
});

const slides = [
  {
    key: 'somethun',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('../../assets/1.jpg'),
    imageStyle: styles.image,
    backgroundColor: '#59b2ab',
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text: 'Other cool stuff',
    image: require('../../assets/2.jpg'),
    imageStyle: styles.image,
    backgroundColor: '#febe29',
  },
  {
    key: 'somethun1',
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    image: require('../../assets/3.jpg'),
    imageStyle: styles.image,
    backgroundColor: '#22bcb5',
  }
];




export default class AuthIntro extends React.Component {

  // componentDidMount() {
  //   // do stuff while splash screen is shown
  //     // After having done stuff (such as async tasks) hide the splash screen
  //     SplashScreen.hide();
  // }

  constructor(props) {
    super(props);

    /*this.state = {
      showRealApp: false
    }*/
  }

  _onDone = () => {
	  this.props.navigation.navigate({ routeName: 'AuthScreen', })
    //this.setState({ showRealApp: true });
  }
  render() {
    /*if (this.state.showRealApp) {
      return <Setup />;
    } else {*/
      return <AppIntroSlider 
      slides={slides}     
      showPrevButton
      showSkipButton onDone={this._onDone} onSkip={this._onDone}/>;
    //}
  }

}
