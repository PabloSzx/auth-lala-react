import { map } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Grid, Button } from "semantic-ui-react";
import { adminGetUsers, adminMailLockedUsers } from "../actions";
import { User, AdminImportUsers } from "./";

export class AdminUsers extends Component {
  componentDidMount() {
    this.props.adminGetUsers();
  }

  render() {
    const { users } = this.props;

    return (
      <Grid>
        <Grid.Row centered>
          <AdminImportUsers />
        </Grid.Row>
        <Grid.Row centered>
          <Button secondary onClick={() => this.props.adminMailLockedUsers()}>
            Enviar nuevo código de activación a todos los usuarios bloqueados
          </Button>
        </Grid.Row>
        <Grid.Row centered>
          <Table
            padded
            selectable
            celled
            size="large"
            style={{ width: "1em" }}
            textAlign="center"
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>email</Table.HeaderCell>
                <Table.HeaderCell>name</Table.HeaderCell>
                <Table.HeaderCell>locked</Table.HeaderCell>
                <Table.HeaderCell>tries</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {map(users, (value, key) => (
                <User key={key} user={value}>
                  {({ onClick }) => {
                    return (
                      <Table.Row
                        onClick={onClick}
                        style={{ cursor: "pointer" }}
                      >
                        {map(value, (v, k) => {
                          switch (k) {
                            case "locked":
                              return (
                                <Table.Cell key={k}>
                                  {v ? "Si" : "No"}
                                </Table.Cell>
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
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = ({ admin: { users = [] } }) => ({
  users,
});

const mapDispatchToProps = { adminGetUsers, adminMailLockedUsers };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUsers);
