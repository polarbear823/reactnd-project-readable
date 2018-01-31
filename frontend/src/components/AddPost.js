import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { connect } from 'react-redux';
import { postNewPost, editPost } from "../actions/posts_actions";
import { getGuid } from '../util/guid_utils';
import { withRouter } from 'react-router';

const FormItem = Form.Item;
const Option = Select.Option;

class AddPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            confirmLoading: false,
            post: null,
            isAdd: true
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isOpen: nextProps.isOpen,
            post: nextProps.post,
            isAdd: nextProps.isAdd
        });
        if (nextProps.isOpen !== this.state.isOpen) {
            this.props.form.resetFields();
        }
    }

    handleOk = () => {
        this.setState({
          confirmLoading: true
        });
        this.props.form.validateFields((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);
              if (this.state.isAdd) {
                const newPost = {
                    id: getGuid(),
                    timestamp: Date.now(),
                    title: values.title,
                    body: values.body,
                    author: values.author,
                    category: values.category
                }
                console.log(this.props.location);
                const sameCategory = this.props.location.pathname === `/${values.category}` || this.props.location.pathname === "/";
                this.props.dispatch(postNewPost(newPost, sameCategory, () => {
                    this.setState({
                        isOpen: false,
                        confirmLoading: false
                    });
                    this.props.changeAddPostState(this.state.isAdd, false, null);
                    if (!sameCategory){
                        this.props.history.push(`/${values.category}`);
                    }
                }));
              } else {
                  const updatedContent = {
                      title: values.title,
                      body: values.body
                  };
                  const postId = this.state.post.id;
                  let updatedPost = this.state.post;
                  updatedPost.title = values.title;
                  updatedPost.body = values.body;
                  this.props.dispatch(editPost(postId, updatedContent, () => {
                    this.setState({
                        isOpen: false,
                        confirmLoading: false
                    });
                    this.props.changeAddPostState(this.state.isAdd, false, updatedPost);
                  }));
              }
            }
          });
    }
    handleCancel = () => {
        this.setState({
            isOpen: false
        });
        if (this.state.isAdd){
            this.props.changeAddPostState(this.state.isAdd, false, null);
        }
        else{
            this.props.changeAddPostState(this.state.isAdd, false, this.state.post);

        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {post} = this.state;
        return (
            <Modal title={this.state.isAdd ? "Add post" : "Edit post"}
            visible={this.state.isOpen}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}>
                <Form>
                    <FormItem
                        label="Title"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 16 }}
                        >
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: 'Please input your title!' }],
                            initialValue: post === null ? "" : post.title
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label="Author"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 16 }}
                        >
                        {getFieldDecorator('author', {
                            rules: [{ required: true, message: 'Please input your name!' }],
                            initialValue: post === null ? "" : post.author
                        })(
                            <Input disabled={post !== null}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="Body"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator('body', {
                            rules: [{ required: true, message: 'Please input your post body!' }],
                            initialValue: post === null ? "" : post.body
                        })(
                            <Input.TextArea rows={10} />
                        )}
                    </FormItem>
                    <FormItem
                        label="Category"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator('category', {
                            rules: [{ required: true, message: 'Please select your category!' }],
                            initialValue: post === null ? "" : post.category
                        })(
                            <Select
                            placeholder="Select a category"
                            disabled={post !== null}
                            >
                            {this.props.categories.map(category => <Option value={category.path} key={category.path}>{category.name}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
export default withRouter(connect((state, ownProps) => ({
    categories: state.categories,
    ...ownProps
  }))(Form.create()(AddPost)));