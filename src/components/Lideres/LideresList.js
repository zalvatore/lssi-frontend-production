import React, { Component } from "react";
import { Table, Button, Input } from "reactstrap";
import axios from 'axios';
import { API_URL_lideres_profit, API_URL_lideres_profit_update } from '../../constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class LidersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profitShares: {}
    };
  }



  static defaultProps = {
    lideres: [],
  };

  handleProfitShareChange = (index, event) => {
    const { profitShares } = this.state;
    profitShares[index] = event.target.value;
    this.setState({ profitShares });
  };

  saveProfitShare = (index) => {
    const leader = this.props.lideres[index].lider;
    const pk= this.props.lideres[index].pk;
    const profitShare = this.state.profitShares[index];

    const url = pk ? `${API_URL_lideres_profit_update}/${pk}/` : API_URL_lideres_profit;
    const method = pk ? 'put' : 'post';
    const data = pk ? { utilidad: profitShare } : { lider: leader, utilidad: profitShare };

    axios({ method, url, data })
      .then(response => {
        toast.success(`Utilidad compartida para ${leader} se actalizo a ${profitShare}%`);
        if (this.props.resetState) {
          this.props.resetState();
        }
      })
      .catch(error => {
        toast.error(`Error con: ${leader}: ${error.message}`);
      });
  };

  render() {
    const { lideres } = this.props;
    const { profitShares } = this.state;

    return (
      <div>
        <Table striped>
          <thead>
            <tr>
              <th>Leader</th>
              <th>% de Utilidad</th>
              <th>Nuevo % de Utilidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lideres.length === 0 ? (
              <tr>
                <td colSpan="4">No leaders found.</td>
              </tr>
            ) : (
              lideres.map((lider, index) => (
                <tr key={lider.pk || index}>
                  <td>{lider.lider}</td>
                  <td>{lider.utilidad}%</td>
                  <td>
                    <Input
                      type="number"
                      placeholder="% de Utilidad"
                      value={profitShares[index] || ''}
                      onChange={(e) => this.handleProfitShareChange(index, e)}
                      className="mr-2"
                    />
                  </td>
                  <td>
                    <Button color="primary" onClick={() => this.saveProfitShare(index)}>
                      Guardar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        <ToastContainer />
      </div>
    );
  }
}

export default LidersList;