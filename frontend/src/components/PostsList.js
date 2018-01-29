import React, { Component } from 'react';
import { List, Menu, Dropdown, Button, Icon } from 'antd';
import { fetchPosts, fetchCategoryPosts } from "../actions/posts_actions";
import { connect } from 'react-redux';
import PostCard from "./PostCard";
import AddPost from "./AddPost";
import './App.css';

const DATE = 'date';
const SCORE = 'score';
class PostsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortBy: '',
            isAdd: true,
            isOpen: false,
            selectedPost: null
        }
    }
    componentDidMount() {
        this.getPosts(this.props.category);
        this.setState({posts: this.props.posts});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.category !== this.props.category) {
            this.getPosts(nextProps.category);
            this.setState({posts: nextProps.posts});
        }
    }

    getPosts = category => {
        const {dispatch} = this.props;
        if (category.length === 0 ) {
            dispatch(fetchPosts());
        } else {
            dispatch(fetchCategoryPosts(category));
        }
    }

    handleMenuClick = (e) => {
        if (e.key === DATE) {
            this.props.posts.sort((post, prevPost) => post.timestamp - prevPost.timestamp);
        } else if (e.key === SCORE) {
            this.props.posts.sort((post, prevPost) => post.voteScore - prevPost.voteScore);
        }
        this.setState({sortBy: e.key});
    }

    openOrCloseAddEditPostModal = (isAdd, isOpen, post) => {
        this.setState({
            isAdd,
            selectedPost: post,
            isOpen
        });       
    }

    getSortMenu = () => {
        return (
            <Menu onClick={this.handleMenuClick} selectedKeys={[this.state.sortBy]}>
                <Menu.Item key={DATE}>By Date</Menu.Item>
                <Menu.Item key={SCORE}>By Score</Menu.Item>
            </Menu>
        );
    }

    render() {
        return (
            <div className="post-list">
                <h3 style={{ marginBottom: 16, display: "inline-block" }}>{`Category: ${this.props.category ? this.props.category : 'all'}`}</h3>
                <div className="posts-buttons">
                    <Dropdown overlay={this.getSortMenu()} trigger={['click']}>
                        <Button style={{ marginRight: 8 }}>
                            Sort <Icon type="down" />
                        </Button>
                    </Dropdown>
                    <Button icon="file-add" onClick={() => this.openOrCloseAddEditPostModal(true, true, null)}>Add</Button>
                </div>
                <List
                itemLayout="horizontal"
                bordered
                dataSource={this.props.posts}
                renderItem={post => (<PostCard post={post}/>)}
                />
                <AddPost isAdd={this.state.isAdd} post={this.state.selectedPost} isOpen={this.state.isOpen} changeAddPostState={this.openOrCloseAddEditPostModal}/>
            </div> 
        );
    }
}
export default connect(state => ({
    posts: state.posts
  }))(PostsList);