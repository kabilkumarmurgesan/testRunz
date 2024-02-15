/* eslint-disable react/display-name */
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Checkbox,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LaboratoryList, DepartmentList } from '../../utils/data';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDepartmentData } from '../../api/departmentAPI';
import { fetchLabById, fetchLabData } from '../../api/labAPI';
import {
  fetchProcedure,
  fetchUpdateProcedureData,
  postProcedureData,
} from '../../api/procedureAPI';
import Confirmationpopup from '../../components/ConfirmationPopup';
import SuccessPopup from '../../components/SuccessPopup';
import { fetchUpdateAssetsData } from '../../api/assetsAPI';
import dayjs from 'dayjs';
import moment from 'moment';
import { toast } from 'react-toastify';
import { navigate } from 'gatsby';
// import Confirmationpopup from "../../components/ConfirmationPopup";
// import Successpopup from "../../components/SuccessPopup";
const validationSchema = Yup.object().shape({
  createdOn: Yup.string().required(),
  createdBy: Yup.string().notRequired(),
  departmentId: Yup.array()
    .min(1, 'Please select at least one Department')
    .required('Department is required'),
  laboratoryId: Yup.array()
    .min(1, 'Please select at least one Laboratory')
    .required('Laboratory is required'),
  organisationId: Yup.string().notRequired(),
  // name: Yup.string().required("Procedure name is required"),
  name: Yup.string()
    .trim()
    .required('Procedure name is required')
    .max(50, 'Must be 50 characters or less'),
  // .matches(
  //   /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/,
  //   'Label cannot have empty spaces',
  // ),
});

