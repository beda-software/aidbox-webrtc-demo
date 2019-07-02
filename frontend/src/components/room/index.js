import _ from 'lodash';
import uuidv4 from 'uuid';

export function createLogin() {
    return _.chain(uuidv4())
        .split('-', 1)
        .first()
        .value();
}

export function getRoomID() {
    return window.location.pathname === '/'
      ? uuidv4()
      : _.chain(window.location.pathname)
          .slice(1)
          .join('')
          .value()
}

export function initRoom (roomID) {
    window.history.replaceState(
        {},
        `Room: ${roomID}`,
        `/${roomID}`
    );
};
