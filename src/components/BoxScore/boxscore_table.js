import React from "react";
import { Table } from "reactstrap";

function BoxscoreTableComponent({ BoxScoreAll }) {
  console.log("BoxScoreAll:", BoxScoreAll);
  const currentWeek = getCurrentWeekNumber();

  function getCurrentWeekNumber() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000) + 1);
    return Math.ceil(days / 7);
  }

  function calculateTotalIncome(week) {
    if (Array.isArray(BoxScoreAll)) {
      const revenueData = BoxScoreAll.find(
        (item) =>
          item.week_number === week &&
          item.boxScore === "revenue"
      );
      const otherRevenueData = BoxScoreAll.find(
        (item) =>
          item.week_number === week &&
          item.boxScore === "other"
      );

      const revenue = revenueData ? revenueData.total : 0;
      const otherRevenue = otherRevenueData ? otherRevenueData.total : 0;

      return (revenue + otherRevenue).toLocaleString();
    } else {
      return "N/A";
    }
  }

  function calculateNetProfit(week) {
    if (Array.isArray(BoxScoreAll)) {
      const revenueData = BoxScoreAll.find(
        (item) =>
          item.week_number === week &&
          item.boxScore === "revenue"
      );
      const otherRevenueData = BoxScoreAll.find(
        (item) =>
          item.week_number === week &&
          item.boxScore === "other"
      );
  
      const revenue = revenueData ? revenueData.total : 0;
      const otherRevenue = otherRevenueData ? otherRevenueData.total : 0;
  
      // Calculate the total income
      const totalIncome = revenue + otherRevenue;
  
      // Calculate the total cost by summing up the costs
      const directCost = getTotalCost(week, "direct");
      const conversionCostVS = getTotalCost(week, "conversionVS");
      const investmentCostVS = getTotalCost(week, "investmentVS");
      const conversionCostGS = getTotalCost(week, "conversion");
      const investmentCostGS = getTotalCost(week, "investmentGS");
      const tax = getTotalCost(week, "tax");
  
      // Calculate net profit by subtracting the total cost from total income
      const netProfit = totalIncome + (directCost + conversionCostVS + investmentCostVS + conversionCostGS + investmentCostGS + tax);
  
      return netProfit.toLocaleString();
    } else {
      return "N/A";
    }
  }
  
  function getTotalCost(week, boxScoreType) {
    if (Array.isArray(BoxScoreAll)) {
      const costData = BoxScoreAll.find(
        (item) =>
          item.week_number === week &&
          item.boxScore === boxScoreType
      );
      return costData ? costData.total : 0;
    } else {
      return 0;
    }
  }
  

  function renderRow(label, boxScoreType) {
    return (
      <tr key={label}>
        <td>{label}</td>
        {lastFourWeeks.map((week) => {
          if (Array.isArray(BoxScoreAll)) {
            const data = BoxScoreAll.find(
              (item) =>
                item.week_number === week &&
                item.boxScore === boxScoreType
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

  return (
    <div>
      <h1>LSSI Total</h1>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Value Streams All</th>
            {lastFourWeeks.map((week) => (
              <th key={week}>{week}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderRow("Revenue", "revenue")}
          {renderRow("Other Revenue", "other")}
          <tr className="table-secondary">
            <td>Total Income</td>
            {lastFourWeeks.map((week) => (
              <td key={week}>{calculateTotalIncome(week)}</td>
            ))}
          </tr>
          {renderRow("Direct Cost + Partner Share", "direct")}
          {renderRow("Value Stream Conversion Cost", "conversionVS")}
          {renderRow("Value Stream Investment", "investmentVS")}
          {renderRow("Conversion Cost General Services", "conversion")}
          {renderRow("Investment General Services", "investmentGS")}
          {renderRow("Tax", "tax")}
          <tr className="table-success">
            <td>Net profit</td>
            {lastFourWeeks.map((week) => (
              <td key={week}>{calculateNetProfit(week)}</td>
            ))}
          </tr>
          <tr>
            <td>ROI</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default BoxscoreTableComponent;
