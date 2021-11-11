import React, { useState, useEffect } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { AppState } from "react-native";
// import NetInfo from "@react-native-community/netinfo";
import rootReducer from "./store";
import ConnectionStatus from "./ConnectionStatus";
//import ReduxNavigation from './ReduxNavigation'
import thunk from "redux-thunk";
import AppContainer from "./appRouteConfig";
const store = createStore(rootReducer, applyMiddleware(thunk));
console.disableYellowBox = true;
const Root = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [netConnection, setNetConnection] = useState(true);

  useEffect(() => {
   
  }, [appState]);

  const _handleAppStateChange = (nextAppState) => {
    setAppState(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    
  });

  return (
    <Provider store={store}>
      <ConnectionStatus isVisible={!netConnection} />
      {/* <ReduxNavigation /> */}
      <AppContainer />
    </Provider>
  );
};

export default Root;

// import React, { useEffect, useState } from "react";
// import { Text, View, Button, Platform } from "react-native";
// import * as RNIap from "react-native-iap";

// const itemSkus = Platform.select({
//   ios: ["com.kizbin.monthly.subscription"],
//   android: ["com.kizbin.monthly.subscription"],
// });
// const Root = () => {
//   const [isSubscribed, SetIsSubscribed] = useState();
//   const [Allproducts, setProducts] = useState([]);

//   useEffect(async () => {
//     RNIap.getSubscriptions(itemSkus).then((res) => {
//       setProducts(res);
//     });
//     const result = await RNIap.initConnection();
//     const purchaseUpdate = RNIap.purchaseUpdatedListener((purchase) => {
//       const receipt = purchase.transactionReceipt;
//       if (receipt) {
//         RNIap.finishTransaction(purchase);
//         SetIsSubscribed(purchase);
//       }
//     });

//     return () => {
//       purchaseUpdate.remove();
//     };
//   }, []);
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 20,
//       }}
//     >
//       <Text>{isSubscribed}</Text>
//       {Allproducts &&
//         Allproducts.map((product) => {
//           return (
//             <View key={product.productId}>
//               <Text>{product.title}</Text>
//               <Text>{product.localizedPrice}</Text>
//               <Button
//                 title="Subscibe Now"
//                 onPress={() => RNIap.requestSubscription(product.productId)}
//               />
//             </View>
//           );
//         })}
//     </View>
//   );
// };
// export default Root;
