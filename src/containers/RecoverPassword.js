import { reduce, cloneDeep, isEmpty, isString, get } from "lodash";
import queryString from "query-string";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Message, Grid, Segment, Input } from "semantic-ui-react";
import validator, { trim } from "validator";
import sha1 from "crypto-js/sha1";
import { recoverPassword, clearError, logoutUser } from "../actions/auth";
import {
  LOADING,
  USER_NOT_LOCKED,
  USED_OLD_PASSWORD,
  INVALID_PASSWORD,
} from "../types";

class RecoverPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      confirm_password: "",
      valid: {
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

    this.props.logoutUser();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.redirect) {
      window.location.replace(this.props.redirect);
    }
    if (
      prevProps.auth !== this.props.auth &&
      !isString(this.props.auth) &&
      !isEmpty(this.props.auth)
    ) {
      const callback = get(
        queryString.parse(this.props.location.search),
        "callback",
        false
      );

      window.location.replace(callback || "http://146.83.216.180:81/");
    }
  };

  validatePassword(
    password = this.state.password,
    confirm_password = this.state.confirm_password
  ) {
    const state = cloneDeep(this.state);

    const conditions = {
      length: () => validator.isLength(password, { min: 8, max: 100 }),
      specialSymbol: () =>
        validator.matches(password, /[~¡!$&+,:;=¿?@#|'<>.^*(){}"%\-_]/),
      lowercase: () => validator.matches(password, /[a-z]/),
      uppercase: () => validator.matches(password, /[A-Z]/),
      number: () => validator.matches(password, /[0-9]/),
      confirm_password: () => password === confirm_password,
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

  async handleSubmit(event) {
    event.preventDefault();
    const {
      password,
      valid: {
        password: { all: valid },
      },
    } = this.state;

    const { email, unlockKey } = this.props.match.params;

    if (!valid) return;

    this.props.recoverPassword({
      email,
      unlockKey,
      password: sha1(trim(password)).toString(),
    });

    this.setState({
      password: "",
      confirm_password: "",
    });
  }
  handleChange({ target: { name, value } }) {
    if (!isEmpty(this.props.error)) {
      this.props.clearError();
    }
    this.setState({ [name]: value }, () => {
      switch (name) {
        case "password":
          this.setState(this.validatePassword(value));
          break;
        case "confirm_password":
          this.setState(this.validatePassword(this.state.password, value));
          break;
        default:
      }
    });
  }

  render() {
    const { password, valid, confirm_password } = this.state;
    const { email } = this.props.match.params;
    const { error, auth } = this.props;

    return (
      <Grid centered padded>
        <Grid.Row />
        <Grid.Row>
          <Message>{email}</Message>
        </Grid.Row>
        <Grid.Row>
          <Form
            onSubmit={this.handleSubmit}
            warning={!valid.password.all}
            error={!isEmpty(error)}
            loading={auth === LOADING}
            size="big"
          >
            <Segment size="big" basic>
              <Form.Field error={!valid.password.all}>
                <label>Nueva Contraseña</label>
                <Input
                  name="password"
                  type="password"
                  placeholder="contraseña"
                  onChange={this.handleChange}
                  value={password}
                />
              </Form.Field>
            </Segment>
            <Segment size="big" basic>
              <Form.Field error={!valid.password.all}>
                <label>Repita su contraseña</label>
                <Input
                  name="confirm_password"
                  type="password"
                  placeholder="contraseña"
                  onChange={this.handleChange}
                  value={confirm_password}
                />
              </Form.Field>
            </Segment>

            <Segment size="big" basic>
              <Form.Button
                size="huge"
                color="blue"
                disabled={!valid.password.all}
              >
                Activar cuenta
              </Form.Button>
            </Segment>
          </Form>
        </Grid.Row>
        <Grid.Row>
          <Segment size="large" basic>
            <Message warning hidden={valid.password.all}>
              <Message.List>
                {reduce(
                  valid,
                  (acum, value, key) => {
                    switch (key) {
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
                                  case "confirm_password": {
                                    a.push(
                                      <Message.Item
                                        key={k + key}
                                        content="Debe repetir su contraseña correctamente."
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
          </Segment>
        </Grid.Row>
        <Grid.Row>
          <Message error hidden={isEmpty(error)}>
            <Message.Header>Error!</Message.Header>

            <Message.List>
              {reduce(
                error,
                (acum, value, key) => {
                  switch (key) {
                    case INVALID_PASSWORD:
                    case USER_NOT_LOCKED:
                    case USED_OLD_PASSWORD:
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
      </Grid>
    );
  }
}

const mapStateToProps = ({ auth, error, redirect }) => ({
  auth,
  error,
  redirect,
});

const mapDispatchToProps = { recoverPassword, clearError, logoutUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecoverPassword);
