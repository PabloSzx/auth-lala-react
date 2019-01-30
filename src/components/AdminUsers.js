import { map } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Header } from "semantic-ui-react";
import { adminGetUsers } from "../actions";
import { User } from "./";

export class AdminUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [
        {
          email: "email",
          name: "name",
          locked: false,
          tries: 0,
          unlockKey: "123124123",
        },
        {
          email: "email",
          name: "name",
          locked: false,
          tries: 0,
          unlockKey: "123124123",
        },
        {
          email: "email",
          name: "name",
          locked: false,
          tries: 0,
          unlockKey: "123124123",
        },
        {
          email: "email",
          name: "name",
          locked: true,
          tries: 0,
          unlockKey: "123124123",
        },
        {
          email: "email",
          name: "name",
          locked: false,
          tries: 0,
          unlockKey: "123124123",
        },
      ],
    };
  }

  componentDidMount() {
    this.props.adminGetUsers();
  }

  render() {
    //const { users } = this.state;
    const { users } = this.props;
    return (
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Locked</Table.HeaderCell>
            <Table.HeaderCell>Intentos erroneos</Table.HeaderCell>
            <Table.HeaderCell>Llave de desbloqueo</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {map(users, (value, key) => (
            <User key={key} user={value}>
              {({ onClick }) => {
                return (
                  <Table.Row onClick={onClick}>
                    {map(value, (v, k) => {
                      switch (k) {
                        case "locked":
                          return (
                            <Table.Cell key={k}>{v ? "Si" : "No"}</Table.Cell>
                          );
                        default:
                          return <Table.Cell key={k}>{v}</Table.Cell>;
                      }
                    })}
                  </Table.Row>
                );
              }}
            </User>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

const mapStateToProps = ({ admin: { users = [] } }) => ({
  users,
});

const mapDispatchToProps = { adminGetUsers };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUsers);
