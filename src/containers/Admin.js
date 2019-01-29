import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Menu } from "semantic-ui-react";
import { AdminPrograms, AdminUsers } from "../components";

export class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: "users",
    };
  }

  handleItemClick = (e, { name }) => this.setState({ active: name });

  render() {
    const { active } = this.state;
    return (
      <Grid centered>
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

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
