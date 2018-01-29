import * as ReadableAPIUtil from '../util/readable_api_util';

export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';
export const GET_CATEGORIES = 'GET_CATEGORIES';

export const receiveCategories = categories => ({
    type: RECEIVE_CATEGORIES,
    categories
});

export const fetchCategories = () => dispatch => (
    ReadableAPIUtil
        .fetchCategories()
        .then(categories => dispatch(receiveCategories(categories)))
);

export const getCategories = () => ({
    type: GET_CATEGORIES
});