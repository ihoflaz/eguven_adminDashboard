import Head from 'next/head';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {useAuth} from 'src/hooks/use-auth';
import {Layout as AuthLayout} from 'src/layouts/auth/layout';

const Page = () => {
    const {enqueueSnackbar} = useSnackbar();
    const auth = useAuth();
    const [snackbarOpen, setSnackbarOpen] = useState({ success: false, message: '' });

    const formik = useFormik({
        initialValues: {
            email: '',
            submit: null
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        }),
        onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                await auth.forgotPassword(values.email);
                setStatus({success: true});
                setSubmitting(false);
                setSnackbarOpen({ success: true, message: 'Password reset email sent' });
            } catch (err) {
                console.error(err);
                setStatus({success: false});
                setErrors({submit: err.message});
                setSubmitting(false);
                setSnackbarOpen({ success: false, message: 'Failed to send password reset email' });
            }
        },
    });


    useEffect(() => {
        if (snackbarOpen.message) {
            enqueueSnackbar(snackbarOpen.message, { variant: snackbarOpen.success ? 'success' : 'error' });
            setSnackbarOpen({ success: false, message: '' });
        }
    }, [snackbarOpen, enqueueSnackbar]);

    return (
        <>
            <Head>
                <title>
                    Forgot Password | Devias Kit
                </title>
            </Head>
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        maxWidth: 550,
                        px: 3,
                        py: '100px',
                        width: '100%'
                    }}
                >
                    <div>
                        <Stack
                            spacing={1}
                            sx={{mb: 1}}
                        >
                            <Typography variant="h4">
                                Forgot Password
                            </Typography>
                        </Stack>
                        <form
                            noValidate
                            onSubmit={formik.handleSubmit}
                        >
                            <Stack spacing={3}>
                                <TextField
                                    error={!!(formik.touched.email && formik.errors.email)}
                                    fullWidth
                                    helperText={formik.touched.email && formik.errors.email}
                                    label="Email Address"
                                    name="email"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="email"
                                />
                            </Stack>
                            {formik.errors.submit && (
                                <Typography
                                    color="error"
                                    sx={{mt: 3}}
                                    variant="body2"
                                >
                                    {formik.errors.submit}
                                </Typography>
                            )}
                            <Button
                                fullWidth
                                size="large"
                                sx={{mt: 3}}
                                type="submit"
                                variant="contained"
                            >
                                Continue
                            </Button>
                        </form>
                    </div>
                </Box>
            </Box>
        </>
    );
};

Page.getLayout = (page) => (
    <AuthLayout>
        {page}
    </AuthLayout>
);

export default Page;
