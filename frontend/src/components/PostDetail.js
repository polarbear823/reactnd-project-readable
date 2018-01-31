import React, { Component } from 'react';
import { fetchPost, deletePost, votePost } from '../actions/posts_actions';
import { connect } from 'react-redux';
import {Card, Icon, List, Button, Form, Input, Alert} from 'antd';
import { UPVOTE, DOWNVOTE } from '../util/constance_util';
import AddPost from './AddPost';
import CommentCard from "./CommentCard";
import { fetchComments, addComment } from '../actions/comments_actions';
import { getGuid } from '../util/guid_utils';

const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentCount: 0,
            isAdd: false,
            isOpen: false,
            title: "",
            body: ""
        };
    }
    
    componentDidMount() {
        this.getPost(this.props.postId);
        this.getComments(this.props.postId);
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.setState({ title: nextProps.post.title, body: nextProps.post.body});
        }
        if (nextProps.commentCount !== this.props.commentCount){
            this.setState({commentCount: nextProps.post.commentCount});
        }
    }

    getPost = postId => {
        const {dispatch} = this.props;
        dispatch(fetchPost(postId));
    }

    getComments = postId => {
        this.props.dispatch(fetchComments(postId));
    }

    onDeleteClicked = () => {
        this.props.dispatch(deletePost(this.props.postId, () => {
            console.log(this.props);
            this.props.history.push('/');
        }));
    }

    onVoteClicked = (voteOption) => {
        this.props.dispatch(votePost(this.props.postId, voteOption));
    }

    openOrCloseAddEditPostModal = (isAdd, isOpen, post) => {
        this.setState({
            isAdd,
            title: post.title,
            body: post.body,
            isOpen
        });       
    }

    onEditButtonClicked = () => {
        this.setState({
            isAdd: false,
            isOpen: true,
        }); 
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            const newComment = {
                id: getGuid(),
                timestamp: Date.now(),
                body: values.commentBody,
                author: values.author,
                parentId: this.props.post.id
            }
            this.props.dispatch(addComment(newComment, () => {
                this.props.form.resetFields();
                this.props.form.validateFields();
                this.setState({commentCount: this.state.commentCount + 1});
            }));
          }
        });
    }

    onDeleteComment = () => {
        this.setState({commentCount: this.state.commentCount - 1});
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const authorError = isFieldTouched('author') && getFieldError('author');
        const commentBodyError = isFieldTouched('commentBody') && getFieldError('commentBody');
        if (this.props.post.id !== undefined) {
        return (
            <div>
                <Card title={this.state.title} 
                      actions={[<Icon type="like-o" onClick={() => this.onVoteClicked(UPVOTE)}/>, 
                                <Icon type="dislike-o" onClick={() => this.onVoteClicked(DOWNVOTE)}/>, 
                                <Icon type="edit" onClick={this.onEditButtonClicked}/>, 
                                <Icon type="delete" onClick={this.onDeleteClicked}/>]}>
                      <p>{this.state.body}</p>
                      <Card.Meta description={`author: ${this.props.post.author} | comments#: ${this.props.post.commentCount} | score: ${this.props.vote}`}
                                 style={{textAlign: "right"}}/>
                </Card>
                <AddPost isAdd={this.state.isAdd} post={this.props.post} isOpen={this.state.isOpen} changeAddPostState={this.openOrCloseAddEditPostModal}/>
                <div className="add-comment-button">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem
                            validateStatus={authorError ? 'error' : ''}
                            help={authorError || ''}
                        >
                            {getFieldDecorator('author', {
                                rules: [{ required: true, message: 'Please input author name!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="author" />
                            )}
                        </FormItem>
                        <FormItem
                            validateStatus={commentBodyError ? 'error' : ''}
                            help={commentBodyError || ''}
                        >
                            {getFieldDecorator('commentBody', {
                                rules: [{ required: true, message: 'Please input your comment content!' }],
                            })(
                                <Input placeholder="comment content" style={{ width: 600 }}/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={hasErrors(getFieldsError())}
                            >
                                Add
                            </Button>
                        </FormItem>
                    </Form> 
                </div>
                <List
                    itemLayout="horizontal"
                    bordered
                    dataSource={this.props.comments}
                    renderItem={comment => (<CommentCard comment={comment} onDeleteComment={this.onDeleteComment}/>)}
                />
            </div>
        )} else {
            return (<Alert
                message="404 Error"
                description="404 NOT FOUND!."
                type="error"
                showIcon
            />);
        }
    }
}
export default connect(state => ({
    post: state.post,
    vote: state.post.voteScore,
    comments: state.comments
  }))(Form.create()(PostDetail));