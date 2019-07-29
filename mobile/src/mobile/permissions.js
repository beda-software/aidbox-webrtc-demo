import _ from 'lodash';

import { Platform, PermissionsAndroid } from 'react-native';


const requestAndroidPermissions = async () => {
    try {
        const permissions = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ]);

        const granted = _.every(
            permissions,
            (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (granted) {
            console.log('Got all necessary permissions.');
        } else {
            console.log('Permissions denied.');
        }
    } catch (err) {
        console.warn(err);
    };
};

// permissions already declared (in info.plist)
const requestIOSPermissions = () => {};

const requestPermissions = () => {
    switch (Platform.OS) {
        case "android":
            requestAndroidPermissions();
            break;
        case "ios":
            requestIOSPermissions();
            break;
    }
}

export default requestPermissions;
