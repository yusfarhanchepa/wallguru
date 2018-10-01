import React, { Component } from "react";
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';
import {
  StyleSheet,
  AsyncStorage,
  Image,
  Dimensions,
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
  Form,
  Item,
  Toast,
  View,
  Label,
  Input,
  Text,
  Card,
  CardItem,
  Picker,
  // PickerItem
} from "native-base";
import StepIndicator from 'react-native-step-indicator';
const secondIndicatorStyles = {
  stepIndicatorSize: 20,
  currentStepIndicatorSize: 21,
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
  stepIndicatorCurrentColor: '#fff',
  stepIndicatorLabelFontSize: 12,
  currentStepIndicatorLabelFontSize: 12,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: '#999999',
  labelSize: 12,
  currentStepLabelColor: '#aaaaaa'
}

const PickerItem = Picker.Item;
export default class ServicesStep3 extends React.Component {
  constructor() {
    super();
    // this.renderRow = this.renderRow.bind(this);
  }
  state = {
    loading: true,
    // refreshing: false,
    // summaryModal: false,
    data: [],
    items: [],
    questions: [],
    services: [],
    selected2: undefined
  };
  async componentDidMount(): Promise<void> {
    let params = this.props.navigation.state.params;
    this.setState({ services: params.services, questions: params.questions, items: params.items, });
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
      const setting = "http://staging.koreawallpaper.com/api/services/services_item?private_token=" + private_token + "&services_id=" + services_id;
      const result = await fetch(setting);
      const response = await result.json();
      // console.log(setting);
      await Promise.all(response.data.map(val => Image.prefetch(val.ServicesCategoryImagePath)));
      // console.log(response);
      if (response.status == true) {
        this.setState({ loading: false, data: response.data });
      }

    }
  }
  onValueChange2(value: string) {
    this.setState({
      selected2: value
    });
  }
  render() {
    const { loading, data, services, items, total_quantity, total_price } = this.state;
    return (

      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Your Information</Title>
          </Body>
          <Right />
        </Header>
        <View style={[styles.stepIndicator, { paddingBottom: 10 }]}>
          <StepIndicator customStyles={secondIndicatorStyles} currentPosition={2} labels={["", "", "", "", ""]} />
        </View>


        <Content padder style={{ backgroundColor: "#f9f7fa" }}>
          {
            loading &&
            <Spinner color="red" />
          }

          <Card >
            <CardItem header bordered>

              <Text>Your Information</Text>
            </CardItem>
            
           
       
    <View style={styles.container}>
      <TextField
        ref={this.sampleRef}
        // value={sample}
        onChangeText={this.onChangeText}
        label='Name'
        multiline={true}
      />
       <TextField
        ref={this.sampleRef}
        // value={sample}
        onChangeText={this.onChangeText}
        label='Company Name(Optional)'
        multiline={true}
      />
      <TextField
        ref={this.sampleRef}
        // value={sample}
        onChangeText={this.onChangeText}
        label='Primary Contact'
        multiline={true}
      />     
      <TextField
        ref={this.sampleRef}
        // value={sample}
        onChangeText={this.onChangeText}
        label='Secondary Contact'
        multiline={true}
      />
    </View>
    </Card>

    <Card style={[styles.carddisplay, styles.mb, styles.mt15]} >
      <CardItem header bordered>
         <Text>Your Address</Text>
       </CardItem>
      <View style={styles.container}>
      <TextField
        ref={this.sampleRef}
        // value={sample}
        onChangeText={this.onChangeText}
        label='Address 1'
        multiline={true}
      />
      <TextField
        ref={this.sampleRef}
        // value={sample}
        onChangeText={this.onChangeText}
        label='Address 2'
        multiline={true}
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Dropdown
            ref={this.nameRef}
          // value={name}
            onChangeText={this.onChangeText}
            label='City'
            data={cityData}
          />
        </View>

        <View style={{ width: 96, marginLeft: 8 }}>
        <TextField
        ref={this.sampleRef}
        // value={sample}
        onChangeText={this.onChangeText}
        label='Postal Code'
        multiline={true}
         />
        </View>
      </View>

      <Dropdown
        ref={this.typographyRef}
        //value={typography}
        onChangeText={this.onChangeText}
        label='State'
        data={stateData}
      />      
      <Dropdown
        ref={this.typographyRef}
        //value={typography}
        onChangeText={this.onChangeText}
        label='Country'
        data={countryData}
      />
    </View>

          </Card>


          {/* {
            !loading && (
              data.map(val => (
                

              ))
            )
          } */}
          {
            !loading && (
              <Button block rounded primary style={styles.mb15}>
                <Text>Select Installer</Text>
              </Button>
            )
          }
        </Content>
      </Container>
    );
  }


}
const { width, height } = Dimensions.get("window");
// const height = (width * 0.67);

const styles = {
  screen: {
    flex: 1,
    padding: 4,
    paddingTop: 56,
    backgroundColor: '#E8EAF6',
  },

  container: {
    marginHorizontal: 4,
    marginVertical: 8,
    paddingHorizontal: 8,
  },

  text: {
    textAlign: 'center',
  },

  textContainer: {
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 16,
    elevation: 1,
    shadowRadius: 1,
    shadowOpacity: 0.3,
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
};

const cityData = [
  // { value: 'Display2', label: 'Display 2' },
  // { value: 'Display1', label: 'Display 1' },
  { value: 'Shah Alam' },
  { value: 'Puchong' },
  { value: 'Putrajaya' },
  { value: 'Cyberjaya' },
  { value: 'Bangi' },
  { value: 'Kajang' },
  { value: 'Semenyih' },
  { value: 'Cyberjaya' },
  { value: 'Bangi' },
];

const stateData = [
  { value: 'Kuala Lumpur' },
  { value: 'Selangor' },
  { value: 'Johor' },
];

const countryData = [
  // { value: '900', props: { disabled: true } },
  { value: 'Malaysia' },
  { value: 'Singapore' },
  { value: 'Indonesia' },
];