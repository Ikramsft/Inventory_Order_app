import { combineReducers } from "redux";
import { createNavigationReducer } from "react-navigation-redux-helpers";
import AppNavigator from "../appRouteConfig";
import { language, logout_user } from "../screens/Language/reducers";
import {
  getOrders_list,
  getOrders_byid,
  setorderstatus,
} from "../screens/Orders/reducer";
import { login, user_data } from "../screens/Login/reducer";
import { get_countrycode, do_signup } from "../screens/Signup/reducer";
import { save_user } from "../screens/Profile/reducer";
import { foregotpassword, get_countrycode1 } from "../screens/Forgot/reducer";
import {
  getMaster,
  getsub1,
  getsub2,
  getsupplier,
  getlocation,
  getunit,
  getsize,
  getcolor,
  delcatagory,
  addcatagory,
  generatestocknumber,
  insertinventory,
} from "../screens/Inventory/reducer";
import {
  search_inventory,
  delete_inventory,
  summary_inventory,
  qty_inventory,
  get_inventory,
  update_inventory,
  check_barcode,
} from "../screens/SearchInventory/reducer";
import {
  getdashboarddata,
  getoutstock,
  getnotifications,
  postIosReciept,
  verifyReciept,
} from "../screens/Dashoard/reducer";
const navReducer = createNavigationReducer(AppNavigator);
console.log("AppNavigator", AppNavigator);
const allReducers = combineReducers({
  nav: navReducer,
  language: language,
  login: login,
  countrycode: get_countrycode,
  get_countrycode1: get_countrycode1,
  do_signup: do_signup,
  user_data: user_data,
  save_user: save_user,
  masterCat: getMaster,
  sub1: getsub1,
  sub2: getsub2,
  supplier: getsupplier,
  location: getlocation,
  unit: getunit,
  size: getsize,
  color: getcolor,
  foregotpassword: foregotpassword,
  delcat: delcatagory,
  addcat: addcatagory,
  stockid: generatestocknumber,
  insertinventory: insertinventory,
  search_inventory: search_inventory,
  deleteStock: delete_inventory,
  summary: update_inventory,
  qty: qty_inventory,
  dashboarddata: getdashboarddata,
  outstock: getoutstock,
  inventorybyid: get_inventory,
  order_list: getOrders_list,
  orderdetails: getOrders_byid,
  setstatus: setorderstatus,
  alerts: getnotifications,
  log_out: logout_user,
  barcode: check_barcode,
  iosReciept: postIosReciept,
  verifyRecieptState: verifyReciept,
});
const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    state = undefined;
  }

  return allReducers(state, action);
};
export default rootReducer;
