import { map, sortBy, isEqual } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Grid, Button, Icon } from "semantic-ui-react";
import { adminGetUsers, adminMailLockedUsers } from "../actions";
import { User, AdminImportUsers, Confirm } from "./";

const sortKeys = obj =>
  map(obj, ({ email, name, locked, tries }) => ({
    email,
    name,
    locked,
    tries,
  }));

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
        users: sortKeys(sortBy(this.props.users, [this.state.column])),
      });
    }
  }

  handleSort = clickedColumn => () => {
    const { column, users, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        users: sortKeys(sortBy(this.props.users, [clickedColumn])),
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
          <Confirm
            onConfirm={() => this.props.adminMailLockedUsers()}
            header="¿Está seguro que desea enviar un nuevo correo electrónico a todos los usuarios bloqueados?"
            content="Se les va a asignar un nuevo código de activación en conjunto con el correo enviado a todos los usuarios bloqueados"
          >
            {onClick => (
              <Button
                icon
                labelPosition="left"
                secondary
                onClick={() => onClick()}
              >
                <Icon name="mail" />
                Código nuevo a usuarios bloqueados
              </Button>
            )}
          </Confirm>
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
                                  {v ? (
                                    <Icon circular name="lock" />
                                  ) : (
                                    <Icon circular name="lock open" />
                                  )}
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
