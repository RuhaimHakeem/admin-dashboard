/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-extraneous-dependencies */
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useState, useEffect } from 'react';
import { query, where, getDocs, collection } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { firestore } from 'src/config/firebase';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

const SignInSchema = Yup.object().shape({
  username: Yup.string().min(1, 'Please Enter the Username').required('Required'),
  password: Yup.string().min(1, 'Please Enter the Password').required('Required'),
});

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [message, setMessage] = useState({
    message: '',
    isError: false,
  });

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

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async (values) => {
    const q = query(
      collection(firestore, 'users'),
      where('username', '==', values.username),
      where('password', '==', values.password)
    );

    const user = await getDocs(q);
    console.log(user?.docs[0]?.data());
    if (!user.docs[0]?.data()) {
      setMessage({
        ...message,
        message: 'Username or Password Invalid',
        isError: true,
      });
      return;
    }

    const userData = { user: user.docs[0]?.data(), isLoggedIn: true };
    localStorage.setItem('user', JSON.stringify(userData));

    router.push('/');
  };

  const renderForm = (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={(values) => {
        handleClick(values);
      }}
      validationSchema={SignInSchema}
    >
      {({ values, errors, touched, handleChange, handleSubmit }) => (
        <>
          <Stack spacing={3} mt={4}>
            <TextField
              name="username"
              value={values.username}
              label="user name"
              onChange={handleChange}
            />
            {errors.username && touched.username && (
              <Alert severity="error">{errors.username}</Alert>
            )}

            <TextField
              name="password"
              label="Password"
              value={values.password}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={handleChange}
            />
            {errors.password && touched.password && (
              <Alert severity="error">{errors.password}</Alert>
            )}
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
            sx={{ marginTop: 4 }}
          >
            Login
          </LoadingButton>
        </>
      )}
    </Formik>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Dashboard</Typography>
          {message.message && (
            <Alert sx={{ margin: '16px 0' }} severity={message.isError ? 'error' : 'success'}>
              {message.message}
            </Alert>
          )}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
