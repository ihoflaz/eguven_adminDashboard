import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Switch
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Page = () => {
  const [data, setData] = useState(null);
  const [openCompanyDialog, setOpenCompanyDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [companyData, setCompanyData] = useState({ name: '', address: '', phone: '' });
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const router = useRouter();
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = window.localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/admin', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleOpenCompanyDialog = (company) => {
    setSelectedCompany(company);
    setCompanyData({
      name: company.name,
      address: company.address || '',
      phone: company.phone || ''
    });
    setOpenCompanyDialog(true);
  };

  const handleCloseCompanyDialog = () => {
    setOpenCompanyDialog(false);
  };

  const handleSaveCompany = () => {
    updateCompany(selectedCompany.id, companyData);
    setOpenCompanyDialog(false);
  };

  const handleChangeCompanyData = (event) => {
    setCompanyData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value
    }));
  };

  // butona tiklatinca calisan fonksiyon
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

  const handleOpenAddUserDialog = (company) => {
    setSelectedCompany(company);
    setOpenAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
  };

  const handleAddUser = async () => {
    const userDataWithCompanyId = {
      ...newUserData,
      companyId: selectedCompany.id // add the companyId to the request body
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/add_users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(userDataWithCompanyId)
      });

      const newUser = await response.json();

      if (response.ok) {
        // Update the local state to reflect the new user
        setData((prevData) => ({
          ...prevData,
          companies: prevData.companies.map((company) => company.id === selectedCompany.id ? {
            ...company,
            users: [...company.users, newUser]
          } : company)
        }));
      } else {
        // Handle error
        console.error(newUser);
      }
    } catch (err) {
      console.error(err);
    }

    setOpenAddUserDialog(false);
  };

  const handleChangeNewUserData = (event) => {
    setNewUserData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value
    }));
  };

  if (!data) {
    return <div>Error: Data is not available</div>;
  }

  const updateCompany = async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/company/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
      });
      const updatedCompany = await response.json();
      setData((prevData) => ({
        ...prevData,
        companies: prevData.companies.map((company) => company.id === id ? updatedCompany : company)
      }));
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
      setData((prevData) => ({
        ...prevData,
        companies: prevData.companies.map((company) => ({
          ...company,
          users: company.users.map((user) => user.id === id ? updatedUser : user)
        }))
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (type, id, value) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/toggle/${type}/${id}/${value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      if (response.ok) {
        if (type === 'company') {
          setData((prevData) => ({
            ...prevData,
            companies: prevData.companies.map((company) => company.id === id ? {
              ...company,
              active: value
            } : company)
          }));
        } else if (type === 'user') {
          setData((prevData) => ({
            ...prevData,
            companies: prevData.companies.map((company) => ({
              ...company,
              users: company.users.map((user) => user.id === id ? { ...user, active: value } : user)
            }))
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleESignButtonClick = (userId) => {
    router.push(`/esign/${userId}`);
  };

  return (
    <>
      <Head>
        <title>
          Overview | Devias Kit
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
          {data.companies.map((company) => (
            <Accordion key={company.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                                sx={{ backgroundColor: '#fafafa' }}>
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>{company.name}</Typography>
                <Button onClick={() => handleOpenAddUserDialog(company)}>ADD</Button>
                <Button onClick={() => handleOpenCompanyDialog(company)}>Edit</Button>
                <Switch checked={company.active}
                        onChange={() => handleToggle('company', company.id, !company.active)}/>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Address: {company.address}
                  <br/>
                  Phone: {company.phone}
                </Typography>
                {company.users && company.users.map((user) => (
                  <Accordion key={user.id}
                             disabled={!company.active}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                                      sx={{ backgroundColor: '#fafafa' }}>
                      <Typography
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>{user.firstName} {user.lastName}</Typography>
                      <Button onClick={() => handleESignButtonClick(user.id)}>E-Sign</Button>
                      <Button onClick={() => handleOpenUserDialog(user)}>Edit</Button>
                      <Switch checked={user.active}
                              onChange={() => handleToggle('user',
                                user.id,
                                !user.active)}/>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Email: {user.email}
                        <br/>
                        Phone: {user.phone}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* Edit Company Dialog */}
      <Dialog open={openCompanyDialog}
              onClose={handleCloseCompanyDialog}>
        <DialogTitle>Edit Company</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={companyData.name}
            onChange={handleChangeCompanyData}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
            value={companyData.address}
            onChange={handleChangeCompanyData}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="standard"
            value={companyData.phone}
            onChange={handleChangeCompanyData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompanyDialog}>Cancel</Button>
          <Button onClick={handleSaveCompany}>Save</Button>
        </DialogActions>
      </Dialog>
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
      {/* Add User Dialog */}
      <Dialog open={openAddUserDialog}
              onClose={handleCloseAddUserDialog}>
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
            value={newUserData.firstName}
            onChange={handleChangeNewUserData}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={newUserData.lastName}
            onChange={handleChangeNewUserData}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={newUserData.email}
            onChange={handleChangeNewUserData}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="standard"
            value={newUserData.phone}
            onChange={handleChangeNewUserData}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={newUserData.password}
            onChange={handleChangeNewUserData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddUserDialog}>Cancel</Button>
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

