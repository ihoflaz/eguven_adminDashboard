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
  Typography, Grid, Divider
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
    selected = []
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
                      <Button onClick={() => handleClickOpen(esign)}>
                        Detaylar
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
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
