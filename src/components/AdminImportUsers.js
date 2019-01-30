import classNames from "classnames";
import csv from "csvtojson";
import { isArray } from "lodash";
import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { Modal, TextArea, Form, Grid, Button, Icon } from "semantic-ui-react";
import { isJSON } from "validator";
import { adminImportUsers } from "../actions";

class AdminImportUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: "",
      open: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();

    let { data } = this.state;

    try {
      if (isJSON(data) && isArray(JSON.parse(data))) {
        data = JSON.parse(data);
        console.log("json: ", data);
        this.props.adminImportUsers(data);
        this.setState({ open: false });
      } else {
        csv({
          ignoreEmpty: true,
        })
          .fromString(data)
          .then(
            json => {
              console.log("csv :", json);
              this.props.adminImportUsers(json);
              this.setState({ open: false });
            },
            error => {
              console.error(error);
            }
          );
      }
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { open, data } = this.state;
    return (
      <Modal
        open={open}
        trigger={<Button>Importar Usuarios</Button>}
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        onSubmit={this.handleSubmit}
      >
        <Modal.Header>Importar Usuarios</Modal.Header>
        <Modal.Content>
          <Grid centered>
            <Grid.Row>
              <Dropzone
                accept=".json,.csv"
                onDrop={(acceptedFiles, rejectedFiles) => {
                  acceptedFiles.forEach(async (file, key) => {
                    fetch(URL.createObjectURL(file))
                      .then(response => response.text())
                      .then(text => {
                        this.setState({
                          data: this.state.data + text,
                        });
                      });
                  });
                }}
              >
                {({ getRootProps, getInputProps, isDragActive }) => {
                  return (
                    <div
                      {...getRootProps()}
                      className={classNames("dropzone", {
                        "dropzone--isActive": isDragActive,
                      })}
                    >
                      <Icon size="large" name="upload" />
                      <input {...getInputProps()} />
                    </div>
                  );
                }}
              </Dropzone>
            </Grid.Row>
            <Grid.Row>
              <Form>
                <Form.Button size="big" color="blue">
                  Enviar
                </Form.Button>

                <TextArea
                  ref={ref => {
                    if (ref) ref.focus();
                  }}
                  onChange={(event, { value: data }) => {
                    this.setState({ data });
                  }}
                  style={{ width: "45em" }}
                  autoHeight
                  placeholder=".json o .csv"
                  value={data}
                />
              </Form>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = { adminImportUsers };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminImportUsers);
