import * as ReadableAPIUtil from '../util/readable_api_util';

export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS';
export const EDIT_COMMENT = 'EDIT_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const VOTE_COMMENT = 'VOTE_COMMENT';
export const ADD_COMMENT = 'ADD_COMMENT';

export const fetchComments = postId => dispatch => (
    ReadableAPIUtil.fetchCommentsForPost(postId)
                    .then(comments => dispatch({type: RECEIVE_COMMENTS, comments}))
);

export const editComment = (commentId, content, callback) => dispatch => {
    ReadableAPIUtil.editComment(commentId, content)
                    .then(() => callback())
                    dispatch({type: EDIT_COMMENT, commentId, content});
};

export const deleteComment = (commentId, callback) => dispatch => {
    ReadableAPIUtil.deleteComment(commentId)
                    .then(() => callback())
                    dispatch({type: DELETE_COMMENT, commentId});
};

export const voteComment = (commentId, option) => dispatch => {
    ReadableAPIUtil.voteComment(commentId, option)
                    .then(comment => dispatch({type: VOTE_COMMENT, commentId, option}));
};

export const addComment = (newComment, callback) => dispatch => {
    ReadableAPIUtil.addComment(newComment)
                    .then(() => callback())
                    dispatch({type: ADD_COMMENT, newComment});
};