import { get } from "lodash";
import React, { Component } from "react";

import { connect } from "react-redux";
import { Grid, Menu } from "semantic-ui-react";
import { adminGetPrograms, adminGetUsers, fetchUser } from "../actions";
import {
  AdminPrograms,
  AdminUsers,
  AdminError,
  AdminLogin,
} from "../components";

export class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: "users",
    };
  }

  componentDidMount() {
    this.props.fetchUser();

    this.props.adminGetPrograms();
    this.props.adminGetUsers();
  }

  handleItemClick = (e, { name }) => this.setState({ active: name });

  render() {
    const { active } = this.state;
    const { auth } = this.props;
    return !get(auth, "admin", false) ? (
      <AdminLogin />
    ) : (
      <Grid centered key={"dashboard"}>
        <Grid.Row>
          <Menu>
            <Menu.Item
              name="users"
              active={active === "users"}
              onClick={this.handleItemClick}
            >
              Usuarios
            </Menu.Item>
            <Menu.Item
              name="programs"
              active={active === "programs"}
              onClick={this.handleItemClick}
            >
              Programas
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
