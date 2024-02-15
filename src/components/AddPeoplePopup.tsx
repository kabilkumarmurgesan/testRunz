import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloseRed from '../assets/images/close-red.svg';
import search from '../assets/images/search.svg';
import { CloseOutlined } from '@mui/icons-material';
import { fetchAllUser } from '../api/userAPI';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchShareRunz, fetchbulkRunz } from '../api/bulkRunz';
import { toast } from 'react-toastify';

const AddPeople = ({ open, close,runzId,runzRow,typePopup ,formValue,handleAssign,assigned}: any) => {
  const dispatch : any =useDispatch()
  const [allUserData, setAlluserData] = React.useState<any>([]);
  const [userList, setuserList]=React.useState<any>([])
const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user
  console.log('userList',userList);
  const runzSliceData = useSelector(
    (state: any) => state.runs.data
  );
  React.useEffect(()=>{
    setuserList([])
  },[runzSliceData])
  // const allUser=  useSelector(
  //   (state: any) => state.user.data?.find_users, 
  // );
  React.useEffect(()=>{
  if(assigned){
    setuserList([])
    setSelectedUser(null)
  }
},[])
console.log("assigned",assigned);

  const singleUserData= useSelector((state:any)=> state.user?.data?.get_user)
  console.log("singleUserData",singleUserData?.laboratoryId);
  
console.log("userList",userList);
React.useEffect(()=>{
  setAlluserData(allUserData)
 },[allUserData])

 React.useEffect(() => {
  if (typePopup === 'assign' || typePopup==="share") {
    let payload={
      organisationId:singleUserData?.organisationId
    }

    dispatch(fetchAllUser(payload)).then((res)=>{
      setAlluserData(res?.find_users.map((item: any) => ({
        label: item.email,
        value: item.email,
        id: item._id,
      })))  
    }).catch((err)=>{
      console.log(err);
    })
  
  }
}, [typePopup]);
  const userSliceData = useSelector(
    (state: any) => state.userLogin?.data?.verifyToken,
  );
console.log(userList,"userList");

  // console.log("newArray",allUser);
  const handleSave=async()=>{
    console.log("save",runzRow);
    const allIds = userList.map((item:any) => item.id);
    const newArray = runzRow?.map((item:any) => ({ 
      objective: item?.objective,
      shared: typePopup=='share'?true:false,
      procedureId: item?.procedureId._id==undefined?item?.procedureId[0]?._id :item?.procedureId._id,
      departmentId: item?.departmentId.map(((item:any)=>item?._id)) ,
      laboratoryId:  item?.laboratoryId.map(((item:any)=>item?._id)) ,
      // assignedTo: item?.assignedTo ,
      assignedBy: userSliceData?._id ,
      dueDate: item?.dueDate ,
      status: item?.status ,
    }));
    
    if(typePopup!=='share'){
      //single asign
      handleAssign(selectedUser)
      // for multiple assign

    //   if(newArray!==undefined){
    //   const output = newArray?.flatMap((aItem:any) =>
    //   allIds.map((bItem:any) => ({ ...aItem, "userId": bItem , assignedTo: bItem ,}))
    //   );
  
    //   let payload={
    //     runs:output
    //   }
    //   await dispatch(fetchbulkRunz(payload))
    // }
    // else{
    //   console.log(formValue?.departmentId?.map(((item:any)=>item?.id)));
      
    //   let output=[{
    //     objective: formValue?.objective,
    //   shared: typePopup=='share'?true:false,
    //   procedureId: formValue?.procedureId,
    //   departmentId: formValue?.departmentId?.map(((item:any)=>item?.id)) ,
    //   laboratoryId:  formValue?.laboratoryId?.map(((item:any)=>item?.id)) ,
    //   // assignedTo:  ,
    //   assignedBy: userSliceData?._id ,
    //   dueDate: formValue?.dueDate ,
    //   status: "Created" ,
    //   }]
    //   const output1 = output?.flatMap((aItem:any) =>
    //   allIds.map((bItem:any) => ({ ...aItem, "userId": bItem , assignedTo: bItem ,}))
    //   );
    //   let payload={
    //     runs:output1
    //   }
    //   console.log(payload);
      
    //   await dispatch(fetchbulkRunz(payload))
    // }
    }
    else{
      const allIds = userList[0].map((item:any) => item.id);
      const newArray = runzRow?.map((item:any) => item._id)
      console.log(allIds);
      
      let payload1={
        shareUserId: allIds, 
        runId: newArray,
      }
       await dispatch(fetchShareRunz(payload1))
       await toast(`Runs ${typePopup === "assign" ? "Assigned" : "shared"} successfully !`, {
        style: {
          background: '#00bf70',
          color: '#fff',
        },
      });
    }
   await close()
   setuserList([])
  //  setSelectedUser(null)
     //  Assigned
  
}
console.log(selectedUser);

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={close}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation"
      fullWidth
      maxWidth="md"
      className="popup-outer"
      disableScrollLock={ true }      
    >
      <Box className="popup-section">
        <Box className="title-popup">
          <Typography>Add people</Typography>
          <CloseIcon onClick={close} />
        </Box>
        <Box>
          <Typography className="follow-people">
            You have selected following people.
          </Typography>
          <Box
            style={{
              borderRadius: '20px',
              border: '1px solid #9F9F9F',
              padding: '30px',
              margin: '15px 0px'
            }}
          >
            <Box>
              {/* {userList?.map((item:any, index:any) => (
                <Chip key={index} label={item.value} sx={{ m: 0.5 }} />
              ))} */}
            </Box>
            <Box>
            {typePopup == "assign" ?
            <Autocomplete
      value={assigned==true?selectedUser:null} // Pass the selected user to the value prop
      options={allUserData !== undefined ? allUserData: []}
      getOptionLabel={(option) => option?.label}
      renderInput={(params) => <TextField {...params} placeholder="Select Email" />}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
        {typePopup == "share" && <Checkbox
            style={{ marginRight: 0 }}
            checked={selected}
          />}
          {option?.value}
        </li>
      )}
      // disableClearable={true}
      onChange={(event, newValue) => {
        setSelectedUser(newValue); // Update the selected user when the value changes
      }}
    />:
               <Autocomplete
              multiple
                style={{borderRadius: '15px !importnant'}}
                limitTags={3}
                value={userList[0]}
                options={allUserData !== undefined ? allUserData: []}
                getOptionLabel={(option:any) => option?.value}          
                disableCloseOnSelect={true}
                // defaultValue={[
                //   top100Films[13],
                //   top100Films[12],
                //   top100Films[11],
                // ]}
                renderInput={(params) => (
                  <TextField  {...params} placeholder="Select Email" />
                )}
                renderOption={(props, option: any, { selected }) => (
                  <React.Fragment>
                    <li {...props}>
                    {typePopup == "share" && <Checkbox
                        style={{ marginRight: 0 }}
                        checked={selected}
                      />}
                      {option.value}
                    </li>
                  </React.Fragment>
                )}
                disableClearable={true}

                onChange={(_, selectedOptions: any) => {setuserList([selectedOptions])}}
              />}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'block', sm: 'flex' },
            justifyContent: 'flex-end',
            mt: 3,
          }}
        >
          <Button
            type="submit"
            onClick={()=>{close(),setuserList([])}}
            variant="contained"
            className="cancel-btn"
            
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={()=>handleSave()}
            variant="contained"
            className="add-btn"
            // disabled={userList?.length > 0? false : true}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
export default AddPeople;