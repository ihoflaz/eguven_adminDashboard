import PropTypes from 'prop-types';
import { useState } from 'react';
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
  Typography, Grid, Divider, Tooltip, CircularProgress
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

export const EsignsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    orders,
    setOrders
  } = props;

  const [open, setOpen] = useState(false);
  const [selectedEsign, setSelectedEsign] = useState(null);

  const handleClickOpen = (esign) => {
    setSelectedEsign(esign);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async (id) => {
    const token = localStorage.getItem('token');
    try {
      // Send a request to the /orderConfirm/:id endpoint
      const response = await fetch(`http://localhost:3000/orderConfirm/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to confirm order with id ${id}`);
      }

      const updatedOrder = await response.json();
      // After the request to /orderConfirm/:id is successful, update the order in the state
      setOrders((prevOrders) => prevOrders.map((order) => order.id === id
        ? updatedOrder
        : order));
    } catch (error) {
      console.error(error);
      // Optionally show an error message to the user
    }
  };

  const handleCheck = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/orderStatus/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check order with id ${id}`);
      }

      const updatedOrder = await response.json();
      // After the request to /orderStatus/:id is successful, update the order in the state
      setOrders((prevOrders) => prevOrders.map((order) => order.id === id
        ? updatedOrder
        : order));
    } catch (error) {
      console.error(error);
      // Optionally show an error message to the user
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
                  Adress
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Siparis Durumu
                </TableCell>
                <TableCell>
                  Siparis Detayi
                </TableCell>
                <TableCell>
                  Siparisi Onayla
                </TableCell>
                <TableCell>
                  Siparisi Kontrol Et
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((esign) => {
                const isSelected = selected.includes(esign.id);
                return (
                  <TableRow
                    hover
                    key={esign.id}
                    selected={isSelected}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {esign.firstName} {esign.lastName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {esign.email}
                    </TableCell>
                    <TableCell>
                      {esign.teslimatadres}/{esign.teslimatilce}/{esign.teslimatil}
                    </TableCell>
                    <TableCell>
                      {esign.telefon}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={esign.statusDetails}>
                        <Typography variant="subtitle2">
                          {esign.status}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleClickOpen(esign)}>
                        Detaylar
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleConfirm(esign.id)}
                        disabled={esign.status !== 'Yeni'}
                      >
                        Onayla
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCheck(esign.id)}
                        disabled={esign.status !== 'Musteri Onayi Bekleniyor'}
                      >
                        {esign.status === 'Kontrol Ediliyor' ? <CircularProgress size={24} /> : 'Kontrol Et'}
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
      <Dialog open={open}
              onClose={handleClose}>
        <DialogTitle>{'Esign Details'}</DialogTitle>
        <DialogContent>
          <Grid container
                spacing={1}>
            {selectedEsign &&
              Object.entries(selectedEsign).map(([key, value], index) => (
                <Grid item
                      xs={12}
                      key={index}>
                  <Typography variant="overline"
                              display="block"
                              gutterBottom>
                    {key.toUpperCase()}
                  </Typography>
                  <Typography variant="body1">{value}</Typography>
                  <Divider variant="middle"/>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

EsignsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  orders: PropTypes.array,
  setOrders: PropTypes.any,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};