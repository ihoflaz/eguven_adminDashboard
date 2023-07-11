import { useRouter } from 'next/router';
import { useEffect, useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { EsignsTable } from './esign-table';
import { applyPagination } from 'src/utils/apply-pagination';


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
  const router = useRouter();
  const { userId } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [esigns, setEsigns] = useState([]);
  const [esignsIds, setEsignsIds] = useState([]);
  const esignsSelection = useSelection(esignsIds);

  useEffect(() => {
    if (!userId) {
      console.log('No user id provided');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/esign/' + userId, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setData(data.data);

        // Call your functions here
        const esigns = applyPagination(data.data, page, rowsPerPage);
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
  }, [userId, page, rowsPerPage]);

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
        <Container>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <EsignsTable
              count={esigns.length}
              items={esigns}
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