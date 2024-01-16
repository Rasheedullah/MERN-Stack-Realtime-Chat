import * as React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
// import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../apis/auth'

// ** view
import Snackbar from "../utils/snackbar";

// ** MUI Imports
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function RegisterForm() {
  const pageRoute = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({open:'false', type:'', message:''})
  const validationSchema = yup.object({
    firstname: yup.string().required("This field is required"),
    lastname: yup.string().required("This field is required"),
    email: yup.string().required("This field is required").email("Invalid email format"),
    password: yup.string().required("This field is required"),
    confirmPassword: yup.string().required("This field is required")
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      setSnackbar({open:'false', type:'', message:''})
    
        const { data } = await registerUser(values)
        if (data?.token) {
          localStorage.setItem("userToken", data.token)
          setSnackbar({open:'true', type:'success', message:'Succesfully Registered!'})
          setIsLoading(false)
          pageRoute("/chats")
        } else {
          setIsLoading(false)
          setSnackbar({open:'true', type:'error', message:data.message})
        }
    },
  });

  return (
    <React.Fragment>
      <Snackbar  open={snackbar.open}  type={snackbar.type} message={snackbar.message}/>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 8,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="firstname"
              label="firstname"
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstname}
              error={formik.touched.firstname && Boolean(formik.errors.firstname)}
              helperText={formik.touched.firstname && formik.errors.firstname}
            />
            <TextField
              fullWidth
              id="lastname"
              label="Last Name"
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastname}
              error={formik.touched.lastname && Boolean(formik.errors.lastname)}
              helperText={formik.touched.lastname && formik.errors.lastname}
            />
            <TextField
              fullWidth
              id="email"
              label="Email"
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading ? true: false}
            >
              {isLoading ? 'wait...': 'Register'}
            </Button>
          </form>
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button fullWidth variant="text" sx={{ mt: 1 }}>
              Login
            </Button>
          </Link>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default RegisterForm;
