import React from "react";
import {
  PermissionsAndroid,
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Platform,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
  BackHandler,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Linking,
} from "react-native";
import {
  FONT_GOOGLE_BARLOW_REGULAR,
  FONT_GOOGLE_BARLOW_SEMIBOLD,
} from "../../constants/fonts";

import { RNCamera } from "react-native-camera";
import BarcodeMask from "react-native-barcode-mask";
import Icon from "react-native-vector-icons/FontAwesome";
import EviIcon from "react-native-vector-icons/EvilIcons";
import IoIcon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import FoundIcon from "react-native-vector-icons/Foundation";
import FearIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { AppStyles } from "../../utility/AppStyles";
import Logo from "../../components/Logo";
import { connect } from "react-redux";
import {
  isFieldEmpty,
  objectLength,
  capitalize,
  toTitleCase,
} from "../../utility";
import { CheckBox, Button, Overlay } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Header from "../../components/Header";
import HeaderBar from "../../components/HeaderBar";
import { FONT_GOOGLE_BARLOW_SEMIBOL } from "../../constants/fonts";
const { width, height } = Dimensions.get("window");
import {
  getMaterCat,
  getsub1,
  getsub2,
  getsupplier,
  getlocation,
  getunit,
  getsize,
  getcolor,
  delcat,
  addcat,
  generatestockid,
  insert_inventory,
} from "./actions";
import { getDahboarddata, getoustckdata } from "../Dashoard/actions";

