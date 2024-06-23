import React from "react";
import { Table } from "reactstrap";

function BoxscoreTableComponentVS({ BoxScore }) {
  console.log("BoxScore:", BoxScore);
  const currentWeek = getCurrentWeekNumber();

  function getCurrentWeekNumber() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000) + 1);
    return Math.ceil(days / 7);
  }

  function calculateTotalIncome(week, VS) {
    if (Array.isArray(BoxScore)) {
      const revenueData = BoxScore.find(
        (item) =>
          item.week_number === week &&
          item.boxScore === "revenue" &&
          item.valueStream === VS
      );
      const otherRevenueData = BoxScore.find(
        (item) =>
          item.week_number === week &&
          item.boxScore === "other" &&
          item.valueStream === VS
      );

      const revenue = revenueData ? revenueData.total : 0;
      const otherRevenue = otherRevenueData ? otherRevenueData.total : 0;

      return (revenue + otherRevenue).toLocaleString();
    } else {
      return "N/A";
    }
  }

  function calculateTotalByType(week, VS, boxScoreType) {
    if (Array.isArray(BoxScore)) {
      const data = BoxScore.find(
        (item) =>
          item.week_number === week &&
          item.boxScore === boxScoreType &&
          item.valueStream === VS
      );
      return data ? data.total : 0;
    } else {
      return 0;
    }
  }

  function calculateNetProfit(week, VS) {
    const revenue = calculateTotalByType(week, VS, "revenue");
    const otherRevenue = calculateTotalByType(week, VS, "other");
    const directCost = calculateTotalByType(week, VS, "direct");
    const conversionVSCost = calculateTotalByType(week, VS, "conversionVS");
    const investmentVSCost = calculateTotalByType(week, VS, "investmentVS");
    const conversionCost = calculateTotalByType(week, VS, "conversion");
    const investmentGSCost = calculateTotalByType(week, VS, "investmentGS");
    const tax = calculateTotalByType(week, VS, "tax");

    const totalIncome = revenue + otherRevenue;
    const totalCosts =
      directCost + conversionVSCost + investmentVSCost + conversionCost + investmentGSCost + tax;

    return (totalIncome + totalCosts).toLocaleString();
  }

  function renderRow(label, boxScoreType, VS) {
    return (
      <tr key={label}>
        <td>{label}</td>
        {lastFourWeeks.map((week) => {
          if (Array.isArray(BoxScore)) {
            const data = BoxScore.find(
              (item) =>
                item.week_number === week &&
                item.boxScore === boxScoreType &&
                item.valueStream === VS
            );
            const formattedTotal = data ? data.total.toLocaleString() : "-";
            return <td key={week}>{formattedTotal}</td>;
          } else {
            return <td key={week}>N/A</td>;
          }
        })}
      </tr>
    );
  }

  const lastFourWeeks = [currentWeek - 3, currentWeek - 2, currentWeek - 1, currentWeek];
  const VSArray = [
    'eu', 
    'general', 
    'latam', 
    'online',
    'Mexico Partners',
    'Mexico Training',
    'Mexico Projects',
    'Mexico',
    'Material Development',
    'Peru',
    'Products',
    'USA Partners',
    'USA Training',
    'USA Projects',
    'USA'

  ];

  return (
    <div>
      {VSArray.map((VS) => (
        <div key={VS}>
          <h1>Value Stream - {VS.toUpperCase()}</h1>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Value Stream - {VS}</th>
                {lastFourWeeks.map((week) => (
                  <th key={week}>{week}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderRow("Revenue", "revenue", VS)}
              {renderRow("Other Revenue", "other", VS)}
              <tr className="table-secondary">
                <td>Total Income</td>
                {lastFourWeeks.map((week) => (
                  <td key={week}>{calculateTotalIncome(week, VS)}</td>
                ))}
              </tr>
              {renderRow("Direct Cost + Partner Share", "direct", VS)}
              {renderRow("Value Stream Conversion Cost", "conversionVS", VS)}
              {renderRow("Value Stream Investment", "investmentVS", VS)}
              {renderRow("Conversion Cost General Services", "conversion", VS)}
              {renderRow("Investment General Services", "investmentGS", VS)}
              {renderRow("Tax", "tax", VS)}
              <tr className="table-success">
                <td>Net profit</td>
                {lastFourWeeks.map((week) => (
                  <td key={week}>{calculateNetProfit(week, VS)}</td>
                ))}
              </tr>
              <tr>
                <td>ROI</td>
              </tr>
            </tbody>
          </Table>
        </div>
      ))}
    </div>
  );
}

export default BoxscoreTableComponentVS;
