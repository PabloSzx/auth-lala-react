import { isEqual } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Form, Grid, Button } from "semantic-ui-react";
import { adminProgramUpdate } from "../actions";

export class Program extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      email: props.program.email,
      program: props.program.program,
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
                <label>Programa</label>
                <input
                  name="program"
                  placeholder="Email"
                  onChange={this.handleChange}
                  value={program}
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

const mapDispatchToProps = { adminProgramUpdate };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Program);
