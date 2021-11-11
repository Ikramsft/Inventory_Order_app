import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";
import {
  Login,
  Dashboard,
  Language,
  Profile,
  Orders,
  Search,
  Inventory,
  Signup,
  Foregot,
  SearchResult,
  EditInventory,
  OrderDetail,
  SubsCription,
  SubsCriptionExpiration,
  PaymentFailed,
  TrialPage,
  Plans
} from "screens";
import Icon from "react-native-vector-icons/FontAwesome5";
import { theme } from "./constants/colors";
import DrawerContainer from "./components/drawerContainer";
import { AppIcon, AppStyles } from "./utility/AppStyles";

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});

const stackProfile = createStackNavigator(
  {
    Profile: { screen: Profile },
  },
  {
    initialRouteName: "Profile",
    headerMode: "float",
    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "red",
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const stackSearchResult = createStackNavigator(
  {
    SearchResult: { screen: SearchResult },
  },
  {
    initialRouteName: "SearchResult",
    headerMode: "float",
    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "red",
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const stackSearch = createStackNavigator(
  {
    Search: { screen: Search },
    SearchResult: {
      screen: SearchResult,
    },
  },
  {
    initialRouteName: "Search",
    headerMode: "float",
    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "red",
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const stackOrders = createStackNavigator(
  {
    Orders: { screen: Orders },
    OrderDetail: { screen: OrderDetail },
  },
  {
    initialRouteName: "Orders",
    headerMode: "float",
    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "red",
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const stackInventory = createStackNavigator(
  {
    Inventory: { screen: Inventory },
    SearchResult: { screen: SearchResult },
  },
  {
    initialRouteName: "Inventory",
    headerMode: "float",

    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "red",
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

// Subscription Stack
const stackSubScription = createStackNavigator(
  {
    SubsCription: { screen: SubsCription },
    // SubsCriptionExpiration: { screen: SubsCriptionExpiration },
    // PaymentFailed: { screen: PaymentFailed },
  },
  {
    initialRouteName: "SubsCription",
    headerMode: "none",
  }
);

const stackDashboard = createStackNavigator(
  {
    Dashboard: { screen: Dashboard },
    Search: {
      screen: stackSearch,
      navigationOptions: {
        header: null,
      },
    },
    Inventory: {
      screen: stackInventory,
      navigationOptions: {
        header: null,
        gestureEnabled: false,
      },
    },
    Profile: { screen: Profile },
    Orders: {
      screen: stackOrders,
      navigationOptions: {
        header: null,
      },
    },
    SubsCriptionExpiration: {
      screen: SubsCriptionExpiration,
      navigationOptions: {
        header: null,
      },
    },
    //SearchResult: { screen: SearchResult },
    EditInventory: { screen: EditInventory },
    // SubsCription: { screen: SubsCription },
    SubsCription: {
      screen: stackSubScription,
      navigationOptions: {
        header: null,
      },
    },
    TrialPage: {
      screen: TrialPage,
      navigationOptions: {
        header: null,
      },
    },
    //Orders: { screen: Orders },
    //OrderDetail: { screen: OrderDetail },
  },
  {
    initialRouteName: "Dashboard",
    headerMode: "float",
    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "red",
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const BottomNavigationContainer = createBottomTabNavigator(
  {
    Dashboard: stackDashboard,
    Search: stackSearch,
    Inventory: stackInventory,
    Profile: stackProfile,
    Orders: stackOrders,
  },
  {
    initialRouteName: "Dashboard",
    defaultNavigationOptions: ({ navigation }) => {
      return {
        tabBarIcon: ({ tintColor }) => {
          const route = navigation.state.routeName;
          const name = {
            Dashboard: "tachometer-alt",
            Search: "search",
            Inventory: "plus",
            Profile: "user",
            Orders: "cart-plus",
          }[route];
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.popToTop();
                navigation.dispatch(navigation.popToTop());
                navigation.navigate(route);
              }}
            >
              <Icon name={name} color={tintColor} size={20} />
            </TouchableOpacity>
          );
        },
        tabBarOptions: {
          showLabel: false,
          showIcon: true,
          activeTintColor: "#2E67AC",
        },
      };
    },
  }
);

const DrawerStack = createDrawerNavigator(
  {
    Tab: stackDashboard,
  },
  {
    drawerPosition: "left",
    initialRouteName: "Tab",
    drawerWidth: 270,
    contentComponent: DrawerContainer,
  }
);

const stackLogin = createStackNavigator(
  {
    Login: {
      screen: Login,
    },
    Signup: { screen: Signup },
    Foregot: { screen: Foregot },
    Profile: { screen: Profile },
    TrialPage: {
      screen: TrialPage,
      navigationOptions: {
        header: null,
      },
    },
    SubsCriptionExpiration: {
      screen: SubsCriptionExpiration,
      navigationOptions: {
        header: null,
      },
    },
    Plans: {
      screen: Plans,
      navigationOptions: {
        header: null,
      },
    },
    PaymentFailed: {
      screen: PaymentFailed,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: "Login",
    headerMode: "float",

    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "red",
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);
const stackLanguage = createStackNavigator(
  {
    Language: { screen: Language },
  },
  {
    initialRouteName: "Language",
    headerMode: "float",

    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "red",
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const RootStackNavigator = createStackNavigator(
  {
    Language: {
      screen: stackLanguage,
      navigationOptions: {
        header: null,
      },
    },
    Signup: { screen: Signup },
    Login: {
      screen: stackLogin,
      navigationOptions: {
        header: null,
      },
    },
    Plans: {
      screen: Plans,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: "Language",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  }
);

const LoginAppContainer = createSwitchNavigator(
  {
    RootStackNavigator: RootStackNavigator,
    BottomNavigationContainer: DrawerStack,
  },
  {
    initialRouteName: "RootStackNavigator",
  }
);

const AppContainer = createAppContainer(LoginAppContainer);

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    color: "black",
    flex: 1,
    fontFamily: AppStyles.fontName.main,
  },
});

export default createAppContainer(AppContainer);
