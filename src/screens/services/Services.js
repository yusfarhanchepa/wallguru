import React from "react";
import { AppRegistry, View, Image, StatusBar, Dimensions,Animated, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { NavigationActions } from "react-navigation";
import Swiper from "react-native-swiper";
// import styles from "./styles";
import APIStore from "../../theme/components/APIStore";

import {
  Button,
  Text,
  Container,
  Card,
  CardItem,
  Body,
  Content,
  Header,
  Left,
  Right,
  Icon,
  Title,
  Input,
  InputGroup,
  Item,
  Spinner,
  Tab,
  Tabs,
  Footer,

  FooterTab,
  Label
} from "native-base";
const setting = "http://staging.koreawallpaper.com/api/setting";
const drawerImage = require("../../../assets/logo.jpg");
// function cacheImages(images) {
//   return images.map(image => {
//     if (typeof image === 'string') {
//       return Image.prefetch(image);
//     } else {
//       return Asset.fromModule(image).downloadAsync();
//     }
//   });
// }
export default class Services extends React.Component {
  state = {
    loading: true,
    data: []
  };

  async componentDidMount(): Promise<void> {
    const result = await fetch(setting);
    const response = await result.json();
    await Promise.all(response.banners.map(banner => Image.prefetch(banner)));
    this.setState({ loading: false, data: response });
  }
  _clickServices(val) {
    // console.log(val);
    this.props.navigation.navigate({ routeName: 'ServicesStep1', params: { services: val } })
    // this.props.navigate({ routeName: 'ServicesStep', params: { ...val } });
  }
  render() {

    const { navigate } = this.props.navigation;
    const { loading, data } = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title style={{
              paddingLeft: 110
            }}>
              <Image style={{ width: 180, height: 180, paddingTop: 10 }} source={drawerImage} />
            </Title>
          </Body>
          <Right />
        </Header>
        {
          loading &&
          <Spinner color="red" style={styles.image} />
        }
         <Content padder>
        {
          !loading && (
            <Swiper
            height={250}
            animated={true}
            // showsButtons={true}
            removeClippedSubviews={false}>
              {
                data.banners.map(banner => (
                  <Image
                    key={banner}
                    source={{ uri: banner }}
                    style={styles.image}
                  />
                ))
              }
            </Swiper>
          )
        }

       
          {
            !loading && data.services.map(val => (
              <TouchableOpacity
                key={val.ServicesID}
                style={styles.itemTwoContainer}
                onPress={() => this._clickServices(val)}
              >
                <View style={styles.itemTwoContent}>
                  <Image
                    style={styles.itemTwoImage}
                    source={{ uri: val.ServicesImagesPath }}
                  />
                  <View style={styles.itemTwoOverlay} />
                  <Text style={styles.itemTwoTitle}>{val.ServicesName}</Text>
                </View>
              </TouchableOpacity>
            ))
          }
        </Content>
      </Container>
    );
  }
}

const { width } = Dimensions.get("window");
const height = (width * 0.67);
const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  header: {
    position: "absolute",
    top: 0,
    height: 57,
    zIndex: 1000,
    paddingTop: 0,
    paddingLeft: 0,
    justifyContent: "center",
    width
  },
  image: {
    width,
    height
  },
  container: {
    padding: 0
  },
  host: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  // map: {
  //   height: width * 0.62,
  //   width
  // },
  loading: {
    height
  },
  itemTwoContainer: {
    // paddingBottom: 10,
    // backgroundColor: 'white',
    marginVertical: 5,
  },
  itemTwoContent: {
    padding: 20,
    position: 'relative',
    marginHorizontal: Platform.OS === 'ios' ? -15 : 0,
    height: 150,
  },
  itemTwoTitle: {
    color: "#fff",
    // fontFamily: Fonts.primaryBold,
    fontSize: 20,
  },
  itemTwoImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  itemTwoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.3,
  },
});
