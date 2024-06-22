import React, { useState, useEffect } from 'react';
import { 
  Navbar,
  NavbarBrand, 
  Nav, 
  NavItem, 
  NavLink, 
  NavbarToggler, 
  Collapse, 
  Dropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem 
} from 'reactstrap';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const removeCookie = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.reload();
  };

  useEffect(() => {
    const user = Cookies.get('user');
    setLoggedInUser(user);
  }, []);

  return (
    <Navbar color="light" light expand="md" className="fixed-top">
      <NavbarBrand href="/">
        <img
          src="https://leansixsigmainstitute.org/wp-content/uploads/2023/11/cropped-LOGO-LSSI-ID.png"
          width="170"
          className="App-logo"
          alt="logo"
        />
      </NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/clientes">Clientes</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/partners">Equipo</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/productos">Productos</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/proveedores">Proveedores</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/costos">Costos</NavLink>
          </NavItem>
          <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle nav caret>
              Proyectos
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <NavLink href="/proyectos">Proyectos - General</NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink href="/detalle_proyectos">Proyectos - Detalles</NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink href="/lideres_proyectos">Proyectos - Lideres</NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink href="/proyecto_con_causa">Proyectos - Con Causa</NavLink>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavItem>
            <NavLink href="/sedes">Value Stream</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/movimientos">Movimientos Bancarios</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/estado_instructor">Pagos</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/BoxScore">Box Score</NavLink>
          </NavItem>
          
        </Nav>
      </Collapse>
      <div className="user-info ml-auto">
        {loggedInUser ? (
          <span>
            Bienvenido, {loggedInUser} | <Link to="/" onClick={removeCookie}>Sign Out</Link>
          </span>
        ) : (
          <span>
            Por favor <Link to="/">log in</Link>
          </span>
        )}
      </div>
    </Navbar>
  );
};

export default Header;