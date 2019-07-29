export default {
    localMedia: {
        video: true,
        audio: true,
    },
    connection: {
        iceServers: [
            {
                url: 'turn:82.202.236.141:3478',
                credential: 'tah8uaP1',
                username: 'turnuser',
            },
            {
                url: 'stun:stun.1.google.com:19302',
            },
        ],
    }
};
