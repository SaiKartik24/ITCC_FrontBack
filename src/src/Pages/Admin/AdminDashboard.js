import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import ApexCharts from 'react-apexcharts';

export default function MixedCharts() {
  const [dep, setDep] = useState(''); 

  const [areaChartSeries, setAreaChartSeries] = useState([
    {
      name: 'Community Data',
      data: [44, 55, 13, 25] 
    }
  ]);

  const pieChartSeries = [44, 55, 13, 25]; 

  const barChartSeries = [
    {
      name: 'Bar Data 1',
      data: [10, 20, 30, 40]
    },
    {
      name: 'Bar Data 2',
      data: [20, 30, 40, 50]
    }
  ];

  const pieChartOptions = {
    chart: {
      type: 'pie',
      toolbar: {
        show: false
      }
    },
    labels: ['Angular', 'React.js', 'Node.js', 'Javascript'],
    colors: ['#FF4560', '#00E396', '#FEB019', 'blue'],
  };

  const areaChartOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['07-28-2024','07-29-2024','07-30-2024','07-31-2024','08-01-2024','08-02-2024','08-03-2024']
    },
    colors: ['#FF4560'],
  };

  const barChartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['Angular', 'React.js', 'Node.js', 'Javascript']
    },
    colors: ['#FF4560', '#00E396', '#FEB019'],
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setDep(selectedValue);
    updateAreaChartData(selectedValue);
  };

  const updateAreaChartData = (value) => {
    const allData = [44, 55, 13, 25];
    const filteredData = {
      10: [44, 0, 0, 0], 
      20: [0, 55, 0, 0],
      30: [0, 0, 13, 0],
      40: [0, 0, 0, 25],
    };

    if (value === '') {
      setAreaChartSeries([
        {
          name: 'Community Data',
          data: allData
        }
      ]);
    } else {
      setAreaChartSeries([
        {
          name: 'Community Data',
          data: filteredData[value] || [0, 0, 0, 0] 
        }
      ]);
    }
  };

  return (
    <div>
      <Accordion defaultExpanded>
        <AccordionSummary aria-controls="panel1-content" id="panel1-header">
          <Typography variant="h6">Users</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ApexCharts options={pieChartOptions} series={pieChartSeries} type="pie" width={380} align="center"/>
          <Typography variant="h6" align="center" style={{ marginTop: '10px' }}>Top 5 Community Users</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h6">Community</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel id="field3-label">Category</InputLabel>
                <Select
                  labelId="field3-label"
                  id="field3"
                  value={dep}
                  onChange={handleChange}
                  label="Category"
                  MenuProps={{ PaperProps: { style: { maxHeight: 160 } } }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={10}>Angular</MenuItem>
                  <MenuItem value={20}>React.js</MenuItem>
                  <MenuItem value={30}>Node.js</MenuItem>
                  <MenuItem value={40}>Javascript</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ApexCharts options={areaChartOptions} series={areaChartSeries} type="area" width={400}  />
              <Typography variant="h6"  style={{ marginTop: '10px' }}>Community Status</Typography>
            </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <ApexCharts options={barChartOptions} series={[barChartSeries[0]]} type="bar" width={400} />
                  <Typography variant="h6"  style={{ marginTop: '10px' }}>Community Users</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ApexCharts options={barChartOptions} series={[barChartSeries[1]]} type="bar" width={400} />
                  <Typography variant="h6" style={{ marginTop: '10px' }}>Community Posts</Typography>
                </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
