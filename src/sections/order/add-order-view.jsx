import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
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

export function AddOrderView() {
  const theme = useTheme();
  const [order, setOrder] = useState({
    product: 'Cake',
    mobile: '',
    description: '',
    quantity: '',
  });

  const [isError, setIsError] = useState({
    product: false,
    mobile: false,
    description: false,
    quantity: false,
  });

  const handleChange = (e) => {
    setIsError({
      ...isError,
      [e.target.name]: !e.target.value,
    });

    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };
  const handleClick = async (e) => {
    const isEmptyFields = !Object.entries(order).every(([_, value]) => value);

    if (isEmptyFields) {
      return;
    }

    await apiInstance.post('add', order, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Go ahead');
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <InputLabel>Select the product</InputLabel>
          <Select
            placeholder="Select"
            required
            name="product"
            onChange={handleChange}
            error={isError.product}
            value={order.product}
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
          error={isError.mobile}
          required
        />
        <TextField
          name="description"
          label="Description"
          onChange={handleChange}
          error={isError.description}
          multiline
          required
        />
        <TextField
          name="quantity"
          label="Quantity"
          onChange={handleChange}
          error={isError.quantity}
          required
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        sx={{ mt: 4 }}
      >
        Add Order
      </LoadingButton>
    </>
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

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
