import { Box, Drawer, Toolbar, Typography } from '@mui/material';
import React from 'react';
import '../../assets/styles/App.scss';
import Avatars from '../../assets/images/Avatars.svg';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { fetchNotificationData } from '../../api/notification.API';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import data from '../../assets/images/profile/user.jpg';
import { fetchNotificationMessageData, fetchReadBulkMessageData, fetchReadSingleMessageData } from '../../api/notificationMessageAPI';
import { fetchSingleUserData } from '../../api/userAPI';
import Emptystate from '../../assets/images/Emptystate.svg';
import moment from 'moment';
import SpinerLoader from '../SpinnerLoader';

export default function AppNotificationDrawer({
  openDrawer,
  toggleNotificationDrawer,
}: any) {

  const [show, setShow] = React.useState(false);
  const [loader, setLoader]=React.useState(false)
  const [notificationQueryStrings, setNotificationQueryString] = React.useState({
    userId: ""
  });
  // const NotificationSliceData = useSelector(
  //   (state: any) => state.notification.data?.get_all_notifications,
  // );
  const [notificationMesssage,setNotificationMesssage]=React.useState([])

  const NotificationMessageSliceData = useSelector(

    (state: any) => {
      return state.notificationMessage.data?.get_notification_message

    }

  )
  const dispatch: any = useDispatch();
  const loginUserSliceData=  useSelector(
    (state: any) => state.userLogin.data, 
  );
    // console.log('wwwww',loginUserSliceData);
  const[userData, setUserData]=React.useState<any>({})
 console.log(loginUserSliceData);
 
  React.useEffect(()=> {
    let temp = { _id: loginUserSliceData?.verifyToken?._id };
    // if (row?._id) {
    dispatch(fetchSingleUserData(temp))
      .then((isSucess:any) => {
        setUserData(isSucess?.get_user)
        setNotificationQueryString(isSucess?.get_user?._id)
        })
      
      .catch((err:any) => {
        console.log(err);
      });
      
    // }
  },[loginUserSliceData]);
  // React.useEffect(() => {
  //   // dispatch(fetchNotificationData());
  //   console.log("notification2", loginUserSliceData?.verifyToken?._id,"==",NotificationMessageSliceData);
    
  //   let payload={
  //     userId: loginUserSliceData?.verifyToken?._id
  //   }
  //   console.log(payload);
    
  //   dispatch(fetchNotificationMessageData(payload)).then((res)=>{
  //     setNotificationMesssage(res?.data?.get_notification_message)
  //     console.log(res?.data?.get_notification_message);
      
  //   });
  // }, []);
  React.useEffect(() => {
    if (openDrawer) {
      notificationMessageList()
      // Fetch data only when the drawer is open
    //   let payload = {
    //     userId: loginUserSliceData?.verifyToken?._id
    //   };
    //   dispatch(fetchNotificationMessageData(payload)).then((res) => {
    //     setNotificationMesssage(res?.data?.get_notification_message);
    //     console.log(res?.data?.get_notification_message);
    //   });
    }
  }, [openDrawer]);
  const notificationMessageList=()=>{
   
    let payload={
      userId: loginUserSliceData?.verifyToken?._id
    }
    console.log(payload);
    setLoader(true)
    dispatch(fetchNotificationMessageData(payload)).then((res)=>{
      setNotificationMesssage(res?.data?.get_notification_message)
      setLoader(false)
      console.log(res?.data?.get_notification_message);
      
    }).catch((err)=>{
      console.log(err);
      
    })
  }
  const getTimeDifference = (notificationTime: any) => {
    const currentTime: any = moment();
    const timestamp = parseInt(notificationTime);

    const notificationTimeData = moment(timestamp);

    const timeDifferenceInMilliseconds = currentTime.diff(notificationTimeData);
  
    const minutesDifference = moment.duration(timeDifferenceInMilliseconds).asMinutes();
    const hoursDifference = moment.duration(timeDifferenceInMilliseconds).asHours();
  
    if (minutesDifference >= 60 && hoursDifference < 24) {
      return `${Math.floor(hoursDifference)}h ago`;
    }
    if (hoursDifference > 24) {
      const daysDifference: number = Math.floor(hoursDifference / 24);
      return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    }
    if(Math.floor(minutesDifference)==0){
      return `Just now`;
    }
    return `${Math.floor(minutesDifference)}min ago`;
  };
  // const handleReadSingleNotification=async(id:any)=>{
  //   let payload={
  //     _id:id,
  //     isRead:true
  //   }
  //   let payload2={
  //     userId: userData?._id
  //   }
  //  await dispatch(fetchReadSingleMessageData(payload))
  //  await  dispatch(fetchNotificationMessageData(payload2)).then((res)=>{
  //   setNotificationMesssage(res?.data?.get_notification_message)
  //   console.log(res?.data?.get_notification_message);
    
  // });

  // }

  const handleReadBulkNotification=async()=>{
    let payload={
      userId:userData?._id,
      isRead:true
    }
    let payload2={
      userId: userData?._id
    }
    console.log('Govindraj',NotificationMessageSliceData?.length);
    
    if(NotificationMessageSliceData?.message?.length!==0){
      await dispatch(fetchReadBulkMessageData(payload))
      await  dispatch(fetchNotificationMessageData(payload2)).then((res)=>{
        setNotificationMesssage(res?.data?.get_notification_message)
        console.log(res?.data?.get_notification_message);
        
      }).catch((err)=>{
        console.log(err);
        
      })
    }
  }
  console.log("notificationMesssage",notificationMesssage);
  
const handleReadNotification=async(id:any)=>{
  let payload2={
    _id:id,
    isRead: true
  }
  await dispatch(fetchReadSingleMessageData(payload2))
  await notificationMessageList()
}
  return (
    <>
    {/* <Toolbar sx={{position:"absolute",right:"0px",zIndex:"9999999 !important"}}/> */}
    <Drawer
      className="profile-head"
      variant="temporary"
      anchor="right"
      open={openDrawer}
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 600,
          boxSizing: 'border-box',
        },
        boxShadow: '-12px 4px 19px 0px #0000001A',
      }}
      onClose={() => { toggleNotificationDrawer(), setShow(!show) }}     
      disableScrollLock={ true }
    >
     
      <Box className="notification-header">
        <Box className="notification-title">
          <Typography>Notifications</Typography>
          <Typography className="mark-read">
            <span style={{ cursor: 'pointer' }} onClick={()=>handleReadBulkNotification()}>Mark all as read</span>{' '}
            <span
              style={{
                width: '24px',
                height: '24px',
                marginLeft: '2rem',
                cursor: 'pointer',
              }}
            >
                <CloseOutlinedIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => { toggleNotificationDrawer(), setShow(!show) }}
              />
              {/* <OpenInNewIcon style={{ width: '24px', height: '24px' }} /> */}
            </span>
          </Typography>
        </Box>
        <Box sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto' }}>
          {loader?
          <SpinerLoader isLoader={loader} />:
          
          notificationMesssage?.message?.length!==0 ? notificationMesssage?.message?.map((row: any, index: any) => (
            <Box className="notifications" key={index}
            style={{
              backgroundColor: row?.isRead == false ? '#F3F3F3' : 'white', // Apply different background for the first notification
            }}
            onClick={()=>handleReadNotification(row?._id)}
            >
              <Box className="image-container">
                <Avatar
                  alt="User Avatar"
                  src={data}
                  sx={{ width: 56, height: 56, borderRadius: '50%' }}
                />
                <Box className="text-container">
                  <Box className="heading">{row.title}</Box>
                  <Box className="content">{row.message}</Box>
                </Box>
              </Box>
              <Box className="time">{getTimeDifference(row.createdAt)}</Box>
            </Box>
          )):
          <Box sx={{ textAlign: 'center', padding:"25%" }}>
          <img src={Emptystate} alt="" />
          <Typography className="no-remainder">
            No notifications yet!
          </Typography>
          </Box>
          }
        </Box>
      </Box>
    </Drawer>
    </>
  );
}
