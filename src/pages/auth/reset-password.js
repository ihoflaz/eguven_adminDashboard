import Head from 'next/head';
import {useRouter} from 'next/router';
import {useFormik} from 'formik';
import * as Yup from 'yup';
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
import { useState, useEffect } from 'react';

const Page = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const {enqueueSnackbar} = useSnackbar();
    const auth = useAuth();
    const [snackbarOpen, setSnackbarOpen] = useState({ success: false, message: '' });

    useEffect(() => {
        console.log("router.query.token", router.query.token)
        console.log("router.query", router.query)
        if(router.query.token) {
            setToken(router.query.token);
            formik.resetForm();
        }
    }, [router.query.token]);

    const formik = useFormik({
        initialValues: {
            password: '',
            passwordConfirm: '',
            submit: null
        },
        validationSchema: Yup.object().shape({
            password: Yup.string().min(8).max(255).required('Password is required'),
            passwordConfirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
        }),
        enableReinitialize: true,
        onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                console.log("values.password", values.password);
                console.log("token", token);
                await auth.resetPassword(values.password, token);
                setStatus({success: true});
                setSubmitting(false);
                setSnackbarOpen({ success: true, message: 'Password reset successful' });
                await router.push('/auth/login');
            } catch (err) {
                console.error(err);
                setStatus({success: false});
                setErrors({submit: err.message});
                setSubmitting(false);
                setSnackbarOpen({ success: false, message: 'Failed to reset password' });
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
                    Reset Password | Devias Kit
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
                                Reset Password
                            </Typography>
                        </Stack>
                        <form
                            noValidate
                            onSubmit={formik.handleSubmit}
                        >
                            <Stack spacing={3}>
                                <TextField
                                    error={!!(formik.touched.password && formik.errors.password)}
                                    fullWidth
                                    helperText={formik.touched.password && formik.errors.password}
                                    label="Password"
                                    name="password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                />
                                <TextField
                                    error={!!(formik.touched.passwordConfirm && formik.errors.passwordConfirm)}
                                    fullWidth
                                    helperText={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
                                    label="Confirm Password"
                                    name="passwordConfirm"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
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
