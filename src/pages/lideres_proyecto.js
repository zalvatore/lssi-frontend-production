import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import axios from "axios";
import { API_URL_lideres, API_URL_lideres_profit } from "../constants";
import Cookies from "js-cookie";
import LidersList from "../components/Lideres/LideresList";

const useLideresData = () => {
  const [lideres, setLideres] = useState([]);
  const [lideresProfit, setLideresProfit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = Cookies.get("token");
    if (token) {
      const headers = { Authorization: `Token ${token}` };
      try {
        const [lideresRes, lideresProfitRes] = await Promise.all([
          axios.get(API_URL_lideres, { headers }),
          axios.get(API_URL_lideres_profit, { headers })
        ]);
        setLideres(lideresRes.data);
        setLideresProfit(lideresProfitRes.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    } else {
      setError("No token found");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const joinData = () => {
    return lideres.map(lider => {
      const profitData = lideresProfit.find(profit => profit.lider === lider) || { pk: null, utilidad: null };
      return {
        lider,
        ...profitData
      };
    });
  };

  return { lideres: joinData(), loading, error, fetchData };
};

const Lideres = () => {
  const { lideres, loading, error, fetchData } = useLideresData();
  const user = Cookies.get("user");

  if (user !== "Zalvatore" && user !== "Bernardo"&& user !== "Luis") {
    return <Container style={{ marginTop: "20px" }}><h1>No Authorizado</h1></Container>;
  }

  if (loading) {
    return <Container style={{ marginTop: "20px" }}>Loading...</Container>;
  }

  if (error) {
    return <Container style={{ marginTop: "20px" }}>{error}</Container>;
  }

  return (
    <Container style={{ marginTop: "20px" }}>
      <h1>Utilidad Lideres de Proyectos</h1>
      <Row>
        <Col>
          <LidersList
            lideres={lideres}
            resetState={fetchData}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Lideres;