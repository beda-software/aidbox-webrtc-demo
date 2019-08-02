import isReactNative from './platform';

import _ from 'lodash';
import uuidv4 from 'uuid';


function getRoomID() {
    if (!isReactNative()) {
        return window.location.pathname === '/'
        ? uuidv4()
        : _.chain(window.location.pathname)
            .slice(1)
            .join('')
            .value()
    }

    return uuidv4();
}

export function createLogin() {
    return _.chain(uuidv4())
        .split('-', 1)
        .first()
        .value();
}

export function createRoom() {
    const roomID = getRoomID();
    return roomID;
}
