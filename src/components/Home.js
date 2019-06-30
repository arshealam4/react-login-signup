import React, { Component } from 'react';
import axios from 'axios';
import config from '../config/config'

class Home extends Component {

  constructor() {
    super()

    this.state = {
      users: [],
      msg: '',
      isError: false
    }

    this.logout = this.logout.bind(this);
  }
  
  showHideMsg(users){
    this.setState({
      isError: true,
      msg: users.data.msg || 'There is some issue, Please try again!'
    });
    setTimeout(() => {
      this.setState({
        isError: false,
      });
    }, 2000)
  }

  logout() {
    localStorage.clear();
    this.props.history.push("/login");
  }

  async getAllUsers() {
    let users;
    try {
      users = await axios.get(config.backendAPI + `/users/user-list`, {
        'headers': {
          'Authorization': JSON.parse(localStorage.getItem('user')).token
        }
      });

      if (users.data.success) {
        this.setState({
          users: users.data.result
        });
      } else {
        this.showHideMsg(users);
      }
    } catch(err) {
      this.showHideMsg(users);
    }
  }

  componentDidMount() {
    this.getAllUsers()
  }

  render() {
    return (
      <div>
        <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-default" type="button" onClick={this.logout}>Logout</button>
            </div>
          </div>

          <div className="container">
          <h2>Users</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {this.state.users.map((user, id) => {
                  return <tr key = {id}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.active ? 'true' : 'false'}</td>
                </tr>
                })}
              </tbody>
            </table>
        </div>

          {this.state.isError ? (<div className="alert alert-danger">
            <strong>ERROR!</strong> {this.state.msg}
          </div>) : (<i></i>) }
      </div>
    );
  }
}

export default Home;
