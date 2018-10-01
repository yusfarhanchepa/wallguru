import React, { Component } from "react";
import NumericInput from 'react-native-numeric-input'
import Modal from "react-native-modal";

import {
  StyleSheet,
  AsyncStorage,
  Image,
  Dimensions,
  FlatList,
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
  List,
  ListItem,
  Thumbnail,
  // FlatList,
  Text, Card, CardItem
} from "native-base";
import StepIndicator from 'react-native-step-indicator';
console.disableYellowBox = true;
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


export default class ServicesStep2 extends React.Component {
  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
  }
  state = {
    loading: true,
    refreshing: false,
    summaryModal: false,
    data: [],
    items: [],
    questions: [],
    services: [],
    total_price: 0,
    total_quantity: 0,
  };
  async componentDidMount(): Promise<void> {
    let params = this.props.navigation.state.params;
    this.setState({ services: params.services, questions: params.questions, });
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
      console.log(setting);
      await Promise.all(response.data.map(val => Image.prefetch(val.ServicesCategoryImagePath)));

      console.log(response);
      if (response.status == true) {

        this.setState({ loading: false, data: response.data });
      }

    }
  }
  _itemSelection = (id, val, qty) => {

    let item = this.state.items;
    var found = false;
    for (var i = 0; i < item.length; i++) {
      if (item[i].id == id) {
        found = true;
        if (qty == 0) {
          item.pop();
        } else {
          item[i] = {
            quantity: qty,
            id: id,
            data: val,
          };
        }
        break;
      }
    }
    if (found == false) {
      if (qty !== 0) {
        item.push({
          quantity: qty,
          id: id,
          data: val,
        });
      }
    }
    console.log(item);
    // item[id] = {
    //   quantity: qty,
    //   id: id,
    //   data: val,
    // };
    let totalprice = 0;
    let totalquantity = 0;
    for (var i = 0; i < item.length; i++) {
      totalquantity += item[i].quantity;
      totalprice += (item[i].data.ServicesItemPrice * item[i].quantity);
    }
    this.setState({ items: item, total_quantity: totalquantity, total_price: totalprice })
  }

  _continue_popup = () => {
    if (this.state.total_quantity === 0) {
      Toast.show({
        text: "Please select the services first",
        buttonText: "Dismiss",
      });
    } else {
      this.setState({ summaryModal: true, refreshing: true, })
    }
  };

  _proceed = () => {
    this.setState({ summaryModal: false })
    // let proceed = true;
    // let question = this.state.questions;
    // if (proceed === false) {
    //   Toast.show({
    //     text: "Please answer all question first",
    //     buttonText: "Dismiss",
    //   })
    // } else {
    this.props.navigation.navigate({ routeName: 'ServicesStep3', params: { services: this.state.services, question: this.state.questions, items: this.state.items } })
    // }
  }

  renderRow({ item }) {
    let actualRowComponent =
      <View style={home_screen_list.row} key={item.ServicesItemID} >
        <View style={home_screen_list.row_cell_head_title}>
          <Text style={home_screen_list.title}>{item.ServicesItemShortName}</Text>
          <Text style={home_screen_list.subtitle}>{item.ServicesItemSubName}</Text>
        </View>
        <Text style={home_screen_list.row_cell}>RM {item.ServicesItemPrice}</Text>
        <NumericInput
          style={home_screen_list.row_cell}
          // value={item.ServicesItemID}
          // initValue={5}
          onChange={value => this._itemSelection(item.ServicesItemID, item, value)}
          totalHeight={30}
          minValue={0}
          valueType='real'
          rounded
          textColor='#B0228C'
          iconStyle={{ color: '#000' }}
        // rightButtonBackgroundColor='red'
        // leftButtonBackgroundColor='green' 
        />
      </View>;
    return actualRowComponent;
  }
  renderRowSummary({ item }) {
    console.log(item);
    let totalprice = item.quantity * item.data.ServicesItemPrice;
    let actualRowComponent =
      <View style={home_screen_list.row} key={item.data.ServicesItemID}   >
        <View style={home_screen_list.row_cell_head_title}>
          <Text style={[home_screen_list.title, { fontSize: 14 }]}>{item.data.ServicesCategoryName} {item.data.ServicesItemShortName}</Text>
          <Text style={home_screen_list.subtitle}>{item.data.ServicesItemSubName}</Text>
        </View>
        <Text style={[home_screen_list.row_summary_cell, { flex: 0.5, flexDirection: 'column', textAlign: "center" }]}>{item.quantity}</Text>
        <Text style={[home_screen_list.row_summary_cell, { flex: 0.5, flexDirection: 'column', textAlign: "right" }]}>RM {totalprice.toFixed(2)}</Text>

      </View>;
    return actualRowComponent;
  }

  renderHeaderSummary = () => {
    var Sticky_header_View = (

      <View style={home_screen_list.header}  >
        <Text style={[home_screen_list.row_summary_cell_header, { flex: 1, flexDirection: 'column', }]}>INSTALLATION</Text>
        <Text style={[home_screen_list.row_summary_cell_header, { flex: 0.4, flexDirection: 'column', textAlign: "center" }]}>QUANTITY</Text>
        <Text style={[home_screen_list.row_summary_cell_header, { flex: 0.5, flexDirection: 'column', textAlign: "right", paddingRight: 10 }]}>PRICE</Text>

      </View>
    );
    return Sticky_header_View;
  };
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
            <Title>{services.ServicesName}</Title>
          </Body>
          <Right />
        </Header>
        <View style={[styles.stepIndicator, { paddingBottom: 10 }]}>
          <StepIndicator customStyles={secondIndicatorStyles} currentPosition={1} labels={["", "", "", "", ""]} />
        </View>


        <Content padder style={{ backgroundColor: "#f9f7fa" }}>
          {
            loading &&
            <Spinner color="red" />
          }
          {
            !loading && (
              data.map(val => (
                <Card style={[styles.carddisplay, styles.mb, styles.mt15]} key={val.ServicesCategoryID}>
                  <CardItem header bordered>
                    <Left style={{ flex: 0.5 }}>
                      <Image square
                        style={{ width: 100, height: 100, paddingTop: 10 }}
                        // key={val.ServicesCategoryID}
                        source={{ uri: val.ServicesCategoryImagePath }}
                      />
                    </Left>
                    <Text>{val.ServicesCategoryName}</Text>
                  </CardItem>
                  <CardItem style={{
                    marginTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: 0,
                  }} >
                    {/* style={{ flex: 1 }} */}
                    <Body  >
                      <FlatList
                        style={home_screen_list.container}
                        data={val.items}
                        renderItem={this.renderRow}
                      />

                    </Body>
                  </CardItem>
                </Card>

              ))
            )
          }
          {
            !loading && (
              <Button block rounded primary style={styles.mb15}
                onPress={() => this._continue_popup()}
              >
                <Text>Continue</Text>
              </Button>
            )
          }
        </Content>
        <Modal
          isVisible={this.state.summaryModal === true}
          style={styles.summaryModal}

          // animationIn="slideInUp"
          // animationOut="slideInDown"
          onBackdropPress={() => this.setState({ summaryModal: false })}
        // animationInTiming={1000}
        // animationOutTiming={1000}
        // backdropTransitionInTiming={1000}
        // backdropTransitionOutTiming={1000}
        >
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', }}>
              <Text Left style={{ flex: 1, paddingVertical: 10, fontWeight: "bold", }}>SUMMARY</Text>
              <Button style={{ position: "absolute", right: 0 }} transparent onPress={() => this.setState({ summaryModal: false })}>
                <Icon name="close" />
              </Button>
            </View>
            {/* {console.log(items)}
            {console.log(refreshing)} */}
            <View style={{ flex: 1 }}>
              <View style={{ flex: 0.8 }}>
                <FlatList
                  style={home_screen_list.container}
                  data={items}
                  ListHeaderComponent={this.renderHeaderSummary}
                  // onRefresh={() => this.onRefresh()}
                  // refreshing={refreshing}
                  renderItem={this.renderRowSummary}
                  stickyHeaderIndices={[0]}
                />
              </View>
              <View style={{ flex: 0.2, flexDirection: 'row', padding: 5, paddingTop: 10 }} >
                <View style={[home_screen_list.row_summary_cell, { flex: 1, flexDirection: 'column', textAlign: "center", fontWeight: "bold", }]}>
                  <Text>GRANDTOTAL</Text>
                </View>
                <Text style={[home_screen_list.row_summary_cell, { flex: 0.5, flexDirection: 'column', textAlign: "center", fontWeight: "bold", }]}>{total_quantity}</Text>
                <Text style={[home_screen_list.row_summary_cell, { flex: 0.5, flexDirection: 'column', textAlign: "right", paddingRight: 10, fontWeight: "bold", }]}>RM {total_price.toFixed(2)}</Text>
              </View>
            </View>
            <Button block rounded primary style={styles.mb15}
              onPress={() => this._proceed()}
            >
              <Text>Proceed</Text>
            </Button>
          </View>
        </Modal>
      </Container>
    );
  }


}
const { width, height } = Dimensions.get("window");
// const height = (width * 0.67);
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
    height: (height * 0.67)
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
  summaryModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    // justifyContent: "center",
    // alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    height: 400,
    alignSelf: "stretch",
  },
});

