import { isEqual } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Form, Grid, Checkbox, Button, Icon } from "semantic-ui-react";
import { adminUserUpdate, adminLockUser, adminDeleteUser } from "../actions";

export class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      email: props.user.email,
      name: props.user.name,
      locked: props.user.locked,
      tries: props.user.tries,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target: { value, name } }) {
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit() {
    let { email, name, locked, tries, unlockKey } = this.state;
    this.props.adminUserUpdate({
      old: {
        email: this.props.user.email,
      },
      email,
      name,
      locked,
      tries,
      unlockKey,
    });
    this.setState({ open: false });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.user, prevProps.user)) {
      this.setState({
        email: this.props.user.email,
        name: this.props.user.name,
        locked: this.props.user.locked,
        tries: this.props.user.tries,
      });
    }
  }

  render() {
    const { open } = this.state;
    const { children, key, user } = this.props;

    const { email, name, locked, tries } = this.state;

    return (
      <Modal
        trigger={children({ onClick: () => this.setState({ open: true }) })}
        onOpen={() => this.setState({ open: true })}
        onClose={() => this.setState({ open: false })}
        open={open}
        key={key}
      >
        <Modal.Header>{user.email}</Modal.Header>
        <Modal.Content>
          <Button
            circular
            icon
            secondary
            style={{ position: "absolute", right: "0.5em", top: "0.5em" }}
            onClick={() => {
              this.setState({
                email: this.props.user.email,
                name: this.props.user.name,
                locked: this.props.user.locked,
                tries: this.props.user.tries,
              });
            }}
          >
            <Icon circular name="redo" />
          </Button>

          <Grid centered>
            <Form size="big">
              <Form.Field>
                <label>Email</label>
                <input
                  name="email"
                  placeholder="Email"
                  onChange={this.handleChange}
                  value={email}
                  style={{ width: "25em" }}
                />
              </Form.Field>
              <Form.Field>
                <label>Name</label>
                <input
                  name="name"
                  placeholder="Nombre"
                  onChange={this.handleChange}
                  value={name}
                  style={{ width: "25em" }}
                />
              </Form.Field>
              <Form.Field>
                <label>Intentos</label>
                <input
                  name="tries"
                  placeholder="Intentos"
                  onChange={this.handleChange}
                  value={tries}
                  style={{ width: "25em" }}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  name="locked"
                  toggle
                  checked={locked}
                  label="Bloqueado"
                  disabled
                  onChange={() => this.setState({ locked: !locked })}
                />
              </Form.Field>
              <Button primary onClick={() => this.handleSubmit()}>
                Guardar
              </Button>
              <Button
                secondary
                onClick={() => {
                  this.props.adminLockUser(user.email);
                }}
              >
                {locked
                  ? "Enviar correo de activación"
                  : "Bloquear y enviar correo de activación"}
              </Button>
              <Button
                color="red"
                onClick={() => this.props.adminDeleteUser(user.email)}
              >
                Eliminar
              </Button>
            </Form>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = { adminUserUpdate, adminLockUser, adminDeleteUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
