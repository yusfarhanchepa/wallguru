import React, { Component } from "react";
import { ListItem ,List } from 'react-native-elements'
import { FlatList , View, StatusBar,Platform } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Badge,
  Left,
  Right,
  Body,
  Switch,
  Radio,
  Picker,
  Separator
} from "native-base";

const account = [
  {
    title: 'Profile',
    icon: 'person'
  },
  {
    title: 'Rate the app!',
    icon: 'stars'
  },
  {
    title: 'Saved Addresses',
    icon: 'stars'
  },
  {
    title: 'Logout',
    icon: 'input'
  },

]
const legal = [
  {
    title: 'Term of Use',
    icon: 'description'
  },
  {
    title: 'Privacy Policy',
    icon: 'lock'
  },

]


export default class Profile extends React.Component {



  render() {
    const { navigate } = this.props.navigation;
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
            <Title>My Profile</Title>
          </Body>
          <Right />
        </Header>

        <Content>
        <Text >  </Text>
        <Text style={{textAlign: 'left',fontWeight:'bold',fontSize:18}}> Account </Text>
        <List>
        {
          account.map((item) => (
            <ListItem
              key={item.title}
              title={item.title}
              leftIcon={{name: item.icon}}
            />
          ))
        }
      </List>
        <Text >  </Text>
          <Text style={{textAlign: 'left',fontWeight:'bold',fontSize:18}}>  Legal </Text>
        <List>
        {
          legal.map((item) => (
            <ListItem
              key={item.title}
              title={item.title}
              leftIcon={{name: item.icon}}
            />
          ))
        }
      </List>

        </Content>
      </Container>
    );
  }

}
