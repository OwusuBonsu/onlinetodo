import "./App.css";
import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  AppBar,
  Typography,
  Divider,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import firebase from "./firebase";

function App() {
  //Declare states
  const [toDoArray, addtoToDoArray] = useState([]);
  const [tempToDoItem, addTempToDoItem] = useState("");
  const [toDoItem, addToDoItem] = useState("");
  const [checkedToDos, getCheckedToDos] = useState([]);
  const [uncheckedToDos, getUncheckedToDos] = useState([]);

  //Get database and ref
  const db = getDatabase();
  const toDoRef = ref(db, "toDos/");

  //Populate array with current to do list and update when list is updated
  useEffect(() => {
    addtoToDoArray([]);
    getCheckedToDos([]);
    getUncheckedToDos([]);
    onValue(toDoRef, (snapshot) => {
      const data = snapshot.val();
      const dataArray = Object.values(data);
      addtoToDoArray(dataArray);
    });
  }, []);

  const clearArrays = () => {
    addtoToDoArray([]);
    getCheckedToDos([]);
    getUncheckedToDos([]);
  };
  //Log array on change
  useEffect(() => {
    console.log(toDoArray);
  }, [toDoArray]);

  useEffect(() => {
    toDoArray.forEach((toDos) => {
      if (toDos.checked === true) {
        console.log(toDos);
        getCheckedToDos((checkedToDos) => checkedToDos.concat(toDos));
      }
    });
  }, [toDoArray]);

  useEffect(() => {
    toDoArray.forEach((toDos) => {
      if (toDos.checked === false) {
        getUncheckedToDos((uncheckedToDos) => uncheckedToDos.concat(toDos));
      }
    });
  }, [toDoArray]);

  const onTextChange = (e) => addTempToDoItem(e.target.value);

  const handleSubmit = () => {
    getCheckedToDos([]);
    getUncheckedToDos([]);
    if (tempToDoItem !== "") {
      console.log(tempToDoItem);
      push(ref(db, "toDos/"), {
        toDoItem: tempToDoItem,
        checked: false,
      });
    }
    if (tempToDoItem === "") {
      console.log("Nothing");
    }
    addTempToDoItem("");
  };

  return (
    <Container>
      <Paper elevation={3}>
        <div className="toDoCard">
          <AppBar position="fixed">
            <Typography variant="h6">To-do List</Typography>
          </AppBar>
          <Typography color="textSecondary">In progress</Typography>
          {JSON.stringify(uncheckedToDos)}
          <Divider variant="middle" />
          <Typography color="textSecondary">Completed</Typography>
          {JSON.stringify(checkedToDos)}
          <Divider variant="middle" />
          <Typography color="textSecondary">New Item</Typography>
          <TextField
            name="toDoItem"
            onChange={onTextChange}
            value={tempToDoItem}
            id="filled-basic"
            label="New item"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(toDoItem);
              }
            }}
          />
        </div>
      </Paper>
    </Container>
  );
}

export default App;
