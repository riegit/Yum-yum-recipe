import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";

import NavBar from "./components/NavBar/index";
import Jumbotron from "./components/Jumbotron/index";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
// import Recipe from "./components/Recipe";
import Home from "./components/Home";

class App extends Component {
  state = {
    username: "",
    password: "",
    auth: {
      userId: "",
      username: "",
      isAuthenticated: false
    }
  };

  componentWillMount() {
    axios.get("/auth/isAuthenticated").then(result => {
      const { userId, isAuthenticated, username } = result.data;
      this.setState({
        auth: {
          userId,
          isAuthenticated,
          username
        }
      });
    });
  }

  handleChange = event => {
    const { name, value } = event.target;
    // Set the state for the appropriate input field
    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    //call a sign In function
    const newUser = {
      username: this.state.username,
      password: this.state.password
    };
    this.setState({
      username: "",
      password: ""
    });
    const { name } = event.target;
    axios.post(name, newUser).then(data => {
      if (data.data.isAuthenticated) {
        const { userId, isAuthenticated, username } = data.data;
        this.setState({
          auth: {
            userId,
            isAuthenticated,
            username
          }
        });
      }
    });
  };

  handleLogout = event => {
    event.preventDefault();
    axios.get("/auth/logout").then(result => {
      this.setState({
        auth: {
          userId: "",
          username: "",
          isAuthenticated: false
        }
      });
    });
  };

  render() {
    const loggedIn = this.state.auth.isAuthenticated;
    return (
      <React.Fragment>
        <NavBar />
        <Jumbotron />

        <main className="maincontainer">
          <Router>
            <div>
              <Route
                exact
                path="/"
                render={() => {
                  if (loggedIn) {
                    return <Redirect to="/profile" />;
                  } else {
                    return (
                      <SignIn
                        handleChange={this.handleChange}
                        handleSubmit={this.handleSubmit}
                        email={this.state.email}
                        password={this.state.password}
                      />
                    );
                  }
                }}
              />
              <Route
                exact
                path="/signup"
                render={() => {
                  if (loggedIn) {
                    return <Redirect to="/profile" />;
                  } else {
                    return (
                      <SignUp
                        handleChange={this.handleChange}
                        handleSubmit={this.handleSubmit}
                        email={this.state.email}
                        password={this.state.password}
                      />
                    );
                  }
                }}
              />
              <Route
                exact
                path="/profile"
                render={() => {
                  if (!loggedIn) {
                    return <Redirect to="/" />;
                  } else {
                    return (
                      <Profile
                        handleLogout={this.handleLogout}
                        auth={this.state.auth}
                      />
                    );
                  }
                }}
              />
              <Route exact path="/home" component={Home} />
            </div>
          </Router>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
