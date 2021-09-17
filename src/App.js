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
  FormGroup,
} from "@material-ui/core";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  child,
  get,
  update,
} from "firebase/database";
import firebase from "./firebase";

function App() {
  //Declare states
  const [toDoObject, updateToDoObject] = useState({});
  const [toDoArray, addtoToDoArray] = useState([]);
  const [tempToDoItem, addTempToDoItem] = useState("");
  const [toDoItem, addToDoItem] = useState("");
  const [checkedToDos, getCheckedToDos] = useState([]);
  const [uncheckedToDos, getUncheckedToDos] = useState([]);
  const [currentItemStat, setCurrentItemStat] = useState();

  //Get database and ref
  const db = getDatabase();
  const toDoRef = ref(db, "toDos/");

  //Populate array with current to do list and update when list is updated
  useEffect(() => {
    onValue(toDoRef, (snapshot) => {
      clearArrays();
      const data = snapshot.val();
      console.log(data);
      updateToDoObject(data);
    });
  }, []);

  useEffect(() => {
    console.log(toDoObject);
    console.log(uncheckedToDos);
  }, [toDoObject]);

  //Clear out data for rerender
  const clearArrays = () => {
    addtoToDoArray([]);
    getCheckedToDos([]);
    getUncheckedToDos([]);
  };

  //Check for (un)checked items
  useEffect(() => {
    Object.values(toDoObject).forEach((toDos) => {
      if (toDos.checked === true) {
        console.log(toDos.constructor.name);
        getCheckedToDos((checkedToDos) => checkedToDos.concat(toDos));
      } else if (toDos.checked === false) {
        console.log(toDos);
        getUncheckedToDos((uncheckedToDos) => uncheckedToDos.concat(toDos));
      }
    });
  }, [toDoObject]);

  useEffect(() => {
    console.log(uncheckedToDos);
    uncheckedToDos.forEach((item) => {
      console.log(item);
    });
  }, [uncheckedToDos]);

  const onTextChange = (e) => addTempToDoItem(e.target.value);

  //Push new todo when user presses enter
  const handleSubmit = () => {
    if (tempToDoItem !== "") {
      const key = push(child(ref(db), "posts")).key;

      set(ref(db, "toDos/" + key), {
        toDoItem: tempToDoItem,
        checked: false,
        key: key,
      });
    }
    if (tempToDoItem === "") {
      console.log("Nothing");
    }
    addTempToDoItem("");
  };

  const handleChange = (param) => () => {
    console.log(param);
    update(ref(db, "toDos/" + param.key), {
      checked: !param.checked,
    });
  };

  return (
    <Container>
      <Paper elevation={3}>
        <div className="toDoCard">
          <AppBar position="fixed">
            <Typography variant="h6">To-do List</Typography>
          </AppBar>
          <Typography color="textSecondary">In progress</Typography>
          <FormGroup>
            {uncheckedToDos.map((item) => (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      checked={item.checked}
                      onChange={handleChange(item)}
                    />
                  }
                  label={item.toDoItem}
                />
              </>
            ))}
          </FormGroup>
          {/* {JSON.stringify(uncheckedToDos)} */}
          <Divider variant="middle" />
          <Typography color="textSecondary">Completed</Typography>
          <FormGroup>
            {checkedToDos.map((item) => (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      checked={item.checked}
                      onChange={handleChange(item)}
                    />
                  }
                  label={item.toDoItem}
                />
              </>
            ))}
          </FormGroup>
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
