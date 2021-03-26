import {LOGIN_USER, REGISTER_USER, AUTH_USER} from '../_.actions/types'
// import {REGISTER_USER} from '../_.actions/types'


export default function user(state = {}, action){
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload}
        case REGISTER_USER:
            return {...state, registerSuccess: action.payload}
        case AUTH_USER:
            return {...state, userData: action.payload}
        default:
            return state;
    }
}
