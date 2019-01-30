import { map } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Header } from "semantic-ui-react";
import { adminGetPrograms } from "../actions";
import { Program } from "./";

export class AdminPrograms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_programs: [
        {
          email: "email",
          program: "informatica",
        },
        {
          email: "email",
          program: "mecanica",
        },
        {
          email: "email",
          program: "civil",
        },
      ],
    };
  }

  componentDidMount() {
    this.props.adminGetPrograms();
  }

  render() {
    const { programs } = this.props;

    return (
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Programa</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {map(programs, (value, key) => (
            <Program key={key} program={value}>
              {({ onClick }) => (
                <Table.Row onClick={onClick}>
                  {map(value, (v, k) => (
                    <Table.Cell key={k}>{v}</Table.Cell>
                  ))}
                </Table.Row>
              )}
            </Program>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

const mapStateToProps = ({ admin: { programs = [] } }) => ({
  programs,
});

const mapDispatchToProps = {
  adminGetPrograms,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPrograms);
