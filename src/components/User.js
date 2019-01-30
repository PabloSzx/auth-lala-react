import { isEqual } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Modal, Form, Grid, Checkbox, Button } from "semantic-ui-react";
import { adminUserUpdate } from "../actions";

export class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      email: props.user.email,
      name: props.user.name,
      locked: props.user.locked,
      tries: props.user.tries,
      unlockKey: props.user.unlockKey,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ target: { value, name } }) {
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

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
        unlockKey: this.props.user.unlockKey,
      });
    }
  }

  render() {
    const { open } = this.state;
    const { children, key, user } = this.props;

    const { email, name, locked, tries, unlockKey } = this.state;

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
          <Grid centered>
            <Form size="big" onSubmit={this.handleSubmit}>
              <Form.Field>
                <label>Email</label>
                <input
                  name="email"
                  placeholder="Email"
                  onChange={this.handleChange}
                  value={email}
                />
              </Form.Field>
              <Form.Field>
                <label>Name</label>
                <input
                  name="name"
                  placeholder="Nombre"
                  onChange={this.handleChange}
                  value={name}
                />
              </Form.Field>
              <Form.Field>
                <label>Intentos</label>
                <input
                  name="tries"
                  placeholder="Intentos"
                  onChange={this.handleChange}
                  value={tries}
                />
              </Form.Field>
              <Form.Field>
                <label>Llave de desbloqueo</label>
                <input
                  name="unlockKey"
                  placeholder="Llave"
                  onChange={this.handleChange}
                  value={unlockKey}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  name="locked"
                  toggle
                  checked={locked}
                  label="Bloqueado"
                  onChange={() => this.setState({ locked: !locked })}
                />
              </Form.Field>
              <Button type="submit">Submit</Button>
            </Form>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = { adminUserUpdate };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
