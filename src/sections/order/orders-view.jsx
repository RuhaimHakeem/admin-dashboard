/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { useState, useEffect } from 'react';
import { doc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
/* eslint-disable react/prop-types */
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import VerifiedIcon from '@mui/icons-material/Verified';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { firestore } from 'src/config/firebase';
import { apiInstance } from 'src/config/api-instance';

export function OrdersView() {
  const [orders, setOrders] = useState([]);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [isActionButtonLoading, setIsActionButtonLoading] = useState({});

  const [message, setMessage] = useState({
    message: '',
    isError: false,
  });

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

  const deleteOrder = async (orderId) => {
    setIsActionButtonLoading((prev) => ({
      ...prev,
      [orderId]: true,
      isDeleteButton: true,
    }));
    try {
      await deleteDoc(doc(firestore, 'orders', orderId));
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setIsActionButtonLoading((prev) => ({
        ...prev,
        [orderId]: false,
      }));
    }
  };

  const updateStatus = async (order) => {
    setIsActionButtonLoading((prev) => ({
      ...prev,
      [order.orderId]: true,
      isDeleteButton: false,
    }));
    try {
      await apiInstance.post(
        'updateStatus',
        { orderId: order.orderId, mobile: order.mobile, customerName: order.customerName },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const orderIndex = orders.findIndex((o) => o.orderId === order.orderId);

      setOrders((prev) => {
        prev[orderIndex] = { ...prev[orderIndex], status: 'Delivered' };
        return prev;
      });

      setMessage({
        ...message,
        message: 'Order status updated successfully!',
      });

      router.push('/customer-reviews');
    } catch (e) {
      console.error(e);
      setMessage({
        ...message,
        message: 'Something Went Wrong',
        isError: true,
      });
    } finally {
      setIsActionButtonLoading({
        ...isActionButtonLoading,
        [order.orderId]: false,
      });
    }
  };

  useEffect(() => {
    if (message.message) {
      setTimeout(() => {
        setMessage({
          ...message,
          message: '',
          isError: false,
        });
      }, 3000);
    }
  }, [message]);

  useEffect(() => {
    getCustomerReviews();

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unsubscribe]);
  return (
    <Container sx={{ height: '80vh' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Orders</Typography>
      </Stack>
      {message.message && (
        <Alert sx={{ marginBottom: '16px' }} severity={message.isError ? 'error' : 'success'}>
          {message.message}
        </Alert>
      )}

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
                <TableCell align="center">Order Status</TableCell>
                <TableCell align="center">Order Total</TableCell>
                <TableCell align="center" colSpan={2}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((order) => (
                <TableRow>
                  <TableCell align="center">{order.product}</TableCell>
                  <TableCell>
                    {order.description.length >= 20
                      ? `${order.description.slice(0, 20)}...`
                      : order.description}
                  </TableCell>
                  <TableCell align="center">{order.mobile}</TableCell>
                  <TableCell align="center">{order.quantity}</TableCell>
                  <TableCell align="center">{order.status}</TableCell>
                  <TableCell align="center">{order.totalPrice}</TableCell>
                  <TableCell align="center">
                    <LoadingButton
                      variant="outlined"
                      color="error"
                      loading={
                        isActionButtonLoading[order.orderId] && isActionButtonLoading.isDeleteButton
                      }
                      onClick={() => deleteOrder(order.orderId)}
                    >
                      Delete
                    </LoadingButton>
                  </TableCell>
                  <TableCell align="center">
                    <LoadingButton
                      disabled={order.status === 'Delivered'}
                      loading={
                        isActionButtonLoading[order.orderId] &&
                        !isActionButtonLoading.isDeleteButton
                      }
                      variant="contained"
                      onClick={() => updateStatus(order)}
                    >
                      {order.status === 'Delivered' && (
                        <VerifiedIcon fontSize="small" sx={{ marginRight: '4px' }} />
                      )}
                      {order.status === 'Delivered' ? 'Delivered' : 'Deliver'}
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
