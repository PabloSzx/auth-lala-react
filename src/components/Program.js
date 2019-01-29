import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Modal, Form, Grid } from "semantic-ui-react";

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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user !== prevProps.user) {
      this.setState({
        email: this.props.program.email,
        program: this.props.program.program,
      });
    }
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
        <Modal.Header>{programProp.email}</Modal.Header>
        <Modal.Content>
          <Grid centered>
            <Form>
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
            </Form>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Program);
