import React, { useEffect, useState } from "react";
import Transactions from "../../Components/Transactions";
import "./style.css";
import { Dropdown, InputGroup, Form, Button } from "react-bootstrap";
import Statistics from "../../Components/Statistics";
import BarChart from "../../Components/BarChart";
import {
  getBarChartData,
  getTransactions,
  getStatistics,
} from "../../Services/Transaction";

const months = [
  { name: "January", number: 1 },
  { name: "February", number: 2 },
  { name: "March", number: 3 },
  { name: "April", number: 4 },
  { name: "May", number: 5 },
  { name: "June", number: 6 },
  { name: "July", number: 7 },
  { name: "August", number: 8 },
  { name: "September", number: 9 },
  { name: "October", number: 10 },
  { name: "November", number: 11 },
  { name: "December", number: 12 },
];

export function Home() {
  const [month, setMonth] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState(null);
  const [barChartData, setBarChartData] = useState();
  const [statisticsData, setStatisticsData] = useState();
  const [translations, setTranslations] = useState();


  const TransactionsData = async () => {
    const res = await getTransactions(searchText, month, page, pageSize);
    setTranslations(res);
  };

  const StatisticsData = async () => {
    const res = await getStatistics(month);
    setStatisticsData(res);
  };

  const BarChartData = async () => {
    const res = await getBarChartData(month);
    setBarChartData(res);
  };

 
  useEffect(() => {
    TransactionsData();
  }, [page]);


  useEffect(() => {
    TransactionsData();
    StatisticsData();
    BarChartData();
  }, [month]);

  return (
    <div className="table-container">
      <div className="vertical-flex division ">
        <div className="horizantal-flex justify-space-between">
          <InputGroup className="mb-3 search-bar">
            <Form.Control
              placeholder="Search Transactions"
              aria-label="Search Transactions"
              aria-describedby="basic-addon2"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              variant="primary"
              id="button-addon2"
              onClick={() => TransactionsData()}
            >
              Search
            </Button>
          </InputGroup>

          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Select Month
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {months.map((month, index) => {
                return (
                  <Dropdown.Item
                    key={index}
                    onClick={(e) => setMonth(month.number)}
                  >
                    {month.name}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {translations && (
          <div className="table-division">
            <Transactions data={translations} />

            <div className="horizantal-flex justify-space-between">
              <div>
                <p>Page No : {page}</p>
              </div>
              <div>
                <ul className="horizantal-list">
                  <li>
                    <button
                      className="button"
                      onClick={() => page && setPage(page - 1)}
                    >
                      previous
                    </button>
                  </li>
                  <li>
                    <button
                      className="button"
                      onClick={() => setPage(page + 1)}
                    >
                      next
                    </button>
                  </li>
                </ul>
              </div>
              <div>Page Size : {pageSize}</div>
            </div>
          </div>
        )}
      </div>

      {statisticsData && (
        <div className="vertical-flex division">
          <div>
            <h4>Statistics - {months.find((m) => m.number == month).name}</h4>
          </div>
          <div className="horizantal-flex justify-center">
            <Statistics data={statisticsData} />
          </div>
        </div>
      )}

      {barChartData && (
        <div className="vertical-flex division">
          <div>
            <h4>
              Bar Chart Stats - {months.find((m) => m.number == month).name}
            </h4>
          </div>
          <div className="horizantal-flex justify-center">
            <BarChart data={barChartData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
