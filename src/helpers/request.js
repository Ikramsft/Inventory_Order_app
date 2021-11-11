import axios from "axios";
import { URL } from "../constants/api";
//const URL = URL;
export function post(params, type = 1) {
  return makeRequest("POST", params, type)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

export function get(params, type = 1) {
  return makeRequest("GET", params, type)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function put(params, type = 1) {
  return makeRequest("PUT", params, type)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function makeRequest(method, params, type) {
  try {
    if (type == 2) {
      let options = {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      };
      var formData = new FormData();
      for (let key in params) {
        formData.append(key, params[key]);
      }

      console.log("formData", formData)
      const resp = await fetch(
        "https://kizbin.com/AppService/purchase_subscription.php",
        {
          headers: {
            //'Accept': 'application/json',
            "Content-Type": "multipart/form-data",
          },
          method: "POST",
          body: formData,
        }
      );

      var data = await resp.json();

      return data;
    } else if (type == 3) {
      // let options = {
      //   method: method,
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "multipart/form-data",
      //   },
      // };
      var formData = new FormData();
      for (let key in params) {
        formData.append(key, params[key]);
      }


      const resp = await fetch(
        "https://kizbin.com/AppService/purchase_verify.php",
        {
          headers: {
            //'Accept': 'application/json',
            "Content-Type": "multipart/form-data",
          },
          method: "POST",
          body: formData,
        }
      );

      var data = await resp.json();

      return data;
    } else {
      let options = {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      };
      var formData = new FormData();

      for (let key in params) {
        if (key == "image_1") {
          if (params[key] != null) {
            if (params[key].isset == 0) formData.append("files[]", params[key]);
          }
        } else if (key == "image_2") {
          if (params[key] != null) {
            if (params[key].isset == 0) formData.append("files[]", params[key]);
          }
        } else if (key == "image_3") {
          if (params[key] != null) {
            if (params[key].isset == 0) formData.append("files[]", params[key]);
          }
        } else if (key == "image_4") {
          if (params[key] != null) {
            if (params[key].isset == 0) formData.append("files[]", params[key]);
          }
        } else {
          formData.append(key, params[key]);
        }
      }

      console.log("formData", formData)
      const resp = await fetch(URL, {
        headers: {
          //'Accept': 'application/json',
          "Content-Type": "multipart/form-data",
        },
        method: "POST",
        body: formData,
      });

      var data = await resp.json();

      return data;
    }
    // const response = axios({
    //   url: URL,
    //   method: 'POST',
    //   data: { do: "GetCountry" },
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'multipart/form-data',
    //     "Accept": "multipart/form-data",
    //   }
    // }).catch((ex) => {
    //   console.log(ex);
    //   throw ex;

    // });

    //return response;
  } catch (ex) { }
}

function queryParams(params) {
  let array_params = {};

  Object.keys(params).map(function (obj) {
    if (Array.isArray(params[obj])) {
      array_params = Object.assign(array_params, arrayParams(params, obj));
      delete params[obj];
    }
  });

  let new_params = Object.assign({}, params, array_params);

  return Object.keys(new_params)
    .map(function (k) {
      if (new_params[k] !== undefined && new_params[k] !== null) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(new_params[k]);
      }
    })
    .join("&");
}

function arrayParams(params, obj) {
  return Object.assign(
    {},
    ...Object.keys(params[obj]).map((key) => ({
      [obj + "[" + key + "]"]: params[obj][key],
    }))
  );
}
