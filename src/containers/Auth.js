import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Checkbox } from "semantic-ui-react";
import sha1 from "crypto-js/sha1";
import { loginUser, loginUserNoSession } from "../actions/auth";

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = { email: "", password: "", remember: false, session: true };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    let { email, password, session } = this.state;

    email = email.trim();
    password = sha1(password)
      .toString()
      .trim();
    console.log("session es ", session);
    if (session) {
      this.props.loginUser({ email, password });
    } else {
      this.props.loginUserNoSession({ email, password });
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { email, password, session } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Field>
            <label>Correo</label>
            <Input
              name="email"
              placeholder="Correo"
              onChange={this.handleChange}
              value={email}
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
