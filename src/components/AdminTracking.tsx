import _ from "lodash";
import React, { useReducer, useEffect } from "react";
import { connect } from "react-redux";
import { Table, Grid, Pagination } from "semantic-ui-react";
import { adminGetTracking } from "../actions";

const AdminTracking = ({
  tracking,
  getTracking,
}: {
  tracking: Array<any>;
  getTracking: Function;
}) => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "GET_TRACKING_DATA":
          return {
            ...state,
            trackingPage: tracking[state.activePage - 1],
            totalPages: _.size(tracking),
            column: null,
            direction: null,
          };
        case "SORT_TRACKING_PAGE":
          return {
            ...state,
            column: action.payload.column,
            trackingPage: action.payload.trackingPage,
            direction: action.payload.direction,
          };
        case "REVERSE_TRACKING_PAGE":
          return {
            ...state,
            trackingPage: _.reverse(state.trackingPage),
            direction:
              state.direction === "ascending" ? "descending" : "ascending",
          };
        case "SET_ACTIVE_PAGE":
          return {
            ...state,
            activePage: action.payload,
            trackingPage: tracking[action.payload - 1],
            column: null,
            direction: null,
          };
        default:
          return state;
      }
    },
    {
      column: null,
      trackingPage: null,
      direction: null,
      totalPages: _.size(tracking),
      activePage: localStorage.getItem("active-tracking-page") || 1,
    }
  );

  useEffect(() => {
    getTracking();
  }, []);

  useEffect(() => {
    dispatch({
      type: "GET_TRACKING_DATA",
    });
  }, [tracking]);

  const handleSort = (clickedColumn: string) => () => {
    const { column, trackingPage } = state;

    if (column !== clickedColumn) {
      dispatch({
        type: "SORT_TRACKING_PAGE",
        payload: {
          column: clickedColumn,
          trackingPage: _.sortBy(
            trackingPage,
            clickedColumn === "id" ? v => parseInt(v.id) : [clickedColumn]
          ),
          direction: "ascending",
        },
      });

      return;
    }

    dispatch({
      type: "REVERSE_TRACKING_PAGE",
    });
  };

  const { trackingPage, column, direction, activePage, totalPages } = state;

  return (
    <Grid centered>
      <Grid.Row>
        <Pagination
          activePage={activePage}
          totalPages={totalPages}
          onPageChange={(e, { activePage }) => {
            dispatch({
              type: "SET_ACTIVE_PAGE",
              payload: activePage,
            });
            window.localStorage.setItem(
              "active-tracking-page",
              _.toString(activePage)
            );
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
                onClick={handleSort("app_id")}
              >
                app_id
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "user_id" ? direction : null}
                onClick={handleSort("user_id")}
              >
                user_id
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "datetime" ? direction : null}
                onClick={handleSort("datetime")}
              >
                datetime
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "datetime_client" ? direction : null}
                onClick={handleSort("datetime_client")}
              >
                datetime_client
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "data" ? direction : null}
                onClick={handleSort("data")}
              >
                data
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "id" ? direction : null}
                onClick={handleSort("id")}
              >
                id
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {_.map(trackingPage, (value, key) => (
              <Table.Row key={key} style={{ cursor: "pointer" }}>
                {_.map(value, (v, k) => (
                  <Table.Cell key={k}>{v}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Grid.Row>
    </Grid>
  );
};

const mapStateToProps = ({ admin: { tracking = [] } }) => ({
  tracking,
});

const mapDispatchToProps = {
  getTracking: adminGetTracking,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminTracking);
