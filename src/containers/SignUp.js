import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input } from "semantic-ui-react";
import { signupUser } from "../actions/auth";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { email, name, password } = this.state;

    this.props.signupUser({ email, name, password });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { email, password, name } = this.state;
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
            <label>Nombre</label>
            <Input
              name="name"
              placeholder="Nombre"
              onChange={this.handleChange}
              value={name}
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

        <Form.Button color="blue">Registrar</Form.Button>
      </Form>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

const mapDispatchToProps = { signupUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
