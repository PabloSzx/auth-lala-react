import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Grid, Label } from "semantic-ui-react";
import sha1 from "crypto-js/sha1";
import { loginUser } from "../actions";

export class AdminLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    let { username, password } = this.state;

    password = sha1(password).toString();

    this.props.loginUser({ email: username, password });

    this.setState({
      password: "",
    });
  }

  render() {
    const { username, password } = this.state;

    return (
      <Grid centered>
        <Grid.Row />
        <Grid.Row>
          <Form size="big" onSubmit={this.handleSubmit}>
            <Form.Field>
              <Label>Usuario</Label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={({ target: { value: username } }) =>
                  this.setState({ username })
                }
              />
            </Form.Field>
            <Form.Field>
              <Label>Contraseña</Label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={({ target: { value: password } }) =>
                  this.setState({ password })
                }
              />
            </Form.Field>

            <Form.Button size="big" color="blue">
              Login
            </Form.Button>
          </Form>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = { loginUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminLogin);
