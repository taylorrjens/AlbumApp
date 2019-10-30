import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { db, storage } from "./firebase";
import uuid from "node-uuid";

export default function AddPhoto(props) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSavePhoto = () => {
    // save file to firebase storage

    //get the download url

    // save url with title to database

    // close dialog box
    setSaving(true);
    storage
      .ref("photos/" + uuid())
      .put(file)
      .then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
          db.collection("users")
            .doc(props.user.uid)
            .collection("albums")
            .doc(props.album_id)
            .collection("photos")
            .add({ title: title, image: downloadURL })
            .then(() => {
              setTitle("");
              setSaving(false);
              setFile(null);
              props.onClose();
            });
        });
      });
  };

  const handleFile = e => {
    const file = e.target.files[0];
    setFile(file);
    console.log(file);
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add a Photo</DialogTitle>
      <DialogContent>
        <TextField
          label="Photo Title"
          fullWidth
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
        />
        <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
          {file && (
            <Typography style={{ marginRight: 20 }}>{file.name}</Typography>
          )}
          <Button variant="contained" component="label">
            Choose a file
            <input
              style={{ display: "none" }}
              type="file"
              onChange={handleFile}
            />
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <div style={{ position: "relative" }}>
          <Button color="primary" variant="contained" onClick={handleSavePhoto}>
            Save
          </Button>
          {saving && (
            <CircularProgress
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -12,
                marginLeft: -12
              }}
              color="secondary"
              size={24}
            />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}
