import PropTypes from 'prop-types';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography, TextField, DialogActions, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

export const UsersTable = (props) => {
  const {
    count = 0,
    items = [],
    initialData = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    setUsers
  } = props;

  const [data, setData] = useState(initialData);
  const router = useRouter();
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // state for the dialog
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  // state for the permissions
  const [userPermissions, setUserPermissions] = useState({
    order: {
      create: false,
      read: false,
      update: false,
      delete: false
    },
    user: {
      create: false,
      read: false,
      update: false,
      delete: false
    }
  });

  const handleESignButtonClick = (userId) => {
    router.push(`/esign/${userId}`);
  };

  // function to handle open dialog
  const handleOpenPermissionDialog = () => {
    setOpenPermissionDialog(true);
  };

// function to handle close dialog
  const handleClosePermissionDialog = () => {
    setOpenPermissionDialog(false);
  };

  // function to handle change in checkboxes
  const handlePermissionChange = (event) => {
    // Split the name into category and action
    const [category, action] = event.target.name.split('.');

    // If user tries to select 'order:create' along with other permissions
    if (action === 'create' && category === 'order' && event.target.checked) {
      // Deselect all other permissions
      setUserPermissions({
        order: {
          create: true,
          read: false,
          update: false,
          delete: false
        },
        user: {
          create: false,
          read: false,
          update: false,
          delete: false
        }
      });

      // Show a warning
      alert('If you select "order:create", all other permissions will be deselected.');
    }
    // If user tries to select a permission other than 'order:create' when 'order:create' is selected
    else if (userPermissions.order.create && event.target.checked) {
      // Don't allow the selection and show a warning
      event.preventDefault();
      alert('You cannot select other permissions along with "order:create".');
    }
    else {
      setUserPermissions((prevPermissions) => ({
        ...prevPermissions,
        [category]: {
          ...prevPermissions[category],
          [action]: event.target.checked
        }
      }));
    }
  };

  const handlePermissions = (user) => {
    setSelectedUser(user);
    // Check if user.UserPermission is not undefined or null
    if (user.UserPermission) {
      // Extract the names of the permissions
      const permissions = user.UserPermission.map(p => p.permission.name);

      // Set the permissions state based on the user's permissions
      setUserPermissions({
        order: {
          create: permissions.includes('order:create'),
          read: permissions.includes('order:read'),
          update: permissions.includes('order:update'),
          delete: permissions.includes('order:delete')
        },
        user: {
          create: permissions.includes('user:create'),
          read: permissions.includes('user:read'),
          update: permissions.includes('user:update'),
          delete: permissions.includes('user:delete')
        }
      });
    } else {
      // If user.UserPermission is undefined or null, set all permissions to false
      setUserPermissions({
        order: {
          create: false,
          read: false,
          update: false,
          delete: false
        },
        user: {
          create: false,
          read: false,
          update: false,
          delete: false
        }
      });
    }

    // Open the dialog
    handleOpenPermissionDialog();
  };

  const handleOpenUserDialog = (user) => {
    setSelectedUser(user);
    setUserData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone
    });
    setOpenUserDialog(true);
  };
  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
  };

  const handleSaveUser = () => {
    updateUser(selectedUser.id, userData);
    setOpenUserDialog(false);
  };

  const handleChangeUserData = (event) => {
    setUserData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value
    }));
  };
  const handleSavePermissions = async () => {
    const permissions = [];
    for (const category in userPermissions) {
      for (const action in userPermissions[category]) {
        if (userPermissions[category][action]) {
          permissions.push(`${category}:${action}`);
        }
      }
    }
    console.log('permissions: ', permissions);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/permission/' + selectedUser.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ permissions })
      });
      if (response.ok) {
        // success
        const updatedUserPermissions = await response.json();
        setUsers((prevUsers) => prevUsers.map((user) => user.id === selectedUser.id
          ? { ...user, UserPermission: updatedUserPermissions }
          : user));
        setOpenPermissionDialog(false);
      } else {
        console.error(response);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/user/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
      });
      const updatedUser = await response.json();
      setUsers((prevUsers) => prevUsers.map((user) => user.id === id ? updatedUser : user));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                const isSelected = selected.includes(user.id);
                return (
                  <TableRow
                    hover
                    key={user.id}
                    selected={isSelected}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {user.firstName} {user.lastName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {user.phone}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenUserDialog(user)}>Duzenle</Button>
                      <Button onClick={() => handleESignButtonClick(user.id)}>
                        E-Imzalar
                      </Button>
                      <Button onClick={() => handlePermissions(user)}>
                        Yetkilendirme
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {/* Edit User Dialog */}
      <Dialog open={openUserDialog}
              onClose={handleCloseUserDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            value={userData.firstName}
            onChange={handleChangeUserData}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={userData.lastName}
            onChange={handleChangeUserData}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={userData.email}
            onChange={handleChangeUserData}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="standard"
            value={userData.phone}
            onChange={handleChangeUserData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Cancel</Button>
          <Button onClick={handleSaveUser}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openPermissionDialog}
              onClose={handleClosePermissionDialog}>
        <DialogTitle>Yetkilendirme</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Orders</Typography>
          <FormGroup>
            <Stack direction={'row'}>
              <FormControlLabel
                control={<Checkbox checked={userPermissions.order.create}
                                   onChange={handlePermissionChange}
                                   name="order.create"/>}
                label="Create"
              />
              <FormControlLabel
                control={<Checkbox checked={userPermissions.order.read}
                                   onChange={handlePermissionChange}
                                   name="order.read"/>}
                label="Read"
              />
              <FormControlLabel
                control={<Checkbox checked={userPermissions.order.update}
                                   onChange={handlePermissionChange}
                                   name="order.update"/>}
                label="Update"
              />
              <FormControlLabel
                control={<Checkbox checked={userPermissions.order.delete}
                                   onChange={handlePermissionChange}
                                   name="order.delete"/>}
                label="Delete"
              />
            </Stack>
          </FormGroup>
          <Typography variant="h6">Users</Typography>
          <FormGroup>
            <Stack direction={'row'}>
              <FormControlLabel
                control={<Checkbox checked={userPermissions.user.create}
                                   onChange={handlePermissionChange}
                                   name="user.create"/>}
                label="Create"
              />
              <FormControlLabel
                control={<Checkbox checked={userPermissions.user.read}
                                   onChange={handlePermissionChange}
                                   name="user.read"/>}
                label="Read"
              />
              <FormControlLabel
                control={<Checkbox checked={userPermissions.user.update}
                                   onChange={handlePermissionChange}
                                   name="user.update"/>}
                label="Update"
              />
              <FormControlLabel
                control={<Checkbox checked={userPermissions.user.delete}
                                   onChange={handlePermissionChange}
                                   name="user.delete"/>}
                label="Delete"
              />
            </Stack>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePermissionDialog}>Iptal</Button>
          <Button onClick={handleSavePermissions}>Kaydet</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

UsersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  users: PropTypes.array,
  setUsers: PropTypes.any,
  initialData: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
