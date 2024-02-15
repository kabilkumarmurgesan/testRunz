/* eslint-disable react/display-name */
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  Checkbox,
  Autocomplete,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Avatars from '../../assets/images/Avatars.svg';
import AddIcon from '@mui/icons-material/Add';
import AddPeoplePopup from '../../components/AddPeoplePopup';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProcedureData,
  deleteProcedureData,
} from '../../api/procedureAPI';
import {
  DepartmentList,
  LaboratoryList,
  OrganizationList,
} from '../../utils/data';
import { fetchDepartmentData } from '../../api/departmentAPI';

import {
  fetchSingleRunsData,
  fetchUpdateRunsData,
  postRunsData,
} from '../../api/RunsAPI';
import { fetchLabData } from '../../api/labAPI';
import Confirmationpopup from '../../components/ConfirmationPopup';
import SuccessPopup from '../../components/SuccessPopup';
import dayjs from 'dayjs';
import moment from 'moment';
import { toast } from 'react-toastify';
import { navigate } from 'gatsby';
import { fetchbulkRunz } from '../../api/bulkRunz';

const validationSchema = Yup.object().shape({
  procedureId: Yup.object().required('Procedure name is required'),
  createdOn: Yup.string().required('Created date is required'),
  departmentId: Yup.array().notRequired(),
  laboratoryId: Yup.array().notRequired(),
  objective: Yup.string()
    .trim()
    .required('Test Objective is required')
    .max(35, 'Label must be at most 35 characters'),
  // dueDate: Yup.date().required('Due Date is required'),
  // dueDate: Yup.string().required('Due Date is required').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, 'Invalid date'),
  assignedTo: Yup.string().notRequired(),
  organisationId: Yup.string().required('Procedure Name is required'),
  userId: Yup.string().notRequired(),
});

