import * as React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../apis/auth'

// ** view
import Snackbar from "../utils/snackbar";

// ** MUI Imports
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function LoginForm() {
  const pageRoute = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({open:'false', type:'', message:''})
  const validationSchema = yup.object({
    email: yup.string().required("This field is required").email("Invalid email format"),
    password: yup.string().required("This field is required")
  });

  const formik = useFormik({
    initialValues: {
        email: "",
        password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      setSnackbar({open:'false', type:'', message:''})
    
        const { data } = await loginUser(values)
        if (data?.token) {
          localStorage.setItem("userToken", data.token)
          setSnackbar({open:'true', type:'success', message:'Login Success Fully!'})
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading ? true: false}
            >
              {isLoading ? 'Wait...': 'Login'}
            </Button>
          </form>
          <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button fullWidth variant="text" sx={{ mt: 1 }}>
              Register
            </Button>
          </Link>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default LoginForm;
