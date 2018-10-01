import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Footer,
  FooterTab,
  Text,
  Body,
  Left,
  Right,
  Icon,
  Badge
} from "native-base";
import styles from "./styles";
import Services from "./services/Services.js";
import MyRequest from "./home/myrequest.js";
import ChatWithUs from "./home/chatwithus.js";
import Profile from "./home/profile.js";
import { TabNavigator } from "react-navigation";


class HomeMenu extends Component {
  constructor(props) {
    super(props);
  }
}

export default (MainScreenNavigator = TabNavigator(
  {
    Services: { screen: props => <Services {...props} />    },
    MyRequest: { screen: props => <MyRequest {...props} /> },
    ChatWithUs: { screen: props => <ChatWithUs {...props} /> },
    Profile: { screen: props => <Profile {...props} /> },
  },
  {
    animationEnabled: false,
    tabBarPosition: "bottom",
    tabBarOptions: {
      showIcon: true,
      labelStyle: {
        fontSize: 8
      },
      style: {
        backgroundColor: '#fff',
      },
      tabStyle: {
        height: 49
      },
      iconStyle: {
        flexGrow: 0,
        marginTop: 1.5
      }
    },
    
    tabBarComponent: props => {
      return (
        <Footer >
          <FooterTab>
            <Button
              vertical
              active={props.navigationState.index === 0}
              onPress={() => props.navigation.navigate("Services")}
            >
              <Icon type="Feather" name="home" />
              <Text>Services</Text>
            </Button>
            <Button
              style={styles.button}
              vertical
              active={props.navigationState.index === 1}
              onPress={() => props.navigation.navigate("MyRequest")}
            >
              <Icon type="Feather" name="briefcase" />
              <Text>My Request</Text>
            </Button>
            <Button
              style={styles.button}
              vertical
              active={props.navigationState.index === 2}
              onPress={() => props.navigation.navigate("ChatWithUs")}
            >
              <Icon type="Feather" name="message-square" />
              <Text>Chat With Us</Text>
            </Button>
            <Button
              style={styles.button}
              vertical
              active={props.navigationState.index === 3}
              onPress={() => props.navigation.navigate("Profile")}
            >
              <Icon type="Feather" name="user" />
              <Text>Profile</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }
));
