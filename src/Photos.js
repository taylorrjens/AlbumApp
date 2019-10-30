import React, { useState, useEffect } from "react";
import PhotoCard from "./PhotoCard";
import Button from "@material-ui/core/Button";
import AddPhoto from "./AddPhoto";
import { db, snapshotToArray } from "./firebase";

export default function Photos(props) {
  console.log(props.match.params.album_id);
  const [dialog_open, setDialogOpen] = useState(false);
  const [photos, setPhotos] = useState([
    {
      id: 0,
      title: "Mountain",
      image:
        "https://images.pexels.com/photos/2767557/pexels-photo-2767557.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    },
    {
      id: 1,
      title: "River",
      image:
        "https://images.pexels.com/photos/2739074/pexels-photo-2739074.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    },
    {
      id: 2,
      title: "Land",
      image:
        "https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    }
  ]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(props.user.uid)
      .collection("albums")
      .doc(props.match.params.album_id)
      .collection("photos")
      .onSnapshot(snapshot => {
        const updated_photos = snapshotToArray(snapshot);
        setPhotos(updated_photos);
      });

    return unsubscribe;
  }, [props]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        paddingLeft: 10,
        paddingTop: 10
      }}
    >
      {photos.map(p => {
        return <PhotoCard photo={p} />;
      })}
      <div>
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
          color="secondary"
          variant="contained"
          style={{ marginRight: 10, marginTop: 10 }}
        >
          Add Photo
        </Button>
      </div>
      <AddPhoto
        open={dialog_open}
        onClose={() => {
          setDialogOpen(false);
        }}
        user={props.user}
        album_id={props.match.params.album_id}
      />
    </div>
  );
}