export const home_screen = StyleSheet.create(
  {
    v_container: {
      flex: 1,
      padding: 0,
      flexDirection: 'column', // main axis
      justifyContent: 'center', // main axis
      alignItems: 'center', // cross axis
      // backgroundColor: colors.background_dark,
    },
  });

export const home_screen_list = StyleSheet.create(
  {
    container: {
      marginTop: 0,
      alignSelf: "stretch",
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
    },
    row: {
      elevation: 1,
      borderRadius: 2,
      // backgroundColor: colors.tertiary,
      flex: 1,
      flexDirection: 'row',  // main axis
      justifyContent: 'flex-start', // main axis
      alignItems: 'center', // cross axis
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    row_cell_head_title: {
      flex: 1,
      flexDirection: 'column',
    },
    row_cell: {
      // color: colors.weather_text_color,
      paddingLeft: 5,
      paddingRight: 5,
      flex: 0,
      fontSize: 14,
      // fontSize: values.font_temp_size,
      // fontFamily: values.font_body,
    },
    row_summary_cell: {
      // color: colors.weather_text_color,
      paddingLeft: 5,
      paddingRight: 5,
      flex: 0,
      fontSize: 14,
      // fontSize: values.font_temp_size,
      // fontFamily: values.font_body,
    },
    row_summary_cell_header: {
      // color: colors.weather_text_color,
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 10,
      paddingBottom: 10,
      flex: 0,
      fontSize: 13,
      fontWeight: "bold",
      color: "#fff",
      // fontSize: values.font_temp_size,
      // fontFamily: values.font_body,
    },
    title: {
      // color: colors.weather_text_color,
      textAlignVertical: 'bottom',
      includeFontPadding: false,
      flex: 0,
      // fontSize: values.font_time_size,
      // fontFamily: values.font_body,
    },
    subtitle: {
      // color: colors.weather_text_color,
      textAlignVertical: 'top',
      includeFontPadding: false,
      flex: 0,
      fontSize: 12,
      // fontFamily: values.font_body,
    },
    header: {
      width: '100%',
      backgroundColor: '#999',
      elevation: 1,
      borderRadius: 2,
      flex: 1,
      paddingLeft: 10,
      flexDirection: 'row',  // main axis
      justifyContent: 'flex-start', // main axis

    }
  });