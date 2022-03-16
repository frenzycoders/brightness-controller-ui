
import './App.css';
import { useEffect, useState } from 'react';
import { Card, Box, InputLabel, MenuItem, FormControl, Select, CircularProgress, Slider } from '@mui/material';
import Axios from 'axios';

function App() {
  const [age, setAge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  let errorMessage = '';

  const [dList, setDList] = useState([]);

  useEffect((e) => {
    loadDisplay();
  }, []);

  const loadDisplay = async () => {
    try {
      let response = await Axios({
        method: "GET",
        url: "http://localhost:3001/monitors"
      });

      if (response.status === 200) {
        console.log(response.data)
        setIsLoading(false);
        setError(false);
        setDList(response.data.monitors);
      }
    } catch (error) {

      errorMessage = error.message;
      setIsLoading(false);
      setError(true);
    }
  }

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const onValueChange = async (val) => {
    let precentage = val / 100;
    try {
      let response = await Axios({
        method: "POST",
        url: "http://localhost:3001/monitors-brightness/" + precentage + "/" + age
      });

      if (response.status === 200) {
        console.log('Changes');
      }
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <>
      <div style={{ textAlign: "center", display: "flex", justifyContent: "center", padding: "200px" }}>
        <Card style={{ width: "250px", padding: "50px" }}>
          {
            isLoading ? (
              <CircularProgress />
            ) : error ? (
              <>
                <p style={{ color: "white" }}>{errorMessage}</p>
              </>
            ) : (
              <>

                <Box sx={{ minWidth: 120, maxWidth: 300 }} alignItems={"center"}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Display</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={age}
                      label="Select Display"
                      onChange={handleChange}
                    >
                      {
                        dList.map((e) => {
                          return (<MenuItem key={e} value={e}>{e}</MenuItem>);
                        })
                      }
                    </Select>
                  </FormControl>
                </Box>
              </>
            )
          }

        </Card>


      </div >
      <div style={{ display: "flex", justifyContent: "center" }}>
        {

          age !== null ? (
            <>
              <div style={{ width: "300px" }}>
                <Slider defaultValue={10} aria-label="Default" valueLabelDisplay="auto" onChange={(e, value) => onValueChange(value)} max={100} />
              </div>
            </>
          ) : (
            <></>
          )
        }
      </div>
    </>
  );
}

export default App;
