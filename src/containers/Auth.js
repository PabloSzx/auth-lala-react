import { isEmpty, reduce } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Form,
  Checkbox,
  Grid,
  Segment,
  Message,
  Input,
} from "semantic-ui-react";
import { isEmail, trim, isLength } from "validator";
import sha1 from "crypto-js/sha1";
import { set } from "lodash/fp";
import { loginUser, loginUserNoSession, clearError } from "../actions";
import {
  INVALID_INFO,
  LOCKED_USER,
  WRONG_EMAIL,
  WRONG_PASSWORD,
  LOADING,
} from "../types";

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      remember: false,
      session: true,
      valid: {
        all: false,
        password: {
          all: false,
        },
        email: {
          all: false,
        },
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    let { email, password, session } = this.state;

    email = trim(email);
    password = trim(sha1(password).toString());
    console.log("session es ", session);
    if (session) {
      this.props.loginUser({ email, password });
    } else {
      this.props.loginUserNoSession({ email, password });
    }

    this.setState({
      password: "",
    });
  }

  validateEmail(email = this.state.email) {
    return set("valid.email.all", isEmail(email), this.state);
  }

  validatePassword(password = this.state.password) {
    return set("valid.password.all", isLength(password, { min: 8, max: 100 }));
  }

  validateAll(chain = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject("Timeout error!"), 30000);
      if (chain) {
        this.setState(this.validatePassword(), () =>
          this.setState(this.validateEmail(), () => {
            const { password, email } = this.state.valid;
            const valid = password.all && email.all;

            this.setState(set(["valid", "all"], valid, this.state));

            resolve(valid);
          })
        );
      } else {
        const { password, email } = this.state.valid;
        const valid = password.all && email.all;
        this.setState(set(["valid", "all"], valid, this.state));

        resolve(valid);
      }
    });
  }

  handleChange({ target: { name, value } }) {
    if (!isEmpty(this.props.error)) {
      this.props.clearError();
    }
    this.setState({ [name]: value }, () => {
      switch (name) {
        case "email":
          this.setState(this.validateEmail(value), () => this.validateAll());
          break;
        case "password":
          this.setState(this.validatePassword(value), () => this.validateAll());
          break;
        default:
      }
    });
  }

  render() {
    const { email, password, session, valid } = this.state;
    const { error, auth } = this.props;
    console.log("this.state", this.state.valid);
    return (
      <Grid centered padded>
        <Grid.Row />
        <Form
          size="huge"
          onSubmit={this.handleSubmit}
          error={!isEmpty(error)}
          loading={auth === LOADING}
          warning={!valid.all}
        >
          <Segment size="massive" basic>
            <Form.Field>
              <label>Correo</label>
              <Input
                name="email"
                type="email"
                placeholder="email@uach.cl"
                onChange={this.handleChange}
                value={email}
              />
            </Form.Field>
            <Form.Field>
              <label>Contraseña</label>
              <Input
                name="password"
                type="password"
                placeholder="contraseña"
                onChange={this.handleChange}
                value={password}
              />
            </Form.Field>
          </Segment>
          <Segment basic>
            <Form.Field>
              <Checkbox
                toggle
                label="Mantenerse conectado"
                onChange={() => this.setState({ session: !session })}
                checked={session}
              />
            </Form.Field>
          </Segment>
          <Segment basic>
            <Form.Field>
              <Form.Button size="huge" color="blue" disabled={!valid.all}>
                Login
              </Form.Button>
            </Form.Field>
          </Segment>

          <Segment basic>
            <Link to="/signup">
              <Form.Field>
                <Form.Button size="huge" color="green">
                  Registrarse
                </Form.Button>
              </Form.Field>
            </Link>
          </Segment>
        </Form>

        <Grid.Row>
          <Message error hidden={isEmpty(error)}>
            <Message.Header>Error!</Message.Header>

            <Message.List>
              {reduce(
                error,
                (acum, value, key) => {
                  switch (key) {
                    case INVALID_INFO:
                    case WRONG_EMAIL:
                    case WRONG_PASSWORD:
                    case LOCKED_USER:
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
        </Grid.Row>
        <Grid.Row>
          <Message warning hidden={valid.all}>
            <Message.Header>Precaución!</Message.Header>

            <Message.List>
              {reduce(
                valid,
                (acum, value, key) => {
                  switch (key) {
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
                                case "all": {
                                  a.push(
                                    <Message.Item
                                      key={k + key}
                                      content="El largo de la contraseña tiene que ser de al menos 8 caracteres."
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
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = ({ auth, error }) => ({
  auth,
  error,
});

const mapDispatchToProps = { loginUser, loginUserNoSession, clearError };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
