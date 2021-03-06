import { isEqual } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Form, Grid, Button, Icon } from "semantic-ui-react";
import { adminProgramUpdate, adminDeleteProgram } from "../actions";
import { Confirm } from "./";

export class Program extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      email: props.program.email,
      program: props.program.program,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target: { value, name } }) {
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit() {
    let { email, program } = this.state;
    this.props.adminProgramUpdate({
      old: {
        email: this.props.program.email,
        program: this.props.program.program,
      },
      email,
      program,
    });

    this.setState({
      open: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.program, prevProps.program))
      this.setState({
        email: this.props.program.email,
        program: this.props.program.program,
      });
  }

  render() {
    const { open } = this.state;
    const { children, key, program: programProp } = this.props;
    const { email, program } = this.state;

    return (
      <Modal
        trigger={children({ onClick: () => this.setState({ open: true }) })}
        onOpen={() => this.setState({ open: true })}
        onClose={() => this.setState({ open: false })}
        open={open}
        key={key}
      >
        <Modal.Header>
          {programProp.email}-{programProp.program}
        </Modal.Header>
        <Modal.Content>
          <Confirm
            header="¿Está seguro que desea resetear los campos del formulario a los obtenidos desde la base de datos?"
            content="Cualquier cambio en los campos de información va a ser perdido"
            onConfirm={() =>
              this.setState({
                email: this.props.program.email,
                program: this.props.program.program,
              })
            }
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
                <label>Programa</label>
                <input
                  name="program"
                  placeholder="Email"
                  onChange={this.handleChange}
                  value={program}
                  style={{ width: "25em" }}
                />
              </Form.Field>
              <Confirm
                header="¿Está seguro que desea guardar en la base de datos los cambios hechos en este programa?"
                content="Si hace un cambio en el campo de email asegurese que en la tabla de usuarios exista el correo electrónico nuevo"
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
                header="¿Está seguro que desea eliminar este programa?"
                content="Éste se va a eliminar de la base de datos"
                onConfirm={() => {
                  this.props.adminDeleteProgram({
                    email: programProp.email,
                    program: programProp.program,
                  });
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
                    <Icon name="remove circle" />
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

const mapDispatchToProps = { adminProgramUpdate, adminDeleteProgram };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Program);
