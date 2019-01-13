import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Checkbox } from "semantic-ui-react";
import { loginUser, loginUserNoSession } from "../actions/auth";
class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = { username: "", password: "", remember: false, session: true };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { username, password, session } = this.state;

    console.log("session es ", session);
    if (session) {
      this.props.loginUser(username, password);
    } else {
      this.props.loginUserNoSession(username, password);
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { username, password, session } = this.state;
    const { auth } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Field>
            <label>Usuario</label>
            <Input
              name="username"
              placeholder="Usuario"
              onChange={this.handleChange}
              value={username}
            />
          </Form.Field>
          <Form.Field>
            <label>Contraseña</label>
            <Input
              name="password"
              type="password"
              placeholder="Contraseña"
              onChange={this.handleChange}
              value={password}
            />
          </Form.Field>
        </Form.Group>

        <Checkbox
          label="Mantenerse conectado"
          onChange={() => this.setState({ session: !session })}
          checked={session}
        />

        <Form.Button color="blue">Login</Form.Button>
      </Form>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth,
});

const mapDispatchToProps = { loginUser, loginUserNoSession };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
