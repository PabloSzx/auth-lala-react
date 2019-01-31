import { map, isEqual, sortBy } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Grid } from "semantic-ui-react";
import { adminGetPrograms } from "../actions";
import { Program, AdminImportPrograms } from "./";

export class AdminPrograms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      column: null,
      programs: props.programs,
      direction: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.programs, prevProps.programs)) {
      this.setState({
        programs: sortBy(this.props.programs, [this.state.column]),
      });
    }
  }

  handleSort = clickedColumn => () => {
    const { column, programs, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        programs: sortBy(this.props.programs, [clickedColumn]),
        direction: "ascending",
      });

      return;
    }

    this.setState({
      programs: programs.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending",
    });
  };

  componentDidMount() {
    this.props.adminGetPrograms();
  }

  render() {
    const { programs, column, direction } = this.state;

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
                  sorted={column === "program" ? direction : null}
                  onClick={this.handleSort("program")}
                >
                  program
                </Table.HeaderCell>
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
