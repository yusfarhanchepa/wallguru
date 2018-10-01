const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  // drawerCover: {
  //   alignSelf: "stretch",
  //   height: deviceHeight / 3.5,
  //   width: null,
  //   position: "relative",
  //   marginBottom: 10
  // },
  drawerImage: {
    position: "relative",
    left: Platform.OS === "android" ? deviceWidth / 18 : deviceWidth / 9,
    top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: 100,
    height: 100,
    marginBottom : deviceHeight /8,
    resizeMode: "cover"
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  }
};
