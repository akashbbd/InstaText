import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const { modalStyle } = useState(getModalStyle);

  const [posts, setPosts] = useState([]);

  const [open, setOpen] = useState(false);

  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //User logged in
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {

        } else {
          // If we just created someone
          return authUser.updateProfile({
            displayName: username,

          });
        }


      } else {
        //User has logged out...
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup functions
      unsubscribe();
    }

  }, [user, username]);

  // {
  //   username: "akku", 
  //   caption: "wow it works", 
  //   imageUrl: "https://i.pinimg.com/736x/34/a7/10/34a71029b6f584cdb82bcc3c60787087.jpg",
  // },

  // {
  //   username: "poo", 
  //   caption: "positive vibes", 
  //   imageUrl: "https://filmfare.wwmindia.com/content/2020/apr/jacqueline-fernandez-netflix-film-mrs-serial-killer-11586948411.jpg",

  // }



  //   //useEffect runs a piece of code on a specific conditions

  useEffect(() => {
    // This is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a new post is added, this code fires up
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);


  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
    setOpen(false);

  }
  console.log(posts);


  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setOpenSignIn(false);
  }

  return (
    <div className="App">




      <Modal
        open={open}
        onClose={() => setOpen(false)} >

        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.tp-lj.si/imagine_cache/og/uploads/instatext.jpg"
                alt="" />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>Sign Up</Button>


          </form>



        </div>
      </Modal>



      {/* Login */}


      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)} >

        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.tp-lj.si/imagine_cache/og/uploads/instatext.jpg"
                alt="" />
            </center>


            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>Sign In</Button>


          </form>



        </div>
      </Modal>


      {/* Login above box */}

      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.tp-lj.si/imagine_cache/og/uploads/instatext.jpg"
          alt="" />


        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (

          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>

        )}
      </div>

      <div className="app_Posts">
        <div className="app_postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))

          }
        </div>
        <div className="app_postsRight">
        <InstagramEmbed
        url='https://www.instagram.com/p/CJnX5clhelmYUE_Y0tsZhwbKSQrFRPFbdF7u9w0/'
        clientAccessToken={123|456}
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => { }}
        onSuccess={() => { }}
        onAfterRender={() => { }}
        onFailure={() => { }}
      />
      </div>
      </div>
      

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to Log In</h3>
      )}

    </div>
  );
}

export default App;
