import { reduce, cloneDeep } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Message } from "semantic-ui-react";
import validator, { trim } from "validator";
import sha1 from "crypto-js/sha1";
import { set } from "lodash/fp";
import { signupUser } from "../actions/auth";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      warning: false,
      success: false,
      error: false,
      begin: true,
      valid: {
        all: false,
        name: {
          length: false,
          alpha: false,
          all: false,
        },
        email: { all: false },
        password: {
          all: false,
          length: false,
          specialSymbol: false,
          lowercase: false,
          uppercase: false,
          number: false,
        },
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validatePassword(password = this.state.password) {
    const state = cloneDeep(this.state);

    const conditions = {
      length: () => validator.isLength(password, { min: 8, max: 100 }),
      specialSymbol: () =>
        validator.matches(password, /[~¡!$&+,:;=¿?@#|'<>.^*(){}"%-_]/),
      lowercase: () => validator.matches(password, /[a-z]/),
      uppercase: () => validator.matches(password, /[A-Z]/),
      number: () => validator.matches(password, /[0-9]/),
    };

    state.valid.password.all = reduce(
      conditions,
      (acum, value, key) => {
        const val = value();
        state.valid.password[key] = val;
        return acum && val;
      },
      true
    );

    return state;
  }

  validateEmail(email = this.state.email) {
    const state = cloneDeep(this.state);

    state.valid.email.all = validator.isEmail(email);

    return state;
  }

  validateName(name = this.state.name) {
    const state = cloneDeep(this.state);

    state.caca = "xd";

    const conditions = {
      length: () => validator.isLength(name, { min: 2, max: 50 }),
      alpha: () => validator.isAlpha(validator.blacklist(name, " "), "es-ES"),
    };

    state.valid.name.all = reduce(
      conditions,
      (acum, value, key) => {
        const val = value();
        state.valid.name[key] = val;
        return acum && val;
      },
      true
    );

    return state;
  }

  validateAll(chain = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject("Timeout error!"), 30000);
      if (chain) {
        this.setState(this.validatePassword(), () =>
          this.setState(this.validateEmail(), () =>
            this.setState(this.validateName(), () => {
              const { name, password, email } = this.state.valid;
              const valid = password.all && name.all && email.all;

              this.setState(set(["valid", "all"], valid, this.state));

              resolve(valid);
            })
          )
        );
      } else {
        const { name, password, email } = this.state.valid;
        const valid = password.all && name.all && email.all;

        this.setState(set(["valid", "all"], valid, this.state));

        resolve(valid);
      }
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { email, name, password, begin } = this.state;

    if (begin) {
      this.setState({ begin: false });
      this.validateAll();
      return;
    }
    const valid = await this.validateAll(true);
    if (!valid) {
      return;
    }

    this.props.signupUser({
      email: trim(email),
      name: trim(name),
      password: sha1(trim(password)).toString(),
    });
  }
  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value, begin: false }, () => {
      switch (name) {
        case "email":
          this.setState(this.validateEmail(value));
          break;
        case "name":
          this.setState(this.validateName(value));
          break;
        case "password":
          this.setState(this.validatePassword(value));
          break;
        default:
      }
    });
  }

  render() {
    const {
      email,
      password,
      name,
      valid,
      begin,
      warning,
      success,
      error,
    } = this.state;
    return (
      <Form
        onSubmit={this.handleSubmit}
        warning={!valid.all}
        success={success}
        error={error}
      >
        <Form.Group>
          <Form.Field error={begin ? false : !valid.email.all}>
            <label>Correo</label>
            <Input
              name="email"
              placeholder="Correo"
              onChange={this.handleChange}
              value={email}
            />
          </Form.Field>
          <Form.Field error={begin ? false : !valid.name.all}>
            <label>Nombre</label>
            <Input
              name="name"
              placeholder="Nombre"
              onChange={this.handleChange}
              value={name}
            />
          </Form.Field>

          <Form.Field error={begin ? false : !valid.password.all}>
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

        <Message
          success
          header="Form Completed"
          content="You're all signed up for the newsletter"
        />
        <Message warning header="Precaución!">
          <Message.List>
            {reduce(
              valid,
              (acum, value, key) => {
                switch (key) {
                  case "name": {
                    acum.push(
                      ...reduce(
                        value,
                        (a, v, k) => {
                          if (!v)
                            switch (k) {
                              case "all": {
                                a.push(
                                  <Message.Item content="Ingrese un nombre valido." />
                                );
                                break;
                              }
                              default:
                            }
                          return a;
                        },
                        []
                      )
                    );
                    break;
                  }
                  case "email": {
                    acum.push(
                      ...reduce(
                        value,
                        (a, v, k) => {
                          if (!v)
                            switch (k) {
                              case "all": {
                                a.push(
                                  <Message.Item content="Ingrese un email valido." />
                                );
                                break;
                              }
                              default:
                            }
                          return a;
                        },
                        []
                      )
                    );
                    break;
                  }
                  case "password": {
                    acum.push(
                      ...reduce(
                        value,
                        (a, v, k) => {
                          if (!v)
                            switch (k) {
                              case "length": {
                                a.push(
                                  <Message.Item content="El largo de la contraseña tiene que ser de al menos 8 caracteres." />
                                );
                                break;
                              }
                              case "specialSymbol": {
                                a.push(
                                  <Message.Item
                                    content={`La contraseña debe contener al menos un caracter especial (~¡!$&+,:;=¿?@#|'<>.^*(){}"%-_).`}
                                  />
                                );
                                break;
                              }
                              case "lowercase": {
                                a.push(
                                  <Message.Item content="La contraseña debe contener al menos una letra minúscula." />
                                );
                                break;
                              }
                              case "uppercase": {
                                a.push(
                                  <Message.Item content="La contraseña debe contener al menos una letra mayúscula." />
                                );
                                break;
                              }
                              case "number": {
                                a.push(
                                  <Message.Item content="La contraseña debe contener al menos un número." />
                                );
                              }
                              default:
                            }
                          return a;
                        },
                        []
                      )
                    );
                    break;
                  }
                }
                return acum;
              },
              []
            )}
          </Message.List>
        </Message>
        <Message error header="Error!" list={["Error."]} />
      </Form>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth,
});

const mapDispatchToProps = { signupUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
