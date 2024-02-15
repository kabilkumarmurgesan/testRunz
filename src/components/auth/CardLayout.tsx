import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import google from "../../assets/images/common/google.svg";
import microsoft from "../../assets/images/common/micro.svg";
import linkedin from "../../assets/images/common/linkedin.svg";
import authbg from "../../assets/images/auth-bg.svg";
import { Card, Link } from "@mui/material";
import { auth, provider } from "../../firebase.config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  updatePassword,
} from "firebase/auth";
import { navigate } from "gatsby";
import { toast } from "react-toastify";
import { fetchLoginUser, fetchSingleUserData, postUserData } from "../../api/userAPI";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import moment from "moment";
import { Helmet } from 'react-helmet';
import favicon from '../../assets/images/common/favicon.svg';

export const CardLayout = ({ children }: any, props: any) => {
  const [answer, setAnswer] = React.useState<any>(10);

  const Placeholder = ({ children }: any) => {
    return <div>{children}</div>;
  };

  const onLoginStart = React.useCallback((e: void) => {
    return e;
  }, []);
  const dispatch: any= useDispatch()
  const userSliceData=  useSelector(
    (state: any) => state.userLogin.data, 
  );
    console.log(userSliceData);
  
  const googleSignup = async (socailType:any) => {
    try {
      const googleProvider = provider("google.com");
      const result:any = await signInWithPopup(auth, googleProvider);
  
      console.log(result);

      
      let payload = {
        firstName: result.user.displayName !== null ? result.user.displayName : result.user.email.split("@")[0].includes(".")?result.user.email.split("@")[0].split('.')[0]:result.user.email.split("@")[0],
        lastName: "",
        fullName:`${result.user.displayName !== null ? result.user.displayName : result.user.email.split("@")[0].includes(".")?result.user.email.split("@")[0].split('.')[0]:result.user.email.split("@")[0]} ${""}`,
        email: result.user.email,
        uid: result.user.uid,
        organisationId: process.env.ORGANIZATION_ID,
        role: process.env.ROLE_ID,
        departmentId: [process.env.DEPARTMENT_ID],
        laboratoryId: [process.env.LABORATORY_ID],
        instituteId: process.env.INSTITUTION_ID,
        createdOn:moment(new Date()).format("MM/DD/YYYY"),
        createdBy: "Self"
      };
  
      await dispatch(postUserData(payload));
  
      let payload2 = {
        idToken: result.user?.accessToken,
      };


      let temp = { _id: userSliceData?.verifyToken?._id };

      await dispatch(fetchLoginUser(payload2)).then((res)=>{
        const temp = { _id: res?.verifyToken?._id };
        console.log(res);
        
         dispatch(fetchSingleUserData(temp)).then((isSuccess: any) => {
          const data = isSuccess?.get_user ?? {};
          window.localStorage.setItem("userProfileDetails",JSON.stringify(isSuccess?.get_user))
          if (data.status!=='Active') {
            toast(`The user is inactive !`, {
              style: {
                background: '#d92828',
                color: '#fff',
              } 
            });
            setTimeout(()=>{
              navigate("/login");

            },2000)
          }
          else{
            window.localStorage.setItem("isLoggedIn", "true");
            toast(`Google Login successful !`, {
              style: {
                background: "#00bf70",
                color: "#fff",
              },
            });
            console.log("passwordHash",result?.user);
            if(result?.user?.reloadUserInfo.hasOwnProperty('passwordHash')){
            setTimeout(()=>{
              navigate("/mypage");

            },2000)
          }
          else{
            setTimeout(()=>{
              navigate("/create-password");

            },2000)
          }
          }
       
      // }
    });
       })

  } catch (error) {
    console.log(error);
    toast(`The user is inactive !`, {
      style: {
        background: '#d92828',
        color: '#fff',
      } 
    });
  }
};
  const microsoftSignup = async (socailType:any) => {
    try {
      const microsoftProvider = provider("microsoft.com");
      const result: any = await signInWithPopup(auth, microsoftProvider);
console.log(result);

      const payload = {
        firstName: result.user.displayName,
        lastName: "",
        fullName: `${result.user.displayName} ${""}`,
        email: result.user.email,
        uid: result.user.uid,
        organisationId: process.env.ORGANIZATION_ID,
        role: process.env.ROLE_ID,
        departmentId: [process.env.DEPARTMENT_ID],
        laboratoryId: [process.env.LABORATORY_ID],
        instituteId:process.env.INSTITUTION_ID,
        createdOn: moment(new Date()).format("MM/DD/YYYY"),
        createdBy: "Self"
      };

      await dispatch(postUserData(payload));

      const payload2 = {
        idToken: result.user?.accessToken,
      };

      const temp = { _id: userSliceData?.verifyToken?._id };

      // await dispatch(fetchSingleUserData(temp)).then((isSuccess: any) => {
      //   const data = isSuccess?.get_user ?? {};
      //   if (!data.isActive) {
      //     navigate("/login");
      //     toast(`The user is inactive !`, {
      //       style: {
      //         background: '#d92828',
      //         color: '#fff',
      //       } 
      //     });
      //   } else {
         await dispatch(fetchLoginUser(payload2)).then((res)=>{
          const temp = { _id: res?.verifyToken?._id };
           dispatch(fetchSingleUserData(temp)).then((isSuccess: any) => {
            const data = isSuccess?.get_user ?? {};
            window.localStorage.setItem("userProfileDetails",JSON.stringify(isSuccess?.get_user))
            if (data.status!=="Active") {
              toast(`The user is inactive !`, {
                style: {
                  background: '#d92828',
                  color: '#fff',
                } 
              });
              setTimeout(()=>{
                navigate("/login");

              },2000)
            }
            else{
              window.localStorage.setItem("isLoggedIn", "true");
              toast(`Microsoft Login successful !`, {
                style: {
                  background: "#00bf70",
                  color: "#fff",
                },
              });
              // console.log("passwordHash",result.users.passwordHash);
              if(result?.user?.reloadUserInfo.hasOwnProperty('passwordHash')){
                setTimeout(()=>{
                  navigate("/mypage");
    
                },2000)
              }
              else{
                setTimeout(()=>{
                  navigate("/create-password");
    
                },2000)
              }
            }
         
        // }
      });
         })

    } catch (error) {
      console.log(error);
      toast(`The user is inactive !`, {
        style: {
          background: '#d92828',
          color: '#fff',
        } 
      });
    }
  };
  return (
    <>
    <Helmet>
    <title>Test Runs</title>
    <link rel="icon" href={favicon} type="image/x-icon" />
  </Helmet>
    <Box
      className="main-center"
      style={{
        height: "100vh",
        backgroundImage: `url(${authbg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        boxShadow: "0px 0px 0px 0px #ffffff",
      }}
    >
      <Grid
        container
        className="main-center-inner"
        style={{
          boxShadow: "0px 4px 10px 0px #0000001A",
          borderRadius: "10px",
        }}
      >
        <Grid item xs={12} sm={12} md={6} lg={6} className="sign-left">
          <Box>
            <Typography className="welcome-to">Welcome to</Typography>
            <Typography className="test-runz">Test Runs</Typography>
          </Box>
          {(children.props.uri === "/login" || children.props.uri === "/" ) &&(
            <Box className="login-center">
               <Typography className="sign-via">Sign In via</Typography>
               <Box className="sign-via-btn">
                {/* <LoginSocialGoogle
                  client_id="32749125067-a5a3fnkg3jutfpnveghsvf2t8cu2ujvt.apps.googleusercontent.com"
                  onLoginStart={onLoginStart}
                  redirect_uri="http://localhost:8000"
                  scope="openid profile email"
                  discoveryDocs="claims_supported"
                  access_type="offline"
                  typeResponse="accessToken"
                  onResolve={({ provider, data }: IResolveParams) => {
                    debugger;
                  }}
                  onReject={(err) => {
                    console.log(err);
                  }}
                > */}
                <Button
                  variant="contained"
                  style={{
                    fontWeight: 600,
                    color: "#181818",
                    fontSize: "15px",
                    textTransform: "none",
                  }}
                  onClick={() => googleSignup("SignIn")}
                >
                  {" "}
                  <img src={google} alt="google" />
                  Sign In with Google
                </Button>
                {/* </LoginSocialGoogle> */}
                {/* <LoginSocialMicrosoft
                  client_id="911d1fd2-9c9e-4a0e-bd71-90c3ec04f27f"
                  redirect_uri="http://localhost:8000"
                  onLoginStart={onLoginStart}
                  scope="openid profile email"
                  response_type="code"
                  tenant="common"
                  prompt="login"
                  onResolve={({ provider, data }: IResolveParams) => {
                    debugger;
                  }}
                  onReject={(err: any) => {
                    console.log(err);
                  }}
                > */}
                <Button
                  variant="contained"
                  style={{
                    fontWeight: 600,
                    color: "#181818",
                    fontSize: "15px",
                    textTransform: "none",
                  }}
                  onClick={() => microsoftSignup("SignIn")}
                >
                  {" "}
                  <img src={microsoft} alt="microsoft" />
                  Sign In with Microsoft
                </Button>
                {/* </LoginSocialMicrosoft> */}
                {/* <LoginSocialLinkedin
                  client_id="86j2ru56b16cq6"
                  client_secret="w33ztd5cu1CAhBgc"
                  redirect_uri="http://localhost:8000"
                  onLoginStart={onLoginStart}
                  scope="openid profile email"
                  response_type="code"
                  onResolve={({ provider, data }: IResolveParams) => {
                    debugger;
                  }}
                  onReject={(err: any) => {
                    console.log(err);
                  }}
                > */}
                {/* <Button
                    variant="contained"
                    style={{
                      fontWeight: 600,
                      color: "#181818",
                      fontSize: "15px",
                      textTransform: 'none'
                    }}
                  >
                    {" "}
                    <img src={linkedin} alt="linkedin" />
                    Sign up with Linkedin
                  </Button> */}
                {/* </LoginSocialLinkedin> */}
              </Box>
            </Box>
          )}
          {children.props.uri === "/signup" && (
            <Box>
              <Typography className="sign-via">Sign up via</Typography>
              <Box className="sign-via-btn">
                {/* <LoginSocialGoogle
                  client_id="32749125067-a5a3fnkg3jutfpnveghsvf2t8cu2ujvt.apps.googleusercontent.com"
                  onLoginStart={onLoginStart}
                  redirect_uri="http://localhost:8000"
                  scope="openid profile email"
                  discoveryDocs="claims_supported"
                  access_type="offline"
                  typeResponse="accessToken"
                  onResolve={({ provider, data }: IResolveParams) => {
                    debugger;
                  }}
                  onReject={(err) => {
                    console.log(err);
                  }}
                > */}
                <Button
                  variant="contained"
                  style={{
                    fontWeight: 600,
                    color: "#181818",
                    fontSize: "15px",
                    textTransform: "none",
                  }}
                  onClick={() => googleSignup("SignUp")}
                >
                  {" "}
                  <img src={google} alt="google" />
                  Sign up with Google
                </Button>
                {/* </LoginSocialGoogle> */}
                {/* <LoginSocialMicrosoft
                  client_id="911d1fd2-9c9e-4a0e-bd71-90c3ec04f27f"
                  redirect_uri="http://localhost:8000"
                  onLoginStart={onLoginStart}
                  scope="openid profile email"
                  response_type="code"
                  tenant="common"
                  prompt="login"
                  onResolve={({ provider, data }: IResolveParams) => {
                    debugger;
                  }}
                  onReject={(err: any) => {
                    console.log(err);
                  }}
                > */}
                <Button
                  variant="contained"
                  style={{
                    fontWeight: 600,
                    color: "#181818",
                    fontSize: "15px",
                    textTransform: "none",
                  }}
                  onClick={() => microsoftSignup("SignUp")}
                >
                  {" "}
                  <img src={microsoft} alt="microsoft" />
                  Sign up with Microsoft
                </Button>
                {/* </LoginSocialMicrosoft> */}
                {/* <LoginSocialLinkedin
                  client_id="86j2ru56b16cq6"
                  client_secret="w33ztd5cu1CAhBgc"
                  redirect_uri="http://localhost:8000"
                  onLoginStart={onLoginStart}
                  scope="openid profile email"
                  response_type="code"
                  onResolve={({ provider, data }: IResolveParams) => {
                    debugger;
                  }}
                  onReject={(err: any) => {
                    console.log(err);
                  }}
                > */}
                {/* <Button
                    variant="contained"
                    style={{
                      fontWeight: 600,
                      color: "#181818",
                      fontSize: "15px",
                      textTransform: 'none'
                    }}
                  >
                    {" "}
                    <img src={linkedin} alt="linkedin" />
                    Sign up with Linkedin
                  </Button> */}
                {/* </LoginSocialLinkedin> */}
              </Box>
            </Box>
          )}
          <Box>
            {children.props.uri === "/forgot-password" && (
              <Box className="auth-inner-text">
                <Box>
                  <Typography variant="h5">Forgot your password?</Typography>
                </Box>
                <Box>
                  <Typography variant="h4">Don't worry we got you</Typography>
                </Box>
                <Box>
                  <Typography variant="h1">Covered</Typography>
                </Box>
              </Box>
            )}
            {children.props.uri === "/create-password" && (
              <Box className="auth-inner-text">
                <Box>
                  <Typography variant="h5">Create your password</Typography>
                </Box>
                <Box>
                  <Typography variant="h4">Don't worry we got you</Typography>
                </Box>
                <Box>
                  <Typography variant="h1">Covered</Typography>
                </Box>
              </Box>
            )}
            {children.props.uri === "/otp" && (
              <Box className="auth-inner-text">
                <Box>
                  <Typography variant="h5">Forgot your password?</Typography>
                </Box>
                <Box>
                  <Typography variant="h4">Don't worry we got you</Typography>
                </Box>
                <Box>
                  <Typography variant="h1">Covered</Typography>
                </Box>
              </Box>
            )}
            <Box className="country-term-section">
              <Box className="country-section">
                <InfoOutlinedIcon sx={{ color: "#565656", mr: 2 }} />
                <FormControl variant="standard">
                  <Select
                    MenuProps={{                   
                      disableScrollLock: true,                   
                      marginThreshold: null
                    }}
                    labelId="country-list-select-label"
                    id="country-list"
                    inputProps={{ "aria-label": "Without label" }}
                    IconComponent={ExpandMoreOutlinedIcon}
                    value={answer}
                    displayEmpty
                    onChange={(event) => setAnswer(event.target.value)}
                    renderValue={
                      answer !== ""
                        ? undefined
                        : () => <Placeholder>Select Country</Placeholder>
                    }
                  >
                    <MenuItem value={10}>English (United states)</MenuItem>
                    <MenuItem value={20}>English (United kingdom)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box className="terms-section">
                <Link href="#">Help</Link>
                <Link href="#">Terms</Link>
                <Link href="#">Privacy</Link>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
          className="sign-right"
          style={{ minHeight: "700px" }}
        >
          {children}
        </Grid>
      </Grid>
    </Box>
    </>
  );
};
