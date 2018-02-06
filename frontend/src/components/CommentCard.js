import React, { Component } from 'react';
import { List, Button, Modal, Input } from 'antd';
import './App.css';
import { connect } from 'react-redux';
import { UPVOTE, DOWNVOTE } from '../util/constance_util';
import { editComment, deleteComment, voteComment } from '../actions/comments_actions';

const SHOW_CLASS = 'show-component';
const NOT_SHOW_CLASS = 'not-show-component';

class CommentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rate: props.comment.voteScore,
            commentBody: props.comment.body,
            showGiveRateButton: true,
            visible: false,
            confirmLoading: false
        };
    }

    onGiveRateClicked = () => {
        this.setState({showGiveRateButton: false});
    }

    onRateButtonClicked = (voteOption) => {
        if (voteOption === UPVOTE) {
            this.props.dispatch(voteComment(this.props.comment.id, UPVOTE));
            this.setState((prevState) => {
                return {
                    rate: prevState.rate + 1,
                    showGiveRateButton: true
                }
            });
        }
        if (voteOption === DOWNVOTE) {
            this.props.dispatch(voteComment(this.props.comment.id, DOWNVOTE));
            this.setState((prevState) => {
                return {
                    rate: prevState.rate - 1,
                    showGiveRateButton: true
                }
            });
        }
    }

    getShowHideClass = (show) => show ? SHOW_CLASS : NOT_SHOW_CLASS;

    handleOk = () => {
        this.setState({
            confirmLoading: true
        });
        const updatedComment = {
            body: this.state.commentBody,
            timestamp: Date.now()
        }
        this.props.dispatch(editComment(this.props.comment.id, updatedComment, () => {
            this.setState({
                visible: false,
                confirmLoading: false
            });
        }));
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    onDeleteButtonClicked = () => {
        this.props.dispatch(deleteComment(this.props.comment.id, () => {
            this.props.onDeleteComment();
        }));
    }

    onEditButtonClicked = () => {
        this.setState({
            visible: true,
        });
    }

    onChangeCommentBody = (e) => {
        this.setState({commentBody: e.target.value});
    }

    render() {
        return (
            <List.Item actions={[<Button shape="circle" icon="edit" onClick={this.onEditButtonClicked} />, <Button shape="circle" icon="delete" onClick={this.onDeleteButtonClicked}/>]}>
                <List.Item.Meta
                    title={this.props.comment.body}
                    description={`Author: ${this.props.comment.author} | vote score: ${this.state.rate === undefined ? 1 : this.state.rate}`}
                    style={{textAlign: "left"}}
                />
                <div className='give-rate-div'>
                    <Button icon="star-o" onClick={this.onGiveRateClicked} className={this.getShowHideClass(this.state.showGiveRateButton)}>Give rate</Button>
                    <div className={this.getShowHideClass(!this.state.showGiveRateButton)}>
                        <Button icon="like-o" onClick={() => this.onRateButtonClicked(UPVOTE)}>+1</Button>
                        {"  "}
                        <Button icon="dislike-o" onClick={() => this.onRateButtonClicked(DOWNVOTE)}>-1</Button>
                        <Modal title="Edit comment content"
                               visible={this.state.visible}
                               onOk={this.handleOk}
                               confirmLoading={this.state.confirmLoading}
                               onCancel={this.handleCancel}
                        >
                            <Input value={this.state.commentBody} onChange={this.onChangeCommentBody}/>
                        </Modal>
                    </div>
                </div>
            </List.Item>
        )
    }
}
export default connect((state, ownProps) => ({...ownProps}))(CommentCard);