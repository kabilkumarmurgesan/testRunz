/* eslint-disable no-var */
import React from 'react';
import PrivateRoute from '../../../components/PrivateRoute';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import edit from '../../../assets/images/edit.svg';
import shareimg from '../../../assets/images/Share-black.svg';
import shareimgarrow from '../../../assets/images/share-arrow-black.svg';
import printer from '../../../assets/images/printer.svg';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EditPopup from './editpopup';
import SplitPane from 'react-split-pane';
import { Editor } from '@tinymce/tinymce-react';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '../../../assets/images/chevrondown-thin.svg';
import RemoveIcon from '@mui/icons-material/Remove';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import AddPeoplePopup from '../../../components/AddPeoplePopup';
import * as html2json from 'html2json';
import parse from 'html-react-parser';
import {
  AddOutlined,
  CloseOutlined,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import RunsForm from '../RunsForm';
import SuccessPopup from '../../../components/SuccessPopup';
import { useLocation } from '@reach/router';
import moment from 'moment';
import { RunsStatusList } from '../../../utils/data';
import {
  fetchSingleRunsData,
  fetchTableChartData,
  fetchUpdateRunsData,
} from '../../../api/RunsAPI';
import { useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import { useSelector } from 'react-redux';
import TableChart from '../../../components/charts/TableChart';
import {
  UpdateUserRunsData,
  fetchSingleUserRunzData,
  postUserRunsData,
} from '../../../api/userRunsAPI';
import { fetchUpdateProcedureData } from '../../../api/procedureAPI';
import { nanoid } from 'nanoid';
import SpinerLoader from '../../../components/SpinnerLoader';
import RealtimeChart from '../../../components/charts/RealtimeChart';

const editorData = `<h2>ESTIMATION OF IRON BY COLORIMETRY</h2>
<p>&nbsp;</p>
<h4>AIM:</h4>
<p><span style="font-weight: 400;">To determine the amount of iron in the given solution colorimetrically using thiocyanate as a complexing agent.</span></p>
<p>&nbsp;</p>
<h4>APPARATUS REQUIRED:</h4>
<ul>
<li>Spectrophotometer</li>
<li>Glass cuvettes</li>
<li>Pipettes</li>
<li>Reagents</li>
</ul>
<p>&nbsp;</p>
<h4>PRINCIPLE:</h4>
<p><span style="font-weight: 400;">Iron when complexed with thiocyanate gives intense red color. The intensity of the color depends upon the concentration of iron in the solution. A calibration curve is obtained by plotting optical density versus conc. the amount of iron in the unknown sample is determined from the plot using an observed optical density.</span><strong>&nbsp;</strong></p>
<p>&nbsp;</p>
<h4>PROCEDURE:</h4>
<p><span style="font-weight: 400;">Different aliquots of the standard iron solution(0.5,1,1.5,2,..3ml) were taken in 100ml of the standard flask. 5 ml potassium thiocyanate solution was added followed by 2 ml of 4 n nitric acids to each of the ions solution samples made up to&nbsp; Mark.&nbsp; The mixture in the standard flask was shaken well and a portion of the color of the solution was taken into the cell. The optical density was measured at 490 NM against a blank solution that contained all reagents except metal ions.</span></p>
<p>&nbsp;</p>
<h4 data-table="1">TABULAR COLUMN:</h4>
<table style="border-collapse: collapse; width: 100%;" border="1">
<thead>
<tr>
<td style="width: 31.8857%; text-align: center;" scope="col"><strong>SI.NO</strong></td>
<td style="width: 31.8857%; text-align: center;" scope="col"><strong data-column="1">The concentration of the iron solution in PPM</strong></td>
<td style="width: 31.9859%; text-align: center;" scope="col"><strong data-column="2">Optical density</strong></td>
</tr>
</thead>
<tbody>
<tr>
<td style="width: 31.8857%; text-align: center;">1.</td>
<td style="width: 31.8857%; text-align: center;" data-column="1">&nbsp;<input id="graph1x11" name="value_KTCw3Dg" type="text" />&nbsp;</td>
<td style="width: 31.9859%; text-align: center;" data-column="2"><input id="graph1y11" name="value_zxIBOyC" type="text" />&nbsp;</td>
</tr>
<tr>
<td style="width: 31.8857%; text-align: center;">2.</td>
<td style="width: 31.8857%; text-align: center;" data-column="1">&nbsp;<input id="graph1x12" name="value_ewAAtzE" type="text" />&nbsp;</td>
<td style="width: 31.9859%; text-align: center;" data-column="2">&nbsp;<input id="graph1y12" name="value_RJZC369" type="text" />&nbsp;</td>
</tr>
<tr>
<td style="width: 31.8857%; text-align: center;">3.</td>
<td style="width: 31.8857%; text-align: center;" data-column="1">&nbsp;<input id="graph1x13" name="value_JITYu6K" type="text" />&nbsp;</td>
<td style="width: 31.9859%; text-align: center;" data-column="2">&nbsp;<input id="graph1y13" name="value_WVTb49E" type="text" />&nbsp;</td>
</tr>
<tr>
<td style="width: 31.8857%; text-align: center;">4.</td>
<td style="width: 31.8857%; text-align: center;" data-column="1">&nbsp;<input id="graph1x14" name="value_ie3a1YZ" type="text" />&nbsp;</td>
<td style="width: 31.9859%; text-align: center;" data-column="2">&nbsp;<input id="graph1y14" name="value_Tilkciq" type="text" />&nbsp;</td>
</tr>
<tr>
<td style="width: 31.8857%; text-align: center;">5.</td>
<td style="width: 31.8857%; text-align: center;" data-column="1">&nbsp;<input id="graph1x15" name="value_VZfimCs" type="text" />&nbsp;</td>
<td style="width: 31.9859%; text-align: center;" data-column="2">&nbsp;<input id="graph1y15" name="value_3Th_fIu" type="text" />&nbsp;</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
<p>Unknown=<strong>&nbsp;<input id="value_8uNUKWm" name="value_8uNUKWm" type="text" />&nbsp;</strong></p>
<p>&nbsp;</p>
<h4>MODEL GRAPH:</h4>
<p><img style="display: block; margin-left: auto; margin-right: auto;" title="Testrunz - Recreation of Schematic diagram (13).png" src="blob:https://test-runz.netlify.app/4f99dc48-3fe3-40cf-99c4-2a706a378e8b" alt="" width="708" height="398" /></p>
<p>&nbsp;</p>
<p><strong>PRECAUTION:</strong></p>
<div class="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]">
<div class="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
<div class="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
<div class="flex flex-grow flex-col gap-3">
<div class="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
<div class="markdown prose w-full break-words dark:prose-invert light">
<ol>
<li>
<p>Safety precautions: Always wear appropriate personal protective equipment (PPE), such as gloves and safety glasses, when handling chemicals.</p>
</li>
<li>
<p>Contamination: Ensure that all glassware is clean and free from any contamination. This can be achieved by rinsing with distilled water and drying with a lint-free cloth.</p>
</li>
<li>
<p>Calibration: Ensure that the spectrophotometer is properly calibrated. This can be achieved by using a standard solution with a known concentration of iron.</p>
</li>
<li>
<p>Standardization: It is important to use a standard solution with a known concentration of iron to ensure accurate results.</p>
</li>
<li>
<p>Blank: Always prepare a blank solution to correct for any background absorbance.</p>
</li>
<li>
<p>Timely measurement: It is important to measure the absorbance of the sample immediately after adding the reagents, as the color of the iron complex may fade over time.</p>
</li>
<li>
<p>Temperature: Keep the temperature of the sample and reagents constant throughout the analysis, as the temperature can affect the formation of the iron complex.</p>
</li>
<li>
<p>Recording the wavelength: Record the wavelength used to measure the absorbance, as this information will be needed for future reference.</p>
</li>
</ol>
</div>
</div>
</div>
<div class="flex justify-between">
<div class="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-3 md:gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">&nbsp;</div>
</div>
</div>
</div>
</div>`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// {
//   name: 600,
//   plot1: 81,
//   plot2: 44,
//   plot3: 25,
//   plot4: 14,
//   amt: 47,
// },

export default function RunsDetails() {
  const dispatch: any = useDispatch();
  const location: any = useLocation();

  const [runzValue, setRunzValue] = React.useState<any>(location.state?.props);
  const [disableStart, setDisableStart] = React.useState<any>(
    runzValue?.status !== 'Created',
  );
  const [disableChart, setDisableChart] = React.useState<boolean>(true);
  const [disableStop, setDisableStop] = React.useState<any>(
    runzValue?.status === 'Created' && runzValue?.status !== 'Started',
  );
  const [value, setValue] = React.useState(0);
  const [userRunzResult, setUserRunzResult] = React.useState('');
  const [userRunzID, setUserRunzID] = React.useState<any>({});
  const [result, setResult] = React.useState<any>({});
  const [remarks, setRemarks] = React.useState<any>('');
  const [openDlg2Dialog, setDialog2Open] = React.useState(false);
  const [answers, setAnswers] = React.useState('');
  const [runsOpen, setRunsOpen] = React.useState(false);
  const [moreInfo, setMoreInfo] = React.useState(false);
  const [chartTable, setChartTable] = React.useState(null);
  const [userProcedure, setuserProcedure] = React.useState('');
  const runsStatus = RunsStatusList;
  const [isLoader, setIsLoader] = React.useState<boolean>(true);
  const [selectedChart, setSelectedChart] = React.useState<any>('Table_Chart');
  const [state, setState] = React.useState({ content: '' });
  const [typePopup, settypePopup] = React.useState('');
  const [staticChartData, setStaticChartData] = React.useState('');
  const [savedChartData, setSavedChartData] = React.useState(null);
  const [savedConnectData, setSavedConnectData] = React.useState(null);
  const [isChartPause, setIsChartPause] = React.useState<any>(true);
  const htmlData: any = state?.content ? state?.content : '';
  const [htmlInput, setHtmlInput] = React.useState<any>({});
  const htmlToJSON: any = html2json?.html2json(htmlData);
  const [usedAsset, setUsedAsset] = React.useState<any>(null);

  const uses = htmlToJSON?.child.map((ele: any) => ele);
  const formRef: any = React.useRef(null);
  const inputRefs = React.useRef<any>({});
  const runsPopupRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  const prevStateRef = React.useRef(htmlToJSON);

  const handleInputChange = (id: any, column: any) => {
    const value = inputRefs.current[id]?.[column]?.value;
    console.log(`Input ${id}, Column ${column}: ${value}`);
  };

  const loginUserSliceData = useSelector((state: any) => state.userLogin.data);
  const credencial = loginUserSliceData?.verifyToken?.role[0];

  const [charts, setCharts] = React.useState<any>([]);
  const [startDate, setStartDate] = React.useState<any>(null);
  const [endDate, setEndDate] = React.useState<any>(null);

  const procedureSliceData = useSelector((state: any) => state.runs.data);

  var runzId: any = [];
  runzId.push(runzValue?._id);
  var runzRow: any = [];
  runzRow.push(runzValue);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoader(true);
      const procedureId = { _id: window.location.pathname.split('/')[3] };
      dispatch(fetchSingleRunsData(procedureId));
      setIsLoader(false);
    }
  }, [value, disableStop, disableStart]);

  React.useEffect(() => {
    runzValue && setDisableChart(runzValue?.status === 'Created');
    if (typeof window !== 'undefined') {
      // const procedureId = { _id: window.location.pathname.split('/')[3] };
      // dispatch(fetchSingleRunsData(procedureId));
      const runz = {
        runId:
          runzValue?.shared == true
            ? runzValue.runId
            : window.location.pathname.split('/')[3],
        // runId: window.location.pathname.split('/')[3],
      };
      dispatch(fetchSingleUserRunzData(runz))
        .then((res: any) => {
          setUserRunzID(res?.get_userRun);
          setRemarks(res?.get_userRun?.remarks);
          setStartDate(res?.get_userRun?.startTime);
          setEndDate(res?.get_userRun?.endTime);
          if (
            res?.get_userRun?.used_Asset &&
            res?.get_userRun?.used_Asset.length > 0
          ) {
            setUsedAsset(res?.get_userRun?.used_Asset[0]);
          }
          if (
            res?.get_userRun?.results !== null &&
            res?.get_userRun?.results !== ''
          )
            setUserRunzResult(
              res?.get_userRun?.results !== undefined &&
                res?.get_userRun?.results,
            );
          else {
            setUserRunzResult(userRunzResult);
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }, [value, runzValue]);

  // React.useEffect(() => {
  //   fetch('http://18.221.90.180:5000/runPython/')
  //     .then((res) => res.json())
  //     .then((res) => {
  //       const data = res?.Centrifugal!==undefined && res?.Centrifugal[0];
  //       let text: any = '';
  //       Object.entries(data).forEach(([key, value]) => {
  //         text =
  //           text +
  //           `<div>
  //           <div>
  //           <span style="font-size: 18px; line-height: 3">${key}</span> <span style="font-size: 18px; font-weight: 600">${value}</span>
  //           </div>
  //         </div>`;
  //       });
  //       setUserRunzResult(text + '</ul>');
  //     });
  // }, [userRunzResult]);

  function isEmptyObject(obj: any) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  const handleReloadSingleData = async () => {
    const procedureId = { _id: runzValue?._id };
    setIsLoader(true);
    await dispatch(fetchSingleRunsData(procedureId));
    const runz = {
      runId: runzValue?.shared
        ? runzValue.runId
        : window.location.pathname.split('/')[3],
    };
    await dispatch(fetchSingleUserRunzData(runz))
      .then((res: any) => {
        setUserRunzID(res?.get_userRun);
        setUserRunzResult(
          res?.get_userRun?.results !== undefined && res?.get_userRun?.results,
        );
        setIsLoader(false);
      })
      .catch((err: any) => {
        console.error(err);
        setIsLoader(false);
      });
    // setRunzValue(procedureSliceData.get_run)
  };

  React.useEffect(() => {
    setRunzValue(runzValue);
    setuserProcedure(userProcedure);
    setState({ content: userProcedure });
    if (runzValue?.status === 'Stopped') {
      setDisableStart(true);
      setDisableStop(true);
    } else if (runzValue?.status === 'Started') {
      setDisableStart(true);
      setDisableStop(false);
    } else if (runzValue?.status === 'Started') {
      setDisableStart(false);
    } else if (runzValue?.status === 'Created') {
      setDisableStart(false);
      setDisableStop(true);
    } // setResult(result)
  }, [runzValue, userProcedure, value]);

  React.useEffect(() => {
    let text: any = '';
    if (userRunzResult !== null && userRunzResult !== '') {
      //   setResult(result)
      //   Object.entries(result).forEach(([key, value]) => {
      //     text =
      //       text +
      //       `<div>
      //       <div>
      //       <span style="font-size: 18px; line-height: 3">${key}</span> <span style="font-size: 18px; font-weight: 600">${value}</span>
      //       </div>
      //     </div>`;
      //   });
      // }
      // else{
      setUserRunzResult(userRunzResult);
      Object.entries(userRunzResult).forEach(([key, value]) => {
        text =
          text +
          `<div>
          <div>
          <span style="font-size: 18px; line-height: 3">${key}</span> <span style="font-size: 18px; font-weight: 600">${value}</span>
          </div>
        </div>`;
      });
    }
    if (text !== '') {
      setUserRunzResult(text + '</ul>');
    }
  }, [userProcedure]);
  React.useEffect(() => {
    // Set a timer for 1 second (1000 milliseconds)
    const timerId = setTimeout(() => {
      setIsLoader(false);
      setRunzValue(procedureSliceData?.get_run);
      setuserProcedure(
        procedureSliceData?.get_run?.procedureId?.procedureDetials,
      );
    }, 2000);

    // Clean up the timer on component unmount or if procedureSliceData changes
    return () => clearTimeout(timerId);
  }, [procedureSliceData, disableStart, disableStop, value]);

  React.useEffect(() => {
    const filtered =
      userRunzID?.userProcedure &&
      Object.entries(JSON.parse(userRunzID?.userProcedure)).filter(
        ([key]) => key,
      );

    const obj = filtered && Object.fromEntries(filtered);
    if (!isEmptyObject(obj && userProcedure)) {
      for (const [key, values] of Object.entries(obj)) {
        if (values && document.getElementById(key)) {
          // @ts-ignore
          document.getElementById(key).value = values;
        }
      }
    }
  }, [userRunzID?.userProcedure, state, value]);

  React.useEffect(() => {
    handleHtmlInput();
  }, [state?.content, userRunzID?.userProcedure, value]);

  // React.useEffect(() => {
  //   if (htmlToJSON.child && htmlToJSON.child !== prevStateRef.current.child) {
  //     getSateicDate();
  //     prevStateRef.current = htmlToJSON;
  //   }
  // }, [htmlToJSON]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const tableChartSlice = useSelector(
    (state: any) => state.tableChart.data?.static_chart,
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const editorRef: any = React.useRef(null);

  const colorsList = ['#e22828', '#90239f', '#111fdf', '#38e907', '#252525'];

  React.useEffect(() => {
    dispatch(fetchTableChartData('655b261e7e26fb0012425184'));
  }, []);

  React.useEffect(() => {
    const data: any = [];
    const tableList: any = [];
    if (tableChartSlice) {
      tableChartSlice.forEach((element: any) => {
        const tableChartOptionsList: any = [];
        const tableChartValues: any = [];
        const tableChannelsList: any = [];
        const tableChartData: any = [];

        element.rows.forEach((rows: any) => {
          tableChartData.push(rows.values);
        });

        for (let i = 0; i < 4; i++) {
          tableChartOptionsList.push({
            name: element.headers[i] ? element.headers[i] : null,
            value: `Y${i + 1}`,
            yAxis: `Y${i + 1}`,
            color: colorsList[i],
            yAxisId:
              i === 0
                ? 'left1'
                : i === 1
                ? 'right1'
                : i === 2
                ? 'left2'
                : 'right2',
            orientation: i % 2 === 0 ? 'left' : 'right',
            dataKey: `plot${[i + 1]}`,
            channelValue: null,
            xValue: null,
            yValue: `Y${i + 1}`,
            tableChartData: tableChartData,
          });
        }

        element.headers.forEach((head: any) => {
          tableChannelsList.push({
            name: head,
            value: head,
          });
        });

        tableList.push({
          name: element.tableName[0],
          value: element.tableName[0],
        });

        element.rows.forEach((row: any, rowIndex: number) => {
          row.values.forEach((value: any) => {
            tableChartValues.push({
              [`plot${rowIndex + 1}`]: value,
              name: value,
            });
          });
        });
        data.push({
          name: element.tableName[0] ? element.tableName[0] : null,
          selectedTable: null,
          tableChartValues: [],
          tableChartOptionsList: tableChartOptionsList,
          tableChannelsList: tableChannelsList,
          tableList: tableList,
          activeChannelOptions: [],
          activeTableChartValues: [],
          xValue: null,
        });
      });
      setCharts(data);
    }
  }, [tableChartSlice]);

  const handleSubmitFormPopup = () => {
    runsPopupRef.current.open(false);
    successPopupRef.current.open(true, 'Runs');
    setTimeout(() => {
      successPopupRef.current.open(false, 'Runs');
    }, 3000);
  };

  const handleYAxisChange = (event: any, dataIndex: any, keyIndex: any) => {
    const data = [...charts];
    const values = { ...data[dataIndex] };
    values.tableChartOptionsList[keyIndex].value = event.target.value;
    values.tableChartOptionsList[keyIndex].yValue = event.target.value;
    setCharts(data);
  };

  const handleTabularColumnChange = (event: any, dataIndex: any) => {
    const data = [...charts];
    data[dataIndex].selectedTable = event.target.value;
    const removedOptions = charts[dataIndex].tableChartOptionsList.filter(
      (item: any) => item.name !== null,
    );
    data[dataIndex].activeChannelOptions = removedOptions;
    setCharts(data);
  };

  const handleChannelChange = (event: any, dataIndex: any, keyIndex: any) => {
    const data = [...charts];
    const values = { ...data[dataIndex] };
    const newIndex = values.activeChannelOptions.length + 1;
    values.tableChartOptionsList[keyIndex].channelValue = event.target.value;
    if (values.activeChannelOptions[keyIndex]) {
      if (values.activeTableChartValues.length === 0) {
        values.activeChannelOptions[keyIndex].tableChartData.forEach(
          (val: any, vi: number) => {
            values.activeTableChartValues[vi] = {
              name: val[0],
              [`plot${keyIndex + 1}`]: val[0],
            };
          },
        );
      } else {
        values.activeChannelOptions[keyIndex].tableChartData.forEach(
          (val: any, vi: number) => {
            values.activeTableChartValues[vi] = {
              ...values.activeTableChartValues[vi],
              name: val[0],
              [`plot${keyIndex + 1}`]: val[0],
            };
          },
        );
      }
    } else {
      values.activeTableChartValues[newIndex] = {
        ...values.activeTableChartValues[newIndex],
        name: 0,
        [`plot${keyIndex + 1}`]: 0,
      };
    }

    setCharts(data);
  };
  const handleChanges = (content: any) => {
    setState({ content });
  };

  const getSateicDate = () => {
    const tablesEles: any = document
      ?.getElementById('content')
      ?.querySelectorAll('table');
    let finalTableTitleResult: any;
    if (tablesEles) {
      const result = Array?.from(tablesEles)?.map((tablesInstance: any) => {
        const headerCells = tablesInstance?.querySelectorAll('[data-column]');
        const headerNames = Array.from(headerCells).map((header: any) => ({
          key: header.getAttribute('data-column'),
          value: header.textContent.trim(),
        }));
        const tableDataRows: any = tablesInstance.querySelectorAll('tbody tr');
        const rowData = Array.from(tableDataRows)?.map((tableDataRow: any) => {
          const tableCells = tableDataRow.querySelectorAll('td[data-column]');
          return Array.from(tableCells).map((cell: any) => {
            const inputCntext = cell.querySelector("input[type='text']");
            if (inputCntext) {
              return {
                key: cell.getAttribute('data-column'),
                value: htmlInput[inputCntext.id],
              };
            }
          });
        });
        return {
          headerNames: headerNames,
          rowData: rowData,
        };
      });
      const mergedDatasets = result.map((dataset) => {
        const mergedData: any = [];
        for (let i = 0; i < dataset.rowData.length; i++) {
          const rowData = dataset.rowData[i];
          const mergedRow: any = {};
          for (let j = 0; j < rowData?.length; j++) {
            const header = dataset.headerNames[j];
            const value: any = rowData[j];
            mergedRow[header?.value] = value?.value;
          }
          mergedData.push(mergedRow);
        }
        return mergedData;
      });
      let filteredData = mergedDatasets?.filter(
        (sublist) => sublist?.some((obj: any) => Object?.keys(obj).length > 0),
      );
      filteredData = filteredData?.map(
        (sublist) =>
          sublist?.filter((obj: any) => Object?.keys(obj).length > 0),
      );
      const results = filteredData?.map((dataset, index) => {
        const subResult = [];
        const firstDataItem = dataset[index];
        for (const key in firstDataItem) {
          const label = key;
          const values: any = [];
          dataset?.forEach((item: any) => {
            if (item[key]) {
              if (!Number.isInteger(parseFloat(item[key]))) {
                values.push(parseFloat(item[key]));
              } else {
                values.push(parseInt(item[key]));
              }
            }
          });
          subResult.push({ label, values });
        }
        return subResult;
      });

      const tablesin = document
        ?.getElementById('content')
        ?.querySelectorAll('[data-table]');
      const getTitle: any = [];

      tablesin?.forEach((element, index) => {
        getTitle.push(element.textContent);
      });

      finalTableTitleResult = getTitle?.map((list: any, index: any) => {
        return { label: list, value: list, data: results[index] };
      });
      setStaticChartData(finalTableTitleResult);
    }
  };

  const onSubmit = () => {
    handleHtmlInput();
    const tablesEles: any = document
      ?.getElementById('content')
      ?.querySelectorAll('table');
    let finalTableTitleResult: any;
    if (tablesEles) {
      const result = Array?.from(tablesEles)?.map((tablesInstance: any) => {
        const headerCells = tablesInstance?.querySelectorAll('[data-column]');
        const headerNames = Array.from(headerCells).map((header: any) => ({
          key: header.getAttribute('data-column'),
          value: header.textContent.trim(),
        }));
        const tableDataRows: any = tablesInstance.querySelectorAll('tbody tr');
        const rowData = Array.from(tableDataRows)?.map((tableDataRow: any) => {
          const tableCells = tableDataRow.querySelectorAll('td[data-column]');
          return Array.from(tableCells).map((cell: any) => {
            const inputCntext = cell.querySelector("input[type='text']");
            if (inputCntext) {
              return {
                key: cell.getAttribute('data-column'),
                value: htmlInput[inputCntext.id],
              };
            }
          });
        });
        return {
          headerNames: headerNames,
          rowData: rowData,
        };
      });
      const mergedDatasets = result.map((dataset) => {
        const mergedData: any = [];
        for (let i = 0; i < dataset.rowData.length; i++) {
          const rowData = dataset.rowData[i];
          const mergedRow: any = {};
          for (let j = 0; j < rowData?.length; j++) {
            const header = dataset.headerNames[j];
            const value: any = rowData[j];
            mergedRow[header?.value] = value?.value;
          }
          mergedData.push(mergedRow);
        }
        return mergedData;
      });
      let filteredData = mergedDatasets?.filter(
        (sublist) => sublist?.some((obj: any) => Object?.keys(obj).length > 0),
      );
      filteredData = filteredData?.map(
        (sublist) =>
          sublist?.filter((obj: any) => Object?.keys(obj).length > 0),
      );
      const results = filteredData?.map((dataset, index) => {
        const subResult = [];
        const firstDataItem = dataset[index];
        for (const key in firstDataItem) {
          const label = key;
          const values: any = [];
          dataset?.forEach((item: any) => {
            if (item[key]) {
              if (!Number.isInteger(parseFloat(item[key]))) {
                values.push(parseFloat(item[key]));
              } else {
                values.push(parseInt(item[key]));
              }
            }
          });
          subResult.push({ label, values });
        }
        return subResult;
      });

      const tablesin = document
        ?.getElementById('content')
        ?.querySelectorAll('[data-table]');
      const getTitle: any = [];

      tablesin?.forEach((element, index) => {
        getTitle.push(element.textContent);
      });
      finalTableTitleResult = getTitle?.map((list: any, index: any) => {
        return { label: list, value: list, data: results[index] };
      });
    }
    let vals = Object.values(htmlInput);

    const empty = vals.filter((item) => item == '');

    if (empty.length !== 0) {
      toast('Must fill all Required Readings', {
        style: {
          background: '#d92828',
          color: '#fff',
        },
      });
    } else if (empty.length === 0) {
      handleHtmlInput();
      var payload: any = {
        runId: runzValue._id,
        organisationId: procedureSliceData?.get_run?.organisationId,
        userProcedure: JSON.stringify(htmlInput),
        static_chart_data: JSON.stringify(finalTableTitleResult),
        startTime: moment(new Date()).toISOString(),
      };
      if (!userRunzID?._id) {
        dispatch(postUserRunsData(payload))
          .then((res: any) => {
            if (res.create_userRunz._id) {
              let payload1 = {
                _id: runzValue._id,
                status: 'Started',
              };
              dispatch(fetchUpdateRunsData(payload1));
              toast(`Runs table readings created successfully !`, {
                style: {
                  background: '#00bf70',
                  color: '#fff',
                },
              });
            } else {
              toast('Something went wrong', {
                style: {
                  background: '#d92828',
                  color: '#fff',
                },
              });
            }
          })
          .catch((err: any) => {
            console.error(err);
          });
      } else {
        let payload2 = {
          _id: userRunzID?._id,
          organisationId: procedureSliceData?.get_run?.organisationId,
          userProcedure: JSON.stringify(htmlInput),
          static_chart_data: JSON.stringify(finalTableTitleResult),
        };
        dispatch(UpdateUserRunsData(payload2))
          .then((res: any) => {
            setStaticChartData(finalTableTitleResult);
            setSavedChartData(null);
            toast(`Runs table readings updated successfully !`, {
              style: {
                background: '#00bf70',
                color: '#fff',
              },
            });
          })
          .catch((err: any) => {
            console.error(err);
          });
      }
      const data: any = {
        value_1ZyZJXD: '0',
        // ... (other key-value pairs)
        value_jouUqbl: '33',
      };

      // Add "title" property to the last object
      data['title'] = 'Vibrational_magnetometer_acet';

      htmlInput['title'] = procedureSliceData?.get_run?.procedureId?.name;

      // const staticPayload: any = {
      //   value_m82LbgF: '20',
      //   value_r8lRpW9: '0',
      //   value_tFD_XSL: '20.3',
      //   value_Ip_lq7g: '20.3',
      //   value_mOc3VOJ: '20.3',
      //   value_dgmNCR1: '20',
      //   value_247Mj1l: '0',
      //   value_kGJyWEN: '20.3',
      //   value_lhqRcvF: '20.3',
      //   value__n1GySX: '0.985',
      //   'value_-GXpkop': '20',
      //   value_ZhNQP5v: '0',
      //   value_yUGEte6: '9.7',
      //   value_4cDE_cD: '9.7',
      //   value_g8aFSp7: '9.7',
      //   value_MmMnOZG: '20',
      //   value_9Y2IpJY: '0',
      //   value_qAZL9aw: '9.7',
      //   value_nDHOyuR: '9.7',
      //   value_AbZdsRL: '9.554',
      //   value_eq0aRh1: '4777.7',
      //   title: 'EDTA Water_acet',
      // };

      fetch('https://vyxeuzxdui.us-east-1.awsapprunner.com/runPython', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(htmlInput),
      })
        .then((res) => {
          fetch('https://vyxeuzxdui.us-east-1.awsapprunner.com/runPython')
            .then((res) => res.json())
            .then((res) => {
              var newarray: any = [];
              newarray = Object.keys(res);

              const data = res !== undefined ? res[newarray][0] : '';
              setUserRunzResult(data);
              let text: any = '';
              Object.entries(data).forEach(([key, value]) => {
                text =
                  text +
                  `<div>
              <div>
              <span style="font-size: 18px; line-height: 3">${key}</span> <span style="font-size: 18px; font-weight: 600">${value}</span>
              </div>
            </div>`;
              });
              if (text !== '') {
                setUserRunzResult(text + '</ul>');
              }
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleChanged1 = (content: any) => {
    setUserRunzResult(content);
  };
  const handleChanged = (content: any) => {
    setRemarks(content);
  };
  const resultSave = async () => {
    if (runzValue.status == 'Created') {
      const payload: any = {
        runId: runzValue._id,
        results: JSON.stringify(userRunzResult),
      };
      if (
        !JSON.stringify(userRunzResult).includes('No calculations') &&
        userRunzResult !== '' &&
        userRunzResult !== null
      ) {
        await dispatch(postUserRunsData(payload));
        let payload1 = {
          _id: runzValue._id,
          status: 'Submitted',
        };
        await toast(`Result saved successfully !`, {
          style: {
            background: '#00bf70',
            color: '#fff',
          },
        });
        await dispatch(fetchUpdateRunsData(payload1));
      } else {
        toast('Result must be filled', {
          style: {
            background: '#d92828',
            color: '#fff',
          },
        });
      }
    } else {
      const payload2: any = {
        _id: userRunzID?._id,
        results: userRunzResult,
      };
      if (
        !JSON.stringify(userRunzResult).includes('No calculations') &&
        userRunzResult !== '' &&
        userRunzResult !== null
      ) {
        await dispatch(UpdateUserRunsData(payload2));
        let payload1 = {
          _id: runzValue._id,
          status: 'Submitted',
        };
        await toast(`Result saved successfully !`, {
          style: {
            background: '#00bf70',
            color: '#fff',
          },
        });
        await dispatch(fetchUpdateRunsData(payload1));
        // }
        // else if(!JSON.stringify(userRunzResult).includes("No calculations") && (userRunzResult!=="" && userRunzResult!==null)){
        //   const payload2: any = {
        //     _id: userRunzID?._id,
        //     results:userRunzResult,

        //     }
        //   await  dispatch(UpdateUserRunsData(payload2));
        //   let payload1 = {
        //     _id: runzValue._id,
        //     status: 'Submitted',
        //   };
        //   await toast(`Result saved successfully !`, {
        //     style: {
        //       background: '#00bf70',
        //       color: '#fff',
        //     },
        //   });
        // await  dispatch(fetchUpdateRunsData(payload1));
      } else {
        toast('Result must be filled', {
          style: {
            background: '#d92828',
            color: '#fff',
          },
        });
      }
    }
  };

  const remarkSave = async () => {
    if (runzValue.status == 'Created') {
      const payload: any = {
        runId: runzValue._id,
        remarks: remarks,
      };
      let payload1 = {
        _id: runzValue._id,
        status: 'Complete',
      };
      if (remarks !== '' && remarks !== null) {
        await dispatch(postUserRunsData(payload));
        await dispatch(fetchUpdateRunsData(payload1));
        await toast(`Remarks saved successfully !`, {
          style: {
            background: '#00bf70',
            color: '#fff',
          },
        });
      } else {
        toast('Remarks must be filled', {
          style: {
            background: '#d92828',
            color: '#fff',
          },
        });
      }
    } else {
      const payload2: any = {
        _id: userRunzID?._id,
        remarks: remarks,
      };
      let payload1 = {
        _id: runzValue._id,
        status: 'Complete',
      };
      if (remarks !== '' && remarks !== null) {
        await dispatch(UpdateUserRunsData(payload2));
        await dispatch(fetchUpdateRunsData(payload1));
        await toast(`Remarks saved successfully !`, {
          style: {
            background: '#00bf70',
            color: '#fff',
          },
        });
      } else {
        toast('Remarks must be filled', {
          style: {
            background: '#d92828',
            color: '#fff',
          },
        });
      }
    }
  };

  // if (empty.length > 0) {
  //   toast('Must fill all Required Readings', {
  //     style: {
  //       background: '#d92828',
  //       color: '#fff',
  //     },
  //   });
  // } else if (empty.length === 0) {
  //   handleHtmlInput();
  //   var payload:any ={
  //           runId: runzValue._id,
  //           organisationId:"659789ec08693d0012352708",
  //           userProcedure:JSON.stringify(htmlInput),
  //           static_chart_data:JSON.stringify(finalTableTitleResult)

  //         }

  //        if(runzValue.status=="Created") {
  //         dispatch(postUserRunsData(payload))
  //         let payload1={
  //           _id:runzValue._id,
  //           status:'Started'
  //         }
  //         dispatch(fetchUpdateRunsData(payload1))
  //       toast(`User Procedure Created !`, {
  //         style: {
  //           background: '#00bf70', color: '#fff'
  //         }
  //       });
  //     }
  //       else{
  //        let payload2={
  //         _id:userRunzID?._id,
  //         organisationId:"659789ec08693d0012352708",
  //         userProcedure:JSON.stringify(htmlInput),
  //         static_chart_data:JSON.stringify(finalTableTitleResult)
  //        }
  //         dispatch(UpdateUserRunsData(payload2))

  //         toast(`User Procedure updated !`, {
  //           style: {
  //             background: '#00bf70', color: '#fff'
  //           }
  //         });
  //       }
  // }
  // }
  //   const onSubmit=()=>{
  //     var payload:any ={
  //       runId: runzValue._id,
  //       organisationId:"655376d2659b7b0012108a33",
  //       userProcedure:JSON.stringify(htmlInput),

  //     }

  //    if(runzValue.status=="Created") {
  //     dispatch(postUserRunsData(payload))
  //     let payload1={
  //       _id:runzValue._id,
  //       status:'Started'
  //     }
  //     dispatch(fetchUpdateRunsData(payload1))
  //   toast(`User Procedure Created !`, {
  //     style: {
  //       background: '#00bf70', color: '#fff'
  //     }
  //   });
  // }
  //   else{
  //    let payload2={
  //     _id:userRunzID?._id,
  //     organisationId:"655376d2659b7b0012108a33",
  //     userProcedure:JSON.stringify(htmlInput),
  //    }
  //     dispatch(UpdateUserRunsData(payload2))

  //     toast(`User Procedure updated !`, {
  //       style: {
  //         background: '#00bf70', color: '#fff'
  //       }
  //     });
  //   }

  //   }
  const handleColorPickerChange = (
    event: any,
    dataIndex: any,
    keyIndex: any,
  ) => {
    const data = [...charts];
    const values = { ...data[dataIndex] };
    values.tableChartOptionsList[keyIndex].color = event.target.value;
    setCharts(data);
  };

  const handleAddChart = () => {
    const data = [...charts];
    const tableChartOptionsList = [];
    for (let i = 0; i < 4; i++) {
      tableChartOptionsList.push({
        name: null,
        value: `Y${i + 1}`,
        yAxis: `Y${i + 1}`,
        color: colorsList[i],
        yAxisId:
          i === 0 ? 'left1' : i === 1 ? 'right1' : i === 2 ? 'left2' : 'right2',
        orientation: i % 2 === 0 ? 'left' : 'right',
        dataKey: `plot${[i + 1]}`,
        channelValue: null,
        xValue: null,
        yValue: `Y${i + 1}`,
      });
    }
    data.push({
      name: null,
      selectedTable: null,
      tableChartValues: [],
      tableChartOptionsList: tableChartOptionsList,
      tableChannelsList: [],
      tableList: data[0].tableList,
      activeChannelOptions: [],
      activeTableChartValues: [],
    });
    setCharts(data);
  };

  const printDocument = () => {
    const input: any = document.getElementById('divToPrint');
    // Set the desired PDF size (A4 or A3)
    const pdfWidth = typeof window !== 'undefined' && window.innerWidth;
    const pdfHeight = typeof window !== 'undefined' && window.innerHeight;

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        let formateArray: [any, any] = [pdfWidth, pdfHeight];
        const pdf: any = new jsPDF({
          orientation: 'portrait',
          format: formateArray,
        });

        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save('chart.pdf');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOnChange = (e: any, row: any) => {
    var runsChange: any = {
      _id: row._id,
    };
    if (e.target.name == 'status') {
      runsChange['status'] = e.target.value;
    }
    dispatch(fetchUpdateRunsData(runsChange));
    toast('Runs status updated !', {
      style: {
        background: '#00bf70',
        color: '#fff',
      },
    });
    handleReloadSingleData();
  };

  const handleChartChange = (event: any) => {
    setSelectedChart(event.target.value);
  };

  const handleHtmlInput = () => {
    let objects = {};
    // @ts-ignore
    let inputEl: any = document
      ?.getElementById('content')
      ?.querySelectorAll('input');

    inputEl?.forEach((ele: any) => {
      const { id, value } = ele;
      let temp = { [id]: value };
      objects = { ...objects, temp };

      setHtmlInput((prev: any) => ({ ...prev, [id]: value }));
      // setHtmlInput((prev: any) => ({ ...prev, title: procedureSliceData?.get_run?.procedureId?.name}));
      // setHtmlInput(prevData => ({
      //   ...prevData,
      //   title: "Vibrational_magnetometer_acet"
      // }));
      // @ts-ignore
      ele.onChange = (e) => {
        const { id, value } = e.target;
        setHtmlInput((prev: any) => ({ ...prev, [id]: value }));
        // setHtmlInput((prev: any) => ({ ...prev, title: procedureSliceData?.get_run?.procedureId?.name}));
      };
    });
    getSateicDate();
    // setHtmlInput((prev: any) => ({ ...prev, title: procedureSliceData?.get_run?.procedureId?.name}));
  };

  const uploadVideo = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      if (videoUrl) {
        const editor = editorRef.current.editor;
        editorRef.current?.insertContent(
          `<video controls><source src="${videoUrl}" type="video/mp4"></video>`,
        );
      }
    }
  };

  const handleEditorInit = (editor: any) => {
    editor.ui.registry.addButton('uploadvideo', {
      text: 'Upload Video',
      onAction: () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'video/*');
        input.onchange = uploadVideo;
        input.click();
      },
    });
  };

  const handleAssignClick = (val: string) => {
    setRunsOpen(true);
    settypePopup(val);
  };

  const handleStatusChange = async (status: any) => {
    setDisableStart(true);
    setDisableStop(status !== 'Started');
    var runsChange: any = {
      _id: runzValue._id,
    };
    runsChange['status'] = status;
    status === 'Stopped' && setIsChartPause(true);
    var createPayload: any = {
      runId: runzValue._id,
      organisationId: procedureSliceData?.get_run?.organisationId,
      userProcedure: JSON.stringify(htmlInput),
      static_chart_data: JSON.stringify(staticChartData),
    };
    var updatePayload: any = {
      _id: userRunzID?._id,
      organisationId: procedureSliceData?.get_run?.organisationId,
      userProcedure: JSON.stringify(htmlInput),
      static_chart_data: JSON.stringify(staticChartData),
      used_Asset: [usedAsset],
    };
    if (status == 'Started') {
      if (userRunzID?._id) {
        updatePayload['startTime'] = moment(new Date()).toISOString();
      } else {
        createPayload['startTime'] = moment(new Date()).toISOString();
      }
      setStartDate(moment(new Date()).toISOString());
    } else {
      setEndDate(moment(new Date()).toISOString());
      updatePayload['endTime'] = moment(new Date()).toISOString();
    }
    if (userRunzID?._id) {
      await dispatch(UpdateUserRunsData(updatePayload));
    } else {
      await dispatch(postUserRunsData(createPayload));
    }
    await dispatch(fetchUpdateRunsData(runsChange));
    await toast('Runs status updated !', {
      style: {
        background: '#00bf70',
        color: '#fff',
      },
    });
  };

  const handleDateChartRetrieve = (data: any, type: string) => {
    type == 'table' ? setSavedChartData(data) : setSavedConnectData(data);
  };

  const getsetUsedAsset = (data: any) => {
    setUsedAsset(data);
  };
  return (
    <PrivateRoute>
      {!isLoader ? (
        <>
          {/* <EditPopup open={openDlg2Dialog} close={() => setDialog2Open(false)} /> */}
          <Box className="runzdetails-page">
            <Box className="top-section">
              <Box sx={{ padding: '24px 0px', margin: '0px 24px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={10} md={10} lg={5} xl={6}>
                    <Box>
                      <Typography className="id-detail">
                        {runzValue?.runNumber}
                      </Typography>
                      <Typography className="id-detail-title">
                        {runzValue?.objective}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={7} xl={6}>
                    <Box
                      sx={{
                        display: { xs: 'none', lg: 'flex' },
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'end',
                      }}
                    >
                      {loginUserSliceData.verifyToken._id ===
                        runzValue?.assignedTo?._id && (
                        <>
                          <Button
                            disabled={disableStart}
                            variant="contained"
                            style={{
                              boxShadow: 'none',
                              backgroundColor: '#ffc60b',
                              padding: '4px 6px',
                              justifyContent: 'center',
                            }}
                            sx={{ m: 2 }}
                            onClick={() => {
                              handleStatusChange('Started');
                            }}
                          >
                            Start
                          </Button>
                          <Button
                            disabled={disableStop}
                            variant="contained"
                            style={{
                              boxShadow: 'none',
                              backgroundColor: '#ffc60b',
                              padding: '4px 6px',
                              justifyContent: 'center',
                              marginRight: '2rem',
                            }}
                            sx={{ m: 2 }}
                            onClick={() => {
                              handleStatusChange('Stopped');
                            }}
                          >
                            Stop
                          </Button>
                        </>
                      )}
                      {/* <Button
                        type="submit"
                        variant="contained"
                        className="edit-btn"
                        onClick={() => {
                          handleAssignClick('assign');
                        }}
                        disabled={!credencial?.runs_management?.assign}
                      >
                        <img
                          src={shareimgarrow}
                          alt="edit"
                          style={{ marginRight: '8px' }}
                        />
                        Assign
                      </Button> */}
                      <Button
                        type="submit"
                        variant="contained"
                        className="edit-btn"
                        onClick={() => {
                          handleAssignClick('share');
                        }}
                        disabled={!credencial?.runs_management?.share}
                      >
                        <img
                          src={shareimg}
                          alt="edit"
                          style={{ marginRight: '8px' }}
                        />
                        Share
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        className="edit-btn"
                        onClick={() => {
                          // setDialog2Open(true);
                          runsPopupRef.current.open(true, runzValue);
                        }}
                        disabled={!credencial?.runs_management?.edit}
                      >
                        <img
                          src={edit}
                          alt="edit"
                          style={{ marginRight: '8px' }}
                        />
                        Edit
                      </Button>
                      <Button
                        className="edit-btn"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          marginRight: '0rem',
                        }}
                        onClick={() => setMoreInfo(!moreInfo)}
                      >
                        More Info
                        {/* <img
                      src={KeyboardArrowDownIcon}
                      alt="KeyboardArrowDownIcon"
                      style={{ marginLeft: '8px' }}
                    /> */}
                        {!moreInfo ? (
                          <KeyboardArrowDown />
                        ) : (
                          <KeyboardArrowUp />
                        )}
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: { xs: 'block', lg: 'none' },
                        textAlign: 'right',
                      }}
                    >
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        disableScrollLock={true}
                      >
                        {loginUserSliceData.verifyToken._id ==
                          runzValue?.assignedTo?._id && (
                          <>
                            <MenuItem onClick={handleClose}>
                              <Button
                                disabled={disableStart}
                                variant="contained"
                                style={{
                                  boxShadow: 'none',
                                  backgroundColor: '#ffc60b',
                                  padding: '4px 6px',
                                  justifyContent: 'center',
                                }}
                                onClick={() => {
                                  handleStatusChange('Started');
                                }}
                              >
                                Start
                              </Button>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <Button
                                disabled={disableStop}
                                variant="contained"
                                style={{
                                  boxShadow: 'none',
                                  backgroundColor: '#ffc60b',
                                  padding: '4px 6px',
                                  justifyContent: 'center',
                                }}
                                onClick={() => {
                                  handleStatusChange('Started');
                                }}
                              >
                                Stop
                              </Button>
                            </MenuItem>
                          </>
                        )}
                        {/* <MenuItem onClick={handleClose}>
                          <Button
                            type="submit"
                            variant="contained"
                            className="edit-btn"
                          >
                            <img
                              src={shareimgarrow}
                              alt="edit"
                              style={{ marginRight: '8px' }}
                            />
                            Assign
                          </Button>
                        </MenuItem> */}
                        <MenuItem
                          onClick={() => {
                            handleAssignClick('share');
                            handleClose();
                          }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            className="edit-btn"
                            disabled={!credencial?.runs_management?.share}
                          >
                            <img
                              src={shareimg}
                              alt="edit"
                              style={{ marginRight: '8px' }}
                            />
                            Share
                          </Button>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            // setDialog2Open(true);
                            runsPopupRef.current.open(true);
                            handleClose();
                          }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            className="edit-btn"
                            disabled={!credencial?.runs_management?.edit}
                          >
                            <img
                              src={edit}
                              alt="edit"
                              style={{ marginRight: '8px' }}
                            />
                            Edit
                          </Button>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setMoreInfo(!moreInfo);
                            handleClose();
                          }}
                        >
                          <Button
                            className="edit-btn"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              marginRight: '0rem',
                            }}
                          >
                            More Info
                            <img
                              src={KeyboardArrowDownIcon}
                              alt="KeyboardArrowDownIcon"
                              style={{ marginLeft: '8px' }}
                            />
                          </Button>
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box
                className="assign-create"
                sx={{
                  padding: '24px 0px',
                  margin: '0px 24px',
                  display: moreInfo ? 'block' : 'none',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                    <Box>
                      <Typography className="id-detail">
                        Test objective
                      </Typography>
                      <Typography
                        className="id-detail"
                        style={{
                          fontSize: '16px',
                          marginTop: '0.4rem',
                        }}
                      >
                        {runzValue?.objective}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                    <Box>
                      <Typography className="id-detail">Run by</Typography>
                      <Typography
                        className="id-detail"
                        style={{
                          fontSize: '16px',
                          marginTop: '0.4rem',
                        }}
                      >
                        {runzValue?.assignedTo?.firstName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                    <Box>
                      <Typography className="id-detail">Assigned by</Typography>
                      <Typography
                        className="id-detail"
                        style={{
                          fontSize: '16px',
                          marginTop: '0.4rem',
                        }}
                      >
                        {runzValue?.assignedBy?.firstName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                    <Box>
                      <Typography className="id-detail">Created on</Typography>
                      <Typography
                        className="id-detail"
                        style={{
                          fontSize: '16px',
                          marginTop: '0.4rem',
                        }}
                      >
                        {moment(parseInt(runzValue?.createdAt)).format(
                          'MM/DD/YYYY',
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
                    <Box>
                      <Typography className="id-detail">Status</Typography>
                      {/* <FormControl
                    className="Status-info"
                    style={{ marginTop: '7px' }}
                  > */}
                      <Box
                        style={{ padding: '0px' }}
                        // style={{
                        //   borderRadius: '20px',
                        //   color: 'white',
                        //   width: '110px',
                        //   padding: '9px 0px',
                        //   alignItems: 'center',
                        //   textAlign: 'center',
                        //   height: '24px',
                        //   display: 'flex',
                        //   justifyContent: 'center',
                        //   fontSize: '12px',
                        //   backgroundColor:
                        //     runzValue?.status == 'Created'
                        //       ? '#8d8d8d'
                        //       : runzValue?.status == 'Started'
                        //         ? '#faaa49'
                        //         : runzValue?.status == 'Complete'
                        //           ? '#00bf70'
                        //           : '#e2445c',
                        // }}
                      >
                        <Box
                          className={
                            runzValue?.status === 'Created'
                              ? 'create-select td-select'
                              : runzValue?.status === 'Started'
                              ? 'start-select td-select'
                              : runzValue?.status === 'Complete'
                              ? 'active-select td-select'
                              : runzValue?.status === 'Submitted'
                              ? 'submit-select td-select'
                              : 'inactive-select td-select'
                          }
                          style={{
                            background:
                              runzValue?.status === 'Created'
                                ? '#8d8d8d'
                                : runzValue?.status === 'Started'
                                ? '#faaa49'
                                : runzValue?.status === 'Stopped'
                                ? '#e2445c'
                                : runzValue?.status == 'Submitted'
                                ? '#a01fb1'
                                : '#00bf70',
                            padding: '6px',
                            color: 'white',
                            width: '140px',
                            borderRadius: '20px',
                            height: '26px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {runzValue?.status}
                        </Box>
                        {/* {runzValue?.status == 'Created'
                        ? 'Created'
                        : runzValue?.status == 'Started'
                          ? 'Started'
                          : runzValue?.status == 'Complete'
                            ? 'Completed'
                            : 'Stopped'} */}
                      </Box>
                      {/* <Select
                      labelId="Status-popup-label"
                      id="Status-info"
                      value={answers}
                      displayEmpty
                      IconComponent={ExpandMoreOutlinedIcon}
                      onChange={(event) => setAnswers(event.target.value)}
                      renderValue={
                        answers !== ''
                          ? undefined
                          : () => <Placeholder>Status</Placeholder>
                      }
                      className="list-completed"
                    >
                      {runsStatus.map((element: any) => (
                              <MenuItem
                                value={element.value}
                                key={element.value}
                              >
                                {element.name}
                              </MenuItem>
                            ))}
                    </Select> */}
                      {/* </FormControl> */}
                      {/* <FormControl className="Status-info"> */}
                      {/* <Select
                            name="status"
                            className={
                              runzValue?.status === 'Created'
                                ? 'create-select td-select'
                                : runzValue?.status === 'Started'
                                ? 'start-select td-select'
                                : runzValue?.status === 'Complete'
                                ? 'active-select td-select'
                                : 'inactive-select td-select'
                            }
                            value={runzValue?.status ? runzValue?.status : 'Stopped'}
                            displayEmpty
                            onChange={(e) => handleOnChange(e, row)}
                            IconComponent={ExpandMoreOutlinedIcon}
                          >
                            {RunsStatusList.map((element: any) => (
                              <MenuItem
                                value={element.value}
                                key={element.value}
                              >
                                {element.name}
                              </MenuItem>
                            ))}
                          </Select> */}
                      {/* </FormControl> */}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Divider
                sx={{ borderColor: '#FFEAA5', borderBottomWidth: '5px' }}
              />
            </Box>

            <Box className="main-runzdetails runz-height">
              <Box className="runz-height" sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 0 }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="tabs-common"
                    className="tabs-common"
                  >
                    <Tab label="Procedures" {...a11yProps(0)} />
                    <Tab
                      disabled={disableChart}
                      label="Charts"
                      {...a11yProps(1)}
                    />
                    <Tab
                      disabled={disableChart}
                      label="Results"
                      {...a11yProps(2)}
                    />
                    <Tab
                      disabled={disableChart}
                      label="Remarks"
                      {...a11yProps(3)}
                    />
                  </Tabs>
                </Box>
                <Box sx={{ paddingBottom: '6rem' }}>
                  <CustomTabPanel value={value} index={0}>
                    {/* <div dangerouslySetInnerHTML={{ __html: userProcedure }} /> */}
                    <div
                      id="content"
                      className="run-editor-width"
                      style={{ overflowY: 'scroll' }}
                    >
                      <form ref={formRef} onChange={handleHtmlInput}>
                        {uses.map((el: any) =>
                          parse(htmlToJSON && html2json.json2html(el)),
                        )}
                      </form>
                    </div>
                    {/* <Editor
                  apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  init={{
                    height: 500,
                    menubar: true,
                    selector: 'textarea',
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'code',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                      'code',
                      'help',
                      'wordcount',
                      'image',
                      'insertdatetime',
                      'template',
                      'insertinput',
                      'customInsertButton',
                      'customAlertButton subscript superscript charmap'
                    ],
                    toolbar:
                      'undo redo | blocks formatselect | ' +
                      'charmap subscript superscript bold italic | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'help |image code table customInsertButton insertdatetime template insertinput customAlertButton tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry ',
                    image_advtab: true,
                    image_title: true,
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    setup: function (editor) {
                      editor.ui.registry.addButton('customInsertButton', {
                        icon: 'edit-block',
                        tooltip: 'Insert Input Element',
                        onAction: function (_) {
                          const value = nanoid(7);
                          editor.insertContent(
                            `&nbsp;<input type='text' id='value_${value}' name='value_${value}'>&nbsp;`
                          );
                        },
                      });
                      editor.ui.registry.addButton('customAlertButton', {
                        icon: 'temporary-placeholder', // Use the built-in alert icon
                        // tooltip: 'Custom Alert',
                        onAction: function (_) {
                          const userInput = window.prompt(
                            'Enter data key attribute',
                          );
                         },
                      });
                    },
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  }}
                  value={state.content}
          // onChange={handleEditorChange}
          onEditorChange={handleChanges}
                /> */}
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <Box id="divToPrint">
                      <Box sx={{ mb: 2 }}>
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={selectedChart}
                            onChange={handleChartChange}
                          >
                            <FormControlLabel
                              value="Table_Chart"
                              control={<Radio />}
                              label="Table Chart"
                              style={{
                                paddingLeft: '10px',
                              }}
                            />
                            <FormControlLabel
                              value="Realtime_Chart"
                              control={<Radio />}
                              label="Connected Chart"
                              style={{
                                paddingLeft: '10px',
                              }}
                            />
                            {/* <FormControlLabel
                              value="Archived_Chart"
                              disabled
                              control={<Radio />}
                              label="Archive Chart"
                              sx={{
                                px: 2,
                              }}
                            /> */}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                      {selectedChart === 'Table_Chart' ? (
                        <TableChart
                          staticChartData={staticChartData}
                          handleDateChartRetrieve={handleDateChartRetrieve}
                          savedChartData={savedChartData}
                        />
                      ) : selectedChart === 'Realtime_Chart' ? (
                        // eslint-disable-next-line react/jsx-no-undef
                        <RealtimeChart
                          handleDateChartRetrieve={handleDateChartRetrieve}
                          savedConnectData={savedConnectData}
                          startDate={startDate}
                          endDate={endDate}
                          usedAsset={usedAsset}
                          isPause={isChartPause}
                          getsetUsedAsset={getsetUsedAsset}
                        />
                      ) : (
                        <Box>Archived Chart</Box>
                      )}
                    </Box>
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <Editor
                      apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                      value={userRunzResult}
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      init={{
                        height: 500,
                        menubar: true,
                        selector: 'textarea',
                        plugins: [
                          'advlist',
                          'autolink',
                          'lists',
                          'link',
                          'image',
                          'charmap',
                          'preview',
                          'anchor',
                          'searchreplace',
                          'visualblocks',
                          'code',
                          'fullscreen',
                          'insertdatetime',
                          'media',
                          'table',
                          'code',
                          'help',
                          'wordcount',
                          'image',
                          'insertdatetime',
                          'template',
                          'insertinput customInsertButton customAlertButton subscript superscript charmap',
                        ],
                        toolbar:
                          'undo redo | blocks formatselect | ' +
                          'charmap subscript superscript bold italic | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'help |link image code table customInsertButton insertdatetime template insertinput customAlertButton uploadVideo tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry ',
                        image_advtab: true,
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        setup: function (editor) {
                          handleEditorInit(editor);
                          editor.ui.registry.addButton('customInsertButton', {
                            icon: 'edit-block',
                            tooltip: 'Insert Input Element',
                            onAction: function (_) {
                              // const value = nanoid(7);
                              editor.insertContent(
                                `&nbsp;<input type='text' >&nbsp;`,
                              );
                            },
                          });
                          editor.ui.registry.addButton('customVideoUpload', {
                            text: 'Upload Video',
                            onAction: function () {
                              editor.insertContent(
                                `<video width="320" height="240" controls><source src="${videoUrl}" type="video/mp4"></video>`,
                              );
                              // if (fileInputRef.current) {
                              //   fileInputRef.current.click();
                              // }
                            },
                          });
                          editor.ui.registry.addButton('customAlertButton', {
                            icon: 'temporary-placeholder', // Use the built-in alert icon
                            // tooltip: 'Custom Alert',
                            onAction: function (_) {
                              const userInput = window.prompt(
                                'Enter data key attribute',
                              );
                            },
                          });
                        },
                        content_style:
                          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      }}
                      onEditorChange={handleChanged1}
                    />
                  </CustomTabPanel>

                  <CustomTabPanel value={value} index={3}>
                    <Editor
                      apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      init={{
                        height: 500,
                        menubar: true,
                        selector: 'textarea',
                        plugins: [
                          'advlist',
                          'autolink',
                          'lists',
                          'link',
                          'image',
                          'charmap',
                          'preview',
                          'anchor',
                          'searchreplace',
                          'visualblocks',
                          'code',
                          'fullscreen',
                          'insertdatetime',
                          'media',
                          'table',
                          'code',
                          'help',
                          'wordcount',
                          'image',
                          'insertdatetime',
                          'template',
                          'insertinput',
                          'customInsertButton',
                          'customAlertButton subscript superscript charmap',
                        ],
                        toolbar:
                          'undo redo | blocks formatselect | ' +
                          'charmap subscript superscript bold italic | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'help |link image code table customInsertButton insertdatetime template insertinput customAlertButton uploadVideo tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry ',
                        image_advtab: true,
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        setup: function (editor) {
                          handleEditorInit(editor);
                          editor.ui.registry.addButton('customInsertButton', {
                            icon: 'edit-block',
                            tooltip: 'Insert Input Element',
                            onAction: function (_) {
                              // const value = nanoid(7);
                              editor.insertContent(
                                `&nbsp;<input type='text' >&nbsp;`,
                              );
                            },
                          });
                          editor.ui.registry.addButton('customAlertButton', {
                            icon: 'temporary-placeholder', // Use the built-in alert icon
                            // tooltip: 'Custom Alert',
                            onAction: function (_) {
                              const userInput = window.prompt(
                                'Enter data key attribute',
                              );
                            },
                          });
                          editor.ui.registry.addButton('customVideoUpload', {
                            text: 'Upload Video',
                            onAction: function () {
                              editor.insertContent(
                                `<video width="320" height="240" controls><source src="${videoUrl}" type="video/mp4"></video>`,
                              );
                              // if (fileInputRef.current) {
                              //   fileInputRef.current.click();
                              // }
                            },
                          });
                        },
                        content_style:
                          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      }}
                      value={remarks}
                      // onChange={handleEditorChange}
                      onEditorChange={handleChanged}
                    />
                  </CustomTabPanel>
                </Box>
              </Box>
              <Box className="edit-details" sx={{ p: 2 }}>
                <Button
                  onClick={() => navigate('/runs')}
                  variant="contained"
                  className="cancel-btn"
                >
                  Back
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {value == 1 && (
                    <img
                      onClick={() => printDocument()}
                      src={printer}
                      alt="printer"
                      style={{ marginRight: '1rem', cursor: 'pointer' }}
                    />
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    className="add-btn"
                    disabled={Object.keys(htmlInput).length == 0 ? true : false}
                    style={{
                      position: 'sticky',
                      display: value == 1 ? 'none' : 'block',
                    }}
                    onClick={() => {
                      (value == 0 && onSubmit()) ||
                        (value == 2 && resultSave()) ||
                        (value == 3 && remarkSave());
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
              {/* </Grid> */}
              {/* </SplitPane> */}
            </Box>
          </Box>
          <SuccessPopup ref={successPopupRef} type="edit" />
          <RunsForm
            formData={runzValue}
            ref={runsPopupRef}
            type="edit"
            submitFormPopup={handleSubmitFormPopup}
            handleReloadSingleData={handleReloadSingleData}
          />
          <AddPeoplePopup
            open={runsOpen}
            close={() => setRunsOpen(false)}
            runzId={runzId}
            runzRow={runzRow}
            typePopup={typePopup}
          />
        </>
      ) : (
        <SpinerLoader isLoader={isLoader} />
      )}
    </PrivateRoute>
  );
}
