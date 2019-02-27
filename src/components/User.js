import { isEqual } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Form, Grid, Checkbox, Button, Icon } from "semantic-ui-react";
import { adminUserUpdate, adminLockUser, adminDeleteUser } from "../actions";
import { Confirm } from "./";

export class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      email: props.user.email,
      name: props.user.name,
      locked: props.user.locked,
      tries: props.user.tries,
      admin: props.user.admin,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target: { value, name } }) {
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit() {
    let { email, name, locked, tries, unlockKey, admin } = this.state;
    this.props.adminUserUpdate({
      old: {
        email: this.props.user.email,
      },
      email,
      name,
      locked,
      tries,
      unlockKey,
      admin,
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
        admin: this.props.user.admin,
      });
    }
  }

  render() {
    const { open } = this.state;
    const { children, key, user } = this.props;

    const { email, name, locked, tries, admin } = this.state;

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
          <Confirm
            header="¿Está seguro que desea resetear los campos del formulario a los obtenidos desde la base de datos?"
            content="Cualquier cambio en los campos de información va a ser perdido"
            onConfirm={() => {
              this.setState({
                email: this.props.user.email,
                name: this.props.user.name,
                locked: this.props.user.locked,
                tries: this.props.user.tries,
              });
            }}
          >
            {onClick => (
              <Button
                circular
                icon
                secondary
                style={{ position: "absolute", right: "0.5em", top: "0.5em" }}
                onClick={() => onClick()}
              >
                <Icon circular name="redo" />
              </Button>
            )}
          </Confirm>

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
                <Confirm
                  header="¿Está seguro que desea cambiar el privilegio admin en este usuario?"
                  content="Puede causar problemas en la administración del programa"
                  onConfirm={() => {
                    this.props.adminUserUpdate({
                      old: {
                        email: this.props.user.email,
                      },
                      ...this.props.user,
                      admin: !admin,
                    });
                    this.setState({ open: false });
                  }}
                >
                  {onClick => (
                    <Checkbox
                      name="admin"
                      toggle
                      checked={admin}
                      label="Admin"
                      onChange={() => onClick()}
                      disabled={
                        this.props.user.email === "pablosaez1995@gmail.com"
                      }
                    />
                  )}
                </Confirm>
              </Form.Field>
              <Form.Field>
                <Checkbox
                  name="admin"
                  toggle
                  checked={locked}
                  label="Bloqueado"
                  disabled
                  onChange={() => this.setState({ locked: !locked })}
                />
              </Form.Field>

              <Confirm
                header="¿Está seguro que desea guardar en la base de datos los cambios hechos en este usuario?"
                content="Si hace un cambio en el campo de email asegurese que en la tabla de programas no hayan referencias al email anterior"
                onConfirm={() => this.handleSubmit()}
              >
                {onClick => (
                  <Button
                    icon
                    labelPosition="left"
                    primary
                    onClick={() => onClick()}
                  >
                    <Icon name="save outline" />
                    Guardar
                  </Button>
                )}
              </Confirm>

              <Confirm
                header={`¿Está seguro que desea ${
                  locked
                    ? "enviar un correo de activación"
                    : "bloquear y enviar un correo de activación"
                } a este usuario?`}
                content="Va a ser enviado un correo electrónico al usuario en conjunto con un código de activación nuevo"
                onConfirm={() => {
                  this.props.adminLockUser(user.email);
                  this.setState({
                    open: false,
                  });
                }}
              >
                {onClick => (
                  <Button
                    icon
                    labelPosition="left"
                    secondary
                    onClick={() => onClick()}
                  >
                    <Icon name={locked ? "mail" : "lock"} />
                    {locked
                      ? "Enviar correo de activación"
                      : "Bloquear y enviar correo de activación"}
                  </Button>
                )}
              </Confirm>

              <Confirm
                header="¿Está seguro que desea eliminar este usuario?"
                content="Asegurese que no haya referencias a este usuario en la tabla de programas"
                onConfirm={() => {
                  this.props.adminDeleteUser(user.email);
                  this.setState({ open: false });
                }}
              >
                {onClick => (
                  <Button
                    icon
                    labelPosition="left"
                    color="red"
                    onClick={() => onClick()}
                  >
                    <Icon name="remove user" />
                    Eliminar
                  </Button>
                )}
              </Confirm>
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
