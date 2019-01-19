import { reduce, cloneDeep } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Message, Grid } from "semantic-ui-react";
import validator, { trim } from "validator";
import sha1 from "crypto-js/sha1";
import { recoverPassword } from "../actions/auth";
class RecoverPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      warning: false,
      success: false,
      error: false,
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
  }
  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value }, () => {
      switch (name) {
        case "password":
          this.setState(this.validatePassword(value));
          break;
        default:
      }
    });
  }

  render() {
    const {
      password,
      valid,
      // warning,
      success,
      error,
    } = this.state;
    const { email } = this.props.match.params;

    return (
      <Grid centered>
        <Grid.Row />
        <Grid.Row>
          <Message>{email}</Message>
        </Grid.Row>
        <Grid.Row>
          <Form
            onSubmit={this.handleSubmit}
            warning={!valid.all}
            success={success}
            error={error}
          >
            <Form.Field error={!valid.password.all}>
              <label>Contraseña</label>
              <Input
                name="password"
                type="password"
                placeholder="Contraseña"
                onChange={this.handleChange}
                value={password}
              />
            </Form.Field>

            <Form.Button color="blue">Recuperar contraseña</Form.Button>

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
            <Message error header="Error!" list={["Error."]} />
          </Form>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth,
});

const mapDispatchToProps = { recoverPassword };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecoverPassword);
