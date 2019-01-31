import { map, sortBy, isEqual } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Grid, Button, Icon } from "semantic-ui-react";
import { adminGetUsers, adminMailLockedUsers } from "../actions";
import { User, AdminImportUsers } from "./";

export class AdminUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      column: null,
      users: props.users,
      direction: null,
    };
  }

  componentDidMount() {
    this.props.adminGetUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.users, prevProps.users)) {
      this.setState({
        users: sortBy(this.props.users, [this.state.column]),
      });
    }
  }

  handleSort = clickedColumn => () => {
    const { column, users, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        users: sortBy(this.props.users, [clickedColumn]),
        direction: "ascending",
      });

      return;
    }

    this.setState({
      users: users.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending",
    });
  };

  render() {
    const { users, column, direction } = this.state;

    return (
      <Grid>
        <Grid.Row centered>
          <AdminImportUsers />
        </Grid.Row>
        <Grid.Row centered>
          <Button
            icon
            labelPosition="left"
            secondary
            onClick={() => this.props.adminMailLockedUsers()}
          >
            <Icon name="mail" />
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
            sortable
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === "email" ? direction : null}
                  onClick={this.handleSort("email")}
                >
                  email
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "name" ? direction : null}
                  onClick={this.handleSort("name")}
                >
                  name
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "locked" ? direction : null}
                  onClick={this.handleSort("locked")}
                >
                  locked
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "tries" ? direction : null}
                  onClick={this.handleSort("tries")}
                >
                  tries
                </Table.HeaderCell>
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
