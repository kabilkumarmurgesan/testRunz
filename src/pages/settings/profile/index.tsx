/* eslint-disable no-var */
import React from 'react';
import {
  Box,
  Autocomplete,
  Checkbox,
  Button,
  Grid,
  MenuItem,
  IconButton,
  Select,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import search from '../../../assets/images/search.svg';
import camera from '../../../assets/images/profile/camera.svg';
import profile from '../../../assets/images/profile/profile.svg';
import organisation from '../../../assets/images/profile/organisation.svg';
import document from '../../../assets/images/profile/document.svg';
import profile2 from '../../../assets/images/profile/profile2.svg';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { withSettingsLayout } from '../../../components/settings';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { navigate } from 'gatsby';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDepartmentById,
  fetchDepartmentData,
} from '../../../api/departmentAPI';
import { fetchLabById, fetchLabData } from '../../../api/labAPI';

import {
  DepartmentList,
  LaboratoryList,
  OrganizationList,
} from '../../../utils/data';
import { toast } from 'react-toastify';
import { fetchSingleRoleData } from '../../../api/roleApi';
import { fetchSingleUserData, fetchUpdateUserData } from '../../../api/userAPI';
import { fileUploadData } from '../../../api/uploadAPI';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../../../firebase.config';
import { log } from 'console';
import AWS from 'aws-sdk';
import { fetchOrganizationById } from '../../../api/organizationAPI';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const validationSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  newpassword: Yup.string()
    .required('New Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Weak password',
    ),
  confirmpassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newpassword'), ''], 'Password mismatch'),
});
const validationSchemaProfile = Yup.object().shape({
  // firstName: Yup.string().required('First name is required'),
  firstName: Yup.string()
    .trim()
    .required('First name is required')
    .max(50, 'Must be 50 characters or less'),
  // lastName: Yup.string().required('Lase name is required'),
  lastName: Yup.string()
    .trim()
    .required('Last name is required')
    .max(50, 'Must be 50 characters or less'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email')
    .matches(emailRegex, 'In-correct email'),
  phoneNumber: Yup.string()
    // .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  // .matches(phoneRegExp, 'Phone number is not valid')
  // .min(10, 'Enter valid number')
  // .max(10, 'too long')
  // .required('Mobile number is required'),
  organisationId: Yup.string().required('Organistation is required'),
  // institution: Yup.string().required("Institution is required"),
  departmentId: Yup.array()
    .min(1, 'Please select at least one Department')
    .required('Department is required'),
  laboratoryId: Yup.array()
    .min(1, 'Please select at least one Laboratory')
    .required('Laboratory is required'),
  // user_id: Yup.string().required(),
  role: Yup.string().required('Role is required'),
  // status: Yup.string().required("Status is required"),
});

const Profile = () => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const [departmentData, setDepartmentData] = React.useState([]);
  const [labData, setLabData] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const dispatch: any = useDispatch();
  const fileUploadField = React.useRef<any>(null);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  interface FormValidation {
    password: boolean;
    newpassword: boolean;
    confirmpassword: boolean;
  }

  const [initalStatus, setInitalStatus] = React.useState<FormValidation>({
    password: false,
    newpassword: false,
    confirmpassword: false,
  });
  const [departments, setDepartments] = React.useState([]);
  const [laboratory, setLaboratory] = React.useState([]);
  const [organizationData, setOrganizationData] = React.useState([]);
  const [roleData, setRoleData] = React.useState([]);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [userData, setUserData] = React.useState({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const Placeholder = ({ children }: any) => {
    return <div>{children}</div>;
  };
  const handleClickShowPassword = (
    key: keyof FormValidation,
    newValue: boolean,
  ) => {
    const updatedValidation = { ...initalStatus };
    updatedValidation[key] = newValue;
    setInitalStatus(updatedValidation);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const loginUserSliceData = useSelector(
    (state: any) => state.userLogin.data?.verifyToken,
  );
  const singleUserData = useSelector(
    (state: any) => state.user?.data?.get_user,
  );
  const credencial = loginUserSliceData?.role[0];
  console.log(singleUserData);

  React.useEffect(() => {
    let temp = { _id: loginUserSliceData?._id };
    // if (row?._id) {
    dispatch(fetchSingleUserData(temp))
      .then((isSucess) => {
        if (isSucess.get_user) {
          console.log('isSucess.get_user', isSucess.get_user);

          setUserData(isSucess.get_user);
          formikProfile.setFieldValue(
            'firstName',
            isSucess.get_user.firstName || '',
          );
          formikProfile.setFieldValue(
            'lastName',
            isSucess.get_user.lastName || '',
          );
          formikProfile.setFieldValue('email', isSucess.get_user.email || '');
          formikProfile.setFieldValue(
            'phoneNumber',
            isSucess.get_user.phoneNumber || '',
          );
          formikProfile.setFieldValue(
            'organisationId',
            isSucess.get_user.organisationId || '',
          );
          formikProfile.setFieldValue(
            'departmentId',
            isSucess.get_user?.departmentId?.map(
              (item: any) => departmentData?.find((obj) => obj.id == item),
            ) || [],
          );
          formikProfile.setFieldValue(
            'laboratoryId',
            isSucess.get_user?.laboratoryId?.map(
              (item: any) => labData?.find((obj) => obj.id == item),
            ) || [],
          );
          console.log(isSucess.get_user.imageUr, 'isSucess.get_user.imageUr');

          formikProfile.setFieldValue('role', isSucess.get_user.role || '');
          setUploadedFile(isSucess.get_user.imageUrl);
          formikProfile.setFieldValue(
            'institution',
            isSucess.get_user.instituteId || '',
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
    // }
  }, [departmentData, labData, loginUserSliceData, singleUserData]);

  React.useEffect(() => {
    dispatch(
      fetchOrganizationById({ instituteId: singleUserData?.instituteId }),
    );
    dispatch(
      fetchDepartmentById({ organisationId: singleUserData?.organisationId }),
    );
    dispatch(fetchLabById({ departmentId: singleUserData?.departmentId }));
  }, [singleUserData]);

  const onSubmit = async (values: any) => {
    const isMatch = checkCredentials(
      values.password,
      values.newpassword,
      values.confirmpassword,
    );
    //profile_management

    if (isMatch) {
      const auths = auth;
      const user = auths.currentUser;
      console.log(auths.currentUser);

      // TODO(you): prompt the user to re-provide their sign-in credentials
      const credential: any = EmailAuthProvider.credential(
        auths.currentUser?.email,
        values.password,
      );
      console.log(credential);
      await reauthenticateWithCredential(user, credential)
        .then(() => {
          // User re-authenticated.
          updatePassword(auth.currentUser, values.newpassword)
            .then(() => {
              toast(`Password Reset successful !`, {
                style: {
                  background: '#00bf70',
                  color: '#fff',
                },
              });
              setTimeout(() => {
                navigate('/login');
              }, 2000);
            })
            .catch((err) => {
              toast(err, {
                style: {
                  background: '#d92828',
                  color: '#fff',
                },
              });
            });
        })
        .catch((error) => {
          toast(`Invalid user password !`, {
            style: {
              background: '#d92828',
              color: '#fff',
            },
          });
          console.error(error);
        });

      // alert("password updated successful!");
      // navigate('/login')
    } else {
      formik.setFieldError('password', 'Invalid password');
    }
  };

  const checkCredentials = (
    password: any,
    newpassword: any,
    confirmpassword: any,
  ) => {
    if (newpassword !== '' && confirmpassword !== '' && password !== '') {
      return true;
    } else {
      return false;
    }
  };
  const checkCredentialsProfile = (
    firstName: any,
    // lastName: any,
    // email: any,
    // mobile: any,
    // organisation: any,
    // lab: any,
    // department: any,
    // designation: any,
    // reqstId: any,
  ) => {
    // if(newpassword!=="" && confirmpassword!=="" && password!== ""){
    return true;
    // }
    // else{
    // return false;
    // }
  };
  console.log(uploadedFile, 'uploadedFile');

  const onSubmitProfile = async (values: any) => {
    const isMatch = checkCredentialsProfile(
      values.firstName,
      // values.lastName,
      // values.email,
      // values.mobile,
      // values.organisation,
      // values.lab,
      // values.password,
      // values.designation,
      // values.reqstId
    );
    console.log('departments', departments);

    if (isMatch) {
      var deptArray: any = [];
      formikProfile.values.departmentId?.map((item: any) =>
        deptArray.push(item?.id),
      );
      var labArray: any = [];
      formikProfile.values.laboratoryId?.map((item: any) =>
        labArray.push(item?.id),
      );
      console.log(values.institution);

      const userValues = {
        // uid:"",
        firstName: values.firstName,
        lastName: values.lastName,
        fullName: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phoneNumber: values.phoneNumber.toString(),
        organisationId: values.organisationId,
        imageUrl: uploadedFile,
        instituteId: values.instituteId,
        departmentId: deptArray,
        laboratoryId: labArray,
        role: values.role,
        _id: userData?._id,
      };
      // debugger
      // userValues['_id'] = userData?._id
      setIsSubmitted(true);
      await dispatch(fetchUpdateUserData(userValues));
      await window.localStorage.setItem(
        'userProfileDetails',
        JSON.stringify(userValues),
      );
      await toast(`User Details updated successful !`, {
        style: {
          background: '#00bf70',
          color: '#fff',
        },
      });
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
      // alert("User Details updated successful!");
    }
  };
  const formik = useFormik({
    initialValues: {
      password: '',
      newpassword: '',
      confirmpassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });
  const formikProfile = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      organisationId: '',
      institution: '',
      departmentId: [],
      laboratoryId: [],
      role: '',
    },
    validationSchema: validationSchemaProfile,
    onSubmit: onSubmitProfile,
  });
  console.log(formikProfile);

  const departmentSliceData = useSelector(
    (state: any) => state.department.data?.get_all_departments,
  );
  const labSliceData = useSelector(
    (state: any) => state.lab.data?.get_all_labs,
  );
  const roleSliceData = useSelector(
    (state: any) => state.role.data?.find_roles,
  );
  const organizationSliceData = useSelector(
    (state: any) => state.organization.data?.get_all_organisations,
  );
  console.log('formikProfile', formikProfile);
  React.useEffect(() => {
    setDepartmentData(
      departmentSliceData?.map((item: any) => ({
        label: item.name,
        value: item.name,
        id: item._id,
      })),
    );
    console.log('labSliceData', labSliceData);

    setLabData(
      labSliceData?.map((item: any) => ({
        label: item.name,
        value: item.name,
        id: item._id,
      })),
    );
    setRoleData(
      roleSliceData?.map((item: any) => ({
        label: item.name,
        value: item._id,
      })),
    );
    const loginUserorganization = organizationSliceData?.filter(
      (item: any) => loginUserSliceData.organisationId === item._id,
    );
    setOrganizationData(
      loginUserorganization?.map((item: any) => ({
        label: item.name,
        value: item.name,
        id: item._id,
      })),
    );
  }, [departmentSliceData, labSliceData, roleSliceData, organizationSliceData]);

  React.useEffect(() => {
    const payload2 = {
      instituteId: loginUserSliceData?.instituteId,
    };
    // dispatch(fetchDepartmentData());
    // dispatch(fetchLabData());
    dispatch(fetchSingleRoleData(payload2));
  }, [loginUserSliceData]);
  console.log(formikProfile);

  const triggerFileUploadField = () => {
    fileUploadField.current?.click();
  };

  const handleImageUpload = async () => {
    const selectedFile = fileUploadField.current.files[0];
    // const formData = new FormData();
    // formData.append('file', selectedFile);
    // const payload = {
    //   file: formData,
    //   type: 'profile'
    // }
    // dispatch(fileUploadData(payload));

    const s3 = new AWS.S3({
      // params: { Bucket: S3_BUCKET, folderName: "profile" },
      region: 'us-east-1',
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEYID,
    });
    const keyPath = `profile/${Date.now()}`;
    const params = {
      Bucket: 'test-run-v2',
      Key: keyPath,
      Body: selectedFile,
      ACL: 'public-read',
      // ContentType: selectedFile.type
    };
    setLoader(true);
    const result = s3.upload(params).promise();
    await result.then((res: any) => {
      setUploadedFile(res.Location);
      toast(`Image uploaded successfully !`, {
        style: {
          background: '#00bf70',
          color: '#fff',
        },
      });
    });
    await result.catch((err) => {
      console.error('Failed to upload', err);
      toast(`Failed to upload !`, {
        style: {
          background: '#e2445c',
          color: '#fff',
        },
      });
    });
    setLoader(false);
  };

  return (
    <Box className="profile-setting-page">
      <Box
        className="title-main"
        sx={{
          borderBottom: '1px solid #F3F3F3',
          padding: '15px 0px',
          paddingBottom: '8px',
          margin: '0px 24px',
        }}
      >
        <Box>
          <Typography>Profile settings</Typography>
          <Typography className="sub-text">
            Edit your profile appearance / name / contact info etc.
          </Typography>
        </Box>
        {/* <Box className="search-field-inner setting-search">
          <TextField
            margin="normal"
            required
            fullWidth
            name="Search"
            id="Search"
            InputLabelProps={{ shrink: false }}
            placeholder="Search"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <img src={search} />
                </InputAdornment>
              ),
            }}
          />
        </Box> */}
      </Box>
      <Box
        sx={{
          width: '100%',
          m: 0,
          padding: '24px',
          display: { xs: 'block', lg: 'flex' },
        }}
      >
        <Box sx={{ paddingLeft: '0rem !important' }}>
          <Box className="profile-camera">
            <div style={{ width: '200px', height: '200px' }}>
              {!loader ? (
                <img
                  src={
                    uploadedFile == null || uploadedFile == ''
                      ? profile
                      : uploadedFile
                  }
                  alt="profiles"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: '5px solid #F3F3F3',
                    borderRadius: '200px',
                    objectFit: 'cover',
                    padding: uploadedFile === null ? '0px' : '0px',
                  }}
                />
              ) : (
                <CircularProgress
                  color="inherit"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: '5px solid #F3F3F3',
                    borderRadius: '200px',
                    padding: '72px',
                  }}
                />
              )}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                cursor: 'pointer',
                right: '0',
              }}
              onClick={triggerFileUploadField}
            >
              <img src={camera} alt="camera" />
            </div>
          </Box>
          <input
            style={{ display: 'none' }}
            type="file"
            ref={fileUploadField}
            accept="image/jpg, image/jpeg, image/png"
            onChange={handleImageUpload}
          />
        </Box>
        <Box
          sx={{ paddingLeft: { xs: '0px!important', lg: '16px !important' } }}
        >
          <Box className="accordion-section">
            <Accordion
              expanded={expanded === 'panel1'}
              onChange={handleChange('panel1')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className="accordion-title">
                  General settings
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <form onSubmit={formikProfile.handleSubmit} autoComplete="off">
                  <Box className="setting-section2">
                    <Grid container spacing={2} className="profile-inner">
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        sx={{
                          paddingRight: {
                            xs: '0rem !important',
                            md: '1rem !important',
                          },
                          paddingBottom: {
                            xs: '1rem !important',
                            md: '0rem !important',
                          },
                        }}
                      >
                        <Box style={{ position: 'relative' }}>
                          <label>
                            First name{' '}
                            <span style={{ color: '#E2445C' }}>*</span>
                          </label>
                          <TextField
                            margin="none"
                            fullWidth
                            id="firstName"
                            name="firstName"
                            autoComplete="off"
                            InputLabelProps={{ shrink: false }}
                            placeholder="First name"
                            onChange={formikProfile.handleChange}
                            onBlur={formikProfile.handleBlur}
                            value={formikProfile.values.firstName}
                            size="small"
                            error={
                              formikProfile.touched.firstName &&
                              Boolean(formikProfile.errors.firstName)
                            }
                            disabled={
                              !credencial?.profile_management?.editUserName
                            }
                          />

                          {formikProfile.touched.firstName &&
                            formikProfile.errors.firstName && (
                              <Typography className="error-field">
                                {formikProfile.errors.firstName}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        sx={{
                          paddingLeft: {
                            xs: '0rem !important',
                            md: '1rem !important',
                          },
                        }}
                      >
                        <Box style={{ position: 'relative' }}>
                          <label>
                            Last name{' '}
                            <span style={{ color: '#E2445C' }}>*</span>
                          </label>
                          <TextField
                            margin="normal"
                            fullWidth
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="off"
                            InputLabelProps={{ shrink: false }}
                            placeholder="Last name"
                            onChange={formikProfile.handleChange}
                            onBlur={formikProfile.handleBlur}
                            value={formikProfile.values.lastName}
                            size="small"
                            error={
                              formikProfile.touched.lastName &&
                              Boolean(formikProfile.errors.lastName)
                            }
                            disabled={
                              !credencial?.profile_management?.editUserName
                            }
                          />
                          {formikProfile.touched.lastName &&
                            formikProfile.errors.lastName && (
                              <Typography className="error-field">
                                {formikProfile.errors.lastName}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} className="profile-inner">
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        sx={{
                          paddingRight: {
                            xs: '0rem !important',
                            md: '1rem !important',
                          },
                          paddingBottom: {
                            xs: '1rem !important',
                            md: '0rem !important',
                          },
                        }}
                      >
                        <Box style={{ position: 'relative' }}>
                          <label>
                            Email <span style={{ color: '#E2445C' }}>*</span>
                          </label>
                          <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            name="email"
                            autoComplete="off"
                            InputLabelProps={{ shrink: false }}
                            placeholder="Email"
                            onChange={formikProfile.handleChange}
                            onBlur={formikProfile.handleBlur}
                            value={formikProfile.values.email}
                            size="small"
                            className="bg-gray-input"
                            error={
                              formikProfile.touched.email &&
                              Boolean(formikProfile.errors.email)
                            }
                            disabled
                          />
                          {formikProfile.touched.email &&
                            formikProfile.errors.email && (
                              <Typography className="error-field">
                                {formikProfile.errors.email}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        sx={{
                          paddingLeft: {
                            xs: '0rem !important',
                            md: '1rem !important',
                          },
                        }}
                      >
                        <Box style={{ position: 'relative' }}>
                          <label>Mobile</label>
                          <TextField
                            margin="none"
                            fullWidth
                            id="phoneNumber"
                            type="number"
                            name="phoneNumber"
                            autoComplete="off"
                            onInput={(e: any) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value),
                              )
                                .toString()
                                .slice(0, 10);
                            }}
                            InputLabelProps={{ shrink: false }}
                            placeholder="Mobile number"
                            onChange={formikProfile.handleChange}
                            onBlur={formikProfile.handleBlur}
                            value={formikProfile.values.phoneNumber}
                            size="small"
                            error={
                              formikProfile.touched.phoneNumber &&
                              Boolean(formikProfile.errors.phoneNumber)
                            }
                            disabled={
                              !credencial?.profile_management?.editContact
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment sx={{ mx: 2 }} position="start">
                                  +91{' '}
                                </InputAdornment>
                              ),
                            }}
                          />
                          {formikProfile.touched.phoneNumber &&
                            formikProfile.errors.phoneNumber && (
                              <Typography className="error-field">
                                {formikProfile.errors.phoneNumber}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} className="profile-inner">
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box style={{ position: 'relative' }}>
                          <label>
                            Organisation{' '}
                            <span style={{ color: '#E2445C' }}>*</span>
                          </label>
                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            className="placeholder-color"
                            style={{ color: 'black', marginTop: '10px' }}
                            displayEmpty
                            IconComponent={ExpandMoreOutlinedIcon}
                            renderValue={
                              formikProfile.values.organisationId !== ''
                                ? undefined
                                : () => (
                                    <Placeholder>
                                      Select Organization
                                    </Placeholder>
                                  )
                            }
                            margin="none"
                            fullWidth
                            id="organisationId"
                            name="organisationId"
                            autoComplete="off"
                            placeholder="Organization"
                            onChange={formikProfile.handleChange}
                            onBlur={() => {
                              dispatch(
                                fetchDepartmentById({
                                  organisationId:
                                    formikProfile.values.organisationId,
                                }),
                              );
                            }}
                            value={formikProfile.values.organisationId}
                            size="small"
                            error={
                              formikProfile.touched.organisationId &&
                              Boolean(formikProfile.errors.organisationId)
                            }
                            disabled={
                              !credencial?.profile_management?.editOrganisation
                            }
                          >
                            {organizationData?.map((item: any, index) => (
                              <MenuItem key={index} value={item.id}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </Select>

                          {formikProfile.touched.organisationId &&
                            formikProfile.errors.organisationId && (
                              <Typography className="error-field">
                                {formikProfile.errors.organisationId}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      className="profile-inner multi-selection"
                    >
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box style={{ position: 'relative' }}>
                          <label>
                            Department/s{' '}
                            <span style={{ color: '#E2445C' }}>*</span>
                          </label>
                          <Autocomplete
                            multiple
                            id="departmentId"
                            disableCloseOnSelect
                            value={formikProfile.values.departmentId}
                            options={
                              departmentData !== undefined ? departmentData : []
                            }
                            getOptionLabel={(option: any) => option?.label}
                            isOptionEqualToValue={(option: any, value: any) =>
                              value?.id == option?.id
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={
                                  formikProfile.values.departmentId?.length == 0
                                    ? 'Department/s'
                                    : ''
                                }
                              />
                            )}
                            fullWidth
                            placeholder="Department"
                            size="medium"
                            onBlur={() => {
                              var arr = [];
                              formikProfile.values.departmentId.map(
                                (item: any) => arr.push(item?.id),
                              );
                              dispatch(fetchLabById({ departmentId: arr }));
                            }}
                            disabled={
                              !credencial?.profile_management?.editDepartment
                            }
                            renderOption={(
                              props,
                              option: any,

                              { selected },
                            ) => (
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
                              formikProfile.setValues({
                                ...formikProfile.values,
                                departmentId: selectedOptions,
                              });
                            }}
                          />
                          {formikProfile.touched.departmentId &&
                            formikProfile.errors.departmentId && (
                              <Typography className="error-field">
                                {formikProfile.errors.departmentId}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      className="profile-inner multi-selection"
                    >
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box style={{ position: 'relative' }}>
                          <label>
                            Labs assigned{' '}
                            <span style={{ color: '#E2445C' }}>*</span>
                          </label>
                          <Autocomplete
                            multiple
                            id="laboratoryId"
                            value={formikProfile.values.laboratoryId}
                            options={labData !== undefined ? labData : []}
                            getOptionLabel={(option: any) => option?.label}
                            isOptionEqualToValue={(option: any, value: any) =>
                              value?.id == option?.id
                            }
                            disableCloseOnSelect
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={
                                  formikProfile.values.laboratoryId?.length == 0
                                    ? 'Laboratory/ies'
                                    : ''
                                }
                              />
                            )}
                            fullWidth
                            placeholder="Laboratory"
                            size="medium"
                            disabled={!credencial?.profile_management?.editLab}
                            renderOption={(
                              props,
                              option: any,
                              { selected },
                            ) => (
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
                              formikProfile.setValues({
                                ...formikProfile.values,
                                laboratoryId: selectedOptions,
                              });
                            }}
                          />
                          {formikProfile.touched.laboratoryId &&
                            formikProfile.errors.laboratoryId && (
                              <Typography className="error-field">
                                {formikProfile.errors.laboratoryId}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} className="profile-inner">
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={6}
                        sx={{
                          paddingRight: {
                            xs: '0rem !important',
                            lg: '1rem !important',
                          },
                        }}
                      >
                        <Box style={{ position: 'relative' }}>
                          <label>
                            Designation{' '}
                            <span style={{ color: '#E2445C' }}>*</span>
                          </label>
                          <Select
                            MenuProps={{
                              disableScrollLock: true,
                              marginThreshold: null,
                            }}
                            className="placeholder-color"
                            style={{ marginTop: '10px', color: 'black' }}
                            displayEmpty
                            disabled={!credencial?.profile_management?.editRole}
                            IconComponent={ExpandMoreOutlinedIcon}
                            renderValue={
                              formik.values.role !== ''
                                ? undefined
                                : () => <Placeholder>Select Role</Placeholder>
                            }
                            margin="none"
                            fullWidth
                            id="role"
                            name="role"
                            autoComplete="off"
                            placeholder="Role"
                            onChange={formikProfile.handleChange}
                            onBlur={formikProfile.handleBlur}
                            value={formikProfile.values.role}
                            size="small"
                            // disabled={true}
                            error={
                              formikProfile.touched.role &&
                              Boolean(formikProfile.errors.role)
                            }
                          >
                            {roleData &&
                              roleData.map((item: any) => (
                                <MenuItem key={item.value} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              ))}
                          </Select>
                          {formikProfile.touched.role &&
                            formikProfile.errors.role && (
                              <Typography className="error-field">
                                {formikProfile.errors.role}
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </form>
              </AccordionDetails>
            </Accordion>
            {credencial?.profile_management?.changePassword && (
              <Accordion
                expanded={expanded === 'panel2'}
                onChange={handleChange('panel2')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="accordion-title">
                    Change password
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Box className="setting-section2">
                      <Box
                        className="profile-inner"
                        style={{ position: 'relative' }}
                      >
                        <InputLabel>Enter old password</InputLabel>
                        <TextField
                          type={initalStatus.password ? 'text' : 'password'}
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() =>
                                    handleClickShowPassword(
                                      'password',
                                      !initalStatus.password,
                                    )
                                  }
                                  edge="end"
                                  sx={{ mr: 0 }}
                                >
                                  {!initalStatus.password ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          name="password"
                          id="password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                          variant="outlined"
                          error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                          }
                          disabled={
                            !credencial?.profile_management?.changePassword
                          }
                          placeholder="Password"
                        />
                        {formik.touched.password && formik.errors.password && (
                          <Typography className="error-field">
                            {formik.errors.password}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        className="profile-inner"
                        style={{ position: 'relative' }}
                      >
                        <InputLabel>Enter new Password</InputLabel>
                        <TextField
                          type={initalStatus.newpassword ? 'text' : 'password'}
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() =>
                                    handleClickShowPassword(
                                      'newpassword',
                                      !initalStatus.newpassword,
                                    )
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                  sx={{ mr: 0 }}
                                >
                                  {/* {!initalStatus.newpassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )} */}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          name="newpassword"
                          id="password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.newpassword}
                          disabled={
                            !credencial?.profile_management?.changePassword
                          }
                          variant="outlined"
                          error={
                            formik.touched.newpassword &&
                            Boolean(formik.errors.newpassword)
                          }
                          placeholder="New Password"
                        />
                        {formik.touched.newpassword &&
                          formik.errors.newpassword && (
                            <Typography className="error-field">
                              {formik.errors.newpassword}
                            </Typography>
                          )}
                        {formik.touched.newpassword &&
                          !formik.errors.newpassword && (
                            <Typography className="valid-field">
                              Strong password
                            </Typography>
                          )}
                      </Box>
                      <Box
                        className="profile-inner"
                        style={{ position: 'relative' }}
                      >
                        <InputLabel>Confirm new password</InputLabel>
                        <TextField
                          type={
                            initalStatus.confirmpassword ? 'text' : 'password'
                          }
                          fullWidth
                          onPaste={(event) => {
                            event.preventDefault();
                          }}
                          style={{ userSelect: 'none' }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() =>
                                    handleClickShowPassword(
                                      'confirmpassword',
                                      !initalStatus.confirmpassword,
                                    )
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                  sx={{ mr: 0 }}
                                >
                                  {/* {!initalStatus.confirmpassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )} */}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          name="confirmpassword"
                          id="password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.confirmpassword}
                          variant="outlined"
                          disabled={
                            !credencial?.profile_management?.changePassword
                          }
                          error={
                            formik.touched.confirmpassword &&
                            Boolean(formik.errors.confirmpassword)
                          }
                          placeholder="Confirm Password"
                        />
                        {formik.touched.confirmpassword &&
                          formik.errors.confirmpassword && (
                            <Typography className="error-field">
                              {formik.errors.confirmpassword}
                            </Typography>
                          )}
                        {formik.touched.confirmpassword &&
                          !formik.errors.confirmpassword && (
                            <Typography className="valid-field">
                              Password matched
                            </Typography>
                          )}
                      </Box>
                    </Box>
                  </form>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        </Box>
      </Box>
      <Box className="edit-details">
        <Button
          type="submit"
          variant="contained"
          className="cancel-btn"
          style={{ visibility: 'hidden' }}
        >
          Back
        </Button>
        <Button
          type="submit"
          onClick={() => {
            expanded == 'panel2'
              ? formik.handleSubmit()
              : formikProfile.handleSubmit();
          }}
          variant="contained"
          className="add-btn"
          disabled={Object.keys(userData).length == 0 ? true : isSubmitted}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

const ProfilePage = withSettingsLayout(Profile);

export default ProfilePage;
