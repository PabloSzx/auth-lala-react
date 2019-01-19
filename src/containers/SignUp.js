import { reduce, cloneDeep, isEmpty } from "lodash";
import React, { Component } from "react";
import AutosizeInput from "react-input-autosize";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Message, Grid, Segment } from "semantic-ui-react";
import validator, { trim } from "validator";
import sha1 from "crypto-js/sha1";
import { set } from "lodash/fp";
import { signupUser, clearError } from "../actions";
import {
  LOADING,
  INVALID_PASSWORD,
  INVALID_EMAIL,
  INVALID_NAME,
  USED_EMAIL,
} from "../types";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
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
    return set("valid.email.all", validator.isEmail(email), this.state);
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
  handleChange({ target: { name, value } }) {
    if (!isEmpty(this.props.error)) {
      this.props.clearError();
    }

    this.setState({ [name]: value, begin: false }, () => {
      switch (name) {
        case "email":
          this.setState(this.validateEmail(value), () => this.validateAll());
          break;
        case "name":
          this.setState(this.validateName(value), () => this.validateAll());
          break;
        case "password":
          this.setState(this.validatePassword(value), () => this.validateAll());
          break;
        default:
      }
    });
  }

  render() {
    const { email, password, name, valid } = this.state;
    const { auth, error } = this.props;
    return (
      <Grid centered padded>
        <Grid.Row />

        <Form
          onSubmit={this.handleSubmit}
          warning={!valid.all}
          error={!isEmpty(error)}
          loading={auth === LOADING}
          size="huge"
        >
          <Segment basic size="massive">
            <Form.Field>
              <label>Nombre</label>
              <AutosizeInput
                name="name"
                placeholder="Nombre"
                onChange={this.handleChange}
                value={name}
              />
            </Form.Field>

            <Form.Field>
              <label>Correo</label>
              <AutosizeInput
                name="email"
                placeholder="correo@uach.cl"
                onChange={this.handleChange}
                value={email}
              />
            </Form.Field>

            <Form.Field>
              <label>Contraseña</label>
              <AutosizeInput
                name="password"
                type="password"
                placeholder="Contraseña"
                onChange={this.handleChange}
                value={password}
              />
            </Form.Field>
          </Segment>

          <Segment basic>
            <Form.Button color="blue" size="huge" disabled={!valid.all}>
              Registrar
            </Form.Button>
          </Segment>

          <Segment basic>
            <Link to="/auth">
              <Form.Field>
                <Form.Button size="huge" color="green">
                  Volver
                </Form.Button>
              </Form.Field>
            </Link>
          </Segment>

          <Message
            success
            header="Form Completed"
            content="You're all signed up for the newsletter"
          />
          <Message warning>
            <Message.Header>Precaución!</Message.Header>

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
                                    <Message.Item
                                      key={k + key}
                                      content="Ingrese un nombre valido."
                                    />
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
                                    <Message.Item
                                      key={k + key}
                                      content="Ingrese un email valido."
                                    />
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
                                    <Message.Item
                                      key={k + key}
                                      content="El largo de la contraseña tiene que ser de al menos 8 caracteres."
                                    />
                                  );
                                  break;
                                }
                                case "specialSymbol": {
                                  a.push(
                                    <Message.Item
                                      key={k + key}
                                      content={`La contraseña debe contener al menos un caracter especial (~¡!$&+,:;=¿?@#|'<>.^*(){}"%-_).`}
                                    />
                                  );
                                  break;
                                }
                                case "lowercase": {
                                  a.push(
                                    <Message.Item
                                      key={k + key}
                                      content="La contraseña debe contener al menos una letra minúscula."
                                    />
                                  );
                                  break;
                                }
                                case "uppercase": {
                                  a.push(
                                    <Message.Item
                                      key={k + key}
                                      content="La contraseña debe contener al menos una letra mayúscula."
                                    />
                                  );
                                  break;
                                }
                                case "number": {
                                  a.push(
                                    <Message.Item
                                      key={k + key}
                                      content="La contraseña debe contener al menos un número."
                                    />
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
                    default:
                  }
                  return acum;
                },
                []
              )}
            </Message.List>
          </Message>

          <Message error>
            <Message.Header>Error!</Message.Header>

            <Message.List>
              {reduce(
                error,
                (acum, value, key) => {
                  switch (key) {
                    case INVALID_PASSWORD:
                    case INVALID_EMAIL:
                    case INVALID_NAME:
                    case USED_EMAIL:
                      acum.push(<Message.Item key={key} content={value} />);
                      break;
                    default:
                  }
                  return acum;
                },
                []
              )}
            </Message.List>
          </Message>
        </Form>
      </Grid>
    );
  }
}

const mapStateToProps = ({ auth, error }) => ({
  auth,
  error,
});

const mapDispatchToProps = { signupUser, clearError };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
