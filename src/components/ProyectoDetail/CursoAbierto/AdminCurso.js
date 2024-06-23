import React, { Component } from "react";
import { Label } from "reactstrap";

class AdminCurso extends Component {

    render() {
        const { 
            adminCostPercentage,
          } = this.state;
        return(<div>
            <h1>Admin Curso</h1>
            <Label>
            Admin Cost Percentage:
            <input
                type="number"
                value={adminCostPercentage}
                onChange={this.handleAdminCostChange}
            />
            </Label>
            

            </div>
            
        )

    }
}   export default AdminCurso;