import { Col, Row, Grid } from "react-native-easy-grid";
import ImagePicker from "react-native-image-crop-picker";
//import ImagePicker from 'react-native-image-picker';
import DropdownAlert from "react-native-dropdownalert";
import messaging from "@react-native-firebase/messaging";
import { checkbarcode } from "../SearchInventory/actions";
class Inventory extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.createNotificationListener();
    this.state = {
      onSuccess: false,
      isbarcode: false,
      user_data: null,
      isloading: true,
      viewAppear: false,
      isVisible: false,
      issubmit: false,
      iscamera: false,
      masterOverlay: false,
      sub1Overlay: false,
      sub2Overlay: false,
      supplierOverlay: false,
      locationOverlay: false,
      unitOverlay: false,
      sizeOverlay: false,
      colorOverlay: false,
      barcodeoverlay: false,
      iscatloading: true,
      issub1loading: true,
      issub2loading: true,
      issupplierloading: true,
      islocaitonloading: true,
      isunitloading: true,
      issizeloading: true,
      iscolorloading: true,
      position: 0,
      visibleBackOverlay: false,
      addcat: false,
      addsub1: false,
      addsub2: false,
      addsupplier: false,
      addlocation: false,
      addunit: false,
      addsize: false,
      addcolor: false,

      masterCat: [],
      sub1: [],
      sub2: [],
      supplier: [],
      location: [],
      unit: [],
      size: [],
      color: [],
      FrontImageSource: [],
      image_array: [],

      product_title: "",
      mastercat: "",
      mastercat_text: '',
      sub1_str: "",
      sub2_str: "",
      searchtag: "",
      product_desc: "",
      quantity: "0",
      price: "",
      cost: "",
      supplier_str: "",
      location_str: "",
      unit_str: "",
      size_str: "",
      color_str: "",
      sku: "",
      barcode: "",
      listingid: "",
      lastinsertedListingid: '',
      image_1: null,
      image_2: null,
      image_3: null,
      image_4: null,
      //error properties
      error_product_title: "",
      error_mastercat: "",
      error_sub1_str: "",
      error_sub2_str: "",
      error_searchtag: "",
      error_product_desc: "",
      error_quantity: "",
      error_price: "",
      error_cost: "",
      error_supplier_str: "",
      error_location_str: "",
      error_unit_str: "",
      error_size_str: "",
      error_color_str: "",
      error_sku: "",
    };
  }
  componentDidMount = () => {
    this.previewarray = [];
    this.get_inventory_data().then((s) => {
      if (s != null) {
        this.setState(
          {
            product_title: s.product_title,
            mastercat: s.mastercat,
            sub1_str: s.sub1_str,
            sub2_str: s.sub2_str,
            searchtag: s.searchtag,
            product_desc: s.product_desc,
            quantity: s.quantity,
            price: s.price,
            cost: s.cost,
            supplier_str: s.supplier_str,
            location_str: s.location_str,
            unit_str: s.unit_str,
            size_str: s.size_str,
            color_str: s.color_str,
          },
          () => { }
        );
      }

      this.get_user_data().then((data) => {
        this.setState(
          {
            listingid: this.props.stockid.data.listingid,
            sku: this.props.stockid.data.listingid,
            user_data: data,
            quantity: "0",
          },
          () => {
            this.setState({ isloading: false });
          }
        );
        // var stockdata = {
        //     do: 'GenerateStockNumber',
        //     username: data.UserName,
        //     userid: data.UserId,
        //     listype: 1,
        //     osname: Platform.OS === "ios" ? "ios" : "and"
        // }

        // this.props.generatestockid(stockdata).then(() => {

        // })
      });
    });

    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);

    Linking.addEventListener("url", this.handleOpenURL);
  };

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenURL);
  }
  handleOpenURL = (event) => {
    this.props.navigation.navigate("Orders");
  };

  onload = () => { };
  createNotificationListener = async () => {
    this.notificationListener = messaging().onMessage((notification) => {

      // notification.android.setChannelId("1:781578090706:android:95ba4e147ffd02cd27550b");
      //  messaging().displayNotification(notification);
      // this.showAlert("title", "body");
      if (this.dropDownAlertadd != null && this.dropDownAlertadd != undefined) {
        this.dropDownAlertadd.alertWithType(
          "success",
          notification.notification.title,
          notification.notification.body
        );

        // if (Platform.OS == "android") {
        //    this.dropDownAlertproductlist.alertWithType('success', notification.notification.title, notification.notification.body);
        // } else {
        //     // this.refs.fmLocalInstance.showMessage({
        //     //     message: notification.notification.title,
        //     //     description: notification.notification.body,
        //     //     type: "success",
        //     // });
        //     if (notification.data != undefined)
        //         this.dropDownAlertRef.alertWithType('success', notification.data.notification.title, notification.data.notification.body);
        //     else
        //         this.dropDownAlertRef.alertWithType('success', notification.notification.title, notification.notification.body);

        // }
      }
    });

    this.notificationOpen = messaging().onNotificationOpenedApp(
      (notificationOpen) => {
        // const notification = notificationOpen.notification;
        // this.showAlert("hi1", "hello1");
        var data = null;

        if (Platform.OS == "android") {
          data = notificationOpen.notification;
        } else {
          data = notificationOpen.notification;
        }

        // var noti = data.title.split("#");
        // //  alert("back")
        // var data = {
        //     orderid: noti[1].trim(),
        //     onload: this.onload()
        // }
        //this.props.navigation.navigate("OrderDetail", data)
        //  this.navi_redirect(noti[1].trim())
        this.props.navigation.navigate("Orders");
      }
    );

    this.backgroundNotification = messaging().setBackgroundMessageHandler(
      async (notificationOpen) => {
        var data = null;
        if (Platform.OS == "android") {
          data = notificationOpen.notification;
        } else {
          data = notificationOpen.notification;
        }

        // var noti = data.title.split("#");
        // //  alert("back")
        // var data = {
        //     orderid: noti[1].trim(),
        //     onload: this.onload()
        // }
        // this.props.navigation.navigate("OrderDetail", data)
        this.props.navigation.navigate("Orders");
      }
    );
    this.initialNotification = messaging()
      .getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          var data = null;

          if (Platform.OS == "android") {
            data = notificationOpen.notification;
          } else {
            data = notificationOpen.notification;
          }

          // var noti = data.title.split("#");
          // console.log("noti", noti[1].trim())
          // //  alert("back")
          // var data = {
          //     orderid: noti[1].trim(),
          //     onload: this.onload()
          // }
          //this.props.navigation.navigate("OrderDetail", data)
          this.props.navigation.navigate("Orders");
        }
      });
  };
  _onTap = (data) => {
    // console.log("ontap", data)
    // var noti = data.title.split("#");
    // console.log("noti", noti[1].trim())
    this.navi_redirect();
  };
  navi_redirect = async () => {
    // alert(order_id)
    // var data = {
    //     orderid: order_id,
    //     onload: this.onload()
    // }
    //  this.props.navigation.navigate("OrderDetail", data)
    this.props.navigation.navigate("Orders");
  };


  saveinDraft = () => {
    const s = this.state;
    var data = {
      product_title: s.product_title,
      mastercat: s.mastercat,
      sub1_str: s.sub1_str,
      sub2_str: s.sub2_str,
      searchtag: s.searchtag,
      product_desc: s.product_desc,
      quantity: s.quantity,
      price: s.price,
      cost: s.cost,
      supplier_str: s.supplier_str,
      location_str: s.location_str,
      unit_str: s.unit_str,
      size_str: s.size_str,
      color_str: s.color_str,
      // sku: s.sku,
      image_1: s.image_1,
      image_2: s.image_2,
      image_3: s.image_3,
      image_4: s.image_4,
      barcode: "",
    };
    this.store_user_data(data).then(() => {
      this.props.navigation.navigate("Dashboard");
    });
  }

  notSaveinDraft = () => {

    var data = {
      product_title: "",
      mastercat: "",
      sub1_str: "",
      sub2_str: "",
      searchtag: "",
      product_desc: "",
      quantity: "0",
      price: "",
      cost: "",
      supplier_str: "",
      location_str: "",
      unit_str: "",
      size_str: "",
      color_str: "",
      sku: "",
      barcode: "",
      listingid: "",
      image_1: null,
      image_2: null,
      image_3: null,
      image_4: null,
    };
    this.store_user_data(data).then(() => {
      this.props.navigation.navigate("Dashboard");
    });
  }


  onBackPress = () => {
    const labels = this.props.label;
    this.setState({ visibleBackOverlay: true })

    return true;
  };

  store_user_data = async (data) => {
    try {
      await AsyncStorage.setItem("inventory_data", JSON.stringify(data));
    } catch (e) {
      // saving error
    }
  };

  get_user_data = async () => {
    const user_data = await AsyncStorage.getItem("user_data");

    var response = JSON.parse(user_data);
    return response;
  };

  get_inventory_data = async () => {
    const user_data = await AsyncStorage.getItem("inventory_data");

    var response = JSON.parse(user_data);
    return response;
  };

  select_images = () => {
    this.setState({ isVisible: true }, () => { });
  };

  async handleCamera(pos) {
    try {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);

      if (
        results[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        "granted" &&
        results[PermissionsAndroid.PERMISSIONS.CAMERA] === "granted"
      ) {
        ImagePicker.openCamera({
          isCamera: true,
          compressQuality: 20,
          maxSize: 4,
          compressImageQuality: 0.3,
          aspectRatioX: 1,
          aspectRatioY: 1,
          height: 1200,
          width: 1200,
          cropping: true,
          minCompressSize: 800,
        })
          .then((images) => {
            var obj = {
              name: "image_" + pos + ".jpg",
              isset: 0,
              type: images.mime,
              uri:
                Platform.OS == "android"
                  ? images.path
                  : images.path.replace("", "file://"),
              size: images.size,
            };
            switch (pos) {
              case 1:
                this.setState({ image_1: obj });
                break;
              case 2:
                this.setState({ image_2: obj });
                break;
              case 3:
                this.setState({ image_3: obj });
                break;
              case 4:
                this.setState({ image_4: obj });
                break;
            }
            this.setState({ isVisible: false });
          })
          .catch((e) => console.log(e));
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  _image_method = (pos) => {
    if (this.state.iscamera == true) {
      Platform.OS == "android"
        ? this.handleCamera(pos)
        : ImagePicker.openCamera({
          isCamera: true,
          compressQuality: 20,
          maxSize: 4,
          compressImageQuality: 0.5,
          aspectRatioX: 1,
          aspectRatioY: 1,
          cropping: true,
          height: 1200,
          width: 1200,
          minCompressSize: 800,
        })
          .then((images) => {
            var obj = {
              name: "image_" + pos + ".jpg",
              isset: 0,
              type: images.mime,
              uri:
                Platform.OS == "android"
                  ? images.path
                  : images.path.replace("", "file://"),
              size: images.size,
            };
            switch (pos) {
              case 1:
                this.setState({ image_1: obj });
                break;
              case 2:
                this.setState({ image_2: obj });
                break;
              case 3:
                this.setState({ image_3: obj });
                break;
              case 4:
                this.setState({ image_4: obj });
                break;
            }
            this.setState({ isVisible: false });
          })
          .catch((e) => console.log(e));
    } else {
      ImagePicker.openPicker({
        isCamera: true,
        compressImageQuality: 0.5,
        compressQuality: 20,
        maxSize: 4,
        height: 1200,
        width: 1200,
        aspectRatioX: 1,
        aspectRatioY: 1,
        cropping: true,
        minCompressSize: 800,
      })
        .then((images) => {
          var obj = {
            name: "image_" + pos + ".jpg",
            isset: 0,
            type: images.mime,
            uri:
              Platform.OS == "android"
                ? images.path
                : images.path.replace("", "file://"),
            size: images.size,
          };
          switch (pos) {
            case 1:
              this.setState({ image_1: obj });
              break;
            case 2:
              this.setState({ image_2: obj });
              break;
            case 3:
              this.setState({ image_3: obj });
              break;
            case 4:
              this.setState({ image_4: obj });
              break;
          }
          this.setState({ isVisible: false });
        })
        .catch((e) => console.log(e));
    }
  };
  removeSelectedPicture = (e) => {
    var array = [...this.state.FrontImageSource]; // make a separate copy of the array

    var index = array.indexOf(e);

    if (e !== -1) {
      array.splice(e, 1);
      this.setState({ FrontImageSource: array });
    }
  };
  toggleOverlay = () => {
    this.setState({ masterOverlay: false, addmaster: false });
  };

  // overlay functions start
  showMasterOverLay = () => {
    this.setState({ masterOverlay: true }, () => {
      var data = {
        do: "GetCategories",
        userid: this.state.user_data.UserId,
        suball: 1,
      };

      this.props.getMaterCat(data).then(() => {
        if (
          this.props.masterCat.data.ResponseMsg == "Records Successfully Fetch"
        ) {
          this.setState(
            { masterCat: this.props.masterCat.data.CatData.split(",") },
            () => {
              this.setState({ iscatloading: false });
            }
          );
        } else {
          this.setState({ iscatloading: false });
        }
        // if (array != null) {
        //     array.map((i, v) => {

        //     })
        // }
      });
    });
  };
  showSub1OverLay = () => {
    if (this.state.mastercat != "") {
      this.setState({ sub1Overlay: true }, () => {
        var data = {
          do: "GetSubCat",
          userid: this.state.user_data.UserId,
          suball: 1,
          mastercat: this.state.mastercat,
        };

        this.props.getsub1(data).then(() => {

          if (this.props.sub1.data.ResponseMsg !== "Record Empty") {
            this.setState(
              { sub1: this.props.sub1.data.CatData.split(",") },
              () => {
                this.setState({ issub1loading: false });
                if (this.state.sub1 != null) {
                  this.state.sub1.map((i, v) => { });
                }
              }
            );
          } else {
            this.setState({ issub1loading: false });
          }
        }).catch((ex) => {
          this.setState({ issub1loading: false });
        });
      });
    }
  };
  showSub2OverLay = () => {
    if (this.state.sub1_str != "" && this.state.mastercat != "") {
      this.setState({ sub2Overlay: true }, () => {
        var data = {
          do: "GetSubCat",
          userid: this.state.user_data.UserId,
          suball: 1,
          mastercat: this.state.mastercat,
          subcat_1: this.state.sub1_str,
        };

        this.props.getsub2(data).then(() => {
          if (this.props.sub1.data.ResponseMsg !== "Record Empty") {
            this.setState(
              { sub2: this.props.sub2.data.CatData.split(",") },
              () => {
                this.setState({ issub2loading: false });
                if (this.state.sub2 != null) {
                  this.state.sub2.map((i, v) => { });
                }
              }
            );
          } else {
            this.setState({ issub2loading: false });
          }
        }).catch((ex) => {
          this.setState({ issub2loading: false });
        });
      })
    }
  };
  showSupplierOverLay = () => {
    this.setState({ supplierOverlay: true }, () => {
      var data = {
        do: "GetSupplier",
        userid: this.state.user_data.UserId,
        suball: 1,
        osname: Platform.OS === "android" ? "and" : "ios",
      };

      this.props.getsupplier(data).then(() => {
        if (
          this.props.supplier.data.ResponseMsg == "Records Successfully Fetch"
        ) {
          this.setState(
            { supplier: this.props.supplier.data.SupData.split(",") },
            () => {
              this.setState({ issupplierloading: false });
            }
          );
        } else {
          this.setState({ addsupplier: true });
        }
      });
    });
  };
  showLocationOverLay = () => {
    this.setState({ locationOverlay: true }, () => {
      var data = {
        do: "GetLocation",
        userid: this.state.user_data.UserId,
        suball: 1,
        osname: Platform.OS === "android" ? "and" : "ios",
      };

      this.props.getlocation(data).then(() => {
        if (
          this.props.location.data.ResponseMsg == "Records Successfully Fetch"
        ) {
          this.setState(
            { location: this.props.location.data.LocData.split(",") },
            () => {
              this.setState({ islocaitonloading: false });
            }
          );
        } else {
          this.setState({ addlocation: true });
        }
      });
    });
  };
  showSizeOverLay = () => {
    this.setState({ sizeOverlay: true }, () => {
      var data = {
        do: "GetSize",
        userid: this.state.user_data.UserId,
        suball: 1,
        osname: Platform.OS === "android" ? "and" : "ios",
      };

      this.props.getsize(data).then(() => {
        if (this.props.size.data.ResponseMsg == "Records Successfully Fetch") {
          this.setState(
            { size: this.props.size.data.SizData.split(",") },
            () => {
              this.setState({ issizeloading: false });
            }
          );
        } else {
          this.setState({ addsize: true });
        }
      });
    });
  };
  showColorOverLay = () => {
    this.setState({ colorOverlay: true }, () => {
      var data = {
        do: "GetColor",
        userid: this.state.user_data.UserId,
        suball: 1,
        osname: Platform.OS === "android" ? "and" : "ios",
      };

      this.props.getcolor(data).then(() => {
        if (this.props.color.data.ResponseMsg == "Records Successfully Fetch") {
          this.setState(
            { color: this.props.color.data.ColData.split(",") },
            () => {
              this.setState({ iscolorloading: false });
            }
          );
        } else {
          this.setState({ addcolor: true });
        }
      });
    });
  };
  showUnitOverLay = () => {
    this.setState({ unitOverlay: true }, () => {
      var data = {
        do: "GetUnit",
        userid: this.state.user_data.UserId,
        suball: 1,
        osname: Platform.OS === "android" ? "and" : "ios",
      };

      this.props.getunit(data).then(() => {
        if (this.props.unit.data.ResponseMsg == "Records Successfully Fetch") {
          this.setState(
            { unit: this.props.unit.data.UntData.split(",") },
            () => {
              this.setState({ isunitloading: false });
            }
          );
        } else {
          this.setState({ addunit: true });
        }
      });
    });
  };
  togglesub1 = () => {
    this.setState({ sub1Overlay: false, addsub1: false });
  };
  togglesub2 = () => {
    this.setState({ sub2Overlay: false, addsub2: false });
  };
  togglesupplier = () => {
    this.setState({ supplierOverlay: false, addsupplier: false });
  };
  togglelocation = () => {
    this.setState({ locationOverlay: false, addlocation: false });
  };
  togglesize = () => {
    this.setState({ sizeOverlay: false, addsize: false });
  };
  togglecolor = () => {
    this.setState({ colorOverlay: false, addcolor: false });
  };
  toggleunit = () => {
    this.setState({ unitOverlay: false, addunit: false });
  };
  togglebarcode = () => {
    this.setState({ barcodeoverlay: false });
  };

  // overlay functions end

  addcatagory = (type) => {
    var data = null;
    var isvalid = true;
    switch (type) {
      case 1:
        if (isFieldEmpty(this.state.mastercat) == true) {
          isvalid = false;
        } else {
          data = {
            do: "CreateCategory",
            userid: this.state.user_data.UserId,
            osname: Platform.OS === "android" ? "and" : "ios",
            mastercat: this.state.mastercat,
          };
        }

        break;
      case 2:
        if (isFieldEmpty(this.state.sub1_str) == true) {
          isvalid = false;
        } else {
          data = {
            do: "SetSubCat",
            userid: this.state.user_data.UserId,
            osname: Platform.OS === "android" ? "and" : "ios",
            mastercat: this.state.mastercat,
            subcat_1: this.state.sub1_str,
          };
        }
        break;
      case 3:
        if (isFieldEmpty(this.state.sub2_str) == true) {
          isvalid = false;
        } else {
          data = {
            do: "SetSubCat",
            userid: this.state.user_data.UserId,
            osname: Platform.OS === "android" ? "and" : "ios",
            mastercat: this.state.mastercat,
            subcat_1: this.state.sub1_str,
            subcat_2: this.state.sub2_str,
          };
        }
        break;
      case 4:
        if (isFieldEmpty(this.state.supplier_str) == true) {
          isvalid = false;
        } else {
          data = {
            do: "SetSupplier",
            userid: this.state.user_data.UserId,
            osname: Platform.OS === "android" ? "and" : "ios",
            supplier: this.state.supplier_str,
          };
        }
        break;
      case 5:
        if (isFieldEmpty(this.state.location_str) == true) {
          isvalid = false;
        } else {
          data = {
            do: "SetLocation",
            userid: this.state.user_data.UserId,
            osname: Platform.OS === "android" ? "and" : "ios",
            location: this.state.location_str,
          };
        }
        break;
      case 6:
        if (isFieldEmpty(this.state.size_str) == true) {
          isvalid = false;
        } else {
          data = {
            do: "SetSize",
            userid: this.state.user_data.UserId,
            osname: Platform.OS === "android" ? "and" : "ios",
            size: this.state.size_str,
          };
        }
        break;
      case 7:
        if (isFieldEmpty(this.state.color_str) == true) {
          isvalid = false;
        } else {
          data = {
            do: "SetColor",
            userid: this.state.user_data.UserId,
            osname: Platform.OS === "android" ? "and" : "ios",
            color: this.state.color_str,
          };
        }
        break;
      case 8:
        if (isFieldEmpty(this.state.unit_str) == true) {
          isvalid = false;
        } else {
          data = {
            do: "SetUnit",
            userid: this.state.user_data.UserId,
            osname: Platform.OS === "android" ? "and" : "ios",
            unit: this.state.unit_str,
          };
        }
        break;
    }
    if (isvalid == true) {
      this.props.addcat(data).then(() => {
        if (this.props.addcatdata.data.ResponseCode == "1") {
          switch (type) {
            case 1:
              this.setState({ masterOverlay: false, addmaster: false });
              break;
            case 2:
              this.setState({ sub1Overlay: false, addsub1: false });
              break;
            case 3:
              this.setState({ sub2Overlay: false, addsub2: false });
              break;
            case 4:
              this.setState({ supplierOverlay: false, addsupplier: false });
              break;
            case 5:
              this.setState({ locationOverlay: false, addlocation: false });
              break;
            case 6:
              this.setState({ sizeOverlay: false, addsize: false });
              break;
            case 7:
              this.setState({ colorOverlay: false, addcolor: false });
              break;
            case 8:
              this.setState({ unitOverlay: false, addunit: false });
              break;
          }
        }
      });
    }
  };

  deleteCatagory(cat, type) {
    var data = null;

    switch (type) {
      case 1:
        data = {
          do: "deleteCategory",
          userid: this.state.user_data.UserId,
          osname: Platform.OS === "android" ? "and" : "ios",
          mastercat: cat,
          catagory: cat,
        };

        break;
      case 2:
        data = {
          do: "deleteCategory",
          userid: this.state.user_data.UserId,
          osname: Platform.OS === "android" ? "and" : "ios",
          mastercat: this.state.mastercat,
          subcat_1: cat,
          catagory: cat,
        };
        break;
      case 3:
        data = {
          do: "deleteCategory",
          userid: this.state.user_data.UserId,
          osname: Platform.OS === "android" ? "and" : "ios",
          mastercat: this.state.mastercat,
          subcat_1: this.state.subcat_1,
          subcat_2: cat,
          catagory: cat,
        };
        break;
      case 4:
        data = {
          do: "DelSupplier",
          userid: this.state.user_data.UserId,
          osname: Platform.OS === "android" ? "and" : "ios",
          supplier: cat,
        };
        break;
      case 5:
        data = {
          do: "DelLocation",
          userid: this.state.user_data.UserId,
          osname: Platform.OS === "android" ? "and" : "ios",
          location: cat,
        };
        break;
      case 6:
        data = {
          do: "DelSize",
          userid: this.state.user_data.UserId,
          osname: Platform.OS === "android" ? "and" : "ios",
          supplier: cat,
        };
        break;
      case 7:
        data = {
          do: "DelColor",
          userid: this.state.user_data.UserId,
          osname: Platform.OS === "android" ? "and" : "ios",
          supplier: cat,
        };
        break;
      case 8:
        data = {
          do: "DelUnit",
          userid: this.state.user_data.UserId,
          osname: Platform.OS === "android" ? "and" : "ios",
          supplier: cat,
        };
        break;
    }

    this.props.delcat(data).then(() => {
      switch (type) {
        case 1:
          var data = {
            do: "GetCategories",
            userid: this.state.user_data.UserId,
            suball: 1,
          };

          this.props.getMaterCat(data).then(() => {

            if (
              this.props.masterCat.data.ResponseMsg ==
              "Records Successfully Fetch"
            ) {
              this.setState(
                { masterCat: this.props.masterCat.data.CatData.split(",") },
                () => {
                  this.setState({ iscatloading: false });
                }
              );
            } else {
              this.setState({ addmaster: true, iscatloading: false });
            }
            // if (array != null) {
            //     array.map((i, v) => {

            //     })
            // }
          });
          //  this.setState({ masterOverlay: false })
          break;
        case 2:
          var data = {
            do: "GetSubCat",
            userid: this.state.user_data.UserId,
            suball: 1,
            mastercat: this.state.mastercat,
          };

          this.props.getsub1(data).then(() => {
            this.setState(
              { sub1: this.props.sub1.data.CatData.split(",") },
              () => {
                this.setState({ issub1loading: false });
                if (this.state.sub1 != null) {
                  this.state.sub1.map((i, v) => { });
                }
              }
            );
          });

          //this.setState({ sub1Overlay: false })
          break;
        case 3:
          var data = {
            do: "GetSubCat",
            userid: this.state.user_data.UserId,
            suball: 1,
            mastercat: this.state.mastercat,
            subcat_1: this.state.sub1_str,
          };

          this.props.getsub2(data).then(() => {
            this.setState(
              { sub2: this.props.sub2.data.CatData.split(",") },
              () => {
                this.setState({ issub2loading: false });
                if (this.state.sub2 != null) {
                  this.state.sub2.map((i, v) => { });
                }
              }
            );
          });
          //  this.setState({ sub2Overlay: false })
          break;
        case 4:
          var data = {
            do: "GetSupplier",
            userid: this.state.user_data.UserId,
            suball: 1,
            osname: Platform.OS === "android" ? "and" : "ios",
          };

          this.props.getsupplier(data).then(() => {
            if (
              this.props.supplier.data.ResponseMsg ==
              "Records Successfully Fetch"
            ) {
              this.setState(
                { supplier: this.props.supplier.data.SupData.split(",") },
                () => {
                  this.setState({ issupplierloading: false });
                }
              );
            } else {
              this.setState({ addsupplier: true });
            }
          });
          //  this.setState({ supplierOverlay: false })
          break;
        case 5:
          var data = {
            do: "GetLocation",
            userid: this.state.user_data.UserId,
            suball: 1,
            osname: Platform.OS === "android" ? "and" : "ios",
          };

          this.props.getlocation(data).then(() => {
            if (
              this.props.location.data.ResponseMsg ==
              "Records Successfully Fetch"
            ) {
              this.setState(
                { location: this.props.location.data.LocData.split(",") },
                () => {
                  this.setState({ islocaitonloading: false });
                }
              );
            } else {
              this.setState({ addlocation: true });
            }
          });
          // this.setState({ locationOverlay: false })
          break;
        case 6:
          var data = {
            do: "GetSize",
            userid: this.state.user_data.UserId,
            suball: 1,
            osname: Platform.OS === "android" ? "and" : "ios",
          };

          this.props.getsize(data).then(() => {
            if (
              this.props.size.data.ResponseMsg == "Records Successfully Fetch"
            ) {
              this.setState(
                { size: this.props.size.data.SizData.split(",") },
                () => {
                  this.setState({ issizeloading: false });
                }
              );
            } else {
              this.setState({ addsize: true });
            }
          });
          // this.setState({ sizeOverlay: false })
          break;
        case 7:
          var data = {
            do: "GetColor",
            userid: this.state.user_data.UserId,
            suball: 1,
            osname: Platform.OS === "android" ? "and" : "ios",
          };

          this.props.getcolor(data).then(() => {
            if (
              this.props.color.data.ResponseMsg == "Records Successfully Fetch"
            ) {
              this.setState(
                { color: this.props.color.data.ColData.split(",") },
                () => {
                  this.setState({ iscolorloading: false });
                }
              );
            } else {
              this.setState({ addcolor: true });
            }
          });
          // this.setState({ color: false })
          break;
        case 8:
          var data = {
            do: "GetUnit",
            userid: this.state.user_data.UserId,
            suball: 1,
            osname: Platform.OS === "android" ? "and" : "ios",
          };

          this.props.getunit(data).then(() => {
            if (
              this.props.unit.data.ResponseMsg == "Records Successfully Fetch"
            ) {
              this.setState(
                { unit: this.props.unit.data.UntData.split(",") },
                () => {
                  this.setState({ isunitloading: false });
                }
              );
            } else {
              this.setState({ addunit: true });
            }
          });
          //this.setState({ unitOverlay: false })
          break;
      }
    });
  }

  copyInventory = () => {
    var stockdata = {
      do: "GenerateStockNumber",
      username: this.state.user_data.UserName,
      userid: this.state.user_data.UserId,
      listype: 1,
      osname: Platform.OS === "ios" ? "ios" : "and",
    };
    this.props.generatestockid(stockdata).then(() => {
      const s = this.state;
      this.setState({
        listingid: "",
        sku: "",
        product_title: s.product_title,
        mastercat: s.mastercat,
        sub1_str: s.sub1_str,
        sub2_str: s.sub2_str,
        searchtag: s.searchtag,
        product_desc: s.product_desc,
        quantity: s.quantity,
        price: s.price,
        cost: s.cost,
        supplier_str: s.supplier_str,
        location_str: s.location_str,
        unit_str: s.unit_str,
        size_str: s.size_str,
        color_str: s.color_str,
        image_1: s.image_1,
        image_2: s.image_2,
        image_3: s.image_3,
        image_4: s.image_4,
        barcode: "",
      });
      this.onPressTouch();
    });
  };

  addnewinventory = () => {
    var stockdata = {
      do: "GenerateStockNumber",
      username: this.state.user_data.UserName,
      userid: this.state.user_data.UserId,
      listype: 1,
      osname: Platform.OS === "ios" ? "ios" : "and",
    };
    //this.props.generatestockid(stockdata).then(() => {

    this.setState(
      {
        listingid: "",
        product_title: "",
        mastercat: "",
        sub1_str: "",
        sub2_str: "",
        searchtag: "",
        product_desc: "",
        quantity: "0",
        price: "",
        cost: "",
        supplier_str: "",
        location_str: "",
        unit_str: "",
        size_str: "",
        color_str: "",
        sku: "",
        barcode: "",
        FrontImageSource: [],
        image_1: null,
        image_2: null,
        image_3: null,
        image_4: null,
      },
      () => {
        this.onPressTouch();
      }
    );
    // })
  };

  saveinventory = () => {
    const labels = this.props.label;
    var isValid = [];
    this.setState({ issubmit: true }, () => {
      if (isFieldEmpty(this.state.product_title) == true) {
        isValid.push(false);
        this.setState({ error_product_title: labels.error_product_title });
      } else {
        isValid.push(true);
        this.setState({ error_product_title: "" });
      }

      if (isFieldEmpty(this.state.mastercat) == true) {
        isValid.push(false);
        this.setState({ error_mastercat: labels.error_mastercat });
      } else {
        isValid.push(true);
        this.setState({ error_mastercat: "" });
      }

      if (isFieldEmpty(this.state.product_desc) == true) {
        isValid.push(false);
        this.setState({ error_product_desc: labels.error_product_desc });
      } else {
        isValid.push(true);
        this.setState({ error_product_desc: "" });
      }
      if (isValid.includes(false) != true) {
        const s = this.state;
        var data = {
          do: "BackgroundInsert",
          barcode: s.barcode,
          prod_title: capitalize(s.product_title),
          maincat: s.mastercat,
          subcat_1: s.sub1_str,
          subcat_2: s.sub2_str,
          tags: capitalize(s.searchtag),
          desc: capitalize(s.product_desc),
          qty: s.quantity,
          supplier: s.supplier_str,
          location: s.location_str,
          price: s.price,
          unit: s.unit_str,
          cost: s.cost,
          pvt_notes: "",
          size: s.size_str,
          color: s.color_str,
          // listingid: this.props.stockid.data.listingid,
          listype: "1",
          username: s.user_data.UserName,
          userid: s.user_data.UserId,
          image_1: s.image_1,
          image_2: s.image_2,
          image_3: s.image_3,
          image_4: s.image_4,
        };

        this.props.insert_inventory(data).then(() => {
          if (this.props.insertinventory.data.ResponseCode == "1") {
            this.setState({ issubmit: false }, () => {
              var dashdata = {
                do: "GetDash",
                userid: this.state.user_data.UserId,
              };
              var getstockdata = {
                do: "GetOutStk",
                userid: this.state.user_data.UserId,
              };
              this.props.getDahboarddata(dashdata);
              this.props.getoustckdata(getstockdata);
              this.setState({ lastinsertedListingid: this.props.insertinventory.data.listingid })
              setTimeout(() => {
                this.setState({ onSuccess: true })
                // Alert.alert(
                //   "",
                //   `${labels.inventoryaddmsg} ${this.props.insertinventory.data.listingid
                //   }`,
                //   [
                //     {
                //       text: labels.alert_imdone,
                //       onPress: () => {
                //         this.props.navigation.navigate("Dashboard");
                //       },
                //     },
                //     {
                //       text: labels.alert_new,
                //       onPress: () => {
                //         this.addnewinventory();
                //       },
                //     },
                //     {
                //       text: labels.alert_copy,
                //       onPress: () => {
                //         this.copyInventory();
                //       },
                //     },
                //   ],
                //   { cancelable: false }
                // );
              }, 200);

            });
          } else {
            this.setState({ issubmit: false }, () => {
              alert("Something went wrong");
            });
          }
        });
      } else {
        this.onPressTouch();
        this.setState({ issubmit: false });
      }
    });
  };
  onPressTouch = () => {
    this.ListView_Ref.scrollToOffset({ offset: 0, animated: true });
  };
  dummy = () => { };
  render() {
    if (this.state.isloading) {
      return (
        <ImageBackground
          source={require("../../assets/bg-SKY.jpg")}
          style={{
            width: "100%",
            height: "100%",

            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <ActivityIndicator size="large" />
        </ImageBackground>
      );
    } else {
      const labels = this.props.label;

      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ImageBackground
            source={require("../../assets/bg-SKY.jpg")}
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
            imageStyle={{
              resizeMode: "cover",
              height: Platform.OS === "android" ? 480 : 550,
            }}
          >
            <View style={{ backgroundColor: "#fff", height: "100%" }}>





              <FlatList
                ref={(ref) => {
                  this.ListView_Ref = ref;
                }}
                keyboardShouldPersistTaps="always"
                data={[{ key: 1 }]}
                keyExtractor={(_, index) => index.toString()}
                stickyHeaderIndices={[0]}
                ListHeaderComponent={() => {
                  return (
                    <ImageBackground
                      source={require("../../assets/bg-SKY.jpg")}
                      style={{
                        overflow: "hidden",
                      }}
                      imageStyle={{
                        resizeMode: "cover",
                        height: Platform.OS === "android" ? 480 : 550, // the image height
                      }}
                    >
                      <HeaderBar
                        navigation={this.props.navigation}
                        user_data={this.state.user_data}
                        isback={true}
                        onBackPress={this.onBackPress}
                      />
                    </ImageBackground>
                  );
                }}
                renderItem={({ item, index }) => {
                  return (
                    <View style={style.container}>
                      <View
                        style={{
                          width: "100%",
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                          {labels.add_product}
                        </Text>
                      </View>
                      <Button
                        title={
                          this.state.barcode != ""
                            ? labels.placeholder_barcode_attached
                            : labels.placeholder_attachbacode
                        }
                        titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                        icon={
                          <View style={{ marginRight: 10 }}>
                            <AntIcon name="scan1" size={25} color="white" />
                          </View>
                        }
                        containerStyle={{ width: "100%", marginBottom: 15 }}
                        onPress={() => {
                          this.setState({ barcodeoverlay: true });
                        }}
                      />

                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.title_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_producttitle}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.title_textinput = input;
                          }}
                          value={this.state.product_title}
                          style={[
                            style.drop,
                            style.extrainput,
                            {
                              borderBottomColor:
                                this.state.error_product_title != ""
                                  ? "red"
                                  : "#b4b4b4",
                            },
                          ]}
                          onChangeText={(text) =>
                            this.setState({ product_title: text })
                          }
                          multiline={false}
                          autoCapitalize="words"
                        />
                      </View>

                      <TouchableWithoutFeedback
                        onPress={() => {
                          // Keyboard.dismiss
                          this.showMasterOverLay();
                        }}
                      >
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_master_cat}
                          </Text>

                          <View
                            style={[
                              style.drop,
                              {
                                borderBottomColor:
                                  this.state.error_mastercat != ""
                                    ? "red"
                                    : "#b4b4b4",
                              },
                            ]}
                          >

                            <Text style={style.selected}>
                              {this.state.mastercat}
                            </Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>

                      <TouchableWithoutFeedback
                        onPress={() => {
                          // Keyboard.dismiss
                          this.showSub1OverLay();
                        }}
                      >
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_subcat1}
                          </Text>

                          <View style={[style.drop]}>
                            <Text style={style.selected}>

                              {this.state.sub1_str}
                            </Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>

                      <TouchableWithoutFeedback
                        onPress={() => {
                          // Keyboard.dismiss
                          this.showSub2OverLay();
                        }}
                      >
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_subcat2}
                          </Text>

                          <View style={style.drop}>
                            <Text style={style.selected}>
                              {this.state.sub2_str}
                            </Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>

                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.search_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_searchtag}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.search_textinput = input;
                          }}
                          style={[style.drop, style.extrainput]}
                          value={this.state.searchtag}
                          autoCapitalize="words"
                          onChangeText={(text) =>
                            this.setState({ searchtag: text })
                          }
                        />
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.desc_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_desc}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.desc_textinput = input;
                          }}
                          value={this.state.product_desc}
                          onChangeText={(text) =>
                            this.setState({ product_desc: text })
                          }
                          autoCapitalize="sentences"
                          style={[
                            style.drop,
                            style.extrainput,
                            { height: 100 },
                            {
                              borderBottomColor:
                                this.state.error_product_desc != ""
                                  ? "red"
                                  : "#b4b4b4",
                            },
                          ]}
                          multiline={true}
                        />
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.qty_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_quantity}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.qty_textinput = input;
                          }}
                          style={[style.drop, style.extrainput]}
                          keyboardType="numeric"
                          onFocus={() => {
                            this.setState({ quantity: "" });
                          }}
                          value={this.state.quantity}
                          onChangeText={(text) =>
                            this.setState({ quantity: text })
                          }
                          errorText={this.state.error_password}
                        />
                      </View>

                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.price_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_price}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.price_textinput = input;
                          }}
                          style={[style.drop, style.extrainput]}
                          keyboardType="numeric"
                          inputContainerStyle={{
                            height: 40,
                            marginBottom: -10,
                          }}
                          value={this.state.price}
                          onChangeText={(text) =>
                            this.setState({ price: text })
                          }
                          errorText={this.state.error_password}
                        />
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.cost_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_cost}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.cost_textinput = input;
                          }}
                          value={this.state.cost}
                          style={[style.drop, style.extrainput]}
                          keyboardType="numeric"
                          inputContainerStyle={{
                            height: 40,
                            marginBottom: -10,
                          }}
                          onChangeText={(text) => this.setState({ cost: text })}
                        />
                      </View>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.showSupplierOverLay();
                        }}
                      >
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_supplier}
                          </Text>

                          <View style={style.drop}>
                            <Text style={style.selected}>
                              {this.state.supplier_str}
                            </Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>

                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.showLocationOverLay();
                        }}
                      >
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_location}
                          </Text>

                          <View style={style.drop}>
                            <Text style={style.selected}>
                              {this.state.location_str}
                            </Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>

                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.showSizeOverLay();
                        }}
                      >
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_size}
                          </Text>

                          <View style={style.drop}>
                            <Text style={style.selected}>
                              {this.state.size_str}
                            </Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.showColorOverLay();
                        }}
                      >
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_color}
                          </Text>

                          <View style={style.drop}>
                            <Text style={style.selected}>
                              {this.state.color_str}
                            </Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>

                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.showUnitOverLay();
                        }}
                      >
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_unit}
                          </Text>

                          <View style={style.drop}>
                            <Text style={style.selected}>
                              {this.state.unit_str}
                            </Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>

                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.sku_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_sku}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.sku_textinput = input;
                          }}
                          value={this.state.sku}
                          style={[style.drop, style.extrainput]}
                          inputContainerStyle={{
                            height: 40,
                            marginBottom: -10,
                          }}
                          onChangeText={(text) => this.setState({ sku: text })} //multiline={true}
                          autoCapitalize="sentences"
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          width: "100%",
                          marginTop: 10,
                        }}
                      >
                        <View
                          style={{
                            width: "48%",
                            marginRight: Dimensions.get("window").width / 100,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              Keyboard.dismiss();
                              this.setState({ position: 1 }, () => {
                                this.select_images();
                              });
                            }}
                            style={style.imgcon}
                          >
                            {this.state.image_1 != null ? (
                              <View>
                                <TouchableOpacity
                                  style={{
                                    zIndex: 999999,
                                    position: "absolute",
                                    right: 2,
                                    top: 2,
                                  }}
                                  onPress={() => {
                                    this.setState({ image_1: null });
                                  }}
                                >
                                  <Icon
                                    name="times"
                                    size={16}
                                    color={"#848484"}
                                  />
                                </TouchableOpacity>
                                <Image
                                  style={{ width: "100%", height: "100%" }}
                                  resizeMode="cover"
                                  source={{ uri: this.state.image_1.uri }}
                                />
                              </View>
                            ) : (
                              <Image
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="contain"
                                source={require("../../assets/pic.jpg")}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            width: "48%",
                            marginLeft: Dimensions.get("screen").width / 100,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              Keyboard.dismiss();
                              this.setState({ position: 2 }, () => {
                                this.select_images();
                              });
                            }}
                            style={style.imgcon}
                          >
                            {this.state.image_2 != null ? (
                              <View>
                                <TouchableOpacity
                                  style={{
                                    zIndex: 999999,
                                    position: "absolute",
                                    right: 2,
                                    top: 2,
                                  }}
                                  onPress={() => {
                                    this.setState({ image_2: null });
                                  }}
                                >
                                  <Icon
                                    name="times"
                                    size={16}
                                    color={"#848484"}
                                  />
                                </TouchableOpacity>
                                <Image
                                  style={{ width: "100%", height: "100%" }}
                                  resizeMode="cover"
                                  source={{ uri: this.state.image_2.uri }}
                                />
                              </View>
                            ) : (
                              <Image
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="contain"
                                source={require("../../assets/pic.jpg")}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          width: "100%",
                        }}
                      >
                        <View
                          style={{
                            width: "48%",
                            marginRight: Dimensions.get("window").width / 100,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              Keyboard.dismiss();
                              this.setState({ position: 3 }, () => {
                                this.select_images();
                              });
                            }}
                            style={style.imgcon}
                          >
                            {this.state.image_3 != null ? (
                              <View>
                                <TouchableOpacity
                                  style={{
                                    zIndex: 999999,
                                    position: "absolute",
                                    right: 2,
                                    top: 2,
                                  }}
                                  onPress={() => {
                                    this.setState({ image_3: null });
                                  }}
                                >
                                  <Icon
                                    name="times"
                                    size={16}
                                    color={"#848484"}
                                  />
                                </TouchableOpacity>
                                <Image
                                  style={{ width: "100%", height: "100%" }}
                                  resizeMode="cover"
                                  source={{ uri: this.state.image_3.uri }}
                                />
                              </View>
                            ) : (
                              <Image
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="contain"
                                source={require("../../assets/pic.jpg")}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            width: "48%",
                            marginLeft: Dimensions.get("screen").width / 100,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              Keyboard.dismiss();
                              this.setState({ position: 4 }, () => {
                                this.select_images();
                              });
                            }}
                            style={style.imgcon}
                          >
                            {this.state.image_4 != null ? (
                              <View>
                                <TouchableOpacity
                                  style={{
                                    zIndex: 999999,
                                    position: "absolute",
                                    right: 2,
                                    top: 2,
                                  }}
                                  onPress={() => {
                                    this.setState({ image_4: null });
                                  }}
                                >
                                  <Icon
                                    name="times"
                                    size={16}
                                    color={"#848484"}
                                  />
                                </TouchableOpacity>
                                <Image
                                  style={{ width: "100%", height: "100%" }}
                                  resizeMode="cover"
                                  source={{ uri: this.state.image_4.uri }}
                                />
                              </View>
                            ) : (
                              <Image
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="contain"
                                source={require("../../assets/pic.jpg")}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>


                      <Button
                        onPress={() => {
                          this.saveinventory();
                        }}
                        titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                        buttonStyle={{
                          backgroundColor: "green",
                          marginTop: 15,
                          marginBottom: 10,
                        }}
                        title={labels.addinvetory}
                      />

                      {objectLength(this.state.FrontImageSource) > 0 ? (
                        <FlatList
                          data={this.state.FrontImageSource}
                          renderItem={({ item, index }) => (
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "column",
                                margin: 1,
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  zIndex: 999999,
                                  position: "absolute",
                                  right: 2,
                                  top: 2,
                                }}
                                onPress={() =>
                                  this.removeSelectedPicture(index)
                                }
                              >
                                <Icon
                                  name="times"
                                  size={16}
                                  color={"#848484"}
                                />
                              </TouchableOpacity>
                              <Image
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 100,
                                }}
                                source={{ uri: item.uri }}
                              />
                            </View>
                          )}
                          //Setting the number of column
                          numColumns={4}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      ) : null}

                      {/* Master catagory overlay */}
                      <Overlay
                        overlayStyle={{
                          width: "70%",
                          padding: 10,
                          maxHeight: 450,
                        }}
                        isVisible={this.state.masterOverlay}
                        onBackdropPress={this.toggleOverlay}
                      >
                        <ScrollView keyboardShouldPersistTaps={"always"}>
                          {this.state.addmaster == true ? (
                            <>
                              <View style={{ marginBottom: 10, width: "100%" }}>
                                <TextInput
                                  value={this.state.mastercat_text}
                                  style={[
                                    style.drop,
                                    style.extrainput,
                                    { marginRight: 0 },
                                  ]}
                                  placeholder={labels.placeholder_master_cat}
                                  onChangeText={(text) =>
                                    this.setState({
                                      mastercat: text,
                                      mastercat_text: text
                                    })
                                  }
                                />
                                <View style={style.addbtn}>
                                  <Button
                                    onPress={() => {
                                      this.addcatagory(1);
                                      this.setState({ mastercat_text: '' })
                                    }}
                                    title={labels.label_add}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                  />
                                  <Button
                                    onPress={() => {
                                      this.setState({
                                        mastercat: "",
                                        masterOverlay: false,
                                        addmaster: false,
                                      });
                                    }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}

                                    title={labels.label_cancel}
                                  />
                                </View>
                              </View>
                            </>
                          ) : this.state.iscatloading == true ? (
                            <View style={{ margin: 10 }}>
                              <ActivityIndicator size="small" />
                            </View>
                          ) : (
                            <Grid>

                              {
                                objectLength(this.state.masterCat) != 0 &&
                                <Row style={{
                                  borderBottomColor: '#ccc',
                                  borderBottomWidth: 1,
                                  paddingBottom: 10,
                                }}>
                                  <Col>
                                    <Text style={{ textAlign: 'center' }}>{labels.mastercategories}</Text>
                                  </Col>
                                </Row>
                              }
                              {objectLength(this.state.masterCat) != 0
                                &&

                                this.state.masterCat.map((v, i) => {
                                  if (v != "")
                                    return (
                                      <Row style={{ margin: 5 }}>
                                        <Col
                                          size={8}
                                          onPress={() => {
                                            this.setState({
                                              mastercat: v,
                                              masterOverlay: false,
                                            });
                                          }}
                                        >
                                          <Text>{v}</Text>
                                        </Col>
                                        <Col
                                          size={2}
                                          onPress={() => {
                                            this.deleteCatagory(v, 1);
                                          }}
                                        >
                                          <Text
                                            style={{ textAlign: "right" }}
                                          >
                                            <EviIcon
                                              name="trash"
                                              size={20}
                                              color="red"
                                            />
                                          </Text>
                                        </Col>
                                      </Row>
                                    );
                                })
                              }
                            </Grid>
                          )}
                        </ScrollView>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.state.addmaster == true ? null : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ addmaster: true });
                              }}
                              style={style.btnadd}
                            >
                              <Icon name="plus" color="#fff" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </Overlay>

                      {/* sub1 catagory overlay */}
                      <Overlay
                        overlayStyle={{
                          width: "70%",
                          padding: 10,
                          maxHeight: 450,
                        }}
                        isVisible={this.state.sub1Overlay}
                        onBackdropPress={this.togglesub1}
                      >
                        <ScrollView keyboardShouldPersistTaps={"always"}>
                          {this.state.addsub1 == true ? (
                            <>
                              <View style={{ marginBottom: 10 }}>
                                <TextInput
                                  style={[
                                    style.drop,
                                    style.extrainput,
                                    { marginRight: 0 },
                                  ]}
                                  value={this.state.text}
                                  placeholder={labels.placeholder_subcat1}
                                  onChangeText={(text) =>
                                    this.setState({ sub1_str: text })
                                  }
                                  errorText={this.state.error_password}
                                />

                                <View style={style.addbtn}>
                                  <Button
                                    onPress={() => {
                                      this.addcatagory(2);
                                    }}
                                    title={labels.label_add}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                  />
                                  <Button
                                    onPress={() => {
                                      this.setState({
                                        sub1_str: "",
                                        sub1Overlay: false,
                                        addsub1: false,
                                      });
                                    }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                    title={labels.label_cancel}
                                  />
                                </View>
                              </View>
                            </>
                          ) : this.state.issub1loading == true ? (
                            <View style={{ margin: 10 }}>
                              <ActivityIndicator size="small" />
                            </View>
                          ) : (
                            <Grid>
                              {objectLength(this.state.sub1) != 0
                                && this.state.sub1.map((v, i) => {
                                  if (v != "")
                                    return (
                                      <Row style={{ margin: 5 }}>
                                        <Col
                                          size={8}
                                          onPress={() => {
                                            this.setState({
                                              sub1_str: v,
                                              sub1Overlay: false,
                                            });
                                          }}
                                        >
                                          <Text>{v}</Text>
                                        </Col>
                                        <Col
                                          size={2}
                                          onPress={() => {
                                            this.deleteCatagory(v, 2);
                                          }}
                                        >
                                          <Text
                                            style={{ textAlign: "right" }}
                                          >
                                            <EviIcon
                                              name="trash"
                                              size={20}
                                              color="red"
                                            />
                                          </Text>
                                        </Col>
                                      </Row>
                                    );
                                })

                              }
                            </Grid>
                          )}
                        </ScrollView>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.state.addsub1 == true ? null : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ addsub1: true });
                              }}
                              style={style.btnadd}
                            >
                              <Icon name="plus" color="#fff" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </Overlay>

                      {/* sub2 catagory overlay */}
                      <Overlay
                        overlayStyle={{
                          width: "70%",
                          padding: 10,
                          maxHeight: 450,
                        }}
                        isVisible={this.state.sub2Overlay}
                        onBackdropPress={this.togglesub2}
                      >
                        <ScrollView keyboardShouldPersistTaps={"always"}>
                          {this.state.addsub2 == true ? (
                            <>
                              <View style={{ marginBottom: 10 }}>
                                <TextInput
                                  style={[
                                    style.drop,
                                    style.extrainput,
                                    { marginRight: 0 },
                                  ]}
                                  value={this.state.text}
                                  placeholder={labels.placeholder_subcat2}
                                  onChangeText={(text) =>
                                    this.setState({ sub2_str: text })
                                  }
                                  errorText={this.state.error_password}
                                />
                                <View style={style.addbtn}>
                                  <Button
                                    onPress={() => {
                                      this.addcatagory(3);
                                    }}
                                    title={labels.label_add}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                  />
                                  <Button
                                    onPress={() => {
                                      this.setState({
                                        sub2_str: "",
                                        sub2Overlay: false,
                                        addsub2: false,
                                      });
                                    }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                    title={labels.label_cancel}
                                  />
                                </View>
                              </View>
                            </>
                          ) : this.state.issub2loading == true ? (
                            <View style={{ margin: 10 }}>
                              <ActivityIndicator size="small" />
                            </View>
                          ) : (
                            <Grid>
                              {objectLength(this.state.sub2) != 0
                                && this.state.sub2.map((v, i) => {
                                  if (v != "")
                                    return (
                                      <Row style={{ margin: 5 }}>
                                        <Col
                                          size={8}
                                          onPress={() => {
                                            this.setState({
                                              sub2_str: v,
                                              sub2Overlay: false,
                                            });
                                          }}
                                        >
                                          <Text>{v}</Text>
                                        </Col>
                                        <Col
                                          size={2}
                                          onPress={() => {
                                            this.deleteCatagory(v, 3);
                                          }}
                                        >
                                          <Text
                                            style={{ textAlign: "right" }}
                                          >
                                            <EviIcon
                                              name="trash"
                                              size={20}
                                              color="red"
                                            />
                                          </Text>
                                        </Col>
                                      </Row>
                                    );
                                })
                              }
                            </Grid>
                          )}
                        </ScrollView>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.state.addsub2 == true ? null : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ addsub2: true });
                              }}
                              style={style.btnadd}
                            >
                              <Icon name="plus" color="#fff" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </Overlay>

                      {/* supplier  overlay */}
                      <Overlay
                        overlayStyle={{
                          width: "70%",
                          padding: 10,
                          maxHeight: 450,
                        }}
                        isVisible={this.state.supplierOverlay}
                        onBackdropPress={this.togglesupplier}
                      >
                        <ScrollView keyboardShouldPersistTaps={"always"}>
                          {this.state.addsupplier == true ? (
                            <>
                              <View style={{ marginBottom: 10 }}>
                                <TextInput
                                  value={this.state.text}
                                  style={[
                                    style.drop,
                                    style.extrainput,
                                    { marginRight: 0 },
                                  ]}
                                  placeholder={labels.placeholder_supplier}
                                  onChangeText={(text) =>
                                    this.setState({ supplier_str: text })
                                  }
                                  errorText={this.state.error_password}
                                />
                                <View style={style.addbtn}>
                                  <Button
                                    onPress={() => {
                                      this.addcatagory(4);
                                    }}
                                    title={labels.label_add}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                  />
                                  <Button
                                    onPress={() => {
                                      this.setState({
                                        supplier_str: "",
                                        supplierOverlay: false,
                                        addsupplier: false,
                                      });
                                    }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                    title={labels.label_cancel}
                                  />
                                </View>
                                {/* <Button
                                                        onPress={() => {
                                                            this.addcatagory(4)
                                                        }} title={labels.label_add} /> */}
                              </View>
                            </>
                          ) : this.state.issupplierloading == true ? (
                            <ActivityIndicator size="small" />
                          ) : (
                            <Grid>
                              {objectLength(this.state.supplier) != 0
                                ? this.state.supplier.map((v, i) => {
                                  if (v != "")
                                    return (
                                      <Row style={{ margin: 5 }}>
                                        <Col size={8}>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.setState({
                                                supplier_str: v,
                                                supplierOverlay: false,
                                              });
                                            }}
                                            style={{ width: "100%" }}
                                          >
                                            <Text>{v}</Text>
                                          </TouchableOpacity>
                                        </Col>
                                        <Col
                                          size={2}
                                          onPress={() => {
                                            this.deleteCatagory(v, 4);
                                          }}
                                        >
                                          <Text
                                            style={{ textAlign: "right" }}
                                          >
                                            <EviIcon
                                              name="trash"
                                              size={20}
                                              color="red"
                                            />
                                          </Text>
                                        </Col>
                                      </Row>
                                    );
                                })
                                : null}
                            </Grid>
                          )}
                        </ScrollView>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.state.addsupplier == true ? null : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ addsupplier: true });
                              }}
                              style={style.btnadd}
                            >
                              <Icon name="plus" color="#fff" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </Overlay>

                      {/* location overlay */}
                      <Overlay
                        overlayStyle={{
                          width: "70%",
                          padding: 10,
                          maxHeight: 450,
                        }}
                        isVisible={this.state.locationOverlay}
                        onBackdropPress={this.togglelocation}
                      >
                        <ScrollView keyboardShouldPersistTaps={"always"}>
                          {this.state.addlocation == true ? (
                            <>
                              {/* <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({ addsub2: false })
                                                    }}>
                                                    <Icon name="arrow-left" size={20} />
                                                </TouchableOpacity> */}
                              <View style={{ marginBottom: 10 }}>
                                <TextInput
                                  value={this.state.text}
                                  style={[
                                    style.drop,
                                    style.extrainput,
                                    { marginRight: 0 },
                                  ]}
                                  placeholder={labels.placeholder_location}
                                  onChangeText={(text) =>
                                    this.setState({ location_str: text })
                                  }
                                  errorText={this.state.error_password}
                                />
                                <View style={style.addbtn}>
                                  <Button
                                    onPress={() => {
                                      this.addcatagory(5);
                                    }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    title={labels.label_add}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                  />
                                  <Button
                                    onPress={() => {
                                      this.setState({
                                        location_str: "",
                                        locationOverlay: false,
                                        addlocation: false,
                                      });
                                    }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                    title={labels.label_cancel}
                                  />
                                </View>
                              </View>
                            </>
                          ) : this.state.islocaitonloading == true ? (
                            <View style={{ margin: 15 }}>
                              <ActivityIndicator size="small" />
                            </View>
                          ) : (
                            <Grid>
                              {objectLength(this.state.location) != 0
                                ? this.state.location.map((v, i) => {
                                  if (v != "")
                                    return (
                                      <Row style={{ margin: 5 }}>
                                        <Col size={8}>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.setState({
                                                location_str: v,
                                                locationOverlay: false,
                                              });
                                            }}
                                            style={{ width: "100%" }}
                                          >
                                            <Text>{v}</Text>
                                          </TouchableOpacity>
                                        </Col>
                                        <Col
                                          size={2}
                                          onPress={() => {
                                            this.deleteCatagory(v, 5);
                                          }}
                                        >
                                          <Text
                                            style={{ textAlign: "right" }}
                                          >
                                            <EviIcon
                                              name="trash"
                                              size={20}
                                              color="red"
                                            />
                                          </Text>
                                        </Col>
                                      </Row>
                                    );
                                })
                                : null}
                            </Grid>
                          )}
                        </ScrollView>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.state.addlocation == true ? null : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ addlocation: true });
                              }}
                              style={style.btnadd}
                            >
                              <Icon name="plus" color="#fff" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </Overlay>

                      {/* size overlay */}
                      <Overlay
                        overlayStyle={{
                          width: "70%",
                          padding: 10,
                          maxHeight: 450,
                        }}
                        isVisible={this.state.sizeOverlay}
                        onBackdropPress={this.togglesize}
                      >
                        <ScrollView keyboardShouldPersistTaps={"always"}>
                          {this.state.addsize == true ? (
                            <>
                              <View style={{ marginBottom: 10 }}>
                                <TextInput
                                  style={[
                                    style.drop,
                                    style.extrainput,
                                    { marginRight: 0 },
                                  ]}
                                  value={this.state.text}
                                  placeholder={labels.placeholder_size}
                                  onChangeText={(text) =>
                                    this.setState({ size_str: text })
                                  }
                                  errorText={this.state.error_password}
                                />
                                <View style={style.addbtn}>
                                  <Button
                                    onPress={() => {
                                      this.addcatagory(6);
                                    }}
                                    title={labels.label_add}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                  />
                                  <Button
                                    onPress={() => {
                                      this.setState({
                                        size_str: "",
                                        sizeOverlay: false,
                                        addsize: false,
                                      });
                                    }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                    title={labels.label_cancel}
                                  />
                                </View>
                              </View>
                            </>
                          ) : this.state.issizeloading == true ? (
                            <View style={{ margin: 15 }}>
                              <ActivityIndicator size="small" />
                            </View>
                          ) : (
                            <Grid>
                              {objectLength(this.state.size) != 0
                                ? this.state.size.map((v, i) => {
                                  if (v != "")
                                    return (
                                      <Row style={{ margin: 5 }}>
                                        <Col size={8}>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.setState({
                                                size_str: v,
                                                sizeOverlay: false,
                                              });
                                            }}
                                            style={{ width: "100%" }}
                                          >
                                            <Text>{v}</Text>
                                          </TouchableOpacity>
                                        </Col>
                                        <Col
                                          size={2}
                                          onPress={() => {
                                            this.deleteCatagory(v, 6);
                                          }}
                                        >
                                          <Text
                                            style={{ textAlign: "right" }}
                                          >
                                            <EviIcon
                                              name="trash"
                                              size={20}
                                              color="red"
                                            />
                                          </Text>
                                        </Col>
                                      </Row>
                                    );
                                })
                                : null}
                            </Grid>
                          )}
                        </ScrollView>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.state.addsize == true ? null : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ addsize: true });
                              }}
                              style={style.btnadd}
                            >
                              <Icon name="plus" color="#fff" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </Overlay>

                      {/* color overlay */}
                      <Overlay
                        overlayStyle={{
                          width: "70%",
                          padding: 10,
                          maxHeight: 450,
                        }}
                        isVisible={this.state.colorOverlay}
                        onBackdropPress={this.togglecolor}
                      >
                        <ScrollView keyboardShouldPersistTaps={"always"}>
                          {this.state.addcolor == true ? (
                            <>
                              <View style={{ marginBottom: 10 }}>
                                <TextInput
                                  style={[
                                    style.drop,
                                    style.extrainput,
                                    { marginRight: 0 },
                                  ]}
                                  value={this.state.text}
                                  placeholder={labels.placeholder_color}
                                  onChangeText={(text) =>
                                    this.setState({ color_str: text })
                                  }
                                  errorText={this.state.error_password}
                                />
                                <View style={style.addbtn}>
                                  <Button
                                    onPress={() => {
                                      this.addcatagory(7);
                                    }}
                                    title={labels.label_add}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                  />
                                  <Button
                                    onPress={() => {
                                      this.setState({
                                        color_str: "",
                                        colorOverlay: false,
                                        addcolor: false,
                                      });
                                    }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                    title={labels.label_cancel}
                                  />
                                </View>
                              </View>
                            </>
                          ) : this.state.iscolorloading == true ? (
                            <View style={{ margin: 15 }}>
                              <ActivityIndicator size="small" />
                            </View>
                          ) : (
                            <Grid>
                              {objectLength(this.state.color) != 0
                                ? this.state.color.map((v, i) => {
                                  if (v != "")
                                    return (
                                      <Row style={{ margin: 5 }}>
                                        <Col size={8}>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.setState({
                                                color_str: v,
                                                colorOverlay: false,
                                              });
                                            }}
                                            style={{ width: "100%" }}
                                          >
                                            <Text>{v}</Text>
                                          </TouchableOpacity>
                                        </Col>
                                        <Col
                                          size={2}
                                          onPress={() => {
                                            this.deleteCatagory(v, 7);
                                          }}
                                        >
                                          <Text
                                            style={{ textAlign: "right" }}
                                          >
                                            <EviIcon
                                              name="trash"
                                              size={20}
                                              color="red"
                                            />
                                          </Text>
                                        </Col>
                                      </Row>
                                    );
                                })
                                : null}
                            </Grid>
                          )}
                        </ScrollView>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.state.addcolor == true ? null : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ addcolor: true });
                              }}
                              style={style.btnadd}
                            >
                              <Icon name="plus" color="#fff" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </Overlay>

                      {/* unit overlay */}
                      <Overlay
                        overlayStyle={{
                          width: "70%",
                          padding: 10,
                          maxHeight: 450,
                        }}
                        isVisible={this.state.unitOverlay}
                        onBackdropPress={this.toggleunit}
                      >
                        <ScrollView keyboardShouldPersistTaps={"always"}>
                          {this.state.addunit == true ? (
                            <>
                              <View style={{ marginBottom: 10 }}>
                                <TextInput
                                  style={[
                                    style.drop,
                                    style.extrainput,
                                    { marginRight: 0 },
                                  ]}
                                  value={this.state.text}
                                  placeholder={labels.placeholder_unit}
                                  onChangeText={(text) =>
                                    this.setState({ unit_str: text })
                                  }
                                  errorText={this.state.error_password}
                                />
                                <View style={style.addbtn}>
                                  <Button
                                    onPress={() => {
                                      this.addcatagory(8);
                                    }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    title={labels.label_add}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                  />
                                  <Button
                                    onPress={() => {
                                      this.setState({
                                        unit_str: "",
                                        unitOverlay: false,
                                        addunit: false,
                                      });
                                    }}
                                    titleStyle={{ fontSize: labels.label_cancel === "Cancel" ? 16 : 13, }}
                                    containerStyle={{ width: "45%", margin: 5 }}
                                    title={labels.label_cancel}
                                  />
                                </View>
                              </View>
                            </>
                          ) : this.state.isunitloading == true ? (
                            <View style={{ margin: 15 }}>
                              <ActivityIndicator size="small" />
                            </View>
                          ) : (
                            <Grid>
                              {objectLength(this.state.unit) != 0
                                ? this.state.unit.map((v, i) => {
                                  if (v != "")
                                    return (
                                      <Row style={{ margin: 5 }}>
                                        <Col size={8}>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.setState({
                                                unit_str: v,
                                                unitOverlay: false,
                                              });
                                            }}
                                            style={{ width: "100%" }}
                                          >
                                            <Text>{v}</Text>
                                          </TouchableOpacity>
                                        </Col>
                                        <Col
                                          size={2}
                                          onPress={() => {
                                            this.deleteCatagory(v, 8);
                                          }}
                                        >
                                          <Text
                                            style={{ textAlign: "right" }}
                                          >
                                            <EviIcon
                                              name="trash"
                                              size={20}
                                              color="red"
                                            />
                                          </Text>
                                        </Col>
                                      </Row>
                                    );
                                })
                                : null}
                            </Grid>
                          )}
                        </ScrollView>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.state.addunit == true ? null : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ addunit: true });
                              }}
                              style={style.btnadd}
                            >
                              <Icon name="plus" color="#fff" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </Overlay>

                      {/* image picker option overlay */}
                      <Overlay
                        isVisible={this.state.isVisible}
                        containerStyle={{ height: 'auto' }}
                        overlayStyle={{
                          width: "70%",
                          borderRadius: 15,
                          paddingVertical: 10,
                          height: 'auto',
                          borderWidth: 0
                        }}
                        onBackdropPress={() => { this.setState({ isVisible: false }) }}
                      >
                        {/* <TouchableOpacity
                          style={{ position: "absolute", right: 5 }}
                          onPress={() => this.setState({ isVisible: false })}
                        >
                          <Icon name="times" size={18} />
                        </TouchableOpacity> */}

                        <View>

                          <TouchableOpacity onPress={() => {
                            this.setState({ iscamera: true }, () => {
                              this._image_method(this.state.position);
                            });
                          }} style={{ justifyContent: 'center', marginVertical: 5, alignItems: 'center', height: 30, }}>
                            <Text>{"From Camera"}</Text>
                          </TouchableOpacity>

                          <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

                          {/* <TouchableOpacity
                            style={style.cameraoption}
                            onPress={() => {
                              this.setState({ iscamera: true }, () => {
                                this._image_method(this.state.position);
                              });
                            }}
                          >


                            <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />
                            <Text style={{ textAlign: "center", fontSize: 16 }}>
                              {"From Camera"}
                            </Text>
                          </TouchableOpacity> */}


                          <TouchableOpacity onPress={() => {
                            this.setState({ iscamera: false }, () => {
                              this._image_method(this.state.position);
                            });
                          }} style={{ justifyContent: 'center', marginVertical: 5, alignItems: 'center', height: 30, }}>
                            <Text> From Library</Text>
                          </TouchableOpacity>

                          <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

                          <TouchableOpacity onPress={() => {
                            this.setState({ isVisible: false })

                          }} style={{
                            justifyContent: 'center',
                            borderRadius: 10,
                            marginTop: 5,
                            backgroundColor: '#43b0f0',
                            // marginVertical: 5,
                            alignItems: 'center',
                            height: 30,
                          }}>
                            <Text style={{ color: '#fff', fontSize: 20 }}>{labels.confirmoption3}</Text>
                          </TouchableOpacity>
                          {/* 
                          <TouchableOpacity
                            style={style.cameraoption}
                            onPress={() => {
                              this.setState({ iscamera: false }, () => {
                                this._image_method(this.state.position);
                              });
                            }}
                          >
                            <Text style={{ textAlign: "center", fontSize: 16 }}>
                              From Library
                            </Text>
                          </TouchableOpacity> */}

                        </View>
                      </Overlay>


                      <Overlay
                        overlayStyle={{
                          width: "70%",
                          paddingTop: 10,
                          paddingLeft: 10,
                        }}
                        isVisible={this.state.isbarcode}
                        onBackdropPress={this.togglebarcode}
                      >
                        <Text style={{ fontSize: 20 }}>Alert</Text>
                        <Text style={{ fontSize: 16 }}>
                          {labels.isexistbarcode}
                        </Text>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.setState({ isbarcode: false });
                          }}
                        >
                          <View
                            style={{
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                              margin: 10,
                              marginRight: 25,
                            }}
                          >
                            <Text>OK</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </Overlay>
                      <Overlay
                        overlayStyle={{
                          width: "100%",
                          padding: 10,
                          height: 450,
                          backgroundColor: "transparent",
                        }}
                        isVisible={this.state.barcodeoverlay}
                        onBackdropPress={this.togglebarcode}
                      >
                        <RNCamera
                          ref={(ref) => {
                            this.camera = ref;
                          }}
                          style={style.preview}
                          type={RNCamera.Constants.Type.back}
                          flashMode={RNCamera.Constants.FlashMode.torch}
                          androidCameraPermissionOptions={{
                            title: "Permission to use camera",
                            message:
                              "We need your permission to use your camera",
                            buttonPositive: "Ok",
                            buttonNegative: "Cancel",
                          }}
                          captureAudio={false}
                          onBarCodeRead={(barcodes) => {
                            var data = {
                              do: "searchByBarcode",
                              userid: this.state.user_data.UserId,
                              associates: 1,
                              barcode: barcodes.data,
                            };
                            this.props.checkbarcode(data).then(() => {

                              if (this.props.isbarcode.data.ResponseCode == 1) {
                                this.setState({ barcodeoverlay: false }, () => {
                                  //alert(labels.isexistbarcode)
                                  var data = {
                                    do: "GetShortDescription",
                                    osname:
                                      Platform.OS === "android" ? "and" : "ios",
                                    userid: this.state.user_data.UserId,
                                    maincat: "",
                                    subcat_1: "",
                                    subcat_2: "",
                                    tags: "",
                                    stock_no: "",
                                    listype: 1,
                                    associate: 1,
                                    sortby: 1,
                                    Current_Page: 0,
                                    barcode: barcodes.data,
                                    refeshMethod: this.dummy,
                                  };

                                  this.setState({ barcode: "" });
                                  this.props.navigation.navigate(
                                    "SearchResult",
                                    { data }
                                  );
                                });
                              } else {
                                this.setState(
                                  {
                                    barcode: barcodes.data,
                                    sku: barcodes.data,
                                    barcodeoverlay: false,
                                  },
                                  () => { }
                                );
                              }
                            });
                          }}
                        >
                          <BarcodeMask />
                        </RNCamera>
                      </Overlay>


                      <Overlay
                        containerStyle={{ height: 'auto' }}
                        overlayStyle={{
                          width: "70%",
                          borderRadius: 15,
                          paddingVertical: 10,
                          height: 'auto',
                          borderWidth: 0
                        }}
                        isVisible={this.state.onSuccess}
                        onBackdropPress={() => {
                          this.setState({ onSuccess: false })
                        }}
                      >
                        {/* here */}
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: 'auto', }}>
                          <Text style={{ fontSize: 16, textAlign: 'center' }}>{`${labels.inventoryaddmsg} ${this.state.lastinsertedListingid
                            }`}</Text>
                          <View style={{ marginTop: 15, width: '100%', height: 'auto', }}>

                            <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

                            <TouchableOpacity onPress={() => {
                              this.setState({ onSuccess: false })
                              this.props.navigation.navigate("Dashboard");
                              // this.saveinDraft()
                              
                            }} style={{ justifyContent: 'center', marginVertical: 5, alignItems: 'center', height: 30, }}>
                              <Text>{labels.alert_imdone}</Text>
                            </TouchableOpacity>

                            <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

                            <TouchableOpacity onPress={() => {
                              this.setState({ onSuccess: false })
                              this.addnewinventory()
                            }} style={{
                               justifyContent: 'center',
                                marginVertical: 5, 
                                alignItems: 'center', 
                                height: 30}}>
                              <Text>{labels.alert_new}</Text>
                            </TouchableOpacity>

                            <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />
                           
                            <TouchableOpacity onPress={() => {
                              this.setState({ onSuccess: false })
                              this.copyInventory()
                            }} style={{ justifyContent: 'center', marginVertical: 5, alignItems: 'center', height: 30, }}>
                              <Text>{ labels.alert_copy}</Text>
                            </TouchableOpacity>

                            <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

                           
                            <TouchableOpacity onPress={() => {
                              this.setState({ onSuccess: false })

                            }} style={{
                              justifyContent: 'center',
                              borderRadius: 10,
                              marginTop: 15,
                              backgroundColor: '#43b0f0',
                              marginVertical: 5,
                              alignItems: 'center',
                              height: 30,
                            }}>
                              <Text style={{ color: '#fff', fontSize: 20 }}>{labels.confirmoption3}</Text>
                            </TouchableOpacity>


                          </View>
                        </View>
                      </Overlay>



                      <Overlay
                        containerStyle={{ height: 'auto' }}
                        overlayStyle={{
                          width: "70%",
                          borderRadius: 15,
                          paddingVertical: 10,
                          height: 'auto',
                          borderWidth: 0
                        }}
                        isVisible={this.state.visibleBackOverlay}
                        onBackdropPress={() => {
                          this.setState({ visibleBackOverlay: false })
                        }}
                      >
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: 'auto', }}>
                          <Text style={{ fontSize: 16, textAlign: 'center' }}>{labels.confirmmsg}</Text>
                          <View style={{ marginTop: 15, width: '100%', height: 'auto', }}>

                            <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

                            <TouchableOpacity onPress={() => {
                              this.setState({ visibleBackOverlay: false })
                              // this.saveinDraft()
                              this.saveinventory();
                            }} style={{ justifyContent: 'center', marginVertical: 5, alignItems: 'center', height: 30, }}>
                              <Text>{labels.confirmoption1}</Text>
                            </TouchableOpacity>

                            <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

                            <TouchableOpacity onPress={() => {
                              this.setState({ visibleBackOverlay: false })
                              this.notSaveinDraft()
                            }} style={{ justifyContent: 'center', marginVertical: 5, alignItems: 'center', height: 30, }}>
                              <Text>{labels.confirmoption2}</Text>
                            </TouchableOpacity>

                            <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />


                            <TouchableOpacity onPress={() => {
                              this.setState({ visibleBackOverlay: false })

                            }} style={{
                              justifyContent: 'center',
                              borderRadius: 10,
                              marginTop: 15,
                              backgroundColor: '#43b0f0',
                              marginVertical: 5,
                              alignItems: 'center',
                              height: 30,
                            }}>
                              <Text style={{ color: '#fff', fontSize: 20 }}>{labels.confirmoption3}</Text>
                            </TouchableOpacity>


                          </View>
                        </View>
                      </Overlay>

                      <Overlay visible={this.state.issubmit}>
                        <ActivityIndicator />
                      </Overlay>
                    </View>
                  );
                }}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  this.onEndReachedCalledDuringMomentum = false;
                }}
              />
            </View>
          </ImageBackground>

          <DropdownAlert
            ref={(ref) => (this.dropDownAlertadd = ref)}
            containerStyle={style.content}
            showCancel={true}
            onCancel={this._onCancel}
            onTap={this._onTap}
            titleNumOfLines={2}
            messageNumOfLines={0}
            onClose={this._onClose}
            successImageSrc={require("../../assets/dropbox.png")}
            imageStyle={{
              height: 40,
              width: 40,
              borderRadius: 360,
            }}
          />
        </KeyboardAvoidingView>
      );
    }
  }
}

