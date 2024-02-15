import React from 'react';
import PrivateRoute from '../../components/PrivateRoute';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { visuallyHidden } from '@mui/utils';
import { Pagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import search from '../../assets/images/search.svg';
import '../../assets/styles/procedure.scss';
import bin from '../../assets/images/bin.svg';
import share from '../../assets/images/Share.svg';
import assign from '../../assets/images/share-arrow.svg';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';
import { AssetsHeaders, OrganizationList } from '../../utils/data';
import { MoreVertOutlined } from '@mui/icons-material';
import AssignPopup from '../../components/AssignPopup';
import AddPeoplePopup from '../../components/AddPeoplePopup';
import DeletePopup from '../../components/DeletePopup';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Popover from '@mui/material/Popover';
import filterIcon from '../../assets/images/filter-icon1.svg';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function TableFilters({
  columns,
  handleMenuCheckboxChange,
  handleDeCheckboxChange,
  handledAllSelected,
  isDeselectAllChecked,
  isselectAllChecked,
  isTableHeaderVisible,
  closeTableHeader,
  deleteRecord,
  module,
  applyFilters,
  status,
  availability,
  runzId,
  runzRow
}: any) {
  const [columnAnchorEl, setColumnAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [filterPopoverEl, setFilterPopoverEl] =
    React.useState<null | HTMLElement>(null);
  const columnAnchorOpen = Boolean(columnAnchorEl);
  const filterAnchorOpen = Boolean(filterPopoverEl);
  const [openAssign, setAssignOpen] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState(null);
  const [filterAvailability, setFilterAvailability] = React.useState(null);
  const [filterSearchBy, setFilterSearchBy] = React.useState(null);
  const [filterFieldName, setFilterFieldName] = React.useState('');
  const [filterSearchValue, setFilterSearchValue] = React.useState(null);
  const [filterType, setFilterType] = React.useState(null);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [filterKey, setFilterKey] = React.useState(null);
  const [runsOpen, setRunsOpen] = React.useState(false);
  const [typePopup, settypePopup] = React.useState('')
  const handleColumnPopoverClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setColumnAnchorEl(event.currentTarget);
  };

  const handleFilterPopoverClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setFilterPopoverEl(event.currentTarget);
  };

  const loginUserSliceData = useSelector(
    (state: any) => state.userLogin.data,
  );

  const credencial = loginUserSliceData?.verifyToken?.role[0]


  const handleColumnPopoverClose = () => {
    setColumnAnchorEl(null);
  };

  const handleFilterPopoverClose = () => {
    setFilterPopoverEl(null);
  };

  const handleAssignClick = (val: string) => {
    setRunsOpen(true);
    settypePopup(val)
  };

  const handleClearFilter = () => {
    setFilterStatus(null);
    setFilterAvailability(null);
    setFilterSearchBy(null);
    setFilterSearchValue(null);
    setFilterOptions([]);
    setFilterType(null);
    applyFilters('search', null);
    handleFilterPopoverClose();
    setFilterKey(null);
  };

  const Placeholder = ({ children }: any) => {
    return <div>{children}</div>;
  };

  return (
    <>
      <AssignPopup open={openAssign} close={() => setAssignOpen(false)} />
      <Grid
        container
        sx={{ my: 2 }}
        alignItems="center"
        justifyContent={isTableHeaderVisible ? 'space-between' : 'flex-end'}
      >
        <Grid item xs={12} sm={12} md={12} lg={6} xl={9}>
          {isTableHeaderVisible && (
            <Box className="search-action">
              <Button
                type="submit"
                onClick={() => handleDeCheckboxChange(false)}
                variant="contained"
                className="close-actions"
              >
                <CloseIcon sx={{ fontSize: '20px', marginRight: '5px' }} />
                Close actions
              </Button>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    sx={{
                      color: '#9F9F9F',
                      '&.Mui-checked': {
                        color: '#FFC60B',
                      },
                    }}
                    checked={isselectAllChecked}
                    checkedIcon={<CheckCircleOutlineOutlinedIcon />}
                    icon={<HighlightOffOutlinedIcon />}
                    onChange={(event) => {
                      handledAllSelected(isselectAllChecked);
                    }}
                  />
                }
                label="Select all"
                className="common-checkbox"
                style={{ marginBottom: '0rem' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    sx={{
                      color: '#9F9F9F',
                      '&.Mui-checked': {
                        color: '#FFC60B',
                      },
                      '& .MuiFormControlLabel-label': {
                        fontSize: '10px', // Adjust the font size as per your preference
                      },
                    }}
                    checkedIcon={<CheckCircleOutlineOutlinedIcon />}
                    icon={<HighlightOffOutlinedIcon />}
                    onChange={(event) => handleDeCheckboxChange(event, false)}
                    checked={isDeselectAllChecked}
                  />
                }
                label="Deselect all"
                className="common-checkbox"
                style={{ marginBottom: '0rem' }}
              />
              {/* <DeletePopup open={isDeletePopupOpen} close={handleCloseDeletePopup} /> */}
              {/* <Button className="delete-actions" onClick={deleteRecord}>
                <img src={bin} alt="Delete" className="Image-actions" />
                Delete
              </Button> */}
              {
                module == 'procedures' && (<Button className="delete-actions" onClick={deleteRecord} disabled={!credencial?.procedure_management?.delete}>
                  <img src={bin} alt="Delete" className="Image-actions" />
                  Delete
                </Button>)}
              {
                module == 'assets' && (<Button className="delete-actions" onClick={deleteRecord} disabled={!credencial?.asset_management?.delete}>
                  <img src={bin} alt="Delete" className="Image-actions" />
                  Delete
                </Button>)}
              {
                module == 'users' && (<Button className="delete-actions" onClick={deleteRecord} disabled={!credencial?.user_management?.delete}>
                  <img src={bin} alt="Delete" className="Image-actions" />
                  Delete
                </Button>)}
              {
                module == 'runs' && (
                  <Button className="delete-actions" onClick={deleteRecord} disabled={!credencial?.runs_management?.delete}>
                    <img src={bin} alt="Delete" className="Image-actions" />
                    Delete
                  </Button>
                )
              }
              {/* {module == 'runs' && (
                <Button className="delete-actions" onClick={()=>handleAssignClick("assign")} >
                  <img src={assign} alt="assign" className="Image-actions" />
                  Assign 
                </Button>
              )}   */}
              <AddPeoplePopup
                open={runsOpen}
                close={() => {setRunsOpen(false);handleDeCheckboxChange(false)}}
                runzId={runzId}
                runzRow={runzRow}
                typePopup={typePopup}
              />
              {module == 'runs' && (
                <Button className="delete-actions" onClick={()=>handleAssignClick("share")} disabled={!credencial?.runs_management?.share}>
                  <img src={share} alt="Share" className="Image-actions" />
                  Share
                </Button>
              )}
              <IconButton onClick={handleColumnPopoverClick}>
                <MoreVertOutlined />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={columnAnchorEl}
                open={columnAnchorOpen}
                onClose={handleColumnPopoverClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {columns.map((item: any, index: number) => (
                  <MenuItem key={item.id} value={item.label}>
                    <Checkbox
                      checked={item.is_show ? true : false}
                      disabled={item.label.includes('ID') ? true : false}
                      onChange={(e) => handleMenuCheckboxChange(e, index)}
                    />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Grid>
        {/* <Grid item xs={12} sm={12} md={12} lg={6} xl={3}>
          <Box className="filter-search"> */}
        {/* <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              IconComponent={ExpandMoreOutlinedIcon}
              placeholder="Select"
            >
              {AssetsHeaders.map((name) => (
                <MenuItem key={name.id} value={name.label}>
                  <Checkbox checked={name.is_show} />
                  <ListItemText primary={name.label} />
                </MenuItem>
              ))}
            </Select> */}

        {/* <TextField
              margin="normal"
              required
              fullWidth
              name="Search"
              id="Search"
              style={{ margin: '0px' }}
              InputLabelProps={{ shrink: false }}
              variant="outlined"
              placeholder="Search"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <img src={search} />
                  </InputAdornment>
                ),
              }}
              className="search-field-inner"
            /> */}
        {/* <Box sx={{ position: 'relative' }}>
              <Button
                // aria-describedby={id}
                variant="contained"
                onClick={handleFilterPopoverClick}
                style={{
                  boxShadow: 'none',
                  backgroundColor: '#fff',
                  padding: '0px',
                  justifyContent: 'center',
                }}
              > */}
        {/* <FilterAltOutlinedIcon style={{ fontSize: '2rem' }} /> */}
        {/* <Badge color="secondary" variant={filterKey === null ? "standard" : "dot"} invisible={false}>
                  <img
                    src={filterIcon}
                    alt="no_image"
                    style={{
                      width: '25px',
                      height: '25px',
                      opacity: 0.9,
                      cursor: 'pointer',
                    }}
                  />
                </Badge>
              </Button>
              <Popover
                className="filter-dropdown"
                open={filterAnchorOpen}
                anchorEl={filterPopoverEl}
                onClose={handleFilterPopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #d0d0d0',
                      alignContent: 'center',
                      padding: '1rem',
                    }}
                  >
                    <Typography fontWeight={600} variant="body1">
                      Filters
                    </Typography>
                    <CloseIcon
                      sx={{ cursor: 'pointer' }}
                      onClick={handleFilterPopoverClose}
                    />
                  </Box>
                  <Box sx={{ padding: '0rem 1rem 1rem 1rem' }}>
                    <Box sx={{ my: 1 }}>
                      <Typography variant="body2" paddingY={1}>
                        Status
                      </Typography>

                      <Select
                        labelId="table-select-label"
                        id="table-select"
                        value={filterStatus}
                        displayEmpty
                        fullWidth
                        size="small"
                        IconComponent={ExpandMoreOutlinedIcon}
                        onChange={(event: any) =>
                          setFilterStatus(event.target.value)
                        }
                        renderValue={
                          filterStatus !== null
                            ? undefined
                            : () => <Placeholder>Select Status</Placeholder>
                        }
                      >
                        {status?.map((element: any) => (
                          <MenuItem value={element.value} key={element.value}>
                            {element.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    {module === 'assets' && (
                      <Box sx={{ my: 1 }}>
                        <Typography variant="body2" paddingY={1}>
                          Availability
                        </Typography>

                        <Select
                          labelId="table-select-label"
                          id="table-select"
                          value={filterAvailability}
                          displayEmpty
                          fullWidth
                          size="small"
                          IconComponent={ExpandMoreOutlinedIcon}
                          onChange={(event: any) =>
                            setFilterAvailability(event.target.value)
                          }
                          renderValue={
                            filterAvailability !== null
                              ? undefined
                              : () => (
                                  <Placeholder>Select Availability</Placeholder>
                                )
                          }
                        >
                          {availability?.map((element: any) => (
                            <MenuItem value={element.value} key={element.value}>
                              {element.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    )}
                    <Box sx={{ my: 1 }}>
                      <Typography variant="body2" paddingY={1}>
                        Search by
                      </Typography>

                      <Select
                        labelId="table-select-label"
                        id="table-select"
                        value={filterSearchBy}
                        size="small"
                        fullWidth
                        displayEmpty
                        IconComponent={ExpandMoreOutlinedIcon}
                        onChange={(event: any, data: any) => {
                          //   debugger;
                            setFilterSearchValue(null);
                          setFilterSearchBy(event.target?.value);
                          setFilterFieldName(data.props.children);
                        }}
                        renderValue={
                          filterSearchBy !== null
                            ? undefined
                            : () => <Placeholder>Search by</Placeholder>
                        }
                      >
                        {columns.map((element: any) => (
                          <MenuItem
                            value={element.id}
                            key={element.id}
                            onClick={() => {
                              setFilterType(element.type);
                              setFilterOptions(element.filters[0]?.options);
                              setFilterKey(element.id);
                            }}
                          >
                            {element.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <Box sx={{ my: 1 }}>
                      {filterType !== null && (
                        <Typography variant="body2" paddingY={1}>
                          {filterType === 'text'
                            ? 'Search'
                            : filterType === 'date'
                            ? `Date ${filterFieldName}`
                            : `Select ${filterFieldName}`}
                        </Typography>
                      )}

                      {filterType === null ? null : filterType === 'text' ? (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="Search"
                          id="Search"
                          style={{ margin: '0px' }}
                          InputLabelProps={{ shrink: false }}
                          placeholder="Search"
                          size="small"
                          value={filterSearchValue}
                          onChange={(event: any) =>
                            setFilterSearchValue(event.target.value)
                          }
                        />
                      ) : filterType === 'date' ? (
                        <Box id="filterDatePicker">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="DD/MM/YYYY"
                              value={filterSearchValue}
                              onChange={(event:any) =>
                                setFilterSearchValue(event.$d)
                              }
                            />
                          </LocalizationProvider>
                        </Box>
                      ) : (
                        <Select
                          value={filterSearchValue}
                          labelId="table-select-label2"
                          id="table-select2"
                          size="small"
                          fullWidth
                          displayEmpty
                          IconComponent={ExpandMoreOutlinedIcon}
                          onChange={(event: any) =>
                            setFilterSearchValue(event.target?.value)
                          }
                          renderValue={
                            filterSearchValue !== null
                              ? undefined
                              : () => <Placeholder>Select</Placeholder>
                          }
                        >
                          {filterOptions.map((element, index) => (
                            <MenuItem key={index} value={element.value}>
                              {element.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #d0d0d0',
                      alignContent: 'center',
                      padding: '1rem',
                    }}
                  >
                    <Button
                      style={{
                        border: '1px solid #d3d3d3',
                        color: '#181818',
                        textTransform: 'capitalize',
                      }}
                      onClick={handleClearFilter}
                    >
                      Clear
                    </Button>
                    <Button
                      style={{
                        border: '1px solid #d3d3d3',
                        background: '#FFC60B',
                        color: '#181818',
                        textTransform: 'capitalize',
                      }}
                      onClick={() => {
                        handleFilterPopoverClose();
                        applyFilters(filterKey, filterSearchValue);
                      }}
                    >
                      Show results
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </Box> */}
        {/* </Box>
        </Grid> */}
      </Grid>
    </>
  );
}
