import React, { useState, useEffect } from "react";

// ** Apis
import { searchUsers, validUser } from "../apis/auth";
import { acessCreate } from "../apis/chat.js";

// ** Redux Imports
import { useDispatch, useSelector } from "react-redux";
import { fetchChats, setNotifications } from "../redux/chatsSlice";

// ** Mui Imports
import { styled } from "@mui/system";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";

// const SearchTextField = styled(TextField)(({ theme }) => ({
//   padding: theme.spacing(2),
// }));

const SearchComponent = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [options, setOptions] = useState([{ id: 1, label: "Select..." }]);
  const CreateOptionData = (data) => {
    let arr = [];
    if (data?.length > 0) {
      data.map((user) => {
        arr.push({ id: user._id, label: user.name });
      });
    }

    setOptions(arr);
  };


  useEffect(() => {
    const searchChange = async () => {
      //   setIsLoading(true)
      const { data } = await searchUsers(search);
      setSearchResults(data);
      CreateOptionData(data);
      //   setIsLoading(false)
    };
    searchChange();
  }, [search]);

  const handleClick = async (e) => {
     if(selectedValue.id!=undefined){
      await acessCreate({ userId: selectedValue.id });
      dispatch(fetchChats());
     }
  };
  return (
    <form>
      <Grid container spacing={1}>
        <Grid item xs={7}>
          <Autocomplete
            autoComplete="new-password"
            name="search"
            options={options}
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => setSelectedValue(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search"
                variant="outlined"
                fullWidth
              />
            )}
            onInputChange={(event, value) => {
              setSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ height: "80%", top: "5px" }}
            onClick={handleClick}
          >
            Send Request
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SearchComponent;