const ProcedureForm = React.forwardRef(
  (
    {
      open,
      close,
      closeFormPopup,
      type,
      formData,
      reload,
      reloadSingleData,
    }: any,
    ref,
  ) => {
    // const [openDlg2Dialog, setDialog2Open] = React.useState(false);
    // const [openSuccess, setSuccessOpen] = React.useState(false);
    console.log(formData);

    const [openForm, setFormOpen] = React.useState(false);
    // const departments: any = [];
    // const laboratory: any = [];
    const [departmentData, setDepartmentData] = React.useState([]);
    const [labData, setLabData] = React.useState([]);
    const dispatch: any = useDispatch();
    const confirmationPopupRef: any = React.useRef();
    const successPopupRef: any = React.useRef();
    const [departments, setDepartments] = React.useState(
      formData !== undefined
        ? formData?.departmentId?.map((item: any) => ({
            label: item?.name,
            value: item?.name,
            id: item?._id,
          }))
        : [],
    );
    const [laboratory, setLaboratory] = React.useState(
      formData !== undefined
        ? formData?.laboratoryId?.map((item: any) => ({
            label: item?.name,
            value: item?.name,
            id: item?._id,
          }))
        : [],
    );
    // const handleAddButtonClick = () => {
    //     setSuccessOpen(true);
    //     closeFormPopup();
    //     setTimeout(() => {
    //       setSuccessOpen(false);
    //     }, 2000);
    //   };
    //   const handleConfirmationYes = () => {
    //     setDialog2Open(false);
    //     closeFormPopup();
    //   };
    const checkCredentials = (values: any) => {
      console.log(values);
      console.log(formik.errors);

      return true;
    };
    const onSubmit = async (values: any) => {
      console.log('values', values);
      const isMatch = checkCredentials(values.name);
      var deptArray: any = [];
      departments.map((item: any) => deptArray.push(item?.id));
      var labArray: any = [];
      laboratory.map((item: any) => labArray.push(item?.id));
      const procedures: any = {
        name: values.name,
        // organisationId: values.organisationId,
        departmentId: deptArray,
        laboratoryId: labArray,
        createdBy: values.createdBy,
        procedureDetials: values.procedureDetials,
        instituteId: singleUserData?.instituteId,
      };
      if (type == 'create') {
        procedures['organisationId'] = values.organisationId;
        procedures['procedureDetials'] = values.procedureDetials;
        procedures['createdOn'] = values.createdOn;
      } else {
        procedures['_id'] = formData._id;
      }

      if (isMatch) {
        if (type == 'edit') {
          dispatch(fetchUpdateProcedureData(procedures))
            .then(() => {
              // setTimeout(()=>{
              reloadSingleData();
              // },3000)

              submitFormPopup();
              clearForm();
            })
            .catch(() => {
              toast('Procedure is not updated !', {
                style: {
                  background: '#d92828',
                  color: '#fff',
                },
              });
            });
          // reload()

          // if(type=='edit'){

          // }
        } else {
          await dispatch(postProcedureData(procedures))
            .then((res) => {
              submitFormPopup();
              setTimeout(() => {
                navigate(`/procedures/details/${res?.create_procedure?._id}`);
              }, 1000);
            })
            .catch((err) => {
              console.log(err);
            });

          clearForm();
          // navigate(`/procedures/details/${}`)
          reload();
        }
      }
    };

    React.useImperativeHandle(ref, () => ({
      open(state: any, row: any, id: any) {
        if (row?._id && !id) {
          let payload = {
            _id: row?._id,
          };
          formik.setValues({ ...formik.values, name: row?.name });
          dispatch(fetchProcedure(payload))
            .then((isSucess) => {
              if (isSucess?.get_procedure) {
                console.log(row);
                // formik.setFieldValue('name',isSucess?.get_procedure?.name || row?.name)
                formik.setValues({
                  ...formik.values,
                  name: isSucess?.get_procedure?.name || row?.name,
                });
                //  formik.setFieldValue('departmentId',isSucess?.get_procedure?.departmentId)
                //  formik.setFieldValue('laboratoryId',isSucess?.get_procedure?.laboratoryId)
                formik.setFieldValue(
                  'organisationId',
                  isSucess?.get_procedure?.organisationId ||
                    row?.organisationId,
                );
                formik.setFieldValue(
                  'procedureDetials',
                  isSucess?.get_procedure?.procedureDetials ||
                    row?.procedureDetials,
                );
                formik.setFieldValue(
                  'createdBy',
                  isSucess?.get_procedure?.createdBy || row?.createdBy,
                );
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (row !== undefined) {
          let department = row?.departmentId?.map((item: any) => ({
            label: item?.name,
            value: item?.name,
            id: item?._id,
          }));
          let laboratory = row?.laboratoryId?.map((item: any) => ({
            label: item?.name,
            value: item?.name,
            id: item?._id,
          }));
          formik.setFieldValue('departmentId', department);
          formik.setFieldValue('laboratoryId', laboratory);
          formik.setFieldValue('procedureDetials', row.procedureDetials);
          formik.setFieldValue('createdBy', row.createdBy);
          // formik.setFieldValue('name', row.name);
          setDepartments(department);
          setLaboratory(laboratory);
        }
        setFormOpen(state);
      },
    }));
    const clearForm = () => {
      formik.resetForm();
      if (type == 'create') {
        setDepartments([]);
        setLaboratory([]);
      }
      formik.dirty = false;
    };
    const userSliceData = useSelector(
      (state: any) => state.userLogin?.data?.verifyToken,
    );

    // const[formValues,setFormValues]=React.useState<any>({})
    const procedureSliceData = useSelector(
      (state: any) => state.procedure.data?.get_procedure,
    );
    const singleUserData = useSelector(
      (state: any) => state.user?.data?.get_user,
    );

    // React.useEffect(() => {
    //  console.log(procedureSliceData?.name);
    //  formik.setFieldValue('name',procedureSliceData?.name)
    //  formik.setFieldValue('departmentId',procedureSliceData?.departmentId)
    //  formik.setFieldValue('laboratoryId',procedureSliceData?.laboratoryId)
    //  formik.setFieldValue('organisationId',procedureSliceData?.organisationId)
    //  formik.setFieldValue('procedureDetials',procedureSliceData?.procedureDetials)

    // }, [procedureSliceData])
    // const initialValues = {
    //   name: formData?.name,
    //   createdBy: new Date(),
    //   departmentId: formData?.departmentId,
    //   laboratoryId: formData?.laboratoryId,
    //   organisationId: formData?.organisationId,
    // };
    // console.log(initialValues);
    const formik = useFormik({
      initialValues: {
        name: '',
        createdOn: moment(new Date()).format('MM/DD/YYYY'),
        createdBy: userSliceData?.firstName + userSliceData?.lastName,
        departmentId: formData ? formData.departmentId : [],
        laboratoryId: formData ? formData.laboratoryId : [],
        organisationId: formData
          ? formData.organisationId
          : singleUserData?.organisationId,
        procedureDetials: '',
      },
      validationSchema: validationSchema,
      onSubmit: onSubmit,
    });
    // console.log(formValues);
    console.log(formik);

    const departmentSliceData = useSelector(
      (state: any) => state.department.data?.get_all_departments,
    );
    const labSliceData = useSelector(
      (state: any) => state.lab.data?.get_all_labs,
    );

    // React.useEffect(()=>{
    //   formik.setFieldValue("departmentId",singleUserData?.departmentId?.map((item: any) => (departmentData?.find(obj => (obj?.id == item) ))) || []);
    //   formik.setFieldValue("laboratoryId",singleUserData?.laboratoryId?.map((item: any) => (labData?.find(obj => (obj?.id == item) ))) || []);

    // },[departmentSliceData])

    React.useEffect(() => {
      const mappedDepartments = (singleUserData?.departmentId || [])
        .map((id: string) => {
          var department = departmentSliceData?.find((obj) => obj._id === id);

          if (department) {
            return {
              label: department.name,
              value: department.name,
              id: department._id,
            };
          }

          return null; // Handle the case where the department with the specified ID is not found
        })
        .filter((department) => department !== null);

      const mappedDLabs = singleUserData?.laboratoryId
        ?.map((id: string) => {
          var lab = labSliceData?.find((obj) => obj._id === id);

          if (lab) {
            return {
              label: lab.name,
              value: lab.name,
              id: lab._id,
            };
          }

          return null; // Handle the case where the department with the specified ID is not found
        })
        .filter((lab) => lab !== null);

      console.log('mappedDepartments', mappedDepartments);
      console.log('mappedDepartments', mappedDLabs);

      setDepartmentData(mappedDepartments);
      setLabData(mappedDLabs);
      // setDepartmentData(
      //   departmentSliceData?.map((item: any) => ({
      //     label: item.name,
      //     value: item.name,
      //     id: item._id,
      //   })),
      // );
      // setLabData(
      //   labSliceData?.map((item: any) => ({
      //     label: item.name,
      //     value: item.name,
      //     id: item._id,
      //   })),
      // );
    }, [departmentSliceData, labSliceData, userSliceData]);

    console.log(departmentData);

    console.log(laboratory);

    // React.useEffect(() => {
    //   let payload={

    //   }
    //   dispatch(fetchDepartmentData());
    //   dispatch(fetchLabData());
    // }, []);

    const handleConfirmationState = (state: any) => {
      if (state === 0) {
        confirmationPopupRef.current.open(false);
      } else {
        confirmationPopupRef.current.open(false);
        setFormOpen(false);
        clearForm();
      }
    };

    const submitFormPopup = () => {
      setFormOpen(false);
      toast(`Procedure ${type == 'edit' ? 'updated' : 'created'} !`, {
        style: {
          background: '#00bf70',
          color: '#fff',
        },
      });
      // successPopupRef.current.open(true, 'Procedure');
      // setTimeout(() => {
      //   successPopupRef.current.open(false, 'Procedure');
      // }, 3000);
    };
    console.log(type);
    const createdOn =
      type == 'edit'
        ? dayjs(
            moment(parseInt(formData?.createdAt))
              .local()
              .format('MM/DD/YYYY'),
          )
        : dayjs(moment().format('MM/DD/YYYY'));

    console.log(formik.errors);

    return (
      <div>
        {/* <Confirmationpopup
                open={openDlg2Dialog}
                close={() => setDialog2Open(false)}
                handleConfirmationYes={handleConfirmationYes}
            />
            <Successpopup open={openSuccess} type={"Procedures"} close={() => setSuccessOpen(false)} /> */}
        <Dialog
          open={openForm}
          keepMounted
          // onClose={() => closeFormPopup(false)}
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
                <Typography>{type} Procedure</Typography>
                <CloseIcon
                  onClick={() => {
                    closeFormPopup(false);
                    clearForm();
                  }}
                />
              </Box>

              <Box>
                <Grid
                  container
                  spacing={2}
                  className="asset-popup calender-sec"
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    sx={{ paddingRight: { sm: '1rem !important' } }}
                  >
                    <Box style={{ position: 'relative' }}>
                      <label style={{ display: 'block' }}>
                        Procedure ID (autogenerated)
                      </label>
                      <TextField
                        margin="normal"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        // required
                        fullWidth
                        id="name"
                        name="organisationId"
                        // autoComplete="name"
                        autoFocus
                        InputLabelProps={{ shrink: false }}
                        placeholder="Procedure ID"
                        className="bg-gray-input"
                        value={formData?.procedureNumber}
                        disabled
                        size="small"
                        // error={
                        //   formik.touched.procedureNumber &&
                        //   Boolean(formik.errors.procedureNumber)
                        // }
                      />
                      {/* {formik.touched.procedureNumber &&
                        formik.errors.procedureNumber && (
                          <Typography className="error-field">
                            {formik.errors.procedureNumber}
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
                    sx={{
                      paddingLeft: { sm: '1rem !important' },
                      paddingTop: {
                        xs: '0rem !important',
                        sm: '1rem !important',
                      },
                    }}
                  >
                    <Box
                      className="bg-gray-input"
                      style={{ position: 'relative' }}
                    >
                      <label style={{ display: 'block' }}>Created on</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="MM/DD/YYYY"
                          value={createdOn}
                          disabled
                          disablePast
                        />
                      </LocalizationProvider>
                      {formik.touched.perchasedDate &&
                        formik.errors.perchasedDate && (
                          <Typography className="error-field">
                            Purchase date required
                          </Typography>
                        )}
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  className="asset-popup multi-selection"
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    sx={{ paddingRight: { sm: '1rem !important' } }}
                  >
                    <Box style={{ position: 'relative' }}>
                      <label style={{ display: 'block' }}>
                        Department<span style={{ color: '#E2445C' }}>*</span>
                      </label>
                      {type == 'edit' &&
                      departments &&
                      departments.length > 0 ? (
                        <Autocomplete
                          multiple
                          id="departmentId"
                          disableCloseOnSelect
                          value={departments}
                          options={
                            departmentData !== undefined ? departmentData : []
                          }
                          getOptionLabel={(option: any) => option.label}
                          isOptionEqualToValue={(option: any, value: any) =>
                            value.id == option.id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={
                                departments?.length == 0 ? 'Department/s' : ''
                              }
                            />
                          )}
                          fullWidth
                          placeholder="Department"
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
                            setDepartments(selectedOptions);
                            formik.setValues({
                              ...formik.values,
                              departmentId: selectedOptions,
                            });
                          }}
                        />
                      ) : (
                        <Autocomplete
                          multiple
                          id="departmentId"
                          disableCloseOnSelect
                          value={departments}
                          options={
                            departmentData !== undefined ? departmentData : []
                          }
                          getOptionLabel={(option: any) => option.label}
                          isOptionEqualToValue={(option: any, value: any) =>
                            value.id == option.id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={
                                departments?.length == 0 ? 'Department/s' : ''
                              }
                            />
                          )}
                          fullWidth
                          placeholder="Department"
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
                          onBlur={() => {
                            var dept: any = [];
                            formik.values.departmentId?.map((item: any) =>
                              dept.push(item?.id),
                            );
                            dispatch(fetchLabById({ departmentId: dept }));
                            setLaboratory([]);
                          }}
                          onChange={(_, selectedOptions: any) => {
                            setDepartments(selectedOptions);
                            formik.setValues({
                              ...formik.values,
                              departmentId: selectedOptions,
                            });
                          }}
                        />
                      )}
                      {/* <Autocomplete
                        multiple
                        id="departmentId"
                        options={
                          departmentData !== undefined ? departmentData : []
                        }
                        disableCloseOnSelect
                        getOptionLabel={(option: any) => option.label}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              name="departmentId"
                              style={{ marginRight: 0 }}
                              checked={selected}
                            />
                            {option.label}
                          </li>
                        )}
                        disabled={type == 'create' ? true : false}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            className={type == 'create' ? 'bg-gray-input' : ''}
                          />
                        )}
                        fullWidth
                        placeholder="Department"
                        size="medium"
                        onChange={(e, f) => {
                          f.forEach((element) =>
                            departments.push(element.value),
                          );
                          formik.setFieldValue('departmentId', departments);
                        }}
                      /> */}
                      {formik.touched.departmentId &&
                        formik.errors.departmentId && (
                          <Typography className="error-field">
                            {formik.errors.departmentId}
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
                    sx={{
                      paddingLeft: { sm: '1rem !important' },
                      paddingTop: {
                        xs: '0rem !important',
                        sm: '1rem !important',
                      },
                    }}
                  >
                    <Box style={{ position: 'relative' }}>
                      <label style={{ display: 'block' }}>
                        Laboratory<span style={{ color: '#E2445C' }}>*</span>
                      </label>
                      {type == 'edit' && laboratory && laboratory.length > 0 ? (
                        <Autocomplete
                          multiple
                          id="departmentId"
                          options={labData !== undefined ? labData : []}
                          getOptionLabel={(option: any) => option.label}
                          isOptionEqualToValue={(option: any, value: any) =>
                            value.id == option.id
                          }
                          disableCloseOnSelect
                          value={laboratory}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={
                                laboratory?.length == 0 ? 'Laboratory/ies' : ''
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
                            formik.setValues({
                              ...formik.values,
                              laboratoryId: selectedOptions,
                            });
                          }}
                        />
                      ) : (
                        <Autocomplete
                          multiple
                          id="departmentId"
                          options={labData !== undefined ? labData : []}
                          getOptionLabel={(option: any) => option.label}
                          isOptionEqualToValue={(option: any, value: any) =>
                            value.id == option.id
                          }
                          disableCloseOnSelect
                          value={laboratory}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={
                                laboratory?.length == 0 ? 'Laboratory/ies' : ''
                              }
                            />
                          )}
                          fullWidth
                          placeholder="Laboratory"
                          size="medium"
                          disabled={departments.length == 0 ? true : false}
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
                            formik.setValues({
                              ...formik.values,
                              laboratoryId: selectedOptions,
                            });
                          }}
                        />
                      )}
                      {formik.touched.laboratoryId &&
                        formik.errors.laboratoryId && (
                          <Typography className="error-field">
                            {formik.errors.laboratoryId}
                          </Typography>
                        )}
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="asset-popup">
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box style={{ position: 'relative' }}>
                      <label style={{ display: 'block' }}>
                        Procedure name
                        <span style={{ color: '#E2445C' }}>*</span>
                      </label>
                      <TextField
                        margin="normal"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        size="small"
                        // required
                        fullWidth
                        id="name"
                        name="name"
                        autoComplete="off"
                        autoFocus
                        inputProps={{ maxLength: 51 }}
                        InputLabelProps={{ shrink: false }}
                        placeholder="Procedure Name"
                        value={formik.values.name}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                      />
                      {formik.touched.name && formik.errors.name && (
                        <Typography className="error-field">
                          {formik.errors.name}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
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
                  className="cancel-btn"
                  onClick={() => {
                    confirmationPopupRef.current.open(true);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="add-btn"
                  disabled={
                    type == 'edit'
                      ? !formik.dirty
                      : Object.keys(formik.errors).length == 0 && formik.dirty
                      ? false
                      : true
                  }
                >
                  {type === 'edit' ? 'Update' : 'Create'}
                </Button>
              </Box>
            </Box>
          </form>
        </Dialog>
        <SuccessPopup ref={successPopupRef} type={type} />
        <Confirmationpopup
          ref={confirmationPopupRef}
          confirmationState={handleConfirmationState}
          type={type}
        />
      </div>
    );
  },
);
export default ProcedureForm;
