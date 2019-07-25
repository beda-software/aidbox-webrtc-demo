import config from 'app-config';

const captureMedia = async (mediaOptions) => {
    return navigator.mediaDevices.getUserMedia(mediaOptions);
};

export async function getLocalMedia() {
    return await captureMedia(config.localMedia);
}
