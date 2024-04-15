/* eslint-disable import/no-extraneous-dependencies */
import { useState, useEffect } from 'react';
import { query, where, getDocs, collection, onSnapshot } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
/* eslint-disable react/prop-types */
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

import { firestore } from 'src/config/firebase';

export function OrdersView() {
  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  let unsubscribe;

  const getCustomerReviews = async () => {
    setIsLoading(true);
    unsubscribe = onSnapshot(collection(firestore, 'orders'), (querySnapshot) => {
      try {
        const ordersDocuments = querySnapshot.docs.map((document) => document.data());
        setOrders(ordersDocuments);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    });
    return unsubscribe;
  };

  useEffect(() => {
    getCustomerReviews();

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container sx={{ height: '80vh' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Customer Reviews</Typography>
      </Stack>

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '80%',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Product Name</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Customer Number</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Order Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((order) => (
                <TableRow>
                  <TableCell align="center">{order.product}</TableCell>
                  <TableCell align="center">{order.description}</TableCell>
                  <TableCell align="center">{order.mobile}</TableCell>
                  <TableCell align="center">{order.quantity}</TableCell>
                  <TableCell align="center">470</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
