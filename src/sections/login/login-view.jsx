/* eslint-disable import/no-extraneous-dependencies */
import { useState } from 'react';
import { query, where, getDocs, collection, onSnapshot } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { firestore } from 'src/config/firebase';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [state, setState] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    const q = query(
      collection(firestore, 'users'),
      where('username', '==', state.username),
      where('password', '==', state.password)
    );

    const user = await getDocs(q);
    if (!user.docs[0]?.data()) {
      console.log('h');
      return;
    }

    // localStorage.setItem('user', {
    //   user,
    //   isLoggedIn: true,
    // });

    router.push('/');
  };

  const renderForm = (
    <>
      <Stack spacing={3} mt={4}>
        <TextField
          name="username"
          label="user name"
          onChange={(e) =>
            setState({
              ...state,
              username: e.target.value,
            })
          }
        />

        <TextField
          name="password"
          label="Password"
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
          onChange={(e) =>
            setState({
              ...state,
              password: e.target.value,
            })
          }
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        sx={{ marginTop: 4 }}
      >
        Login
      </LoadingButton>
    </>
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

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
