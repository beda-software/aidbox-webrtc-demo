import _ from 'lodash';
import uuidv4 from 'uuid';

export function createLogin() {
    return _.chain(uuidv4())
        .split('-', 1)
        .first()
        .value();
}
