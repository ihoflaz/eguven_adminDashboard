import { useRouter } from 'next/router';
import { useEffect, useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Container, Dialog,
  DialogActions, DialogContent, DialogTitle,
  Stack,
  SvgIcon,
  TextField,
  Typography
} from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { UsersTable } from '../sections/user/user-table';
import { applyPagination } from 'src/utils/apply-pagination';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { CustomersSearch } from '../sections/customer/customers-search';

const useUsers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useUserIds = (users) => {
  return useMemo(
    () => {
      return users.map((user) => user.id);
    },
    [users]
  );
};

const Page = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const userSelection = useSelection(userIds);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setData(data.users);

        // Call your functions here
        const users = applyPagination(data.users, page, rowsPerPage);
        setUsers(users);

        const userIds = users.map((user) => user.id);
        setUserIds(userIds);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [page, rowsPerPage]);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  // Function to handle input changes
  const handleInputChange = (event) => {
    setNewUser({
      ...newUser,
      [event.target.name]: event.target.value
    });
  };

  // Function to handle opening the add user dialog
  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  // Function to handle closing the add user dialog
  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  // Function to handle adding a new user
  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/add_users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      const addedUser = await response.json();
      setUsers(prevUsers => [...prevUsers, addedUser]);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
      });
      setAddDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>
          Users
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Users
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon/>
                      </SvgIcon>
                    )}
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon/>
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                  onClick={handleAddDialogOpen}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomersSearch/>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <UsersTable
                users={users}
                setUsers={setUsers}
                count={data.length}
                items={users}
                initialData={users}
                onDeselectAll={userSelection.handleDeselectAll}
                onDeselectOne={userSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={userSelection.handleSelectAll}
                onSelectOne={userSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={userSelection.selected}
              />
            )}
          </Stack>
        </Container>
      </Box>
      {/* Add User Dialog */}
      <Dialog open={addDialogOpen}
              onClose={handleAddDialogClose}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            value={newUser.firstName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={newUser.lastName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={newUser.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="standard"
            value={newUser.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={newUser.password}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleAddUser}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
