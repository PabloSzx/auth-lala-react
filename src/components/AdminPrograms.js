import { map } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Grid } from "semantic-ui-react";
import { adminGetPrograms } from "../actions";
import { Program, AdminImportPrograms } from "./";

export class AdminPrograms extends Component {
  componentDidMount() {
    this.props.adminGetPrograms();
  }

  render() {
    const { programs } = this.props;

    return (
      <Grid>
        <Grid.Row centered>
          <AdminImportPrograms />
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
                <Table.HeaderCell>program</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {map(programs, (value, key) => (
                <Program key={key} program={value}>
                  {({ onClick }) => (
                    <Table.Row onClick={onClick} style={{ cursor: "pointer" }}>
                      {map(value, (v, k) => (
                        <Table.Cell key={k}>{v}</Table.Cell>
                      ))}
                    </Table.Row>
                  )}
                </Program>
              ))}
            </Table.Body>
          </Table>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = ({ admin: { programs = [] }, error }) => ({
  error,
  programs,
});

const mapDispatchToProps = {
  adminGetPrograms,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPrograms);
