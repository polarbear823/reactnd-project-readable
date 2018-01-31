import * as ReadableAPIUtil from '../util/readable_api_util';

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const RECEIVE_POST = 'RECEIVE_POST';
export const GET_POSTS = 'GET_POSTS';
export const ADD_POST = 'ADD_POST';
export const EDIT_POST = 'EDIT_POST';
export const DELETE_POST = 'DELETE_POST';
export const VOTE_POST = 'VOTE_POST';

export const receivePosts = posts => ({
    type: RECEIVE_POSTS,
    posts
});

export const receivePost = post => ({
    type: RECEIVE_POST,
    post
});

export const fetchPosts = () => dispatch => (
    ReadableAPIUtil
        .fetchPosts()
        .then(posts => dispatch(receivePosts(posts)))
);

export const fetchCategoryPosts = (category) => dispatch => (
    ReadableAPIUtil
        .fetchCategoryPosts(category)
        .then (categoryPosts => dispatch(receivePosts(categoryPosts)))
);

export const postNewPost = (newPost, sameCategory, callback) => dispatch => {
    ReadableAPIUtil
        .postNewPost(newPost)
        .then(() => callback())
        dispatch({type: ADD_POST, newPost, sameCategory});
};

export const editPost = (postId, content, callback) => dispatch => {
    ReadableAPIUtil
        .editPost(postId, content)
        .then(() => callback())
        dispatch({type: EDIT_POST, postId, content});
};

export const getPosts = () => ({
    type: GET_POSTS
});

export const deletePost = (postId, callback) => dispatch => {
    ReadableAPIUtil
        .deletePost(postId)
        .then(() => callback())
        dispatch({type: DELETE_POST, postId});
};

export const fetchPost =  (postId) => dispatch => (
    ReadableAPIUtil
        .fetchPost(postId)
        .then(post => dispatch(receivePost(post)))
);

export const votePost = (postId, option) => dispatch => (
    ReadableAPIUtil
        .votePost(postId, option)
        .then(post => dispatch({type: VOTE_POST, postId, option}))
);