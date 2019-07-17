import config from 'app-config';

const captureMedia = async (config) => {
    return navigator.mediaDevices.getUserMedia(config);
};

export async function getLocalMedia() {
    const { localMedia } = config;
    return await captureMedia(localMedia);
};
