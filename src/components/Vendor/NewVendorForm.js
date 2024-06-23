import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { API_URL_vendors } from "../../constants";
import Cookies from 'js-cookie';

class NewVendorForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pk: '',
      vendor: "",
      errorMessage: ''
    };
  }

  componentDidMount() {
    if (this.props.vendor) {
      const { pk, vendor } = this.props.vendor;
      this.setState({ pk, vendor });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  createVendor = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL_vendors, this.state, { headers })
      .then(() => {
        this.props.resetState();
        this.props.toggle();
      })
      .catch(error => {
        this.setState({ errorMessage:'Error adding vendor.' });
        console.error("Error adding vendor:", error.response.data);
      });
  };

  editVendor = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL_vendors + this.state.pk, this.state, { headers })
      .then(() => {
        this.props.resetState();
        this.props.toggle();
      })
      .catch(error => {
        console.log(error);
        this.setState({ errorMessage:'Error updating vendor.' });
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  render() {
    const { errorMessage } = this.state;

    return (
      <Form onSubmit={this.props.vendor ? this.editVendor : this.createVendor}>
        <FormGroup>
          <Label for="vendor">Vendor Name:</Label>
          <Input
            type="text"
            name="vendor"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.vendor)}
            required
          />
        </FormGroup>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button>Submit</Button>
      </Form>
    );
  }
}

export default NewVendorForm;