const RunsForm = React.forwardRef(
  (
    {
      openConfirmationPopup,
      type,
      formData,
      reload,
      handleReloadSingleData,
    }: any,
    ref,
  ) => {
    // const [openDlg2Dialog, setDialog2Open] = React.useState(false);
    // const [openSuccess, setSuccessOpen] = React.useState(false);

    const [answers, setAnswers] = React.useState('');
    const [procedureData, setprocedureData] = React.useState('');
    const [assignUser, setAssignUser] = React.useState('');

    const [departmentData, setDepartmentData] = React.useState([]);

    let DepartmentData = formData?.departmentId?.map((item: any) => ({
      label: item.name,
      value: item.name,
      id: item._id,
    }));

    let LabData = formData?.laboratoryId?.map((item: any) => ({
      label: item.name,
      value: item.name,
      id: item._id,
    }));
    const loginUserSliceData = useSelector(
      (state: any) => state.userLogin.data,
    );
    const [lab, setLab] = React.useState(LabData ? LabData : []);

    const [department, setDepartment] = React.useState(
      DepartmentData ? DepartmentData : [],
    );

    const [departments, setDepartments] = React.useState(
      formData?.departmentId?.map((item: any) => ({
        label: item?.name,
        value: item?.name,
        id: item?._id,
      })),
    );
    const [laboratory, setLaboratory] = React.useState(
      formData?.laboratoryId?.map((item: any) => ({
        label: item?.name,
        value: item?.name,
        id: item?._id,
      })),
    );

    const [labData, setLabData] = React.useState([]);
    const dispatch: any = useDispatch();
    const confirmationPopupRef: any = React.useRef();
    const successPopupRef: any = React.useRef();
    const dueDateInputRef: any = React.useRef(null);
    const Placeholder = ({ children }: any) => {
      return <div>{children}</div>;
    };
    const [runsOpen, setRunsOpen] = React.useState(false);
    const [runCreate, setRunsCreate] = React.useState(false);
    const runzSliceData = useSelector((state: any) => state.runs.data);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState(null);
    const [isAssigned, setIsAssigned] = React.useState(false);
    const [dueDate, setDueDate] = useState(null);
    const [error, setError] = React.useState('');

    //   const fetchProcedureSuggestions = async (inputValue) => {
    //   setLoading(true);
    //   try {
    //     // Call your API here to fetch procedure suggestions based on inputValue
    //     // Replace the following line with your API call

    //     const response = await fetch(`your-api-endpoint?q=${inputValue}`);
    //     const data = await response.json();
    //     setOptions(data);
    //   } catch (error) {
    //     console.error('Error fetching procedure suggestions:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const handleInputChange = (event, newInputValue) => {
      // Fetch suggestions when the user types
      setInputValue(newInputValue);
    };
    React.useEffect(() => {
      if (dueDateInputRef.current) {
        dueDateInputRef.current.disabled = true;
      }
    }, [dueDateInputRef.current]);
    React.useEffect(() => {
      formik.setFieldValue('objective', runzSliceData?.get_run?.objective);
      formik.setFieldValue(
        'laboratoryId',
        runzSliceData?.get_run?.laboratoryId,
      );
      formik.setFieldValue(
        'departmentId',
        runzSliceData?.get_run?.departmentId,
      );
      formik.setFieldValue('procedureId', runzSliceData?.get_run?.procedureId);
      formik.setFieldValue(
        'dueDate',
        type == 'edit' ? dayjs(runzSliceData?.get_run?.dueDate) : null,
      );
      if (type == 'edit') {
        setDueDate(dayjs(runzSliceData?.get_run?.dueDate, 'MM/DD/YYYY'));
      }
      // console.log("dayjs(runzSliceData?.get_run?.dueDate",dayjs(runzSliceData?.get_run?.dueDate))
    }, [runzSliceData]);
    React.useImperativeHandle(ref, () => ({
      open(state: any, row: any) {
        setRunsCreate(state);
        if (type == 'edit') {
          if (row?._id) {
            let payload = {
              _id: row?._id,
            };
            dispatch(fetchSingleRunsData(payload));
            // formik.setFieldValue('procedureId',runzSliceData?.get_run?.procedureId?._id)
            formik.setFieldValue(
              'objective',
              runzSliceData?.get_run?.objective,
            );
            formik.setFieldValue(
              'procedureId',
              runzSliceData?.get_run?.procedureId,
            );
            formik.setFieldValue(
              'laboratoryId',
              runzSliceData?.get_run?.laboratoryId,
            );
            formik.setFieldValue(
              'departmentId',
              runzSliceData?.get_run?.departmentId,
            );
            console.log(
              'dayjs(runzSliceData?.get_run?.dueDate',
              dayjs(runzSliceData?.get_run?.dueDate),
            );
            formik.setFieldValue(
              'dueDate',
              dayjs(runzSliceData?.get_run?.dueDate),
            );
            setDepartment(
              runzSliceData?.get_run?.departmentId?.map((item: any) => ({
                label: item.name,
                value: item.name,
                id: item._id,
              })),
            );
            setLab(
              runzSliceData?.get_run?.laboratoryId?.map((item: any) => ({
                label: item.name,
                value: item.name,
                id: item._id,
              })),
            );
            setDueDate(dayjs(runzSliceData?.get_run?.dueDate, 'MM/DD/YYYY'));
          }
        } else {
          formik.setFieldValue('objective', '');
          formik.setFieldValue('procedureId', null);
        }
      },
    }));
    // const departments: any = [];
    // const laboratory: any = [];
    // console.log("isMatch",type);
    const checkCredentials = () => {
      if (type !== 'edit') {
        if (isAssigned) {
          return true;
        } else {
          setIsAssigned(false);
        }
      } else {
        setIsAssigned(true);
        return true;
      }
    };
    const singleUserData = useSelector(
      (state: any) => state.user?.data?.get_user,
    );
    var deptArray: any = [];
    var labArray: any = [];
    const onSubmit = async (values: any) => {
      console.log('submit');

      // if(dueDate==null){
      //   setDueDateError("Due Date is required")
      // }
      // else{
      //   setDueDateError("")
      // }
      const isMatch = checkCredentials();
      console.log('isMatch', values);
      console.log('isMatch', isMatch);
      if (isMatch == true) {
        console.log('isMatch', type);

        department?.map((item: any) => deptArray.push(item?.id));

        lab?.map((item: any) => labArray.push(item?.id));
        console.log('deptArray', deptArray, labArray);

        let runsValues: any = {
          objective: values.objective,
          procedureId: values.procedureId?._id,
          departmentId: deptArray,
          laboratoryId: labArray,
          assignedTo: values.assignedTo,
          assignedBy: values.assignedBy,
          dueDate: moment(values.dueDate).format('MM/DD/YYYY'),
          createdOn: moment(values.createdOn.$d).format('MM/DD/YYYY'),
          status: values.status,
          organisationId: values.organisationId,
          userId: singleUserData?._id,
          // procedureDetials:values.procedureDetials
        };
        console.log('isMatch', runsValues);
        console.log('isMatch', type);

        if (type == 'edit') {
          console.log('isMatch', runsValues);
          runsValues['_id'] = formData._id;
          await dispatch(fetchUpdateRunsData(runsValues));
          await submitFormPopup();
          await handleReloadSingleData();
          await reload();
        } else {
          if (
            assignUser !== undefined &&
            assignUser !== '' &&
            assignUser !== null
          ) {
            runsValues['shared'] = false;
            runsValues['assignedTo'] = loginUserSliceData?.verifyToken?._id;
            (runsValues['createdOn'] = moment(new Date()).format('MM/DD/YYYY')),
              (runsValues['assignedBy'] = loginUserSliceData?.verifyToken?._id);
            runsValues['userId'] = assignUser;
            // delete runsValues.organisationId
            // delete runsValues.createdOn

            await dispatch(fetchbulkRunz({ runs: [runsValues] }));
            await reload();
          } else {
            await dispatch(postRunsData(runsValues));
            await reload();
          }
        }
        submitFormPopup();
        // reload()
        clearForm();
      }
      //  else {
      //   formik.setFieldError('name', '');
      // }
    };
    const createdDate =
      type === 'edit'
        ? dayjs(moment(formData?.createdOn).format('MM/DD/YYYY'))
        : dayjs(moment(new Date()).format('MM/DD/YYYY'));

    var dateDue = type == 'edit' ? dayjs(formData?.dueDate) : null;
    const formik = useFormik({
      initialValues: {
        departmentId: '',
        laboratoryId: '',
        organisationId: singleUserData?.organisationId,
        procedureId: '',
        objective: '',
        dueDate: dueDate,
        createdOn:
          type == 'edit'
            ? createdDate
            : dayjs(moment(new Date()).format('MM/DD/YYYY')),
        assignedBy: loginUserSliceData?.verifyToken?._id,
        assignedTo: loginUserSliceData?.verifyToken?._id,
        status: 'Created',
        procedureNumber: '',
        userId: '',
        // procedureDetials:""
      },
      validationSchema: validationSchema,
      onSubmit: onSubmit,
    });

    // console.log("createdDate",type == 'edit' ? "1"+createdDate : "3"+moment(new Date()).format('MM/DD/YYYY')  );

    const departmentSliceData = useSelector(
      (state: any) => state.department.data?.get_all_departments,
    );
    const labSliceData = useSelector(
      (state: any) => state.lab.data?.get_all_labs,
    );
    React.useEffect(() => {
      setDepartmentData(
        departmentSliceData?.map((item: any) => ({
          label: item.name,
          value: item.name,
          id: item._id,
        })),
      );
      setLabData(
        labSliceData?.map((item: any) => ({
          label: item.name,
          value: item.name,
          id: item._id,
        })),
      );
    }, [departmentSliceData, labSliceData]);

    React.useEffect(() => {
      // dispatch(fetchDepartmentData());
      // dispatch(fetchLabData());
    }, []);

    const handleDateChanges = (selectedDate: any, name: any) => {
      const formattedDate = moment(selectedDate?.$d).format('MM/DD/YYYY');
      formik.handleChange(name)(formattedDate);
      setDueDate(formattedDate);
      if (!moment(formattedDate).isValid()) {
        setError('Invaild Date');
      } else {
        setError('');
      }
    };
    const handleConfirmationState = (state: number) => {
      if (state === 0) {
        confirmationPopupRef.current.open(false);
      } else {
        confirmationPopupRef.current.open(false);
        // setRunsCreate(false);
        // clearForm()
        handleClose();
      }
    };

    const submitFormPopup = () => {
      setRunsCreate(false);
      toast(`Runs ${type == 'edit' ? 'updated' : 'created'} !`, {
        style: {
          background: '#00bf70',
          color: '#fff',
        },
      });
      // if(type=='edit'){

      // }
      // clearForm()
      handleClose();
      // successPopupRef.current.open(true, 'Run');
      // setTimeout(() => {
      //   successPopupRef.current.open(false, 'Run');
      // }, 3000);
    };
    const clearForm = () => {
      formik.resetForm();
      setDepartment([]);
      setLab([]);
      setAssignUser('');
      formik.dirty = false;
      // setOrganization([]);
    };
    const procedureSliceData = useSelector(
      (state: any) => state.procedure.data?.get_all_procedures,
    );
    React.useEffect(() => {
      setLoading(true);
      let payload: any = {
        page: 1,
        perPage: 10,
        searchBy: 'name',
        search: inputValue,
      };
      if (
        loginUserSliceData?.verifyToken?.role[0]?.name == 'Tester' ||
        loginUserSliceData?.verifyToken?.role[0]?.name == 'Requester'
      ) {
        payload['laboratoryId'] = singleUserData?.laboratoryId;
      }
      if (loginUserSliceData?.verifyToken?.role[0]?.name == 'Admin') {
        payload['organisationId'] = singleUserData?.organisationId;
      }
      dispatch(fetchProcedureData(payload));
    }, [inputValue]);
    const handleClose = () => {
      if (type !== 'edit') {
        formik.resetForm();
        setDepartment([]);
        setLab([]);
        setDueDate('');
        setError('');
        setAssignUser('');
        formik.setFieldValue('procedureId', '');
      }
      setIsAssigned(false);
      setRunsCreate(false);
    };

    const handleAssign = (userList: any) => {
      console.log('userList1', userList);

      setIsAssigned(true);
      setAssignUser(userList?.id);
    };

    const opt = procedureSliceData?.Procedures;
    console.log(formik, 'dueDate');

    return (
      <div>
        <Dialog
          open={runCreate}
          keepMounted
          aria-labelledby="add-new-asset-title"
          aria-describedby="add-new-asset"
          fullWidth
          maxWidth="md"
          className="popup-outer"
          disableScrollLock={true}
        >
          <form onSubmit={formik.handleSubmit}>
            <Box className="popup-section">
              <Box className="title-popup">
                <Typography>{type} Run</Typography>
                <CloseIcon
                  onClick={() => {
                    handleClose();
                  }}
                />
              </Box>
              <Box>
                <Grid container className="asset-popup" spacing={0}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box style={{ position: 'relative' }}>
                      {/* {formik.values.procedureId} */}
                      <label style={{ display: 'block' }}>
                        Procedure name
                        <span style={{ color: '#E2445C' }}>*</span>
                      </label>
                      <Autocomplete
                        loading={loading}
                        value={formik.values.procedureId}
                        options={opt !== undefined ? opt : []}
                        disableClearable={true}
                        getOptionLabel={(option: any) => option.name}
                        isOptionEqualToValue={(option: any, value: any) =>
                          value == option?._id
                        }
                        onChange={(event, value) => {
                          formik.setFieldValue('procedureId', value || '');
                          // Handle selection
                          let LabData = value?.laboratoryId?.map(
                            (item: any) => ({
                              label: item.name,
                              value: item.name,
                              id: item._id,
                            }),
                          );

                          formik.setFieldValue('laboratoryId', LabData || '');
                          setLaboratory(LabData);

                          let DepartmentData = value?.departmentId?.map(
                            (item: any) => ({
                              label: item.name,
                              value: item.name,
                              id: item._id,
                            }),
                          );
                          setDepartments(DepartmentData);

                          formik.setFieldValue(
                            'departmentId',
                            DepartmentData || '',
                          );
                          formik.setFieldValue(
                            'procedureNumber',
                            value?.procedureNumber || '',
                          );

                          setDepartment(DepartmentData);
                          setLab(LabData);
                        }}
                        onInputChange={handleInputChange}
                        renderInput={(procedureNames) => (
                          <TextField
                            {...procedureNames}
                            margin="none"
                            placeholder="Select procedure"
                          />
                        )}
                      />
                      {/* {formik.touched.procedureId &&
                        formik.errors.procedureId && (
                          <Typography className="error-field">
                            {formik.errors.procedureId}
                          </Typography>
                        )} */}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box style={{ position: 'relative' }}>
                      <label style={{ display: 'block' }}>Procedure name<span style={{ color: "#E2445C" }}>*</span></label>
            <Select
                      MenuProps={{                   
                        disableScrollLock: true,                   
                        marginThreshold: null
                      }}
                        className="placeholder-color"
                        displayEmpty
                        IconComponent={ExpandMoreOutlinedIcon}
                        renderValue={
                          formik.values.procedureId !== ''
                            ? undefined
                            : () => (
                              <Placeholder>Select Procedure</Placeholder>
                            )
                        }
                        margin="none"
                        fullWidth
                        id="procedureId"
                        name="procedureId"
                        // autoComplete="organisationId"
                        placeholder="organisationId"

                        onChange={(e) => {
                          formik.handleChange(e);

                          const selectedProcedure = procedureSliceData?.Procedures.find(
                            (item:any) => item._id === e.target.value
                          );
                          let LabData = selectedProcedure?.laboratoryId?.map((item: any) => ({
                            label: item.name,
                            value: item.name,
                            id: item._id,
                          }))

                           formik.setFieldValue('laboratoryId', LabData || '');
                          setLaboratory(
                            LabData
                          );
                          let DepartmentData = selectedProcedure?.departmentId?.map((item: any) => ({
                            label: item.name,
                            value: item.name,
                            id: item._id,
                          }))
                          setDepartments(DepartmentData)

                          formik.setFieldValue('procedureId', selectedProcedure?._id || '');
                          formik.setFieldValue('departmentId', DepartmentData || '');
                          formik.setFieldValue('procedureNumber', selectedProcedure?.procedureNumber || "")

                          setDepartment(DepartmentData)
                          setLab(LabData)

                        }}
                        onBlur={formik.handleBlur}
                        // getOptionLabel={(option: any) => option.label}
                        // isOptionEqualToValue={(option: any, value: any) =>
                        //       value.id == option.id
                        //     }
                        value={formik.values.procedureId}
                        size="small"
                        error={
                          formik.touched.procedureId &&
                          Boolean(formik.errors.procedureId)
                        }
                      >
                        {procedureSliceData?.Procedures.map((item, index) => (
                          <MenuItem key={index} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select> 
                      {formik.touched.procedureId &&
                        formik.errors.procedureId && (
                          <Typography className="error-field">
                            {formik.errors.procedureId}
                          </Typography>
                        )}
                    </Box>
                  </Grid> */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    sx={{ paddingRight: { sm: '1rem !important' } }}
                  >
                    {type == 'edit' ? (
                      <Box style={{ position: 'relative' }}>
                        <label style={{ display: 'block' }}>
                          Run Id(autogenerated)
                        </label>
                        <TextField
                          margin="none"
                          fullWidth
                          id="procedureId"
                          name="procedureId"
                          // autoComplete="procedureId"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Procedure Id"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formData?.runNumber}
                          size="small"
                          error={
                            formik.touched.procedureId &&
                            Boolean(formik.errors.procedureId)
                          }
                          disabled
                        />
                      </Box>
                    ) : (
                      <Box style={{ position: 'relative' }}>
                        <label style={{ display: 'block' }}>
                          Procedure Id (autogenerated)
                        </label>
                        <TextField
                          margin="none"
                          fullWidth
                          id="procedureId"
                          name="procedureId"
                          // autoComplete="procedureId"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Procedure Id"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.procedureNumber}
                          size="small"
                          error={
                            formik.touched.procedureId &&
                            Boolean(formik.errors.procedureId)
                          }
                          disabled
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    className="asset-popup calender-sec"
                  >
                    <Box style={{ position: 'relative' }}>
                      <label>Created on</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="MM/DD/YYYY"
                          value={formik.values.createdOn}
                          disabled
                          disablePast
                        />
                      </LocalizationProvider>
                      {formik.touched.createdOn && formik.errors.createdOn && (
                        <Typography className="error-field">
                          Created Date is required
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    className="multi-selection"
                    sx={{ paddingRight: { sm: '1rem !important' } }}
                  >
                    <Box style={{ position: 'relative' }}>
                      <label style={{ display: 'block' }}>Department/s</label>
                      <Autocomplete
                        value={department}
                        options={
                          departmentData !== undefined ? departmentData : []
                        }
                        multiple
                        id="departmentId"
                        disableCloseOnSelect
                        getOptionLabel={(option: any) => option.label}
                        isOptionEqualToValue={(option: any, value: any) =>
                          value?.id == option?.id
                        }
                        renderOption={(props, option: any, { selected }) => (
                          <React.Fragment>
                            <li {...props}>
                              <Checkbox
                                style={{ marginRight: 0 }}
                                checked={selected}
                              />
                              {option.value}
                            </li>
                          </React.Fragment>
                        )}
                        onChange={(_, selectedOptions: any) =>
                          setDepartment(selectedOptions)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            value={params}
                            placeholder={
                              department?.length == 0 ? 'Department/s' : ''
                            }
                          />
                        )}
                        fullWidth
                        placeholder="Department"
                        size="medium"
                        disabled
                      />
                      {/* {formik.touched.departmentId &&
                        formik.errors.departmentId && (
                          <Typography className="error-field">
                            {formik.errors.departmentId}
                          </Typography>
                        )} */}
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    className="multi-selection"
                  >
                    <Box style={{ position: 'relative' }}>
                      <label style={{ display: 'block' }}>Laboratory/ies</label>

                      <Autocomplete
                        value={lab}
                        options={
                          labData !== undefined && labData?.length !== 0
                            ? labData
                            : []
                        }
                        disableCloseOnSelect
                        multiple
                        id="laboratoryId"
                        getOptionLabel={(option: any) => option.label}
                        isOptionEqualToValue={(option: any, value: any) =>
                          value?.id == option?.id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={
                              lab?.length == 0 ? 'Laboratory/ies' : ''
                            }
                          />
                        )}
                        fullWidth
                        placeholder="Laboratory"
                        size="medium"
                        renderOption={(props, option: any, { selected }) => (
                          <React.Fragment>
                            <li {...props}>
                              <Checkbox
                                style={{ marginRight: 0 }}
                                checked={selected}
                              />
                              {option.value}
                            </li>
                          </React.Fragment>
                        )}
                        onChange={(_, selectedOptions: any) => {
                          setLaboratory(selectedOptions);
                        }}
                        disabled
                      />
                      {/* {formik.touched.laboratoryId &&
                        formik.errors.laboratoryId && (
                          <Typography className="error-field">
                            {formik.errors.laboratoryId}
                          </Typography>
                        )} */}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box style={{ position: 'relative' }}>
                      <label style={{ display: 'block', marginBottom: '8px' }}>
                        Test objective
                        <span style={{ color: '#E2445C' }}>*</span>
                      </label>
                      <TextField
                        margin="none"
                        fullWidth
                        id="objective"
                        name="objective"
                        autoComplete="off"
                        InputLabelProps={{ shrink: false }}
                        inputProps={{ maxLength: 36 }}
                        placeholder="Test objective"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.objective}
                        size="small"
                        error={
                          formik.touched.objective &&
                          Boolean(formik.errors.objective)
                        }
                      />
                      {formik.touched.objective && formik.errors.objective && (
                        <Typography className="error-field">
                          {formik.errors.objective}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    sx={{ paddingRight: { sm: '1rem !important' } }}
                    className="asset-popup calender-sec"
                  >
                    <Box style={{ position: 'relative' }}>
                      <label>
                        Due date<span style={{ color: '#E2445C' }}>*</span>
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disablePast
                          format="MM/DD/YYYY"
                          onChange={(selectedDate) =>
                            handleDateChanges(selectedDate, 'dueDate')
                          }
                          value={dueDate}
                          inputRef={dueDateInputRef}
                        />
                      </LocalizationProvider>
                      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker format="MM/DD/YYYY" disablePast onChange={(selectedDate: any) => handleDateChanges(selectedDate, 'dueDate')} value={formik.values.dueDate} />
                      </LocalizationProvider> */}
                      {/* {formik.touched.dueDate && formik.errors.dueDate && ( */}
                      <Typography className="error-field">{error}</Typography>
                      {/* )} */}
                    </Box>
                  </Grid>

                  <Grid item xs={0} sm={6} md={6} lg={6} />
                  {type !== 'edit' && (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      sx={{ paddingRight: { sm: '1rem !important' } }}
                    >
                      <Box style={{ position: 'relative' }}>
                        <label
                          style={{ display: 'block', marginBottom: '0.8rem' }}
                        >
                          Assign to<span style={{ color: '#E2445C' }}>*</span>
                        </label>
                        {formik.touched.userId && formik.errors.userId && (
                          <Typography className="error-field">
                            {formik.errors.userId}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img src={Avatars} alt="Avatars" />
                          <Button
                            disabled={
                              Object.keys(formik.errors).length == 0 &&
                              moment(dueDate).isValid()
                                ? false
                                : true
                            }
                            variant="contained"
                            className="avatar-add"
                            onClick={() => {
                              setRunsOpen(true);
                            }}
                          >
                            <AddIcon sx={{ mr: 1 }} />
                            Add
                          </Button>
                          {/* {isAssigned &&<img src={Avatars} alt="Avatars" style={{paddingLeft:"10px"}} />} */}
                        </Box>
                        {/* {JSON.stringify(Object.keys(formik.errors).length == 0 )} */}
                        {Object.keys(formik.errors).length == 0 &&
                          moment(dueDate).isValid() &&
                          !isAssigned && (
                            <Typography className="error-field">
                              Please assign at least one people
                            </Typography>
                          )}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Box
                sx={{
                  display: { xs: 'block', sm: 'flex' },
                  justifyContent: 'flex-end',
                  mt: 3,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    confirmationPopupRef.current.open(true);
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    type === 'edit'
                      ? !formik.dirty
                      : Object.keys(formik.errors).length == 0 &&
                        moment(dueDate).isValid() &&
                        isAssigned
                      ? false
                      : true
                  }
                  className="add-btn"
                >
                  {type === 'edit' ? 'Update' : 'Create'}
                </Button>
              </Box>
            </Box>
          </form>
        </Dialog>
        <AddPeoplePopup
          open={runsOpen}
          close={() => setRunsOpen(false)}
          typePopup={'assign'}
          formValue={formik.values}
          handleAssign={handleAssign}
          assigned={
            Object.keys(formik.errors).length == 0 &&
            moment(dueDate).isValid() &&
            isAssigned
          }
          // runzId={runzId}
          //         runzRow={runzRow}
          //         typePopup={typePopup}
        />
        <Confirmationpopup
          ref={confirmationPopupRef}
          confirmationState={handleConfirmationState}
          type={type}
        />
        <SuccessPopup ref={successPopupRef} type={type} />
      </div>
    );
  },
);
export default RunsForm;
