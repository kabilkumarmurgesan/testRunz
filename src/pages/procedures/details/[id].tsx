import React from 'react';
import PrivateRoute from '../../../components/PrivateRoute';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import edit from '../../../assets/images/edit.svg';
import printer from '../../../assets/images/printer.svg';
import { Editor } from '@tinymce/tinymce-react';
import { fetchSingleProcedureData, fetchUpdateProcedureData } from '../../../api/procedureAPI';
import { useDispatch, useSelector } from 'react-redux';
import ProcedureForm from '../ProcedureForm';
import SuccessPopup from '../../../components/SuccessPopup';
import { useLocation } from '@reach/router';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { navigate } from 'gatsby';
import moment from 'moment';
import { fetchAssetsName } from '../../../api/assetsAPI';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';
import SpinerLoader from '../../../components/SpinnerLoader';
import AWS from 'aws-sdk';
// import ProceduresRichText from './Editor';

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('name is required').max(50, 'Must be 50 characters or less'),
  asset_Name: Yup.array().notRequired(),
  procedure: Yup.string().required().max(50, 'Must be 50 characters or less'),
});

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

export default function ProcedureDetails() {
  const editorRef: any = React.useRef(null);
  const dispatch: any = useDispatch();
  const [procedureData, setprocedureData] = React.useState<any>({});
  const [assetsList, setAssetsList] = React.useState([]);
  // const [assetsData, setAssetsData] = React.useState([]);
  const formPopupRef: any = React.useRef(null);
  const confirmationPopupRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  const [assetsData, setAssetsData] = React.useState<any>([]);
  const [assetName, setAssetName] = React.useState<any>([]);
  const [assetNamepatch, setAssetNamepatch] = React.useState<any>([]);
  // console.log('assetName',assetName);
  const [state, setState] = React.useState({ content:"" });
  const [isLoader, setIsLoader] = React.useState(true);
  // const [errors, setErrors] = React.useState("");
  const onSubmit = (values: any) => {

    // debugger
    const isMatch = checkCredentials(values.name);
    if (isMatch) {
      // dispatch(fetchUpdateAssetsData(values));
      // setFormPopup(false);
    } else {
      formik.setFieldError('name', 'Invalid first name');
    }
  };
  const procedureSliceData = useSelector(
    (state: any) => state.procedure.data?.get_procedure,
  );
  
  const loginUserSliceData = useSelector(
    (state: any) => state.userLogin.data,
  );
 
  const credencial =  loginUserSliceData?.verifyToken?.role[0]

  
  const formik = useFormik({
    initialValues: {
      name: procedureData?.name,
      asset_Name: '',
      procedure: '',
      html:''
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });


  React.useEffect(() => {
    console.log("1");
  
    // Set a timer for 1 second (1000 milliseconds)
    const timerId = setTimeout(() => {
      setIsLoader(false);
      setprocedureData(procedureSliceData);
  
  
      setState({ content: procedureSliceData?.procedureDetials });
      formik.setValues({ ...formik.values, name: procedureSliceData?.name });
      const data:{label:string, value: string, id: number}[] = []
      console.log()
      if(procedureSliceData?.assetId.length !== 0){
        console.log("sjdfjsdflik",procedureSliceData?.assetId)
        // Uncomment the following lines if you have data structure like procedureSliceData.assetId
          procedureSliceData?.assetId?.map((item: {name:string,_id:number}) => {
            data.push({label: item.name,value: item.name,id: item._id})
          })
      }
      setAssetNamepatch(data)
    }, 2000); // 1000 milliseconds = 1 second
  
    // Clean up the timer on component unmount or if procedureSliceData changes
    return () => clearTimeout(timerId);
  
  }, [procedureSliceData]);


  console.log(procedureSliceData);
  const location: any = useLocation();
  const procedureValue = location.state?.props;
  // console.log(procedureValue);

  const handleCloseFormPopup = (state: any) => {
    formPopupRef.current.open(state);
  };

  const handleSubmitFormPopup = () => {
    formPopupRef.current.open(false);
    successPopupRef.current.open(true, 'Procedure');
    setTimeout(() => {
      successPopupRef.current.open(false, 'Procedure');
    }, 3000);
  };

  const handleOpenConfirmationPopup = (state: any) => {
    confirmationPopupRef.current.open(state);
  };
  const handleConfirmationDone = (state: any) => {
    if (state === 1) {
      formPopupRef.current.open(false);
    }
    confirmationPopupRef.current.open(false);
  };
  const handleChange = (content:any) => {
    setState({ content });
  };

  const handleEditorChange = (e:any) => {
    console.log( e.target.getContent());
    console.log("Content was updated:", e.target.getContent());
  };
  const [htmlInput, setHtmlInput] = React.useState<any>({});

  const handleHtmlInput = () => {
    let objects = {};
    // @ts-ignore
    let inputEl: any = document
      ?.getElementById("content")
      ?.querySelectorAll("input");
console.log(inputEl);

    inputEl?.forEach((ele: any) => {
      const { id, value } = ele;
      let temp = { [id]: value };
      objects = { ...objects, temp };
      setHtmlInput((prev: any) => ({ ...prev, [id]: value }));
      // @ts-ignore
      ele.onChange = (e) => {
        const { id, value } = e.target;
        setHtmlInput((prev: any) => ({ ...prev, [id]: value }));
      };
    });
    console.log(objects);
    
  };
  console.log(htmlInput);
  const handleSave = (e:any) => {
    // if(assetNamepatch.length!==0){
  //  console.log(state);
  var assetIds: any = []
  assetNamepatch?.map((item: any) => (assetIds.push(item?.id)))
  console.log('assetIds',assetIds);
  
   const payload={
    _id: procedureData._id,
    name:formik.values.name,
    procedureDetials: state.content,
    assetId:assetIds
   }
   handleHtmlInput();

   const tablesEles: any = document
   ?.getElementById("content")
   ?.querySelectorAll("table");
   let finalTableTitleResult: any;
   console.log(tablesEles);
 
 if (tablesEles) {
   const result = Array?.from(tablesEles)?.map((tablesInstance: any) => {
     const headerCells = tablesInstance?.querySelectorAll("[data-column]");
     const headerNames = Array.from(headerCells).map((header: any) => ({
       key: header.getAttribute("data-column"),
       value: header.textContent.trim(),
     }));
     const tableDataRows: any = tablesInstance.querySelectorAll("tbody tr");
     const rowData = Array.from(tableDataRows)?.map((tableDataRow: any) => {
       const tableCells = tableDataRow.querySelectorAll("td[data-column]");
       return Array.from(tableCells).map((cell: any) => {
         const inputCntext = cell.querySelector("input[type='text']");
         if (inputCntext) {
           return {
             key: cell.getAttribute("data-column"),
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
  let filteredData = mergedDatasets?.filter((sublist) =>
    sublist?.some((obj: any) => Object?.keys(obj).length > 0)
  );
  filteredData = filteredData?.map((sublist) =>
    sublist?.filter((obj: any) => Object?.keys(obj).length > 0)
  );

  const results = filteredData?.map((dataset, index) => {
    const subResult = [];
    const firstDataItem = dataset[index];
    for (const key in firstDataItem) {
      const label = key;
      const values: any = [];
      dataset?.forEach((item: any) => {
        if (item[key]) {
          values.push(parseInt(item[key]));
        }
      });
      subResult.push({ label, values });
    }
    return subResult;
  });

  const tablesin = document
    ?.getElementById("content")
    ?.querySelectorAll("[data-table]");
  const getTitle: any = [];

  tablesin?.forEach((element, index) => {
    getTitle.push(element.textContent);
  });

  finalTableTitleResult = getTitle?.map((list: any, index: any) => {
    return { label: list, value: list, data: results[index] };
  });
  let vals = Object.values(htmlInput);
  const empty = vals.filter((item) => item === "");

  }
  dispatch(fetchUpdateProcedureData(payload)).then((res)=>{
    toast(`Procedure updated !`, {
      style: {
        background: '#00bf70', color: '#fff'
      }
    });
    // setTimeout(()=>{
      const procedureId = { _id: procedureData._id,};
    dispatch(fetchSingleProcedureData(procedureId));
    // },3000)
  }).catch((err)=>{
    console.log(err);
    
  })

 
// }
// else{
//  setErrors("Asset Name is required")
// }
}
  // console.log(state);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // console.log(window.location.pathname.split('/'));
      const procedureId = { _id: window.location.pathname.split('/')[3] };
      dispatch(fetchSingleProcedureData(procedureId));
    }
  }, []);
  const assetsSliceData = useSelector(
    (state: any) => state.assets.data?.get_all_assets_name,
  );
  const reloadSingleData=async()=>{
    console.log("1timrd");
    
    const procedureId = { _id: procedureData._id,};
    setIsLoader(true)
     await dispatch(fetchSingleProcedureData(procedureId));
     await setIsLoader(false)
  }
  // React.useEffect(() => {
  //   setAssetsData(assetsData);
  // }, [assetsData]);

  React.useEffect(() => {
    dispatch(fetchAssetsName());
    // setAssetsData(assetsData);
  }, []);
  React.useEffect(() => {
    setAssetsData(
      assetsSliceData?.map((item: any) => ({
        label: item.name,
        value: item.name,
      id: item._id,
      })))
  }, [assetsSliceData]);

  // console.log('assetsData',assetsData);
  
  const checkCredentials = (values: any) => {
    return true;
  };
const onChangeValue=(e:any)=>{
console.log(e.target.value);

}
const uploadVideo = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const videoUrl = URL.createObjectURL(file);
    if (videoUrl) {
      const editor = editorRef.current.editor;
    console.log('videoUrl',videoUrl);

      editorRef.current?.insertContent(
        `<video controls><source src="${videoUrl}" type="video/mp4"></video>`
      );
    }
  }
};

const handleEditorInit = (editor) => {
  editor.ui.registry.addButton("uploadvideo", {
    text: "Upload Video",
    onAction: () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "video/*");
      input.onchange = uploadVideo;
      input.click();
    },
  });
};

const s3 = new AWS.S3({
  // params: { Bucket: S3_BUCKET, folderName: "profile" },
  region: 'us-east-1',
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEYID,
});


  return (
    <PrivateRoute>
      {!isLoader ?
      <Box className="proceduredetails-page">
        <Box className="top-section" sx={{position:'relative !important',top:'0px !important',width:'100% !important'}}>
          <Box sx={{ padding: '24px 0px', margin: '0px 24px' }}>
            <Grid container spacing={2} >
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <Box sx={{paddingRight:"4rem"}}>
                  <Typography className="id-detail">
                  {procedureData?.procedureNumber}
                  </Typography>
                  <Typography className="id-detail-title">
                  {procedureData?.name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Box>
                  <Typography className="id-detail">Created by</Typography>
                  <Typography
                    className="id-detail"
                    style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      marginTop: '0.4rem',
                    }}
                  >
                    {procedureData?.createdBy}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Box>
                  <Typography className="id-detail">Created on</Typography>
                  <Typography
                    className="id-detail"
                    style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      marginTop: '0.4rem',
                    }}
                  >
                 {moment(parseInt(procedureData?.createdAt)).format('MM/DD/YYYY')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={3}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'end',
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    className="edit-btn"
                    onClick={() => {
                      formPopupRef.current.open(true ,procedureData);
                    }}
                    disabled={!credencial?.procedure_management?.edit}
                  >
                    <img src={edit} alt="edit" style={{ marginRight: '8px' }} />
                    Edit
                  </Button>
                </Box>
              </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
             
            </Grid> */}
          </Box>
          <Divider sx={{ borderColor: '#FFEAA5', borderBottomWidth: '5px' }} />
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Box className="main-proceduredetails" sx={{padding:'1.5rem 1.5rem 8rem !important'}}>
            <Grid container spacing={2} className="">
              <Grid item xs={12} sm={12} md={6} lg={6} className='prod-input-auto  prod-input'>
                <Box style={{ position: 'relative' }}>
                  <label style={{marginBottom:"0.6rem",display:"block"}}>Procedure name</label>
                  <TextField
                    margin="none"
                    fullWidth
                    id="name"
                    name="name"
                    autoComplete="off"
                    InputLabelProps={{ shrink: false }}
                    inputProps={{ maxLength: 51 }}
                    placeholder="Procedure name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    size="small"
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    className='prod-name'
                  />
                  {formik.touched.name && formik.errors.name && (
                    <Typography className="error-field">
                      {formik.errors.name}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} className='prod-input-auto prod-multi'>
                <Box style={{ position: 'relative' }}>
                  <label style={{marginBottom:"0.6rem",display:"block"}}>Assets name</label>
                  <Autocomplete
                    multiple
                    id="asset_Name"
                    disableCloseOnSelect
                    value={assetNamepatch}
                    options={assetsData !== undefined ? assetsData : []}
                    getOptionLabel={(option: any) => option.label}
                    isOptionEqualToValue={(option: any, value: any) =>
                      value.id == option.id
                    }
                    renderInput={(params) => <TextField {...params}  />}
                    fullWidth
                    placeholder="asset_Name"
                    size="medium"
                    // onFocus={()=>setErrors("")}
                    renderOption={(props, option: any, { selected }) => (
                      <React.Fragment>
                        <li {...props}>
                          <Checkbox
                            style={{ marginRight: 0 }}
                            checked={selected}
                          />
                          {option.label}
                        </li>
                      </React.Fragment>
                    )}
                    onChange={(_, selectedOptions: any) =>
                      {setAssetNamepatch(selectedOptions); formik.setValues({ ...formik.values, 'asset_Name': selectedOptions })
                      // setDropdownData((prevData) => [...prevData, newItem]);
                    }
                    }
                  />
                  {/* {errors!==""&& (
                    <Typography className="error-field">
                      {errors}
                    </Typography>
                  )} */}
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box style={{ position: 'relative' }}>
                  <label>Full procedure</label>
                  <Box sx={{ mt: 1.5 }} id="content">
                  {/* <ProceduresRichText
              editorRef={editorRef}
              value={formik.values.html}
              onEditorChange={(event: any) =>
                formik.setFieldValue("html", event)
              }
            /> */}
                    <Editor
                      apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      // value={editorData}
                      init={{
                        height: 650,
                        paste_data_images: false,
                        menubar: true,
                        selector: 'textarea',
                        plugins: [
                          'advlist',
                          "paste",
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
                          'customAlertButton subscript superscript charmap textpattern',
                        ],
                        toolbar: 'undo redo | blocks formatselect | ' +
                        'charmap subscript superscript bold italic | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'help |link image code table customInsertButton insertdatetime template insertinput customDataAttrButton uploadVideo tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry ',
                        image_advtab: true,
                    image_title: true,
                    automatic_uploads: true,
                    file_picker_types: "image",
                    table_advtab: "true",
                    file_picker_callback: function (cb, value, meta) {
                      var input = document.createElement("input");
                      input.setAttribute("type", "file");
                      input.setAttribute("accept", "image/jpg, image/jpeg, image/png");
                      input.onchange = function () {
                        var file = this.files[0];
                        var reader = new FileReader();
                        reader.onload = function () {
                          const keyPath = `profile/${Date.now()}`;
                          const params = {
                            Bucket: 'test-run-v2',
                            Key: keyPath,
                            Body: file,
                            ACL: 'public-read',
                            // ContentType: selectedFile.type
                          };

                          s3.upload(params, function (err:any, data:any) {
                            if (err) {
                              console.error('Error uploading image to AWS S3:', err);
                            } else {
                              const id = "blobid" + new Date().getTime();
                              const blobCache = window?.tinymce?.activeEditor.editorUpload.blobCache;
                              const blobInfo = blobCache.create(id, file, data.Location);
                              blobCache.add(blobInfo);
                              cb(data.Location,{ alt: file.name });
                            }
                          });
                        };
                        reader.readAsDataURL(file);
                      };
          
                      input.click();
                    },
                    setup: function (editor) {
                      handleEditorInit(editor);
                      editor.ui.registry.addButton("customInsertButton", {
                        icon: "edit-block",
                        tooltip: "Insert Input Element",
                        onAction: function (_) {
                          const value = nanoid(7);
                          editor.insertContent(
                            `&nbsp;<input type='text' id='value_${value}' name='value_${value}'>&nbsp;`
                          );
                        },
                      });
                      var toTimeHtml = function (date) {
                        return (
                          '<time datetime="' +
                          date.toString() +
                          '">' +
                          date.toDateString() +
                          "</time>"
                        );
                      };
                      editor.ui.registry.addButton("customVideoUpload", {
                        text: "Upload Video",
                        onAction: function () {
                          editor?.insertContent(
                            `<video width="320" height="240" controls><source src="${videoUrl}" type="video/mp4"></video>`
                          );
                          // if (fileInputRef.current) {
                          //   fileInputRef.current.click();
                          // }
                        },
                      });

                      editor.ui.registry.addButton("customDateButton", {
                        icon: "insert-time",
                        tooltip: "Insert Current Date",
                        disabled: true,
                        onAction: function (_) {
                          editor.insertContent(toTimeHtml(new Date()));
                        },
                        onSetup: function (buttonApi) {
                          var editorEventCallback = function (eventApi:any) {
                            buttonApi?.setDisabled(
                              eventApi.element.nodeName.toLowerCase() === "time"
                            );
                          };
                          editor.on("NodeChange", editorEventCallback);
                          return function (buttonApi) {
                            editor.off("NodeChange", editorEventCallback);
                          };
                        },
                      });

                      editor.ui.registry.addButton("customDataAttrButton", {
                        icon: "fas fa-cog",
                        tooltip: "Assign Data Attribute",
                        onAction: function (_) {
                          const selectedNode = editor.selection.getNode();
                          const key = window.prompt("Enter data attribute key:");
                          if (key) {
                            const value = window.prompt("Enter data attribute value:");
                            if (value) {
                              selectedNode.setAttribute(`data-${key}`, value);
                            }
                          }
                        },
                      });
                    },
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                    value={state.content}
          onChange={handleEditorChange}
          onEditorChange={handleChange}
          // onSaveContent={handleSave}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* <Grid container spacing={2} className="asset-popup">
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box>
                  <label style={{ color: '#181818' }}>Procedure name</label>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    InputLabelProps={{ shrink: false }}
                    placeholder="bubble sort 2"
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} className="asset-popup">
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box>
                  <label style={{ color: '#181818' }}>Full procedures</label>
                  <Box sx={{ mt: 2 }}>
                    <Editor
                      apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      init={{
                        height: 400,
                        menubar: true,
                        plugins: [
                          'advlist autolink lists link image charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen',
                          'insertdatetime media table paste code help wordcount',
                        ],
                        toolbar:
                          'undo redo | formatselect | ' +
                          'bold italic backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style:
                          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid> */}
          </Box>
          <Box className="edit-details" sx={{ p: 2 }}>
            <Button
              variant="contained"
              className="cancel-btn"
              onClick={() => navigate('/procedures')}
            >
              Back
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <img
                src={printer}
                alt="printer"
                style={{ marginRight: '1rem', cursor: 'pointer' }}
              /> */}
              <Button type="submit" variant="contained" disabled={""} className="add-btn" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        </form>
        <ProcedureForm
          formData={procedureValue}
          type={'edit'}
          ref={formPopupRef}
          closeFormPopup={handleCloseFormPopup}
          submitFormPopup={handleSubmitFormPopup}
          openConfirmationPopup={handleOpenConfirmationPopup}
          reloadSingleData={reloadSingleData}
        />

        <SuccessPopup ref={successPopupRef} />
      </Box>:
      
        <SpinerLoader isLoader={isLoader} />}
    </PrivateRoute>
  );
}
