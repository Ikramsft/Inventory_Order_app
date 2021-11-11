/**
 * @format
 */
//global.PaymentRequest = require('react-native-payments').PaymentRequest;
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/Root';
import {name as appName} from './app.json';
import { typography } from './src/utility/typography'

typography()
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
