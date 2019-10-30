import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import { Link, Route } from "react-router-dom";
import { auth, db, snapshotToArray } from "./firebase";
import Photos from "./Photos";
import AddAlbum from "./AddAlbum";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

export function App(props) {
  const [drawer_open, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dialog_open, setDialogOpen] = useState(false);
  const [albums, setAlbums] = useState([
    { id: 0, title: "nature" },
    { id: 1, title: "cities" }
  ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, [props.history]);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("albums")
        .onSnapshot(snapshot => {
          const updated_albums = snapshotToArray(snapshot);
          setAlbums(updated_albums);
        });
    }
  }, [user]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            color="inherit"
            variant="h6"
            style={{ marginLeft: 15, flexGrow: 1 }}
          >
            News
          </Typography>
          <Typography color="inherit" style={{ marginRight: 30 }}>
            Hi {user.email}!
          </Typography>
          <Button onClick={handleSignOut} type={"password"} color="inherit">
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawer_open}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <List component="nav">
          {albums.map(a => {
            return (
              <ListItem
                button
                to={"/app/album/" + a.id + "/"}
                component={Link}
                onClick={() => {
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={a.name} />
              </ListItem>
            );
          })}
          <ListItem
            button
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            <ListItemText primary="Create New Album" />
          </ListItem>
        </List>
      </Drawer>
      <AddAlbum
        user={user}
        open={dialog_open}
        onClose={() => {
          setDialogOpen(false);
        }}
      />
      <Route
        path="/app/album/:album_id/"
        render={routeProps => {
          return <Photos user={user} {...routeProps} />;
        }}
      />
    </div>
  );
}
