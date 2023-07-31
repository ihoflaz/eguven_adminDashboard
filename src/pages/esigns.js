import { useEffect, useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { EsignsTable } from '../sections/esign/esign-table';
import { applyPagination } from 'src/utils/apply-pagination';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';

const useEsigns = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useEsignIds = (esigns) => {
  return useMemo(
    () => {
      return esigns.map((esign) => esign.id);
    },
    [esigns]
  );
};

const Page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [esigns, setEsigns] = useState([]);
  const [esignsIds, setEsignsIds] = useState([]);
  const esignsSelection = useSelection(esignsIds);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/esigns', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setData(data.esigns);

        // Call your functions here
        const esigns = applyPagination(data.esigns, page, rowsPerPage);
        setEsigns(esigns);

        const esignsIds = esigns.map((esign) => esign.id);
        setEsignsIds(esignsIds);

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

  return (
    <>
      <Head>
        <title>
          E-İmza
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
                  Esigns
                </Typography>
              </Stack>
            </Stack>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <EsignsTable
                count={data.length}
                items={esigns}
                orders={esigns}
                setOrders={setEsigns}
                onDeselectAll={esignsSelection.handleDeselectAll}
                onDeselectOne={esignsSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={esignsSelection.handleSelectAll}
                onSelectOne={esignsSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={esignsSelection.selected}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
