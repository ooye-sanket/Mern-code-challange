import React from "react";
import Table from "react-bootstrap/Table";
import "./style.css";

const keys = [
  "Id",
  "Title",
  "Description",
  "Price",
  "Category",
  "Sold",
  "Image",
];

function DataTable({ data }) {
  if (!data) {
    return null;
  }


  return (
    <>
      <Table bordered hover>
        <thead>
          <tr>
            {keys.map((key, index) => {
              return <th key={index}>{key}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.data.transactions?.map((rowData, index1) => {
            return (
              <tr key={index1}>
                {keys?.map((key, index2) => {
                  return (
                    <td key={index2}>{String(rowData[key.toLowerCase()])}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default DataTable;
