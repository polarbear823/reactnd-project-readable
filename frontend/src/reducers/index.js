import { combineReducers } from 'redux'
import {RECEIVE_CATEGORIES, GET_CATEGORIES} from '../actions/readable_actions';
import {RECEIVE_POSTS, GET_POSTS, ADD_POST, DELETE_POST, EDIT_POST, RECEIVE_POST, VOTE_POST} from '../actions/posts_actions';
import { RECEIVE_COMMENTS, EDIT_COMMENT, DELETE_COMMENT, VOTE_COMMENT, ADD_COMMENT } from '../actions/comments_actions';
import { UPVOTE, DOWNVOTE } from '../util/constance_util';

function categories (state = [], action) {
    switch (action.type) {
        case RECEIVE_CATEGORIES :
          return action.categories
        case GET_CATEGORIES :
            return state
        default :
        return state
    }
}

function posts (state = [], action) {
    switch (action.type) {
        case RECEIVE_POSTS :
          return action.posts
        case GET_POSTS :
          return state
        case ADD_POST :
          action.newPost.voteScore = 1;
          return state.concat(action.newPost)
        case EDIT_POST : 
          return state.map(post => {
              if (action.postId === post.id) {
                  post.title = action.content.title;
                  post.body = action.content.body;
              }
              return post;
          })
        case DELETE_POST : 
          return state.filter(post => post.id !== action.postId)
        default :
        return state
    }
}

function post (state = {}, action) {
    switch (action.type) {
        case RECEIVE_POST:
            return action.post
        case VOTE_POST:
            let updatedPost = state;
            if (action.postId === state.id) {
                if(action.option === UPVOTE) {
                    updatedPost.voteScore += 1;
                }
                if (action.option === DOWNVOTE) {
                    updatedPost.voteScore -= 1;
                }
            }
            return updatedPost   
        default:
            return state
    }
}

function comments(state = [], action) {
    switch (action.type) {
        case RECEIVE_COMMENTS:
            return action.comments
        case EDIT_COMMENT:
            return state.map(comment => {
                if (comment.id === action.commentId) {
                    comment.body = action.content.body;
                    comment.timestamp = action.content.timestamp;
                }
                return comment;
            })
        case DELETE_COMMENT:
            return state.filter(comment => comment.id !== action.commentId)
        case VOTE_COMMENT:
            return state.map(comment => {
                if (comment.id === action.commentId) {
                    if (action.option === UPVOTE) {                        
                        comment.voteScore += 1;
                    }
                    if (action.option === DOWNVOTE) {
                        comment.voteScore -= 1;
                    }
                }
                return comment;
            })
        case ADD_COMMENT:
            action.newComment.voteScore = 1;
            return state.concat(action.newComment)    
        default:
            return state;
    }
}
export default combineReducers({
    categories,
    posts,
    post,
    comments
  });
