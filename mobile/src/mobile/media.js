import _ from 'lodash';

import { mediaDevices } from 'react-native-webrtc';

const getUserMedia = async (options) => {
    const devices = await mediaDevices.enumerateDevices();
    const { deviceId: sourceId } = _.find(devices, {
        kind: "videoinput",
        facing: "front"
    });
    return await mediaDevices.getUserMedia({
        ...options,
        video: {
            facingMode: "user",
            optional: [{ sourceId }]
        }
    });
};

export default getUserMedia;
