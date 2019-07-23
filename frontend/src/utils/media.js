import config from 'app-config';

const captureMedia = async (config) => {
    return navigator.mediaDevices.getUserMedia(config);
};

export async function getLocalMedia() {
    return await captureMedia(config.localMedia);
}
