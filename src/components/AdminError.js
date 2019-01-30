import { has, get } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Message } from "semantic-ui-react";
import { ADMIN_ERROR } from "../types";

export class componentName extends Component {
  render() {
    const { error } = this.props;

    return (
      <Message error hidden={!has(error, ADMIN_ERROR)}>
        <Message.Header>Error!</Message.Header>
        <Message.Content content={get(error, [ADMIN_ERROR], "")} />
      </Message>
    );
  }
}

const mapStateToProps = ({ error }) => ({
  error,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentName);
