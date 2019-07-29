import isReactNative from 'src/utils/platform';
import requestPermissions from 'src/mobile/permissions';

import config from 'src/app-config';

const captureMedia = async (mediaOptions) => {
    return navigator.mediaDevices.getUserMedia(mediaOptions);
};

export async function getLocalMedia() {
    if (isReactNative()) {
        return requestPermissions();
    };

    return await captureMedia(config.localMedia);
}
