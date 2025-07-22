 import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { motion } from 'framer-motion';
import { Avatar, InputAdornment, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@mui/material';
import { registerCompany, sendCode } from './registerCompanySlice';
import { useNavigate } from 'react-router-dom';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  logo: yup.string(),
  banner: yup.string(),
  companyName: yup.string().required('Company name is required'),
  subdomain: yup.string().required('Subdomain is required'),
  address: yup.string().required('Address is required'),
  phone: yup
    .string()
    .matches(/^\+?\d{10,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  firstName: yup.string().required('Company name is required'),
  lastName: yup.string().required('Company name is required'),
  firstName: yup.string().required('Company name is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterCompanyForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields } = formState;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  /**
   * Form Submit
   */
  function onSubmit({ confirmPassword, ...data }) {
    dispatch(sendCode({ formData: data, dispatch })).then(({ payload }) => {
      if (payload.token) {
        localStorage.setItem('company', payload.token);
        navigate('/verify-email');
      }
    });
  }

   const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Company Name *" />
              )}
            />
            <div className="flex items-center gap-2">
              <Controller
                name="subdomain"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth placeholder="Subdomain" />
                )}
              />
              <span className="text-gray-600 font-medium">.ihubconnect.com</span>
            </div>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Address" />
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Phone Number" type="tel" />
              )}
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="First Name" />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Last Name" />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Email Address" type="email" />
              )}
            />
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Password" type="password" />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Confirm Password" type="password" />
              )}
            />
          </div>
        )
      default:
        return null
    }
  }

   const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Enter Company's Details"
      case 2:
        return 'Enter Personal Details'
      case 3:
        return 'Set-up your Password'
      default:
        return ''
    }
  }

  return (
    <div className="flex flex-col w-[60%] flex-1 md:ltr:pr-32 md:rtl:pl-32">
      <Typography
        variant="h5"
        className="font-medium flex flex-auto items-center justify-center p-8 mt-10"
      >
        Register Company
      </Typography>

      <Card component={motion.div} className="w-full mb-32">
        <CardContent className="px-32 py-24">
          <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
            {/* BANNER UPLOAD */}
            <Controller
              control={control}
              name="banner"
              render={({ field: { onChange, value } }) => (
                <Box
                  required
                  sx={{
                    borderWidth: 4,
                    borderStyle: 'solid',
                    borderColor: 'background.paper',
                  }}
                  className="relative w-full h-160 sm:h-192 px-32 rounded-[15px] sm:px-48"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 z-10 rounded-2" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      <label
                        htmlFor="companyBanner"
                        className="flex p-8 cursor-pointer"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="companyBanner"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setBannerFile(file);
                            onChange(URL.createObjectURL(file));
                          }}
                        />
                        <Tooltip title="Upload Company Banner" arrow>
                          <FuseSvgIcon className="text-white cursor-pointer">
                            heroicons-outline:camera
                          </FuseSvgIcon>
                        </Tooltip>
                      </label>
                    </div>

                    <div>
                      <IconButton
                        onClick={() => {
                          setBannerFile(null);
                          onChange('');
                        }}
                      >
                        <FuseSvgIcon className="text-white">
                          heroicons-solid:trash
                        </FuseSvgIcon>
                      </IconButton>
                    </div>
                  </div>
                  <img
                    className="absolute inset-0 object-cover w-full h-full"
                    src={value}
                  />
                </Box>
              )}
            />

            {/* LOGO UPLOAD */}
            <div className="w-full flex flex-auto items-center -mt-64 justify-center">
              <Controller
                control={control}
                name="logo"
                render={({ field: { onChange, value } }) => (
                  <Box
                    required
                    sx={{
                      borderWidth: 4,
                      borderStyle: 'solid',
                      borderColor: 'background.paper',
                    }}
                    className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <label
                        htmlFor="button-avatar"
                        className="flex p-8 cursor-pointer"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="button-avatar"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setLogo(file);
                            onChange(URL.createObjectURL(file));
                          }}
                        />
                        <Tooltip title="Upload Company Logo" arrow>
                          <FuseSvgIcon className="text-white cursor-pointer">
                            heroicons-outline:camera
                          </FuseSvgIcon>
                        </Tooltip>
                      </label>
                      <IconButton
                        onClick={() => {
                          setLogo(null);
                          onChange('');
                        }}
                      >
                        <FuseSvgIcon className="text-white">
                          heroicons-solid:trash
                        </FuseSvgIcon>
                      </IconButton>
                    </div>
                    <Avatar
                      sx={{
                        backgroundColor: 'background.default',
                        color: 'text.secondary',
                      }}
                      className="object-cover w-full h-full text-64 font-bold"
                      src={value}
                    />
                  </Box>
                )}
              />
            </div>

            {/* FORM FIELDS */}
            <Box className="w-full mt-16">
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Company Name"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="subdomain"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Subdomain"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Address"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {showPassword ? (
                            <VisibilityOffIcon
                              onClick={handleTogglePassword}
                              sx={{
                                cursor: 'pointer',
                              }}
                            />
                          ) : (
                            <VisibilityIcon
                              onClick={handleTogglePassword}
                              sx={{
                                cursor: 'pointer',
                              }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {showPassword ? (
                            <VisibilityOffIcon
                              onClick={handleTogglePassword}
                              sx={{
                                cursor: 'pointer',
                              }}
                            />
                          ) : (
                            <VisibilityIcon
                              onClick={handleTogglePassword}
                              sx={{
                                cursor: 'pointer',
                              }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {/* SUBMIT BUTTON */}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit(onSubmit)}
              disabled={_.isEmpty(dirtyFields) || !isValid}
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterCompanyForm; 