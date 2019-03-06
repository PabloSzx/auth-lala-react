import { map, isEqual, sortBy } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Grid } from "semantic-ui-react";
import { adminGetTracking } from "../actions";

class AdminTracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      column: null,
      tracking: props.tracking,
      direction: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.tracking, prevProps.tracking)) {
      this.setState({
        tracking: sortBy(this.props.tracking, [this.state.column]),
      });
    }
  }

  handleSort = clickedColumn => () => {
    const { column, tracking, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        tracking: sortBy(this.props.tracking, [clickedColumn]),
        direction: "ascending",
      });

      return;
    }

    this.setState({
      tracking: tracking.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending",
    });
  };

  componentDidMount() {
    this.props.adminGetTracking();
  }

  render() {
    const { tracking, column, direction } = this.state;

    return (
      <Grid>
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
                  sorted={column === "app_id" ? direction : null}
                  onClick={this.handleSort("app_id")}
                >
                  app_id
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "user_id" ? direction : null}
                  onClick={this.handleSort("user_id")}
                >
                  user_id
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "datetime" ? direction : null}
                  onClick={this.handleSort("datetime")}
                >
                  datetime
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "datetime_client" ? direction : null}
                  onClick={this.handleSort("datetime_client")}
                >
                  datetime_client
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "data" ? direction : null}
                  onClick={this.handleSort("data")}
                >
                  data
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "id" ? direction : null}
                  onClick={this.handleSort("id")}
                >
                  id
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {map(tracking, (value, key) => (
                <Table.Row style={{ cursor: "pointer" }}>
                  {map(value, (v, k) => (
                    <Table.Cell key={k}>{v}</Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = ({ admin: { tracking = [] } }) => ({
  tracking,
});

const mapDispatchToProps = {
  adminGetTracking,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminTracking);
