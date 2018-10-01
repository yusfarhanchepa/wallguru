import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  AsyncStorage
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Card,
  CardItem,
  Text,
  Body,
  Left,
  Right,
  Spinner
} from "native-base";
// import styles from "./styles";


export default class MyPoint extends Component {
  async componentDidMount(): Promise<void> {
    let getMembership = false;
    let private_token = "";
    try {
      private_token = await AsyncStorage.getItem('private_token');
      if (private_token != null || private_token == 'undefined') {
        getMembership = true;
      }
    } catch (error) {
      console.log(error);
    }
    if (getMembership) {

      const setting = "http://staging.koreawallpaper.com/api/membership/get_all?private_token=" + private_token;
      const result = await fetch(setting);
      const response = await result.json();
      // await Promise.all(response.banners.map(banner => Image.prefetch(banner)));
      this.setState({ loading: false, data: response.data });
      console.log(response.data)
    }
  }
  state = {
    loading: true,
    data: []
  };
  render() {
    const { loading, data } = this.state;
    return (
      <Container style={styles.container}>
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
            <Title>MadBonus</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          {
            loading &&
            <Spinner color="red" />
          }
          {
            !loading && (
              data.map(val => (
                <Card style={styles.mb}>
                  <CardItem header bordered first>
                    <Text>{val.MembershipTypeName}</Text>
                  </CardItem>
                  <CardItem bordered>
                    <Body>
                      <Text>
                      {val.FullName}{"\n"}
                      {val.Email}{"\n"}
                      {val.MembershipIC}{"\n"}
                      </Text>
                    </Body>
                  </CardItem>
                  <CardItem footer bordered last>
                    <Text>Seoul Credit : {val.Credit}</Text>
                  </CardItem>
                </Card>
              ))
            )
          }
        </Content>
      </Container>
    );
  }
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
  }

});
