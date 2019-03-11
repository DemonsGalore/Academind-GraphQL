import React, { Component } from 'react';

import AuthContext from '../context/auth-context';

import './auth.css';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLogin: true,
      errors: {},
    };
  }

  static contextType = AuthContext;

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { email, password } = this.state;
    console.log("EMAIL", email);
    console.log("Password", password);

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      };
    }

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      console.log(resData);
      if (resData.data.login.token) {
        this.context.login(
          resData.data.login.userId,
          resData.data.login.token,
          resData.data.login.tokenExpiration,
        );
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  switchAuthMode = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin }
    })
  }

  render() {
    return (
      <form className="auth-form" noValidate onSubmit={this.onSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={this.state.email}
            onChange={this.onChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn">Submit</button>
          <button type="button" className="btn" onClick={this.switchAuthMode}>
            Switch to {this.state.isLogin ? 'SignUp' : 'SignIn'}
          </button>
        </div>
      </form>
    );
  }
}

export default Auth;
