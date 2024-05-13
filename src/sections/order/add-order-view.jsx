/* eslint-disable import/no-extraneous-dependencies */
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';
// eslint-disable-next-line import/no-unresolved
import { apiInstance } from 'src/config/api-instance';

const OrderSchema = Yup.object().shape({
  customerName: Yup.string().min(1, 'Please Enter the Customer Name').required('Required'),
  product: Yup.string().min(1, 'Please Enter the Product').required('Required'),
  mobile: Yup.string().min(11, 'Please provide a valid mobile number').required('Required'),
  description: Yup.string().required('Required'),
  quantity: Yup.number().typeError('Quantity must be a number').required('Required'),
  totalPrice: Yup.number().typeError('Total Price must be a number').required('Required'),
});

export function AddOrderView() {
  const theme = useTheme();

  const [message, setMessage] = useState({
    message: '',
    isError: false,
  });

  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (message.message) {
      setTimeout(() => {
        setMessage({
          message: '',
          isError: false,
        });
      }, 3000);
    }
  }, [message.message]);

  const handleClick = async (order) => {
    setisLoading(true);

    try {
      await apiInstance.post('add', order, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage({
        ...message,
        message: 'Order Added Successfully',
        isError: false,
      });
    } catch (e) {
      console.error(e);
      setMessage({
        ...message,
        message: 'Something Went Wrong',
        isError: true,
      });
    } finally {
      setisLoading(false);
    }
  };

  const renderForm = (
    <Formik
      initialValues={{
        customerName: '',
        product: 'Cake',
        mobile: '',
        description: '',
        quantity: '',
        totalPrice: '',
      }}
      onSubmit={(values) => {
        handleClick(values);
      }}
      validationSchema={OrderSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        /* and other goodies */
      }) => (
        <form>
          <Stack spacing={3}>
            <Stack spacing={2}>
              <TextField
                name="customerName"
                label="Customer name"
                onChange={handleChange}
                value={values.customerName}
              />
              {errors.customerName && touched.customerName && (
                <Alert severity="error">{errors.customerName}</Alert>
              )}
              <InputLabel>Select the product</InputLabel>
              <Select
                placeholder="Select"
                required
                name="product"
                onChange={handleChange}
                value={values.product}
              >
                <MenuItem value="Cake">Cake</MenuItem>
                <MenuItem value="Cookies">Cookies</MenuItem>
                <MenuItem value="Muffin">Muffin</MenuItem>
                <MenuItem value="Cupcake">Cupcake</MenuItem>
                <MenuItem value="Macaron">Macaron</MenuItem>
              </Select>
            </Stack>
            <TextField
              name="mobile"
              label="Mobile number"
              onChange={handleChange}
              value={values.mobile}
            />
            {errors.mobile && touched.mobile && <Alert severity="error">{errors.mobile}</Alert>}

            <TextField
              name="description"
              label="Description"
              onChange={handleChange}
              multiline
              value={values.description}
            />
            {errors.description && touched.description && (
              <Alert severity="error">{errors.description}</Alert>
            )}

            <TextField
              name="quantity"
              label="Quantity"
              onChange={handleChange}
              value={values.quantity}
            />
            {errors.quantity && touched.quantity && (
              <Alert severity="error">{errors.quantity}</Alert>
            )}
            <TextField
              name="totalPrice"
              label="Total Price"
              onChange={handleChange}
              value={values.totalPrice}
            />
            {errors.totalPrice && touched.totalPrice && (
              <Alert severity="error">{errors.totalPrice}</Alert>
            )}

            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              color="inherit"
              loading={isLoading}
              onClick={handleSubmit}
              sx={{ mt: 4 }}
            >
              Add Order
            </LoadingButton>
          </Stack>
        </form>
      )}
    </Formik>
  );

  return (
    <Box
      sx={{
        color: alpha(theme.palette.background.default, 0.9),
        ...bgGradient({
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
      }}
    >
      <Stack alignItems="center" justifyContent="center">
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Add Order</Typography>

          <Typography variant="body2" sx={{ mb: 5 }}>
            Please provide order details
          </Typography>
          {message.message && (
            <Alert sx={{ marginBottom: '16px' }} severity={message.isError ? 'error' : 'success'}>
              {message.message}
            </Alert>
          )}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
