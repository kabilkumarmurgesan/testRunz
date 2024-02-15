import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { darkTheme, lightTheme } from '../utils/theme';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import AppHeader from './layout/header';
import AppMenu from './layout/menu';
import AppProfileDrawer from './layout/profile-drawer';
import AppNotificationDrawer from './layout/notification-drawer';
// import AppProfileDrawer from "./layout/profile-drawer";
// import AppNotificationDrawer from "./layout/notification-drawer";
import { Helmet } from 'react-helmet';
import favicon from '../assets/images/common/favicon.svg'; // Adjust the path accordingly
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }: any) => {
  // let isLoggedIn :any= null;

  // if (typeof window !== 'undefined') {
  //   isLoggedIn = sessionStorage.getItem('isLoggedIn');
  // }
  if (typeof window !== 'undefined') {
  const storedData = localStorage.getItem("isLoggedIn");
  console.log(storedData);
  
  if (!storedData) {
    navigate("/login")
    return null
  }

}
  const [width, setWidth] = React.useState(95);
  const [classn, setClassn] = React.useState<any>('closemenu');
  const [editProfile, setEditProfile] = React.useState(false);
  const [notificationList, setNotificationList] = React.useState(false);
  const [theme, setTheme] = React.useState(lightTheme);

  const toggleDrawer = () => {
    setWidth(width === 290 ? 95 : 290);
    setClassn(width === 290 ? 'closemenu' : 'openmenu');
  };

  const toggleProfileDrawer = () => {
    setNotificationList(false);
    setEditProfile(!editProfile);
  };

  const toggleNotificationDrawer = () => {
    setEditProfile(false);
    setNotificationList(!notificationList);
  };

  const toggleTheme = () => {
    setTheme((prevTheme: any) =>
      prevTheme === lightTheme ? darkTheme : lightTheme,
    );
  };

  // if (isLoggedIn === 'false') {
  //   console.log('false');

  //   navigate('/login');
  //   return null;
  // }

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>Test Runs</title>
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppHeader
          toggleDrawer={toggleDrawer}
          toggleProfileDrawer={toggleProfileDrawer}
          toggleNotificationDrawer={toggleNotificationDrawer}
          toggleTheme={toggleTheme}
        />
        <AppMenu width={width} classn={classn} />

        <AppProfileDrawer
          openDrawer={editProfile}
          toggleProfileDrawer={toggleProfileDrawer}
        />
        <AppNotificationDrawer
          openDrawer={notificationList}
          toggleNotificationDrawer={toggleNotificationDrawer}
        />

        <Box
          component="main"
          sx={{
            width: '100%',
            position: 'relative',
            top: '80px',
          }}
          className={`${width === 290 ? 'wide-class' : 'narrow-class'}`}
        >
          {children}
        </Box>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={false}
        hideProgressBar={true}
      />
    </ThemeProvider>
  );
  // }
};

export default PrivateRoute;
