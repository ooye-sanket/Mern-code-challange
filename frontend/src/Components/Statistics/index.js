import React from "react";
import "./style.css";
import { Table } from "react-bootstrap";

function DataCard({ data }) {
  console.log(data);
  if (!data) {
    return <div> please loading..............</div>; 
  }

  // required data feching 
  const keys = Object.keys(data.data);

  return (
    <div>
      <Table bordered className="data-card">
        <tbody>
          {keys.map((key, index) => {
            return (
              <tr key={index}>
                <td>{key}</td>
                <td>{data.data[key]}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default DataCard;
