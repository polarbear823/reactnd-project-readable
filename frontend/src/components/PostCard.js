import React, { Component } from 'react';
import { List, Button } from 'antd';
import { Link } from 'react-router-dom';
import './App.css';
import { connect } from 'react-redux';
import { deletePost, votePost } from '../actions/posts_actions';
import AddPost from './AddPost';
import { UPVOTE, DOWNVOTE } from '../util/constance_util';

const SHOW_CLASS = 'show-component';
const NOT_SHOW_CLASS = 'not-show-component';

class PostCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showGiveRateButton: true,
            isAdd: false,
            isOpen: false
        };
    }

    onGiveRateClicked = () => {
        this.setState({showGiveRateButton: false});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.props = nextProps;
        }
    }

    onRateButtonClicked = (voteOption) => {
        if (voteOption === UPVOTE) {
            this.props.dispatch(votePost(this.props.post.id, UPVOTE));
        }
        if (voteOption === DOWNVOTE) {
            this.props.dispatch(votePost(this.props.post.id, DOWNVOTE));
        }
        this.setState({showGiveRateButton: true});
    }

    getShowHideClass = (show) => show ? SHOW_CLASS : NOT_SHOW_CLASS;

    onDeleteButtonClicked = () => {
        this.props.dispatch(deletePost(this.props.post.id, () => {}));
    }

    onEditButtonClicked = () => {
        this.setState({
            isAdd: false,
            isOpen: true,
        }); 
    }

    openOrCloseAddEditPostModal = (isAdd, isOpen, post) => {
        this.setState({
            isAdd,
            isOpen
        });       
    }

    render() {
        return (
            <List.Item actions={[<Button shape="circle" icon="edit" onClick={this.onEditButtonClicked} />, <Button shape="circle" icon="delete" onClick={this.onDeleteButtonClicked}/>]}>
                <List.Item.Meta
                    title={<Link to={`/${this.props.post.category}/${this.props.post.id}`}>{this.props.post.title}</Link>}
                    description={`Author: ${this.props.post.author} 
                    | comments: ${this.props.post.commentCount === undefined ? 0 : this.props.post.commentCount} 
                    | vote score: ${this.props.post.voteScore}`}
                />
                <div className='give-rate-div'>
                    <Button icon="star-o" onClick={this.onGiveRateClicked} className={this.getShowHideClass(this.state.showGiveRateButton)}>Give rate</Button>
                    <div className={this.getShowHideClass(!this.state.showGiveRateButton)}>
                        <Button icon="like-o" onClick={() => this.onRateButtonClicked(UPVOTE)}>+1</Button>
                        {"  "}
                        <Button icon="dislike-o" onClick={() => this.onRateButtonClicked(DOWNVOTE)}>-1</Button>
                        <AddPost isAdd={this.state.isAdd} post={this.props.post} isOpen={this.state.isOpen} changeAddPostState={this.openOrCloseAddEditPostModal}/>
                    </div>
                </div>
            </List.Item>
        )
    }
}
export default connect((state, ownProps) => ({posts: state.posts, ...ownProps}))(PostCard);