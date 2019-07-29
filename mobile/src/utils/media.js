import isReactNative from 'src/utils/platform';
import requestPermissions from 'src/mobile/permissions';
import getUserMedia from 'src/mobile/media';

import config from 'src/app-config';

const captureMedia = async (mediaOptions) => {
    const mediaHandler = isReactNative()
        ? getUserMedia
        : navigator.mediaDevices.getUserMedia;

    return mediaHandler(mediaOptions);
};

export async function getLocalMedia() {
    if (isReactNative()) {
        requestPermissions();
    };

    return await captureMedia(config.localMedia);
}
