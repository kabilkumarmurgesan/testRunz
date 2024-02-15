/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssetsName } from '../../api/assetsAPI';
import { InfluxDB } from '@influxdata/influxdb-client';
// import { Line } from 'react-chartjs-2';
// import 'chartjs-plugin-streaming';
import { toast } from 'react-toastify';
import SpinerLoader from '../SpinnerLoader';
import loadable from '@loadable/component';

const ReactApexChart = loadable(() => import('react-apexcharts'));
// const Chart = require('react-chartjs-2').Chart;

const url = 'https://us-east-1-1.aws.cloud2.influxdata.com';
const token =
  'UvFb5MGj_jaqi9JTTNlVpKQIvNdoZF3-EilZhxCgESAdlbmNgVmJeXagVj12LomLF7-liSxePRlfio9k1r8fbA==';
const org = '63cd6a63187aa056';
// const bucket = 'Pasco Codenode';
const bucket = 'Codenode';

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

export default function RealtimeChart({
  handleDateChartRetrieve,
  savedConnectData,
  startDate,
  endDate,
  usedAsset,
  isPause,
  getsetUsedAsset,
}: any) {
  // const socket = io('https://api.dev.testrunz.com');
  const [charts, setCharts] = React.useState<any>([]);
  const [assets, setAssets] = React.useState(
    savedConnectData === null ? null : savedConnectData.assets,
  );
  const [colorsList, setColorsList] = React.useState<any>([
    '#e22828',
    '#90239f',
    '#111fdf',
    '#38e907',
    '#252525',
  ]);

  const [assetsOptions, setAssetsOptions] = React.useState<any>([]);
  const [measure, setMeasure] = React.useState<any>('Codenode1_connect');
  const [isChartPause, setIsChartPause] = React.useState<any>(isPause);
  const dispatch: any = useDispatch();
  const [channelOptions, setChannelOptions] = React.useState<any>([]);
  const [channelTemp, setChannelTemp] = React.useState<any>([]);
  const [chartData, setChartData] = React.useState<any>({
    datasets: [],
  });

  const [realTimeData, setRealTimeData] = React.useState<any>([]);

  // const [chartData2, setChartData2] = React.useState<any>({
  //   labels: [],
  //   datasets: [],
  // });

  const [series, setSeries] = React.useState<any>([]);
  const [realTimeSeries, setRealTimeSeries] = React.useState<any>([]);
  const [realTimeSeriesList, setRealTimeSeriesList] = React.useState<any>({});

  const [isSets, setIsSets] = React.useState(false);
  const [showArchivedChart, setShowArchivedChart] = React.useState<any>(false);
  const [channelList, setChannelList] = React.useState<any>([
    {
      sensor: null,
      axis: 'Y1',
      color: colorsList[0],
    },
    {
      sensor: null,
      axis: 'Y2',
      color: colorsList[1],
    },
    {
      sensor: null,
      axis: 'Y3',
      color: colorsList[2],
    },
    {
      sensor: null,
      axis: 'Y4',
      color: colorsList[3],
    },
  ]);
  const RealTimeOptions: any = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    chart: {
      id: 'realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1100,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [],
    stroke: {
      colors: [],
      curve: 'straight',
      width: 3,
    },

    xaxis: {
      title: {
        text: 'Data',
      },
      distribution: 'linear',
      type: 'datetime',
      range: 1000 * 10,
      tickAmount: 15, // Specifies the number of ticks on the y-axis
      categories: [],
    },
    yaxis: {
      title: {
        text: 'Time',
      },
      tickAmount: 15, // Specifies the number of ticks on the y-axis
    },
    legend: {
      show: false,
    },
  };
  const axisList: any = [
    {
      name: 'Y1',
      value: 'Y1',
    },
    {
      name: 'Y2',
      value: 'Y2',
    },
    {
      name: 'Y3',
      value: 'Y3',
    },
    {
      name: 'Y4',
      value: 'Y4',
    },
  ];

  const assetsSliceData = useSelector(
    (state: any) => state.assets.data?.get_all_assets_name,
  );

  const Placeholder = ({ children }: any) => {
    return <div style={{ color: 'lightgrey' }}>{children}</div>;
  };

  React.useEffect(() => {
    dispatch(fetchAssetsName());
  }, []);

  React.useEffect(() => {
    setIsChartPause(isPause);
  }, [isPause]);

  React.useEffect(() => {
    if (endDate && endDate !== null && assets && assets !== null) {
      setShowArchivedChart(true);
      setIsChartPause(true);
      getTimeRangeData();
    }
  }, [endDate, isSets]);

  React.useEffect(() => {
    if (assetsSliceData) {
      const assetsFilterData: any = assetsSliceData.filter((item: any) =>
        item.name.includes('_connect'),
      );
      setAssetsOptions(assetsFilterData);
      if (usedAsset !== null) {
        const temp = assetsSliceData.filter(
          (item: any) => item._id == usedAsset,
        );
        const atemp = temp.length > 0 ? temp[0].name : null;
        handleAssetsChange({ target: { value: atemp } });
      }
    }
  }, [assetsSliceData, usedAsset]);

  const getTimeRangeData = async () => {
    try {
      const selectedChannel: any = [];
      channelOptions.forEach((element: any) => {
        selectedChannel.push(element.name);
      });
      const fields = selectedChannel
        .map((item: any) => `r._field == "${item}"`)
        .join(' or ');
      const stemp: any = moment(startDate);
      const etemp: any = moment(endDate);
      // let etemp: any = moment('2024-01-31T13:58:54.037Z');
      // let stemp: any = moment('2024-01-30T21:53:55.637Z');
      const query2: any = `from(bucket: "${bucket}")
        |> range(start: ${stemp.toISOString()}, stop: ${etemp.toISOString()})
        |> filter(fn: (r) => r["_measurement"] == "${measure}" and ${fields})
        |> yield(name: "mean")`;
      // const chart2: any = { ...chartData2 };
      const channels = [...channelList];
      const seriesData: any = {};
      const seriesList: any = [];
      selectedChannel.forEach((channal: any, index: number) => {
        const dataObj: any = { [`${channal}`]: [] };
        Object.assign(seriesData, dataObj);
      });

      const result = await queryApi.collectRows(query2);
      result.forEach((dataset: any) => {
        selectedChannel.forEach((channal: any, index: number) => {
          // const sets = chart2.datasets[index];
          // const labels = chart2['labels'];
          if (
            dataset._value !== undefined &&
            dataset._value !== null &&
            channal === dataset._field
          ) {
            channels[index].sensor = channal;
            // labels.push(moment(dataset._time, 'HH:mm:ss').format('hh:mm:ss'));
            // sets.data.push(dataset._value);
            seriesData[`${dataset._field}`].push([
              new Date(dataset._time).getTime(),
              dataset._value.toFixed(2),
            ]);
          }
        });
      });

      Object.entries(seriesData).forEach(([key, value]) => {
        seriesList.push({
          name: key,
          data: value,
        });
      });
      setSeries(seriesList);
      setChannelList(channels);
      // setChartData2(chart2);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = React.useCallback(
    async (values: any) => {
      if (channelTemp.length !== 0) {
        try {
          const selectedChannel: any = channelTemp.filter(
            (item: any, index: number, inputArray: any) => {
              return inputArray.indexOf(item) == index;
            },
          );
          const fields = selectedChannel
            .map((item: any) => `r._field == "${item}"`)
            .join(' or ');
          const query1: any = `from(bucket: "${bucket}")
          |> range(start: -duration(v: 1s))
          |> filter(fn: (r) => r["_measurement"] == "${measure}" and ${fields})
          |> aggregateWindow(every: 1s, fn: mean, createEmpty: false)
          |> yield(name: "mean")`;
          const chart: any = { ...chartData };
          const result = await queryApi.collectRows(query1);
          if (result.length !== 0 && selectedChannel.length === result.length) {
            channelTemp.forEach((channal: any, index: number) => {
              result.forEach((dataset: any) => {
                const sets = chart.datasets[index];
                if (
                  dataset._value !== undefined &&
                  dataset._value !== null &&
                  channal === dataset._field
                ) {
                  sets.data.push({
                    x: moment(dataset._stop),
                    y: dataset._value,
                  });
                }
              });
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    [channelTemp],
  );

  const getRealTimeChartDate = async () => {
    try {
      const selectedChannel: any = channelTemp.filter(
        (item: any, index: number, inputArray: any) => {
          return inputArray.indexOf(item) == index;
        },
      );

      const fields = selectedChannel
        .map((item: any) => `r._field == "${item}"`)
        .join(' or ');
      const query1: any = `from(bucket: "${bucket}")
          |> range(start: -duration(v: 1s))
          |> filter(fn: (r) => r["_measurement"] == "${measure}" and ${fields})
          |> aggregateWindow(every: 1s, fn: mean, createEmpty: false)
          |> yield(name: "mean")`;
      const chart: any = { ...chartData };
      const result = await queryApi.collectRows(query1);
      const channels = [...channelList];
      const seriesData: any = realTimeSeriesList;
      const RealTimeData: any = [...realTimeData];
      const seriesList: any = [];
      if (result.length !== 0 && selectedChannel.length === result.length) {
        channelTemp.forEach((channal: any, index: number) => {
          result.forEach((dataset: any) => {
            const sets = chart.datasets[index];
            if (
              dataset._value !== undefined &&
              dataset._value !== null &&
              channal === dataset._field
            ) {
              RealTimeData.push(dataset._value.toFixed(2));
              seriesData[`${dataset._field}`].push({
                x: new Date(dataset._stop).getTime(),
                y: dataset._value.toFixed(2),
              });
            }
          });
        });
      }

      Object.entries(seriesData).forEach(([key, value]) => {
        seriesList.push({
          name: key,
          data: value,
        });
      });
      setRealTimeSeriesList(seriesData);
      setRealTimeData(RealTimeData);
      setRealTimeSeries(seriesList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddChannel = () => {
    const data: any = [...channelList];
    handleAddChannelColor('#222222', data.length + 1);
    data.length < 10
      ? data.push({
          color: colorsList[4],
          sensor: null,
          axis: 'Y1',
        })
      : toast('Please select add blow 10 chennals !', {
          style: {
            background: '#d92828',
            color: '#fff',
          },
        });
    setChannelList(data);
  };

  const handleChannelChange = (event: any, index: any) => {
    const channels = [...channelList];
    const data = { ...chartData };
    const realTimeSeries = realTimeSeriesList;
    const prevChannel = channels[index].sensor;
    channels[index].sensor = event.target.value;
    setChannelList(channels);
    if (event.target.value !== null) {
      const dataObj: any = { [`${event.target.value}`]: [] };
      Object.assign(realTimeSeries, dataObj);
    } else {
      delete realTimeSeries[`${prevChannel}`];
    }
    data.datasets[index] = {
      label: event.target.value === null ? `Y${index + 1}` : event.target.value,
      backgroundColor: colorsList[index],
      borderColor: colorsList[index],
      fill: false,
      lineTension: 0,
      borderDash: [8, 4],
      data: [],
    };

    const temp: any = [];
    data.datasets.map((item: any) => {
      !['Y1', 'Y2', 'Y3', 'Y4'].includes(item.label) && temp.push(item.label);
    });
    setRealTimeSeriesList(realTimeSeries);
    setChannelTemp(temp);
    setIsChartPause(false);
  };

  // const handleYAxisChange = (event: any, keyIndex: any) => {
  //   const channels = [...channelList];
  //   channels[keyIndex].axis = event.target.value;
  //   setChannelList(channels);
  // };

  const handleColorPickerChange = (event: any, key: any) => {
    const channels: any = [...channelList];
    channels[key].color = event.target.value;
    setChannelList(channels);
    // handleAddChannelColor(event.target.value, key);
  };

  const handleAddChannelColor = (value: string, key: any) => {
    let colorLists = [...colorsList];
    if (colorLists > key) {
      colorLists = [...colorLists, value];
    } else {
      colorLists[key] = value;
    }
    setColorsList(colorLists);
  };

  const handleAssetsChange = async (event: any) => {
    if (event.target.value !== null) {
      try {
        setMeasure(event.target.value);
        const query2 = `from(bucket: "${bucket}")
    |> range(start: -duration(v: 1s))
    |> filter(fn: (r) => r._measurement == "${event.target.value}")
    |> group(columns: ["_field"]) // Group by fiel	d to get all fields
    |> limit(n: 1) // Limit to 1 row (optional, you can adjust as needed)`;

        const result = await queryApi.collectRows(query2);
        const sensors: any = [];
        const data = { ...chartData };
        // const data2 = { ...chartData2 };
        // let temp = {
        //   name: 'temperature_data',
        // };

        // result.length === 0
        //   ? sensors.push(temp)
        //   : result.forEach((element: any) => {
        //       sensors.push({
        //         name: element._field,
        //       });
        //     });

        result.forEach((element: any) => {
          sensors.push({
            name: element._field,
          });
        });
        endDate && endDate !== null && setIsSets(true);
        setChannelOptions(sensors);
        setAssets(event.target.value);
        const atemp: any = assetsSliceData.filter(
          (item: any) => item.name == event.target.value,
        );
        getsetUsedAsset(atemp[0]._id);
        channelList.forEach((item: any, index: any) => {
          data.datasets[index] = {
            label: `Y${index + 1}`,
            backgroundColor: colorsList[index],
            borderColor: colorsList[index],
            fill: false,
            lineTension: 0,
            borderDash: [8, 4],
            data: [],
          };
        });

        // sensors.forEach((item: any, index: any) => {
        //   data2.datasets[index] = {
        //     label: item.name,
        //     backgroundColor: colorsList[index > 3 ? 4 : index],
        //     borderColor: colorsList[index > 3 ? 4 : index],
        //     fill: false,
        //     lineTension: 0,
        //     borderDash: [8, 4],
        //     data: [],
        //   };
        // });
      } catch (error) {
        toast(`Device not found !`, {
          style: {
            background: '#e2445c',
            color: '#fff',
          },
        });
      }
    } else {
      setAssets(event.target.value);
    }
  };

  const options: any = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    events: [],
    tooltips: { enabled: false },
    hover: { mode: null },
    plugins: {
      streaming: {
        pause: isChartPause,
        duration: 10000,
        refresh: 1000,
        delay: 5000,
        onRefresh: onRefresh,
      },
    },
    scales: {
      xAxes: [
        {
          type: 'realtime',
          distribution: 'linear',
          ticks: {
            displayFormats: 1,
            maxRotation: 0,
            minRotation: 0,
            stepSize: 1,
            maxTicksLimit: 30,
            minUnit: 'second',
            source: 'auto',
            autoSkip: true,
            callback: function (value: moment.MomentInput) {
              return moment(value, 'HH:mm:ss').format('hh:mm:ss');
            },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 50,
          },
        },
      ],
    },
    height: 300,
  };
  const optionsapex: any = {
    chart: {
      id: 'chart2',
      type: 'line',
      height: 230,
      toolbar: {
        autoSelected: 'pan',
        show: false,
      },
    },

    colors: colorsList,
    stroke: {
      colors: colorsList,
      curve: 'straight',
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'datetime',
    },
  };

  const optionsLine: any = {
    chart: {
      id: 'chart1',
      height: 130,
      type: 'area',
      brush: {
        target: 'chart2',
        enabled: true,
      },
      selection: {
        enabled: true,
        xaxis: {
          min: new Date(startDate).getTime(),
          max: new Date(endDate).getTime(),
        },
      },
    },
    colors: colorsList,
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      type: 'datetime',
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      tickAmount: 2,
    },
  };

  React.useEffect(() => {
    if (realTimeData.length !== 0) {
      const RealTimeOptionsChage: any = [...RealTimeOptions];
      RealTimeOptionsChage.xaxis.categories = realTimeData.map(
        (_item: any, index: number) =>
          new Date().getTime() - (realTimeData.length - index),
      );
    }
  }, [realTimeData]);

  React.useEffect(() => {
    let interval: any = 0;
    if (channelTemp.length !== 0) {
      interval = setInterval(() => {
        getRealTimeChartDate();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [channelTemp]);

  React.useEffect(() => {
    return () => {
      let temp = {
        assets,
        chartData,
        channelList,
      };
      handleDateChartRetrieve(temp);
    };
  }, [chartData, assets, channelList]);

  return (
    <Box>
      <Grid container sx={{ my: 2 }} spacing={2}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={10}
          xl={10}
          style={{ borderRight: '1px solid #e4e5e7' }}
          className="chart-left"
        >
          <Grid container sx={{ px: 4 }}>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Select
                labelId="view-all-label"
                id="time-sec"
                value={assets}
                displayEmpty
                IconComponent={ExpandMoreOutlinedIcon}
                MenuProps={{
                  disableScrollLock: true,
                  marginThreshold: null,
                }}
                onChange={(event) => handleAssetsChange(event)}
                disabled={isSets}
                renderValue={
                  assets !== null
                    ? undefined
                    : () => <Placeholder>Select Assets</Placeholder>
                }
                size="small"
                style={{
                  width: '250px',
                  borderRadius: '10px',
                }}
              >
                {assetsOptions.map((item: any, index: number) => (
                  <MenuItem key={index} value={item.name}>
                    {item.name === null ? 'Null' : item.name}
                  </MenuItem>
                ))}
                <MenuItem value={null}>-- Clear Data --</MenuItem>
              </Select>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              textAlign={'end'}
            ></Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            {showArchivedChart ? (
              <>
                {series.length !== 0 ? (
                  <>
                    <div id="chart-line2">
                      <ReactApexChart
                        options={optionsapex}
                        series={series}
                        type="line"
                        height={480}
                      />
                    </div>
                    <div id="chart-line">
                      <ReactApexChart
                        options={optionsLine}
                        series={series}
                        type="area"
                        height={180}
                      />
                    </div>
                  </>
                ) : (
                  <SpinerLoader isLoader={series.length === 0} />
                )}
              </>
            ) : (
              <ReactApexChart
                options={RealTimeOptions}
                series={realTimeSeries}
                type="line"
                height={540}
              />
            )}
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={2}
          xl={2}
          style={{ overflowY: 'scroll' }}
          className="chart-right"
        >
          <Grid container alignItems={'center'}>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <Typography variant="body1" fontWeight={500}>
                Channels
              </Typography>
            </Grid>
            <Grid item xs={8} sm={8} md={8} lg={8} xl={8} textAlign={'end'}>
              <Button
                variant="contained"
                className="add-chart"
                sx={{ mr: 2 }}
                onClick={() => handleAddChannel()}
              >
                <AddIcon />
              </Button>
              <Button variant="contained" className="remove-chart" disabled>
                <RemoveIcon />
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }} style={{ overflowY: 'auto', height: '580px' }}>
            {channelList?.map((element: any, key: number) => (
              <Box key={key}>
                <Grid container>
                  <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                    <Box>
                      <Box className="color-chart">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            labelId="view-all-label"
                            size="small"
                            value={element.sensor}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            onChange={(event) => {
                              handleChannelChange(event, key);
                            }}
                            renderValue={
                              element.sensor !== null
                                ? undefined
                                : () => <Placeholder>Select</Placeholder>
                            }
                            disabled={assets === null || isSets}
                            style={{ width: '90%' }}
                          >
                            {channelOptions.map((item: any, index: number) => (
                              <MenuItem key={index} value={item.name}>
                                {item.name}
                              </MenuItem>
                            ))}
                            <MenuItem value={null}>-- Clear Data --</MenuItem>
                          </Select>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Box>
                      <Box className="color-chart">
                        {/* <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            labelId="view-all-label"
                            size="small"
                            value={element.axis}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            onChange={(event) => handleYAxisChange(event, key)}
                            disabled={assets === null || isSets}
                            renderValue={
                              element.axis !== null
                                ? undefined
                                : () => <Placeholder>Axis</Placeholder>
                            }
                            fullWidth
                          >
                            {axisList.map((item: any, index: any) => (
                              <MenuItem key={index} value={item.value}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box> */}
                        <Box className="color-picker">
                          <input
                            style={{
                              backgroundColor: element.color,
                              color: element.color,
                            }}
                            type="color"
                            className="color-input"
                            value={element.color}
                            onChange={(event) =>
                              handleColorPickerChange(event, key)
                            }
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Divider orientation="horizontal" sx={{ py: 0 }} />
    </Box>
  );
}
