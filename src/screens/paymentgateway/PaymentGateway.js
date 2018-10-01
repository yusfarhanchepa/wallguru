
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Button,
  Text,
  View,
  Alert,
  ToastAndroid
} from "react-native";
import IPay88, { Pay } from "ipay88-sdk";
 
export default class PaymentGateway extends Component {
  successNotify = data => {
    if (Platform.OS === "ios") {
      const {
        transactionId,
        referenceNo,
        amount,
        remark,
        authorizationCode 
      } = data;
 
      Alert.alert("Message", `Payment authcode is ${authorizationCode}`, {
        cancelable: true
      });
    } else {
      ToastAndroid.show(
        `Message: Payment authcode is ${authorizationCode}`,
        ToastAndroid.LONG
      );
    }
  };
 
  cancelNotify = data => {
    const { transactionId, referenceNo, amount, remark, error } = data;
 
    if (Platform.OS === "ios") {
      Alert.alert("Message", `${error}`, { cancelable: true });
    } else {
      ToastAndroid.show(`Message: ${error}`, ToastAndroid.LONG);
    }
  };
 
  failedNotify = data => {
    const { transactionId, referenceNo, amount, remark, error } = data;
 
    if (Platform.OS === "ios") {
      Alert.alert("Message", `${error}`, { cancelable: true });
    } else {
      ToastAndroid.show(`Message: ${error}`, ToastAndroid.LONG);
    }
  };
 
  pay = () => {
    try {
      const data = {};
      data.paymentId = "2"; // refer to ipay88 docs
      data.merchantKey = "6JixBUl54b";
      data.merchantCode = "M12711";
      data.referenceNo = "androidTEST";
      data.amount = "1.00";
      data.currency = "MYR";
      data.productDescription = "Payment";
      data.userName = "test";
      data.userEmail = "test@gmail.com";
      data.userContact = "+60123456789";
      data.remark = "me";
      data.utfLang = "UTF-8";
      data.country = "MY";
      data.backendUrl = "https://www.koreawallpaper.com/index.php/transaction/backend";
      const errs = Pay(data);
      if (Object.keys(errs).length > 0) {
        console.log(errs);
      }
    } catch (e) {
      console.log(e);
    }
  };
 
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <IPay88
          successNotify={this.successNotify}
          failedNotify={this.failedNotify}
          cancelNotify={this.cancelNotify}
        />
        <Button title="Pay" onPress={this.pay} />
      </View>
    );
  }
}
