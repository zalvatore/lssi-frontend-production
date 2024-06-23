import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { 
  API_URL_costos, 
  API_URL_partidas, 
  API_URL_productos,
  API_URL_vendors,
} from "../../../constants";
import Cookies from 'js-cookie';

class ProyectoPartidaFrom extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pk: '',
      partida: '', 
      precio: '', 
      costo: '', 
      errorMessage: "",
      proyecto_code: "",
      asignado:"",
      asignadoList: [],
      isMaterialesDigitalesSelected: false,
      isInstructorSelected: false,
      isProveedorSelected: false,
      miembro_asignado:'',
      productos: [], 
      vendors: [],
      proveedor: '',
      cantidad: '',
      totalCost: '',
      productosDigtiales: [], 
      productosImpresos: [],
    };
  }

  componentDidMount() {
    const { instructores } = this.props;
  
    if (this.props.partida) {
      const {
        pk,
        partida,
        precio,
        costo,
        moneda,
        proyecto_code,
        referencia,
        asignado,
        isMaterialesDigitalesSelected,
        isProveedorSelected,
        miembro_asignado,
        productos,
        cantidad,
        proveedor,
      } = this.props.partida;
  
      this.setState({
        pk,
        partida,
        precio,
        costo,
        moneda,
        proyecto_code,
        referencia,
        asignado,
        isMaterialesDigitalesSelected,
        isInstructorSelected: miembro_asignado !== '',
        isProveedorSelected,
        miembro_asignado,
        productos,
        instructores,
        cantidad,
        totalCost: cantidad * costo,
        totalPrice: cantidad * precio,
        proveedor,
      }, () => {
        const token = Cookies.get("token");
        const headers = { Authorization: `Token ${token}` };
        axios.get(API_URL_productos, { headers })
          .then((response) => {
            const productos = response.data;
            const filteredProductosDigital = productos.filter(producto => producto.tipo === 'Manual digital');
            const filteredProductosImpreso = productos.filter(producto => producto.tipo === 'Manual impreso');
  
            if (this.state.asignado === 'Proveedor') {
              this.setState({
                isProveedorSelected: true,
              });
            }
  
            if (this.state.partida === "Materiales Digitales") {
              this.setState({
                isMaterialesDigitalesSelected: true,
                productos: filteredProductosDigital
              });
            } else if (this.state.partida === "Materiales impresos") {
              this.setState({
                isMaterialesDigitalesSelected: true,
                productos: filteredProductosImpreso
              });
            } else {
              this.setState({
                isMaterialesDigitalesSelected: false,
                productos: []
              });
            }
          })
          .catch(error => console.error("Error fetching productos:", error));
      });
    }
  
    this.getData();
    const proyectoCodeFrom = this.props.proyectoCode;
    this.setState({ proyecto_code: proyectoCodeFrom });
  }
  

  getData(){
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };
  
    // Consolidate multiple axios requests into Promise.all for better efficiency
    Promise.all([
      axios.get(API_URL_partidas, { headers }),
      axios.get(API_URL_costos, { headers }),
      axios.get(API_URL_productos, { headers }),
      axios.get(API_URL_vendors, { headers }),
    ]).then(responses => {
      const [partidasResponse, costosResponse, productosResponse, vendorResponse] = responses;
      this.setState({
        partidas: partidasResponse.data,
        costos: costosResponse.data,
        vendors: vendorResponse.data
      });
  
      const allProductos = productosResponse.data;
      const filteredProductosDigital = allProductos.filter(producto => producto.tipo === 'Manual digital');
      const filteredProductosImpreso = allProductos.filter(producto => producto.tipo === 'Manual impreso');
      this.setState({
        productosDigtiales: filteredProductosDigital,
        productosImpresos: filteredProductosImpreso,
      });
    }).catch(error => {
      console.error('Error fetching data:', error);
    });

  }
  

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeNumeric = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
  
    // Handle the case where value is initially undefined
    const newValue = isNaN(numericValue) ? '' : numericValue;
  
    this.setState(prevState => ({
      ...prevState,
      [name]: newValue
    }), () => {
      if (name === 'cantidad' || name === 'costo' || name === 'precio') {
        // Calculate totalCost when cantidad or costo or precio changes
        const { cantidad, costo, precio } = this.state;
        const totalCost = cantidad * costo;
        const totalPrice = cantidad * precio;
        this.setState({ totalCost, totalPrice });
      }
      console.log(`State ${name} updated:`, this.state[name]);
    });
  }

  onChangeAsignado = e => {
    const { name, value } = e.target; 
    //const { instructores } = this.props;
    if (value === 'Instructor') {
      this.setState({
        //asignadoList: instructores,
        [name]: value,
        isInstructorSelected: true,
        isProveedorSelected: false,
      });
    } else if (value === 'Proveedor') {
      this.setState({
        [name]: value,
        isInstructorSelected: false,
        isProveedorSelected: true,
      });
    }
    else {
      this.setState({
        [name]: value,
        isInstructorSelected: false,
        isProveedorSelected: false,
      });
    }
    
    //const filteredCostos = partners.filter(partner => partner.costo === value);

  };


  onChangePartida = e => {
    const { name, value } = e.target;
    const { productosDigtiales, productosImpresos } = this.state;
  
    if (value === "Materiales Digitales") {
      this.setState({
        isMaterialesDigitalesSelected: true,
        [name]: value,
        productos: productosDigtiales
      });
    } else if (value === "Materiales impresos") {
      this.setState({
        isMaterialesDigitalesSelected: true,
        [name]: value,
        productos: productosImpresos
      });
    } else {
      this.setState({
        isMaterialesDigitalesSelected: false,
        [name]: value,
        productos: []
      });
    }
  };
  

  createPartida = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL_partidas, this.state, { headers })
    .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
        console.log("Error adding partida:", error);
        this.setState({ errorMessage: 'Error adding partida.' });
    });
  };

  editPartida = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL_partidas + this.state.pk, this.state, { headers })
    .then(() => {
        this.props.resetState();
        this.props.toggle();
    }).catch(error => {
        this.setState({ errorMessage:'Error editing partida.' });
        console.error("Error editing partida:", error);
    });
};

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  defaultIfEmptyNumeric(value) {
    // Ensure that the value is not empty and return 0 if it is
    return value || 0;
  }

  render() {
    const { 
      partida, 
      errorMessage, 
      costos,
      productos,
      producto, 
      isMaterialesDigitalesSelected, 
      isInstructorSelected,
      isProveedorSelected,
      asignado,
      miembro_asignado,
      cantidad,
      vendors
    } = this.state;

    const proyectoCodeFrom = this.props.proyectoCode
    const proyectoNameFrom = this.props.proyectoName
    const totalPrice = this.state.precio * cantidad;
    const totalCost =  this.state.costo * cantidad;


    console.log('this.state', this.state)
    const h3Style = {
        color: 'blue' // Change the color to your desired value
      };
  
    return (
        <div>
            <h3>{proyectoNameFrom}</h3>
            {proyectoCodeFrom && 
            <h3 style={h3Style}>{proyectoCodeFrom.toUpperCase()}</h3>
            }
        <Form onSubmit={this.props.partida ? this.editPartida : this.createPartida}>
        <FormGroup>
          <Label for="partida">Selecciona Partida</Label>
          <Input
            type="select"
            name="partida"
            value={partida}
            onChange={this.onChangePartida}
          >
            <option key='0' value="">Partida:</option>
            {Array.isArray(costos) && costos
              .map(costo => costo.costo)
              .sort()
              .map(sortedCosto => (
                <option key={sortedCosto} value={sortedCosto}>
                  {sortedCosto}
                </option>
              ))}
          </Input>
          </FormGroup>
          {isMaterialesDigitalesSelected && (
              <FormGroup>
                <Label for="Selecciona Materiales">Selecciona Materiales:</Label>
                <Input
                  type="select"
                  name="producto"
                  value={producto}
                  onChange={this.onChange}
                  >
                    <option key='0' value="">Producto:</option>
                    {Array.isArray(productos) && productos.map(producto => (
                      <option key={producto.pk} value={producto.nombre}>
                        {producto.nombre}
                      </option>
                    ))}
              </Input>
              </FormGroup>
            )}
            <FormGroup>
            <Label for="asignado">Asignado:</Label>
              <Input
                type="select"
                name="asignado"
                value={asignado}
                onChange={this.onChangeAsignado}
                className="form-control"
              >
                <option key='0' value="">Selecciona</option>
                <option key='1' value="Instructor">Instructor</option>
                <option key='2' value="Proveedor">Proveedor</option>
                <option key='3' value="Sin Asignar">Sin Asignar</option>

              </Input>
          </FormGroup>
          {isInstructorSelected && (
            <FormGroup>
              <Label for="Selecciona miembro asignar">Selecciona miembro a Asignar:</Label>
              <Input
                type="select"
                name="miembro_asignado"
                value={miembro_asignado}
                onChange={this.onChange}
                >
                  <option key='0' value="">Miembro:</option>
                  {Array.isArray(this.props.instructores) && this.props.instructores
                  .map(instructor => (
                    <option key={instructor.pk} value={instructor.instructor}>
                      {instructor.instructor}
                    </option>
                  ))}
              </Input>
            </FormGroup>

          )
          }
          {isProveedorSelected && (
            <FormGroup>
              <Label for="Selecciona proveedor">Selecciona Proveedor:</Label>
              <Input
                type="select"
                name="proveedor"
                value={this.defaultIfEmpty(this.state.proveedor)}
                onChange={this.onChange}
                >
                  <option key='0' value="">Proveedor:</option>
                  {Array.isArray(vendors) && vendors
                  .map(proveedor => (
                    <option key={proveedor.pk} value={proveedor.vendor}>
                      {proveedor.vendor}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          )}
            <FormGroup>
                <Label for="precio">Precio Unitario:</Label>
                <Input
                    type="number"
                    name="precio"
                    onChange={this.onChangeNumeric}
                    value={this.defaultIfEmpty(this.state.precio)}
                    inputMode="numeric"
                    onWheel={(e) => e.target.blur()}
                />
            </FormGroup>
            <FormGroup>
                <Label for="costo">Costo Unitario:</Label>
                <Input
                    type="number"
                    name="costo"
                    onChange={this.onChangeNumeric}
                    value={this.defaultIfEmpty(this.state.costo)}
                    inputMode="numeric"
                    onWheel={(e) => e.target.blur()}
                />
            </FormGroup>
            <FormGroup>
                <Label for="costo">Cantidad:</Label>
                <Input
                    type="number"
                    name="cantidad"
                    onChange={this.onChangeNumeric}
                    value={this.defaultIfEmpty(this.state.cantidad)}
                    inputMode="numeric"
                    onWheel={(e) => e.target.blur()}
                />
            </FormGroup>
              <FormGroup>
              <Label for="totalPrice">Total Price:</Label>
              <Input
                type="text"
                name="totalPrice"
                onChange={this.onChange}
                value={totalPrice.toFixed(2)} // Adjust to the desired number of decimals
                
              />
            </FormGroup>
            <FormGroup>
              <Label for="totalCost">Total Cost:</Label>
              <Input
                type="text"
                name="totalCost"
                onChange={this.onChange}
                value={totalCost.toFixed(2)} // Adjust to the desired number of decimals
                
              />
            </FormGroup>

            <FormGroup>
              <Label for="moneda">Moneda:</Label>
                <Input
                  type="select"
                  name="moneda"
                  value={this.defaultIfEmpty(this.state.moneda)}
                  onChange={this.onChange}
                  className="form-control"
                >
                  <option key='0' value="">Selecciona moneda</option>
                  <option key='1' value="MXN">MXN</option>
                  <option key='2' value="USD">USD</option>
                  <option key='3' value="EUR">EUR</option>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="referencia">Referencia:</Label>
              <Input
                type="text"
                name="referencia"
                onChange={this.onChange}
                value={this.defaultIfEmpty(this.state.referencia)}
              />
            </FormGroup>
            
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            <Button>Guardar</Button>
        </Form>
      </div>
    );
  }
}

export default ProyectoPartidaFrom;