import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';
import { Layout, Menu, Icon } from 'antd';
import PostsList from './PostsList';
import  PostDetail from './PostDetail';
import { fetchCategories } from '../actions/readable_actions';

const { Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

const Nav = (props) => (
  <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
      <div className="logo">
      <span><Icon type="book" /></span>
      <span> Readable</span>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']} defaultOpenKeys={['categories']}>
        <Menu.Item key="home">
          <Link to='/'>
            <Icon type="home" />
            <span className="nav-text">Home</span>
          </Link>
        </Menu.Item>
        <SubMenu
          key="categories"
          title={<span><Icon type="profile" /><span>Categories</span></span>}
        >
          {props.categories.map(category => {
            return(
            <Menu.Item key={category.name}><Link to={`/${category.path}`}>{category.name}</Link></Menu.Item>
          )})}
        </SubMenu>
      </Menu>
    </Sider>
);
class App extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchCategories());
  }
  render() {
    return (
      <div className="App">
        <Layout>
          <Nav categories={this.props.categories}/>
          <Layout style={{ marginLeft: 200, height: '100vh' }}>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
            <Route exact path='/' render={() => (
              <PostsList category=''/>
            )}/>
             <Route exact path="/:category" render={(props) => (
               <PostsList category={props.match.params.category}/>
            )} />
            <Route exact path="/:category/:postId" render={(props) => (
              <PostDetail postId={props.match.params.postId} history={this.props.history}/>
            )} />

            </div>
          </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  categories: state.categories
}))(App));
