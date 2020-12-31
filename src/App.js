import React,{ useEffect, useState } from 'react';
import './App.css';
import LineGraph from './components/LineGraph';
import axios from './axios';

function App() {

const [covidSummary, setcovidSummary] = useState({})
const [days, setDays] = useState(7);
const [country, setCountry] = useState('');
const [coronaCountAr, setCoronaCountAr] = useState([]);
const [label, setLabel] = useState([]);
// componentDidMount
  useEffect(() => {
    
    axios.get(`/summary`)
    .then(res => {
      setcovidSummary(res.data);
    
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  const formateDate = (date) => {
    const d= new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const _date = d.getDate();
    return `${year}-${month}-${_date}`;
  } 


  const countryHandler = (e) => {
    setCountry(e.target.value);
    const d = new Date();
    const to = formateDate(d);
    const from = formateDate(d.setDate(d.getDate() - days));
    //console.log(from, to);
    getCoronaReportByDateRange(e.target.value, from ,to);
  }
  const daysHandler = (e) => {
    setDays(e.target.value);
    const d = new Date();
    const to = formateDate(d);
    const from = formateDate(d.setDate(d.getDate() - e.target.value));
    getCoronaReportByDateRange(country, from, to);
  }

  const getCoronaReportByDateRange = (countrySlug, from, to) => {
    axios.get(`./country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`)
    .then(res => {
      console.log(res);
      const yAxisCoronaCount = res.data.map(d => d.Cases);
      const xAxisLabel = res.data.map(d => d.Date);
      setCoronaCountAr(yAxisCoronaCount);
      setLabel(xAxisLabel);
    })
    .catch(error => {
      console.log(error);
    })
  } 



  return (
    <div style={{ textAlign: "center",
      backgroundColor: "lightgrey",
      height: "900px"}}>
      <div>
        <div style={{
          backgroundColor: 'black',
          color: "white",
          padding: "1px",
          fontSize: "30px"
        }}>
          <p>World Wide Corona Test</p>
        </div>
        <div style={{
          marginTop: "20px",
          display:"flex",
          flexDirection:"column",
          alignItems:"center"
        }}>
          <select value={country} onChange={countryHandler} style={{
          width: "200px",
          marginBottom:"20px"
        }}>
            <option value="">Select Country</option>
            {
              covidSummary.Countries && covidSummary.Countries.map(country =>
              <option key={country.Slug } value={country.Slug}>{country.Country}</option>)
            }
          </select>
          <select  value={days} onChange={daysHandler} style={{
          width: "200px",
          
        }}>
            <option value="7">Last 6 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>
      <div style={{backgroundColor:"white",
                    width: "60%", marginLeft:"300px",height:"350px", marginBottom:"40px", borderRadius:"15px", boxShadow:"0px 0px 40px 1px black"}}>
      <LineGraph
        yAxis={coronaCountAr}
        label={label}
      />
      </div>
    </div>
  );
}

export default App;
