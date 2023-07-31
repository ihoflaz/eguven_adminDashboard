import Head from 'next/head';
import NextLink from 'next/link';
import {useRouter} from 'next/navigation';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Box, Button, Link, Stack, TextField, Typography} from '@mui/material';
import {useAuth} from 'src/hooks/use-auth';
import {Layout as AuthLayout} from 'src/layouts/auth/layout';

const Page = () => {
    const router = useRouter();
    const auth = useAuth();
    const formik = useFormik({
        initialValues: {
            companyName: '',
            companyAddress: '',
            companyPhone: '',
            companyEmail: '',
            companyFormUrl: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            submit: null
        },
        validationSchema: Yup.object({
            companyName: Yup
                .string()
                .max(255)
                .required('Company Name is required'),
            companyAddress: Yup
                .string()
                .max(255)
                .required('Company Address is required'),
            companyPhone: Yup
                .number()
                .max(255)
                .required('Company Phone is required'),
            companyEmail: Yup
                .string()
                .max(255)
                .required('Company Email is required'),
            companyFormUrl: Yup
                .string()
                .max(255)
                .required('Company Form Url is required'),
            firstName: Yup
                .string()
                .max(255)
                .required('First Name is required'),
            lastName: Yup
                .string()
                .max(255)
                .required('Last Name is required'),
            email: Yup
                .string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            phone: Yup
                .number()
                .max(255)
                .required('Phone is required'),
            password: Yup
                .string()
                .max(255)
                .required('Password is required')
        }),
        onSubmit: async (values, helpers) => {
            try {
                await auth.signUp(
                    values.companyName,
                    values.companyAddress,
                    values.companyPhone,
                    values.companyEmail,
                    values.companyFormUrl,
                    values.firstName,
                    values.lastName,
                    values.email,
                    values.phone,
                    values.password
                );
                router.push('/auth/login');
            } catch (err) {
                helpers.setStatus({success: false});
                helpers.setErrors({submit: err.message});
                helpers.setSubmitting(false);
            }
        }
    });

    return (
        <>
            <Head>
                <title>
                    Register | Devias Kit
                </title>
            </Head>
            <Box
                sx={{
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
                            sx={{mb: 3}}
                        >
                            <Typography variant="h4">
                                Register
                            </Typography>
                            <Typography
                                color="text.secondary"
                                variant="body2"
                            >
                                Already have an account?
                                &nbsp;
                                <Link
                                    component={NextLink}
                                    href="/auth/login"
                                    underline="hover"
                                    variant="subtitle2"
                                >
                                    Log in
                                </Link>
                            </Typography>
                        </Stack>
                        <form
                            noValidate
                            onSubmit={formik.handleSubmit}
                        >
                            <Stack spacing={3}>
                                <TextField
                                    error={Boolean(formik.touched.companyName && formik.errors.companyName)}
                                    fullWidth
                                    helperText={formik.touched.companyName && formik.errors.companyName}
                                    label="Company Name"
                                    name="companyName"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.companyName}
                                />
                                <TextField
                                    error={Boolean(formik.touched.companyAddress && formik.errors.companyAddress)}
                                    fullWidth
                                    helperText={formik.touched.companyAddress && formik.errors.companyAddress}
                                    label="Company Address"
                                    name="companyAddress"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.companyAddress}
                                />
                                <TextField
                                    error={Boolean(formik.touched.companyPhone && formik.errors.companyPhone)}
                                    fullWidth
                                    helperText={formik.touched.companyPhone && formik.errors.companyPhone}
                                    label="Company Phone"
                                    name="companyPhone"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.companyPhone}
                                />
                                <TextField
                                    error={Boolean(formik.touched.companyEmail && formik.errors.companyEmail)}
                                    fullWidth
                                    helperText={formik.touched.companyEmail && formik.errors.companyEmail}
                                    label="Company Email"
                                    name="companyEmail"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.companyEmail}
                                />
                                <TextField
                                    error={Boolean(formik.touched.companyFormUrl && formik.errors.companyFormUrl)}
                                    fullWidth
                                    helperText={formik.touched.companyFormUrl && formik.errors.companyFormUrl}
                                    label="Company Form Url"
                                    name="companyFormUrl"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.companyFormUrl}
                                />
                                <TextField
                                    error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                                    fullWidth
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                    label="First Name"
                                    name="firstName"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.firstName}
                                />
                                <TextField
                                    error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                                    fullWidth
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                    label="Last Name"
                                    name="lastName"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.lastName}
                                />
                                <TextField
                                    error={!!(formik.touched.email && formik.errors.email)}
                                    fullWidth
                                    helperText={formik.touched.email && formik.errors.email}
                                    label="Email Address"
                                    name="email"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="email"
                                    value={formik.values.email}
                                />
                                <TextField
                                    error={Boolean(formik.touched.phone && formik.errors.phone)}
                                    fullWidth
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    label="Phone"
                                    name="phone"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.phone}
                                />
                                <TextField
                                    error={!!(formik.touched.password && formik.errors.password)}
                                    fullWidth
                                    helperText={formik.touched.password && formik.errors.password}
                                    label="Password"
                                    name="password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.password}
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
