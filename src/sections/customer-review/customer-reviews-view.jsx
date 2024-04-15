/* eslint-disable import/no-extraneous-dependencies */
import { useState, useEffect } from 'react';
import { query, where, getDocs, collection, onSnapshot } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import ReviewsTable from 'src/routes/components/reviews-table';

import { firestore } from 'src/config/firebase';

export default function CustomerReviewsView() {
  const [orderReviews, setOrderReviews] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  let unsubscribe;

  const getCustomerReviews = async () => {
    setIsLoading(true);
    unsubscribe = onSnapshot(collection(firestore, 'reviews'), (querySnapshot) => {
      const reviews = querySnapshot.docs.map((document) => document.data());

      const ordersPromises = reviews.map(async (review) => {
        const q = query(collection(firestore, 'orders'), where('orderId', '==', review.orderId));
        const orderSnapshot = await getDocs(q);
        const order = orderSnapshot.docs[0].data();
        return {
          ...order,
          ...review,
        };
      });

      Promise.all(ordersPromises)
        .then((orders) => {
          setOrderReviews(orders);
        })
        .catch((error) => {
          console.error('Error fetching orders:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
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
        <ReviewsTable orderReviews={orderReviews} />
      )}
    </Container>
  );
}
