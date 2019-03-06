import { get } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Menu, Icon } from "semantic-ui-react";
import { adminGetPrograms, adminGetUsers, fetchUser } from "../actions";
import {
  AdminPrograms,
  AdminUsers,
  AdminError,
  AdminLogin,
  AdminTracking,
} from "../components";

export class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: window.localStorage.getItem("active-tab-admin") || "users",
    };
  }

  componentDidMount() {
    this.props.fetchUser();

    this.props.adminGetPrograms();
    this.props.adminGetUsers();
  }

  handleItemClick = (e, { name }) => {
    this.setState({ active: name });
    window.localStorage.setItem("active-tab-admin", name);
  };

  render() {
    const { active } = this.state;
    const { auth } = this.props;
    return !get(auth, "admin", false) ? (
      <AdminLogin />
    ) : (
      <Grid centered key={"dashboard"}>
        <Grid.Row>
          <Menu icon="labeled">
            <Menu.Item
              name="users"
              active={active === "users"}
              onClick={this.handleItemClick}
            >
              <Icon name="user outline" />
              Usuarios
            </Menu.Item>
            <Menu.Item
              name="programs"
              active={active === "programs"}
              onClick={this.handleItemClick}
            >
              <Icon name="table" />
              Programas
            </Menu.Item>
            <Menu.Item
              name="tracking"
              active={active === "tracking"}
              onClick={this.handleItemClick}
            >
              <Icon name="chart line" />
              Tracking
            </Menu.Item>
          </Menu>
        </Grid.Row>
        <Grid.Row>
          <AdminError />
        </Grid.Row>
        <Grid.Row>
          {(() => {
            switch (active) {
              case "users":
                return <AdminUsers />;
              case "programs":
                return <AdminPrograms />;
              case "tracking":
                return <AdminTracking />;
              default:
                return null;
            }
          })()}
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = ({ auth, admin: { admin } }) => ({
  admin,
  auth,
});

const mapDispatchToProps = { adminGetPrograms, adminGetUsers, fetchUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
