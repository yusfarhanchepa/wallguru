import variable from "./../variables/platform";

export default (variables = variable) => {
  const tabBarTheme = {
    
    backgroundColor: variables.tabBgColor
  };

  return tabBarTheme;
};
