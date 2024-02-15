import { CloseOutlined } from '@mui/icons-material';
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
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { TableChartStaticData } from '../../utils/data';
import moment from 'moment';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTableChartData } from '../../api/RunsAPI';
// import { TableChartStaticData } from '../../utils/data';

export default function TableChart({
  staticChartData,
  handleDateChartRetrieve,
  savedChartData,
}: any) {
  const [colorList, setColorList] = React.useState<any>([
    '#e22828',
    '#90239f',
    '#111fdf',
    '#38e907',
    '#222222',
  ]);

  const channelOptions = [
    {
      channel: null,
      yAxisValue: 'Y1',
      color: colorList[0],
      yAxisId: 'left1',
      orientation: 'left',
      dataKey: 'plot1',
      name: 'Y1',
    },
    {
      channel: null,
      yAxisValue: 'Y2',
      color: colorList[1],
      yAxisId: 'right1',
      orientation: 'right',
      dataKey: 'plot2',
      name: 'Y2',
    },
    {
      channel: null,
      yAxisValue: 'Y3',
      color: colorList[2],
      yAxisId: 'left2',
      orientation: 'left',
      dataKey: 'plot3',
      name: 'Y3',
    },
    {
      channel: null,
      yAxisValue: 'Y4',
      color: colorList[3],
      yAxisId: 'right2',
      orientation: 'right',
      dataKey: 'plot4',
      name: 'Y4',
    },
  ];

  const yAxisOptions: any = [
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

  // const initialData: any = [
  //   {
  //     selectedTable: null,
  //     channelOptions: channelOptions,
  //     xAxisValue: null,
  //     yAxisOptions: [],
  //   },
  // ];

  const [chartData, setChartData] = React.useState<any>(
    savedChartData === null
      ? staticChartData === ''
        ? []
        : staticChartData
      : savedChartData,
  );
  console.log('savedChartData', savedChartData);
  console.log('staticChartData', staticChartData);

  // const [chartData, setChartData] = React.useState<any>(TableChartStaticData);
  const [tableList, setTableList] = React.useState<any>([]);
  const [channelsList, setChannelsList] = React.useState<any>([]);

  React.useEffect(() => {
    const data: any = [];
    const tableList: any = [];
    const channels: any = [];
    if (savedChartData === null) {
      chartData?.forEach((element: any, index: number) => {
        tableList.push({
          name: element.label,
          value: element.value,
        });

        element?.data?.forEach((channel: any) => {
          channels.push({
            name: channel.label,
            value: channel.label,
            index: index,
            data: channel.values,
          });
        });
      });
    } else {
      staticChartData?.forEach((element: any, index: number) => {
        tableList.push({
          name: element.label,
          value: element.value,
        });

        element?.data?.forEach((channel: any) => {
          channels.push({
            name: channel.label,
            value: channel.label,
            index: index,
            data: channel.values,
          });
        });
      });
    }
    data.push({
      selectedTable: null,
      channelOptions: channelOptions,
      channelsList: [],
      xAxisValue: null,
      yAxisOptions: yAxisOptions,
      charts: [],
    });
    setTableList(tableList);
    if (savedChartData === null) {
      setChartData(data);
    }
    setChannelsList(channels);
    // setCData(charts)
  }, []);

  const handleTableChange = (event: any, index: number) => {
    debugger;
    const data: any = [...chartData];
    const activeTable = tableList.findIndex(
      (item: any) => item.name === event.target.value,
    );
    if (activeTable !== -1) {
      const activeChannel = channelsList.filter(
        (item: any) => item.index === activeTable,
      );
      data[index].selectedTable = event.target.value;
      data[index].channelsList = activeChannel;
      data[index].xAxisValue = null;
      data[index].charts = [];
      data[index].channelOptions.forEach((element: any) => {
        element.channel = null;
      });
      setChartData(data);
    } else {
      data[index] = {
        selectedTable: null,
        channelOptions: channelOptions,
        channelsList: [],
        xAxisValue: null,
        yAxisOptions: yAxisOptions,
        charts: [],
      };
      setChartData(data);
    }
    console.log('chartData', chartData);
  };

  const handleChannelChange = (event: any, index: number, keys: number) => {
    const data: any = [...chartData];
    const channels: any = { ...data[index] };
    const charts: any = [...channels.charts];
    const axisPosition: any =
      channels.channelOptions[keys].dataKey.charAt(
        channels.channelOptions[keys].dataKey.length - 1,
      ) - 1;
    const channelPosition = channels.channelsList.findIndex(
      (item: any) => item.name === event.target.value,
    );
    const channelCount = channels.channelsList.length;
    const currentPlotData = channels.channelsList.find(
      (item: any) => item.name === event.target.value,
    );
    if (channelPosition !== -1) {
      channels.channelOptions[keys].channel = event.target.value;
      channels.channelOptions[keys].color = colorList[keys];
      for (let i = 0; i < currentPlotData.data.length; i++) {
        if (channels.charts.length === 0) {
          charts.push({
            [`plot${keys + 1}`]: currentPlotData.data[i]
              ? currentPlotData.data[i]
              : 0,
          });
        } else {
          charts[i][`plot${keys + 1}`] = currentPlotData.data[i]
            ? currentPlotData.data[i]
            : 0;
        }
      }
      data[index].charts = charts;
      setChartData(data);
    } else {
      channels.channelOptions[keys].channel = event.target.value;
      channels.channelOptions[keys].color = colorList[axisPosition];
      channels.charts.forEach((_element: any, position: number) => {
        delete channels.charts[position][`plot${axisPosition + 1}`];
      });
      setChartData(data);
    }
    console.log('handleChannelChange', chartData);
  };

  const handleXAxisChange = (event: any, index: number) => {
    const data = [...chartData];
    data[index].xAxisValue = event.target.value;
    const channels: any = { ...data[index] };
    const charts: any = [...channels.charts];
    const channelIndex = channelsList.findIndex(
      (item: any) => item.name === event.target.value,
    );
    const channelCount = channels.channelsList.length;
    const currentPlotData = channels.channelsList.find(
      (item: any) => item.name === event.target.value,
    );
    if (currentPlotData)
      for (let i = 0; i < currentPlotData.data.length; i++) {
        if (channels.charts.length === 0) {
          charts.push({
            [`Xplot${channelIndex + 1}`]: currentPlotData.data[i]
              ? currentPlotData.data[i]
              : 0,
          });
        } else {
          charts[i][`Xplot${channelIndex + 1}`] = currentPlotData.data[i]
            ? currentPlotData.data[i]
            : 0;
        }
      }
    if (channelIndex !== -1) {
      data[index].xDataKey = `Xplot${channelIndex + 1}`;
    } else {
      charts.forEach((element: any, position: number) => {
        delete charts[position][`Xplot${index + 1}`];
      });
    }
    data[index].charts = charts;
    setChartData(data);
  };

  const handleYAxisChange = (event: any, index: number, key: any) => {
    const data = [...chartData];
    const channels: any = { ...data[index] };
    const channelOptions: any = { ...channels.channelOptions[key] };
    let yAxisId =
      event.target.value === 'Y4'
        ? 'right2'
        : event.target.value === 'Y2'
        ? 'right1'
        : event.target.value === 'Y1'
        ? 'left1'
        : 'left2';
    let orientation =
      event.target.value === 'Y4' || event.target.value === 'Y2'
        ? 'right'
        : 'left';
    const newChannelIndex = data[index].channelOptions.length;
    channels.channelOptions[key] = {
      channel: channelOptions.channel,
      yAxisValue: event.target.value,
      color: channelOptions.color ? channelOptions.color : '#222222',
      yAxisId: yAxisId,
      orientation: orientation,
      dataKey: channelOptions.dataKey,
      name: event.target.value,
    };
    setChartData(data);
  };

  const handleColorPickerChange = (event: any, dataIndex: any, key: any) => {
    const data = [...chartData];
    const values = { ...data[dataIndex] };
    handleAddChannelColor(event.target.value, key);
    values.channelOptions[key].color = event.target.value;
    setChartData(data);
  };

  const handleAddChannelColor = (value: string, key: any) => {
    let colorLists = [...colorList];
    // debugger;
    if (colorLists > key) {
      colorLists = [...colorLists, value];
    } else {
      colorLists[key] = value;
    }
    setColorList(colorLists);
  };

  const handleAddChannel = (index: any) => {
    const data: any = [...chartData];
    const newChannelIndex = data[index].channelOptions.length;
    handleAddChannelColor('#222222', newChannelIndex);
    const stringLen =
      data[index].channelOptions[newChannelIndex - 1].dataKey.length;
    data[index].channelOptions[newChannelIndex] = {
      channel: null,
      yAxisValue: 'Y1',
      color: colorList[4],
      yAxisId: 'left1',
      orientation: 'left',
      name: 'Y1',
      dataKey: `plot${newChannelIndex + 1}`,
    };
    // data[index].channelOptions[0].data.forEach((item) => {
    //   plot1.push({
    //     plot1: item.plot1,
    //   });
    // });
    // data[index].channelOptions[newChannelIndex] = {
    //   axisOptions: {
    //     yAxisId:
    //       newChannelIndex % 2 === 0
    //         ? `left${newChannelIndex}`
    //         : `right${newChannelIndex}`,
    //     orientation: newChannelIndex % 2 === 0 ? 'left' : 'right',
    //     dataKey: `plot${newChannelIndex + 1}`,
    //     name: yAxisOptions[0].name,
    //     color: colorList[0],
    //   },
    //   lineOptions: {
    //     yAxisId:
    //       newChannelIndex % 2 === 0
    //         ? `left${newChannelIndex}`
    //         : `right${newChannelIndex}`,
    //     color: colorList[0],
    //     dataKey: `plot${newChannelIndex + 1}`,
    //   },
    //   data: plot1,
    //   value: yAxisOptions[0].value,
    // };
    setChartData(data);
  };

  const handleRemoveChannel = (index: any) => {
    const data: any = [...chartData];
    const channels: any = { ...data[index] };
    const charts: any = [...channels.charts];
    let colorLists = [...colorList];
    const channelCount = channels.channelOptions.length;
    channels.channelOptions.pop();
    charts.forEach((_element: any, position: number) => {
      delete charts[position][`plot${channelCount}`];
    });
    colorLists.pop();
    setColorList(colorLists);
    setChartData(data);
    // setChartData((prevData) => {
    //     const data = [...prevData];
    //     data[index].channelOptions.pop();
    //     return data;
    //   });
  };

  const handleAddChart = () => {
    const data: any = [...chartData];
    const newIndex = data.length;
    data[newIndex] = {
      selectedTable: null,
      channelOptions: channelOptions,
      channelsList: [],
      xAxisValue: null,
      yAxisOptions: yAxisOptions,
      charts: [],
    };
    setChartData(data);
  };

  const handleRemoveChart = (index: number) => {
    setChartData((prevData: any) => {
      const newArray = prevData.filter(
        (item: any, key: number) => key !== index,
      );
      return newArray;
    });
  };

  const Placeholder = ({ children }: any) => {
    return <div style={{ color: 'lightgrey' }}>{children}</div>;
  };

  React.useEffect(() => {
    return () => {
      handleDateChartRetrieve(chartData, 'table');
    };
  }, [chartData]);
  return (
    <Box>
      <>
        {chartData?.map((data: any, index: any) => (
          <>
            <Grid container key={index} sx={{ my: 2 }} spacing={2}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={9}
                xl={9}
                // sx={{ pr: 4 }}
                style={{ borderRight: '1px solid #e4e5e7' }}
                className="chart-left"
              >
                {JSON.stringify(tableList.length)}

                <Grid container sx={{ pr: 4 }}>
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                    <Select
                      labelId="view-all-label"
                      id="time-sec"
                      value={data.selectedTable}
                      displayEmpty
                      IconComponent={ExpandMoreOutlinedIcon}
                      onChange={(event) => handleTableChange(event, index)}
                      MenuProps={{
                        disableScrollLock: true,
                        marginThreshold: null,
                      }}
                      renderValue={
                        data.selectedTable !== null
                          ? undefined
                          : () => <Placeholder>Select Table</Placeholder>
                      }
                      size="small"
                      style={{
                        width: '100%',
                        borderRadius: '10px',
                        marginBottom: '15px',
                        marginRight: '2rem',
                      }}
                    >
                      {tableList?.map((item: any, index: number) => (
                        <MenuItem key={index} value={item.value}>
                          {item.name}
                        </MenuItem>
                      ))}
                      {tableList.length > 0 ? (
                        <MenuItem value={null}>-- Clear Data --</MenuItem>
                      ) : (
                        <MenuItem>-- No Recored --</MenuItem>
                      )}
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                    <Box className="color-chart" sx={{ marginLeft: '2rem' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Typography className="xy-sec">X</Typography>
                        <Select
                          id="x-sec"
                          MenuProps={{
                            disableScrollLock: true,
                            marginThreshold: null,
                            anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'left',
                            },
                            transformOrigin: {
                              vertical: 'top',
                              horizontal: 'left',
                            },
                          }}
                          labelId="view-all-label2"
                          size="small"
                          value={data.xAxisValue}
                          displayEmpty
                          IconComponent={ExpandMoreOutlinedIcon}
                          onChange={(event) => handleXAxisChange(event, index)}
                          renderValue={
                            data.xAxisValue !== null
                              ? undefined
                              : () => <Placeholder>Channel</Placeholder>
                          }
                          disabled={data.selectedTable === null}
                          style={{ width: '100%' }}
                        >
                          {data.channelsList?.map(
                            (item: any, index: number) => (
                              <MenuItem key={index} value={item.name}>
                                {item.name}
                              </MenuItem>
                            ),
                          )}
                          <MenuItem value={null}>-- Clear Data --</MenuItem>
                        </Select>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    textAlign={'end'}
                  >
                    <>
                      <Button
                        variant="contained"
                        className="add-chart"
                        onClick={handleAddChart}
                        sx={{ mr: 2 }}
                      >
                        <AddIcon /> &nbsp; Add
                      </Button>
                      {index >= 1 && (
                        <Button
                          variant="contained"
                          className="add-chart"
                          onClick={() => handleRemoveChart(index)}
                        >
                          <CloseOutlined sx={{ fontSize: '18px' }} /> &nbsp;
                          Remove
                        </Button>
                      )}
                    </>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4 }}>
                  <ResponsiveContainer width="100%" height={500}>
                    <LineChart data={data.charts}>
                      <XAxis
                        orientation="bottom"
                        dataKey={data.xDataKey}
                        label={{
                          value: data.xAxisValue,
                          position: 'insideBottom',
                          fill: '#111fdf',
                        }}
                        tick={{
                          fontSize: 12,
                        }}
                        domain={['auto', 'auto']}
                        // interval="preserveStart"
                        type="number"
                        name={data.xAxisValue}
                      />
                      {data.channelOptions?.map(
                        (axis: any, axisIndex: number) => (
                          <YAxis
                            key={axisIndex}
                            yAxisId={axis.yAxisId}
                            orientation={axis.orientation}
                            label={{
                              value: axis.name,
                              angle: -90,
                              position: 'insideBottom',
                              fill: axis.color,
                            }}
                            tick={{
                              fontSize: 12,
                            }}
                            domain={['auto', 'auto']}
                            name={data.xAxisValue}
                          />
                        ),
                      )}
                      <Tooltip />
                      <CartesianGrid
                        stroke="#f5f5f5"
                        strokeDasharray="3 3"
                        strokeWidth={2}
                      />

                      {data.channelOptions?.map(
                        (line: any, lineIndex: number) => (
                          <Line
                            key={lineIndex}
                            type="linear"
                            dataKey={line.dataKey}
                            stroke={line.color}
                            strokeWidth={2}
                            yAxisId={line.yAxisId}
                            dot={{
                              r: 2,
                              fill: line.color,
                            }}
                          />
                        ),
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={3}
                xl={3}
                style={{ overflowY: 'scroll' }}
                className="chart-right"
              >
                <Grid container alignItems={'center'}>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <Typography variant="body1" fontWeight={500}>
                      Channels
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={8}
                    sm={8}
                    md={8}
                    lg={8}
                    xl={8}
                    textAlign={'end'}
                  >
                    <Button
                      variant="contained"
                      className="add-chart"
                      sx={{ mr: 2 }}
                      onClick={() => handleAddChannel(index)}
                      disabled={data.selectedTable === null}
                    >
                      <AddIcon />
                    </Button>
                    <Button
                      variant="contained"
                      className={
                        data.channelOptions?.length < 5
                          ? 'remove-chart'
                          : 'add-chart'
                      }
                      onClick={() => handleRemoveChannel(index)}
                      disabled={data.channelOptions?.length < 5}
                    >
                      <RemoveIcon />
                    </Button>
                  </Grid>
                </Grid>
                <Box
                  sx={{ mt: 2 }}
                  style={{ overflowY: 'auto', height: '420px' }}
                >
                  {data.channelOptions?.map((element: any, key: number) => (
                    <Box key={key}>
                      <Grid container>
                        <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
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
                                  value={element.channel}
                                  displayEmpty
                                  IconComponent={ExpandMoreOutlinedIcon}
                                  onChange={(event) =>
                                    handleChannelChange(event, index, key)
                                  }
                                  disabled={data.selectedTable === null}
                                  renderValue={
                                    element.channel !== null
                                      ? undefined
                                      : () => <Placeholder>Select</Placeholder>
                                  }
                                  style={{ width: '90%' }}
                                  // style={{ width: '220px' }}
                                >
                                  {data.channelsList?.map(
                                    (item: any, index: number) => (
                                      <MenuItem key={index} value={item.name}>
                                        {item.name}
                                      </MenuItem>
                                    ),
                                  )}
                                  <MenuItem value={null}>
                                    -- Clear Data --
                                  </MenuItem>
                                </Select>
                              </Box>
                              <Box className="color-picker">
                                <Box />
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
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
                                  value={element.yAxisValue}
                                  displayEmpty
                                  IconComponent={ExpandMoreOutlinedIcon}
                                  onChange={(event) =>
                                    handleYAxisChange(event, index, key)
                                  }
                                  disabled={data.selectedTable === null}
                                  // renderValue={
                                  //   element.value !== null
                                  //     ? undefined
                                  //     : () => <Placeholder>Axis</Placeholder>
                                  // }
                                  // style={{ width: '100px' }}
                                  fullWidth
                                >
                                  {data.yAxisOptions.map(
                                    (item: any, index: number) => (
                                      <MenuItem key={index} value={item.value}>
                                        {item.name}
                                      </MenuItem>
                                    ),
                                  )}
                                </Select>
                              </Box>
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
                                    handleColorPickerChange(event, index, key)
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
          </>
        ))}
      </>
    </Box>
  );
}

const StaticData = [
  {
    y1: Math.ceil(Math.random()),
    y2: Math.ceil(Math.random()),
    y3: Math.ceil(Math.random()),
    y4: Math.ceil(Math.random()),
  },
  {
    y1: Math.ceil(Math.random()),
    y2: Math.ceil(Math.random()),
    y3: Math.ceil(Math.random()),
    y4: Math.ceil(Math.random()),
  },
  {
    y1: Math.ceil(Math.random()),
    y2: Math.ceil(Math.random()),
    y3: Math.ceil(Math.random()),
    y4: Math.ceil(Math.random()),
  },
  {
    y1: Math.ceil(Math.random()),
    y2: Math.ceil(Math.random()),
    y3: Math.ceil(Math.random()),
    y4: Math.ceil(Math.random()),
  },
  {
    y1: Math.ceil(Math.random()),
    y2: Math.ceil(Math.random()),
    y3: Math.ceil(Math.random()),
    y4: Math.ceil(Math.random()),
  },
];

const customTickFormatter = (value: any) => {
  return `${value}`;
};
