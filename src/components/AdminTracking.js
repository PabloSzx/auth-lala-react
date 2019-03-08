import { map, isEqual, sortBy, size, slice } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Grid, Pagination } from "semantic-ui-react";
import { adminGetTracking } from "../actions";

class AdminTracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      column: null,
      tracking: props.tracking,
      direction: null,
      activePage: window.localStorage.getItem("active-tracking-page") || 1,
      totalPages: window.localStorage.getItem("total-tracking-pages") || 1,
    };
  }

  componentDidMount() {
    this.props.adminGetTracking();
    const tracking = sortBy(
      this.props.tracking,
      this.state.column === "id" ? v => parseInt(v.id) : [this.state.column]
    );
    const activePage = this.state.activePage;
    const nPerPage = 50;
    const totalPages = Math.ceil(size(tracking) / nPerPage);
    window.localStorage.setItem("total-tracking-pages", totalPages);

    this.setState({
      tracking: slice(
        tracking,
        nPerPage * (activePage - 1),
        nPerPage * activePage
      ),
      totalPages,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.activePage !== prevState.activePage ||
      !isEqual(this.props.tracking, prevProps.tracking)
    ) {
      const tracking = sortBy(
        this.props.tracking,
        this.state.column === "id" ? v => parseInt(v.id) : [this.state.column]
      );
      const activePage = this.state.activePage;
      const nPerPage = 50;
      const totalPages = Math.ceil(size(tracking) / nPerPage);
      window.localStorage.setItem("total-tracking-pages", totalPages);
      this.setState({
        tracking: slice(
          tracking,
          nPerPage * (activePage - 1),
          nPerPage * activePage
        ),
        totalPages,
      });
    }
  }

  handleSort = clickedColumn => () => {
    const { column, tracking, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        tracking: sortBy(
          this.props.tracking,
          clickedColumn === "id" ? v => parseInt(v.id) : [clickedColumn]
        ),
        direction: "ascending",
      });

      return;
    }

    this.setState({
      tracking: tracking.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending",
    });
  };

  render() {
    const { tracking, column, direction, activePage, totalPages } = this.state;

    return (
      <Grid centered>
        <Grid.Row>
          <Pagination
            activePage={activePage}
            totalPages={totalPages}
            onPageChange={(e, { activePage }) => {
              this.setState({ activePage });
              window.localStorage.setItem("active-tracking-page", activePage);
            }}
          />
        </Grid.Row>
        <Grid.Row>
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
