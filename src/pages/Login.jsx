import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project
import IconButton from 'components/@extended/IconButton';

// icons
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// IMAGE
import bgImage from '../../../assets/images/logo.png';
import logo from '../../../assets/images/vue.jpg';

// ✅ pakai authService
import { login } from '../../../services/authService';

export default function AuthLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* BACKGROUND */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
            url(${bgImage})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1
        }}
      />

      {/* FORM */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          textAlign: 'center'
        }}
      >

        {/* LOGO */}
        <img
          src={logo}
          alt="Logo"
          style={{ width: 90, marginBottom: 10 }}
        />

        <h2>E-Kinerja</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          Silakan login untuk melanjutkan
        </p>

        <Formik
          initialValues={{ nip: '', password: '', submit: null }}
          validationSchema={Yup.object().shape({
            nip: Yup.string()
              .matches(/^[0-9]+$/, 'NIP harus berupa angka')
              .min(10, 'NIP minimal 10 digit')
              .max(20, 'NIP maksimal 20 digit')
              .required('NIP wajib diisi'),
            password: Yup.string()
              .required('Password wajib diisi')
              .max(50, 'Password maksimal 50 karakter')
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              setSubmitting(true);

              // ✅ pakai global service
              const res = await login(values);

              const { token, user } = res;

              const userRole = user.role
                ?.toLowerCase()
                .replace(/\s+/g, '_');

              // simpan ke localStorage
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('role', userRole);

              // redirect berdasarkan role
              let redirectPath = '/dashboard/dashboard-opd';

              if (userRole === 'admin_utama') {
                redirectPath = '/dashboard/dashboard-utama';
              }

              navigate(redirectPath, { replace: true });

            } catch (error) {
              setErrors({
                submit:
                  error.response?.data?.message || 'Login gagal'
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>

                {/* NIP */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>NIP</InputLabel>
                    <OutlinedInput
                      fullWidth
                      name="nip"
                      value={values.nip}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Masukkan NIP"
                      error={Boolean(touched.nip && errors.nip)}
                    />
                  </Stack>
                  {touched.nip && errors.nip && (
                    <FormHelperText error>{errors.nip}</FormHelperText>
                  )}
                </Grid>

                {/* PASSWORD */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Masukkan Password"
                      error={Boolean(touched.password && errors.password)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </Stack>
                  {touched.password && errors.password && (
                    <FormHelperText error>{errors.password}</FormHelperText>
                  )}
                </Grid>

                {/* ERROR */}
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error sx={{ textAlign: 'center' }}>
                      {errors.submit}
                    </FormHelperText>
                  </Grid>
                )}

                {/* BUTTON */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Loading...' : 'Login'}
                  </Button>
                </Grid>

              </Grid>
            </form>
          )}
        </Formik>

      </div>
    </div>
  );
}

AuthLogin.propTypes = {
  isDemo: PropTypes.bool
};