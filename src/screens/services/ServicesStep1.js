import React, { Component } from "react";
import {
  StyleSheet,
  AsyncStorage,
  Dimensions
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Body,
  Left,
  Right,
  Spinner,
  Toast,
  AppRegistry,
  View,
  Label,
  Textarea,
  Text, Card, CardItem
} from "native-base";
import StepIndicator from 'react-native-step-indicator';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
// const PAGES = ['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5'];
const secondIndicatorStyles = {
  stepIndicatorSize: 40,
  currentStepIndicatorSize: 42,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: '#d0333a',
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: '#d0333a',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#d0333a',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#d0333a',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#d0333a',
  stepIndicatorLabelFontSize: 12,
  currentStepIndicatorLabelFontSize: 12,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: '#999999',
  labelSize: 12,
  currentStepLabelColor: '#aaaaaa'
}
const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
  const iconConfig = {
    name: 'feed',
    type: 'SimpleLineIcons',
    color: stepStatus === 'finished' ? '#ffffff' : '#fff',
    // size: 2,
  };
  switch (position) {
    case 0: {
      iconConfig.name = 'grid';
      break;
    }
    case 1: {
      iconConfig.name = 'calendar';
      break;
    }
    case 2: {
      iconConfig.name = 'location-pin';
      break;
    }
    case 3: {
      iconConfig.name = 'credit-card';
      break;
    }
    case 4: {
      iconConfig.name = 'paper-plane';
      break;
    }
    default: {
      break;
    }
  }
  return iconConfig;
};

export default class ServicesStep1 extends Component {
  constructor() {
    super();
  }
  state = {
    currentPage: 0,
    loading: true,
    data: [],
    questions: [],
    services: []
  };
  async componentDidMount() {

    let params = this.props.navigation.state.params;
    this.setState({ services: params.services });
    let getdetail = false;
    let private_token = "";
    try {
      private_token = await AsyncStorage.getItem('private_token');
      if (private_token != null || private_token == 'undefined') {
        getdetail = true;
      }
    } catch (error) {
      console.log(error);
    }
    if (getdetail && params.services.ServicesID) {
      let services_id = params.services.ServicesID;
      const setting = "http://staging.koreawallpaper.com/api/services/services_question?private_token=" + private_token + "&services_id=" + services_id;
      const result = await fetch(setting);
      const response = await result.json();
      if (response.status == true) {
        let question = []
        response.data.forEach(function (val) {
          question["Q" + val.ServicesQuestionID] = { id: val.ServicesQuestionID, question: val.ServicesQuestionName, require: val.ServicesQuestionRequired, value: "" };
          // this.setState({ ["Q" + val.ServicesQuestionID]: "1" });
        });
        this.setState({
          loading: false,
          data: response.data,
          questions: question,
        });
      }
    }
  }

  _radiobutton_check(id, value) {
    let question = this.state.questions;
    question["Q" + id]["value"] = value;
    this.setState({ questions: question })
  }
  _textarea_check(id, value) {
    let question = this.state.questions;
    question["Q" + id]["value"] = value;
    this.setState({ questions: question })
  }
  _render_html(val) {
    switch (val.ServicesQuestionType) {
      case "radio":
        return (<RadioForm
          radio_props={val.Option}
          initial={0}
          // onPress={(value) => this.setState({ Holder : TextInputValue })}
          onPress={(value) => this._radiobutton_check(val.ServicesQuestionID, value)}
          buttonInnerColor={'#e3e1e4'}
          buttonColor={'#e3e1e4'}
          buttonSize={10}
          buttonOuterSize={20}
          formHorizontal={false}
          style={{ alignItems: 'flex-start' }}
          initial={-1}
        />);
        break;
      case "textarea":
        return (
          <View><Label style={{ fontSize: 14 }}>
            {val.ServicesQuestionPlaceholder}
          </Label>
            <Textarea
              onChangeText={(value) => this._textarea_check(val.ServicesQuestionID, value)}
              block
              style={{ alignSelf: 'stretch', backgroundColor: "#e3e1e4" }}
              rowSpan={5}
              bordered placeholder="Write here..."
            /></View>);
        break;
    }
  }
  _proceed() {
    let proceed = true;
    let question = this.state.questions;
    for (var k in question) {
      if (question.hasOwnProperty(k)) {
        if (question[k]["value"] == "" && question[k]["require"] == "1") {
          proceed = false;
        }
        // alert("Key is " + k + ", value is" + question[k]);
      }
    }
    if (proceed === false) {
      Toast.show({
        text: "Please answer all question first",
        buttonText: "Dismiss",
      })
    } else {
      this.props.navigation.navigate({ routeName: 'ServicesStep2', params: { services: this.state.services, question: this.state.questions } })
    }
  }
  render() {
    // let params = this.props.navigation.state.params;
    const { loading, data, question, services } = this.state;
    // if (currentPage == 0) {
    return (

      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{services.ServicesName}</Title>
          </Body>
          <Right />
        </Header>
        {/* borderBottomColor: '#dad47c', borderBottomWidth: 1 */}
        <View style={[styles.stepIndicator, { paddingBottom: 10 }]}>
          <StepIndicator renderStepIndicator={this.renderStepIndicator} customStyles={secondIndicatorStyles} currentPosition={this.state.currentPage} labels={["Detail", "Schedule", "Address", "Payment", "Finish"]} />
        </View>


        <Content padder style={{ backgroundColor: "#f9f7fa" }}>
          {
            loading &&
            <Spinner color="red" />
          }
          {
            !loading && (
              data.map(val => (
                <Card style={[styles.carddisplay, styles.mb, styles.mt15]} key={val.ServicesQuestionID}>
                  <CardItem header bordered>
                    <Text>{val.ServicesQuestionName}</Text>
                  </CardItem>
                  <CardItem bordered>
                    <Body>
                      {this._render_html(val)}
                    </Body>
                  </CardItem>
                </Card>

              ))
            )
          }
          {
            !loading && (
              <Button block rounded primary style={styles.mb15}
                onPress={() =>
                  this._proceed()
                }>
                <Text>Continue</Text>
              </Button>
            )
          }
        </Content>

      </Container>
    );
    // }
  }

  renderStepIndicator = params => (
    <Icon style={{ fontSize: 16 }}
      {...getStepIndicatorIconConfig(params)}
    />
  );
}
const { width } = Dimensions.get("window");
const height = (width * 0.67);
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF"
  },
  text: {
    alignSelf: "center",
    marginBottom: 7
  },
  mb: {
    marginBottom: 15
  },
  loading: {
    height
  },

  stepIndicator: {
    marginHorizontal: 15,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  carddisplay: {
    // borderRadius: 50,
    borderWidth: 1,
    borderColor: '#fff'
  },
  radioWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
});

