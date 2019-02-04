import React, { Component, Fragment } from "react";
import { Confirm, Button, Icon } from "semantic-ui-react";

export default class ConfirmModal extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }
  onCancel() {
    this.setState({ open: false });
  }
  render() {
    const { open } = this.state;
    const {
      confirmButton = (
        <Button compact icon labelPosition="left" primary>
          <Icon name="check circle outline" />
          Confirmar
        </Button>
      ),
      cancelButton = (
        <Button compact icon labelPosition="left" color="grey">
          <Icon name="times circle outline" />
          Cancelar
        </Button>
      ),
      content = "",
      header = "¿Está seguro?",
      size = "tiny",
      children,
      onConfirm,
    } = this.props;

    return (
      <Fragment>
        <Confirm
          basic
          open={open}
          onCancel={() => this.onCancel()}
          onConfirm={() => {
            onConfirm();
            this.setState({ open: false });
          }}
          cancelButton={cancelButton}
          confirmButton={confirmButton}
          content={content}
          header={header}
          size={size}
        />
        {children(() => this.setState({ open: true }))}
      </Fragment>
    );
  }
}