const style = StyleSheet.create({
  content: {
    backgroundColor: "green",
  },
  size: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 8,
  },
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
    height: "100%",
    backgroundColor: "#f6f6f6",
  },
  selected: {
    marginLeft: 0,
    fontSize: 16,
    marginTop: 15,
    color: "#0f3e53",
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
  },
  droptitle: {
    fontSize: 16,
    color: "#808080",
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
  },
  extrainput: {
    marginLeft: 0,
    height: 50,
    paddingLeft: 0,
    color: "#0f3e53",
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
    fontWeight: "500",
    fontSize: 16,
  },
  drop: {
    height: 50,
    borderBottomWidth: 1.5,
    borderBottomColor: "#b4b4b4",
    marginBottom: 25,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "flex-start",
  },
  addbtn: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: -10,
    justifyContent: "center",
    alignContent: "center",
  },
  input: {
    height: 70,
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cameraIcon: {
    margin: 5,
    height: 40,
    width: 40,
  },
  bottomOverlay: {
    position: "absolute",
    width: "100%",
    flex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cameraoption: {
    borderWidth: 1,
    borderColor: "#848484",
    margin: 5,
    width: "90%",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  imgcon: {
    width: "100%",
    height: 150,
    backgroundColor: "#848484",
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
  },
  preview: {
    height: "100%",
    width: "100%",
  },
  capture: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,

    margin: 20,
  },
  btnadd: {
    backgroundColor: "#5fafdd",
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    label: state.language.data,
    user_data: state.login,
    masterCat: state.masterCat,
    sub1: state.sub1,
    sub2: state.sub2,
    supplier: state.supplier,
    location: state.location,
    unit: state.unit,
    size: state.size,
    color: state.color,
    deletedcat: state.delcat,
    addcatdata: state.addcat,
    stockid: state.stockid,
    insertinventory: state.insertinventory,
    updatedinventory: state.summary,
    inventorybyid: state.inventorybyid,
    isbarcode: state.barcode,
  };
};

export default connect(
  mapStateToProps,
  {
    getMaterCat,
    getsub1,
    getsub2,
    getsupplier,
    getlocation,
    getunit,
    getsize,
    getcolor,
    delcat,
    addcat,
    generatestockid,
    insert_inventory,
    getDahboarddata,
    getoustckdata,
    checkbarcode,
  }
)(Inventory);
