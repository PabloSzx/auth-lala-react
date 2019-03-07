import { isEmpty, reduce, get, isString } from "lodash";
import queryString from "query-string";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Form,
  Checkbox,
  Grid,
  Segment,
  Message,
  Input,
  Icon,
} from "semantic-ui-react";
import { isEmail, trim, isLength } from "validator";
import sha1 from "crypto-js/sha1";
import { set } from "lodash/fp";
import {
  loginUser,
  loginUserNoSession,
  clearError,
  fetchUser,
} from "../actions";
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

  componentDidMount() {
    const callback = get(
      queryString.parse(this.props.location.search),
      "callback",
      false
    );

    this.props.fetchUser(callback);
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

      window.location.replace(
        callback || "https://trac.uach.lalaproject.org:81/"
      );
    }
  };

  async handleSubmit(event) {
    event.preventDefault();
    let { email, password, session } = this.state;

    email = trim(email);
    password = trim(sha1(password).toString());

    const callback = get(
      queryString.parse(this.props.location.search),
      "callback",
      false
    );
    console.log("callback aca es", callback);

    if (session) {
      this.props.loginUser({ email, password, callback });
    } else {
      this.props.loginUserNoSession({ email, password, callback });
    }

    this.setState({
      password: "",
    });
  }

  validateEmail(email = this.state.email) {
    return set("valid.email.all", isEmail(email), this.state);
  }

  validatePassword(password = this.state.password) {
    return set("valid.password.all", isLength(password, { min: 3, max: 100 }));
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
    return (
      <Grid centered padded>
        <Grid.Row />
        <Form
          size="big"
          onSubmit={this.handleSubmit}
          error={!isEmpty(error)}
          loading={auth === LOADING}
        >
          <Segment size="big" basic>
            <Form.Field>
              <label>Correo Electrónico</label>
              <Input
                name="email"
                type="email"
                placeholder="email@uach.cl"
                onChange={this.handleChange}
                value={email}
                style={{ width: "20em" }}
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
                style={{ width: "20em" }}
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
              <Form.Button
                size="big"
                color="blue"
                disabled={!valid.all}
                icon
                labelPosition="left"
              >
                <Icon name="sign-in" />
                Ingresar
              </Form.Button>
            </Form.Field>
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
      </Grid>
    );
  }
}

const mapStateToProps = ({ auth, error, redirect }) => ({
  auth,
  error,
  redirect,
});

const mapDispatchToProps = {
  loginUser,
  loginUserNoSession,
  clearError,
  fetchUser,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Auth)
);
