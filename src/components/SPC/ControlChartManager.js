import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table } from "reactstrap";
import axios from "axios";
import { API_URL_SPC, API_URL_SPC_List } from "../../constants";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SPCChart from './ControlChart'
import SPCChartHist from './hist'
import SPCChartBox from './box'

class ControlChartManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newChartName: "",
      dropdownOpen: false,
      selectedChart: "",
      spc_data: [],
      spc_data_list: [],
      dataEntry: "",
    };
  }

  componentDidMount() {
    this.getSPCList();
  }

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  handleChartNameChange = (event) => {
    this.setState({ newChartName: event.target.value });
  };

  getSPCData = () => {
    const { selectedChart } = this.state;
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };

    axios.get(API_URL_SPC, { headers })
      .then(res => {
        const data = res.data;
        if (data.length > 0) {
          const filteredData = data.filter((item) => item.name === selectedChart);
          this.setState({ spc_data: filteredData });
        }
      })
      .catch(error => console.log(error));
  };

  getSPCList = () => {
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_SPC_List, { headers })
      .then(res => this.setState({ spc_data_list: res.data }))
      .catch(error => console.log(error));
  };

  handleCreateNewChart = () => {
    const { newChartName } = this.state;
    const newData = {
      name: newChartName,
      // Add any other data you want to save to the database
    };

    axios.post(API_URL_SPC_List, newData)
      .then(response => {
        toast.success("Control chart created successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        this.setState({
          newChartName: "",
        });

        this.getSPCList();
      })
      .catch(error => {
        console.error("Error creating control chart:", error);
        toast.error("Error creating control chart", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      });
  };

  handleDataEntryRecord = () => {
    const { dataEntry, selectedChart } = this.state;
    const newData = {
      name: selectedChart,
      entry: dataEntry,
      // Add any other data you want to save to the database
    };

    axios.post(API_URL_SPC, newData)
      .then(response => {
        toast.success("Data entered successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        this.setState({
          dataEntry: "",
        });

        this.getSPCData();
      })
      .catch(error => {
        console.error("Error entering data:", error);
        toast.error("Error entering data", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      });
  };

  handleSelectChart = (chartName) => {
    this.setState({ selectedChart: chartName }, () => {
      this.getSPCData();
    });
  };

  handleDataEntryChange = (event) => {
    this.setState({ dataEntry: event.target.value });
  };

  handleControlLimitCalcChange = (event) => {
    this.setState({ controlLimitCalc: event.target.value });
  };

  countSPCDataElements = () => {
    return this.state.spc_data.length;
  };

  render() {
    const { 
      newChartName, 
      dropdownOpen, 
      selectedChart, 
      spc_data_list, 
      dataEntry,
      controlLimitCalc,
      spc_data } = this.state;

    const spcDataCount = this.countSPCDataElements();
  
    return (
      <div>
        <h2>Control Chart Management - Create or Select</h2>
  
        <ToastContainer />
        <Form>
          <br />
          <FormGroup>
            <Label for="newChartName">Create New Control Chart</Label>
            <Input
              type="text"
              name="newChartName"
              id="newChartName"
              placeholder="Enter a new control chart name"
              value={newChartName}
              onChange={this.handleChartNameChange}
            />
          </FormGroup>
          <Button onClick={this.handleCreateNewChart}>Create</Button>
          <br />
          <br />
          <FormGroup>
            <Label for="controlChartSelect">Select Control Chart</Label>
            <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdown}>
              <DropdownToggle caret>
                {selectedChart || "Select Control Chart"}
              </DropdownToggle>
              <DropdownMenu>
                {spc_data_list.map((chart, index) => (
                  <DropdownItem key={index} onClick={() => this.handleSelectChart(chart.name)}>
                    {chart.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </FormGroup>
          <br />
          
          {selectedChart && (
            <FormGroup>
              <Label for="dataEntry">Enter data</Label>
              <Input
                type="number"
                name="dataEntry"
                id="dataEntry"
                placeholder="Enter data..."
                value={dataEntry}
                onChange={this.handleDataEntryChange}
                inputMode="numeric" 
              />
            </FormGroup>
          )}
          
          {selectedChart && (
            <Button onClick={this.handleDataEntryRecord}>Record</Button>
          )}
          {selectedChart && (
            <FormGroup>
              <Label for="controlLimitCalc">Enter numebr of last data point to calcculate Control limits</Label>
              <Input
                type="number"
                name="controlLimitCalc"
                id="controlLimitCalc"
                placeholder="Enter data points..."
                value={controlLimitCalc}
                onChange={this.handleControlLimitCalcChange}
                inputMode="numeric" 
              />
            </FormGroup>
          )}
          
          {selectedChart && (
            <Button onClick={this.handleControlLimitCalcChange}>Calculate Control Limits</Button>
          )}
        </Form>

        {selectedChart && spcDataCount < 25 && (
          <h2>Total data entry is {spcDataCount}, min of 25 for statistical significance</h2>
        )}

        { selectedChart && spcDataCount < 25 && (
          <Table>
            <thead>
              <tr>
                <th>
                  Data Entry
                </th>
              </tr>
            </thead>
            <tbody>
              { !spc_data || spc_data.length <=0 ? (
                <tr>
                <td colSpan="15" align="center">
                  <b>Ups, todavia no hay datos!!</b>
                </td>
              </tr>

              ) : (
                spc_data.map( data => (
                  <tr key={data.pk}>
                    <td>{data.entry}</td>
                  </tr>
                )
                )
              )
              }
            </tbody>
          </Table>  
        )}

        { selectedChart && spcDataCount > 25 &&   (
          <SPCChart 
            spc_data={spc_data} 
            controlLimitCalc={controlLimitCalc} 
            />

        )}

        { selectedChart && spcDataCount > 25 && (
          <SPCChartHist spc_data={spc_data} />

        )}

        { selectedChart && spcDataCount > 25 && (
          <SPCChartBox spc_data={spc_data} />

        )}

      

      </div>
    );
  }
}

export default ControlChartManager;
