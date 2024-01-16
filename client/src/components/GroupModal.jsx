import * as React from "react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { setGroupModal } from "../redux/profileSlice";
import { fetchChats } from "../redux/chatsSlice";

// ** Apis
import { searchUsers, validUser } from "../apis/auth";
import { createGroup } from "../apis/chat";
//M UI imports
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { CardContent } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs() {
  const dispatch = useDispatch();
  const addModal = useSelector((state) => state.profile.groupModal);
  const [search, setSearch] = React.useState("");
  const [options, setOptions] = useState([]);
  const [selectedUser, setSelectedUsers] = useState([]);

  const top100Films = [{ title: "The Shawshank Redemption", id: 1994 }];

  const CreateOptionData = (data) => {
    let arr = [];
    if (data?.length > 0) {
      data.map((user) => {
        arr.push({ id: user._id, label: user.name });
      });
      setOptions(arr);
    }
  };
  const validationSchema = yup.object({
    chatName: yup.string().required("This field is required"),
    users: yup
      .number()
      .required("This field is required")
      .min(2, "Please select at least two user"),
  });

  let formik = useFormik({
    initialValues: {
      chatName: "",
      users: selectedUser.length,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await createGroup({
          chatName: values.chatName,
          users: JSON.stringify(selectedUser.map((e) => e)),
        });
        dispatch(setGroupModal(false));
        dispatch(fetchChats());
        setSelectedUsers([]);
        formik.resetForm();
      } catch (error) {
        console.error("Error adding Room:", error);
      }
    },
  });
  const handleClick = (e) => {
    // console.log('data', e)
    let slctUser = [];
    e.map((user) => {
      slctUser.push(user.id);
    });
    setSelectedUsers(slctUser);
  };
  useEffect(() => {
    formik.setFieldValue("users", selectedUser.length);
  }, [selectedUser]);

  const handleCustomSubmit = () => {
    formik.submitForm();
  };
  const handleClose = () => {
    // dispatch(setAddModal(false))
  };

  useEffect(() => {
    const searchChange = async () => {
      //   setIsLoading(true)
      const { data } = await searchUsers(search);
      // setSearchResults(data)
      CreateOptionData(data);
      //   setIsLoading(false)
    };
    searchChange();
  }, [search]);
  return (
    <React.Fragment>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={addModal}
        onClose={handleClose}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Create Group
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => dispatch(setGroupModal(false))}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <CardContent>
            <form>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="chatName"
                    label="Group Name"
                    placeholder="Group Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.chatName}
                    error={
                      formik.touched.chatName && Boolean(formik.errors.chatName)
                    }
                    helperText={
                      formik.touched.chatName && formik.errors.chatName
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={formik.touched.users && Boolean(formik.errors.users)}
                  >
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={options}
                      name="users"
                      getOptionLabel={(option) => option.label}
                      // defaultValue={[options[0]]}
                      filterSelectedOptions
                      onChange={(event, newValue) => {
                        handleClick(newValue);
                        // setSelectedUsers([]);
                        // formik.setFieldValue('users', newValue);
                        // console.log('Selected options:', newValue);
                      }}
                      // onBlur={formik.handleBlur}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select User"
                          placeholder="Favorites"
                        />
                      )}
                    />
                    {formik.touched.users && formik.errors.users && (
                      <FormHelperText error>
                        {formik.errors.users}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            autoFocus
            onClick={() => dispatch(setGroupModal(false))}
          >
            Cancel
          </Button>
          <Button autoFocus onClick={handleCustomSubmit}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
