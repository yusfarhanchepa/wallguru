import React from "react";
import { Root } from "native-base";
import { StackNavigator, DrawerNavigator } from "react-navigation";

import HomeMenu from "./screens/HomeMenu";
import AuthScreen from "./screens/AuthScreen";
import AuthScreen2 from "./screens/AuthScreen2";
import AuthScreen3 from "./screens/AuthScreen3";
import AuthIntro from "./screens/AuthIntro";

import AuthLogoutScreen from "./screens/AuthLogoutScreen/";
import MyMembership from "./screens/MyMembership/";
import MyPoint from "./screens/MyPoint/"; 
import ServicesStep1 from "./screens/services/ServicesStep1/"; 
import ServicesStep2 from "./screens/services/ServicesStep2/"; 
import ServicesStep3 from "./screens/services/ServicesStep3/"; 

import SideBar from "./screens/sidebar/";
import PaymentGateway from "./screens/paymentgateway/PaymentGateway";

state = {
  isLogin: false,
};
// check_session = async () => {
//   // alert();
//   try {
//     let private_token = await AsyncStorage.getItem('private_token');
//     alert(private_token);
//     // if(private_token > 0){
//       this.setState({"isLogin": true});
//     // }
//     // alert(private_token);
//   } catch (error) {
//     alert("ERR "+ error);
//   }
//   return
// }
// this.check_session();
const Drawer = DrawerNavigator(
  {
    AuthScreen: { screen: AuthScreen },
    AuthScreen2: { screen: AuthScreen2 },
    AuthScreen3: { screen: AuthScreen3 },
    AuthIntro: { screen: AuthIntro },
    MyMembership: { screen: MyMembership },
    MyPoint: { screen: MyPoint },
    AuthLogoutScreen: { screen: AuthLogoutScreen },
    HomeMenu: { screen: HomeMenu },
    PaymentGateway: { screen: PaymentGateway },
   
  },
  {
    initialRouteName: this.state.isLogin ? "HomeMenu":"AuthIntro",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = StackNavigator(
  {
    Drawer: { screen: Drawer },
    // HomeMenu: { screen: HomeMenu },
    ServicesStep1: { screen: ServicesStep1 },
    ServicesStep2: { screen: ServicesStep2 },
    ServicesStep3: { screen: ServicesStep3 },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <AppNavigator />
  </Root>;
