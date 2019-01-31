import classNames from "classnames";
import csv from "csvtojson";
import { isArray } from "lodash";
import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { Modal, TextArea, Form, Grid, Button, Icon } from "semantic-ui-react";
import { isJSON } from "validator";
import { adminImportPrograms } from "../actions";

class AdminImportPrograms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: "",
      open: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit() {
    let { data } = this.state;

    try {
      if (isJSON(data) && isArray(JSON.parse(data))) {
        data = JSON.parse(data);
        console.log("json: ", data);
        this.props.adminImportPrograms(data);
        this.setState({ open: false, data: "" });
      } else {
        csv({
          ignoreEmpty: true,
        })
          .fromString(data)
          .then(
            json => {
              console.log("csv :", json);
              this.props.adminImportPrograms(json);
              this.setState({ open: false, data: "" });
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
        trigger={
          <Button primary icon labelPosition="left">
            <Icon name="calendar plus outline" />
            Importar Programas
          </Button>
        }
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
      >
        <Modal.Header>Importar Programas</Modal.Header>
        <Modal.Content>
          <Button
            circular
            icon
            secondary
            style={{ position: "absolute", right: "0.5em", top: "0.5em" }}
            onClick={() => {
              this.setState({
                data: "",
              });
            }}
          >
            <Icon circular name="redo" />
          </Button>

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
                      <Button
                        icon
                        labelPosition="left"
                        circular
                        size="huge"
                        color="brown"
                      >
                        <Icon name="upload" />
                        Subir archivo
                      </Button>
                      <input {...getInputProps()} />
                    </div>
                  );
                }}
              </Dropzone>
            </Grid.Row>
            <Grid.Row>
              <Form>
                <Form.Button
                  icon
                  labelPosition="left"
                  size="big"
                  color="blue"
                  onClick={() => this.handleSubmit()}
                >
                  <Icon name="plus circle" />
                  Importar
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

const mapDispatchToProps = { adminImportPrograms };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminImportPrograms);
