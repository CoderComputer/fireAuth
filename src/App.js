import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn : false,
    name: '',
    email: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, email, photoURL} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
    })
    .catch(error => {

    })
  }
  const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: '',
        password: '',
        isValid : false,
        error : '',
        existingUser : false
        
      }
      setUser(signedOutUser)
    })
  }

  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  const switchForm = e => {
    const createdUser = {...user};
        createdUser.existingUser = e.target.checked;
        setUser(createdUser);
  }

  const handleChange = e => {
    const newUserInfo = {
      ...user,
    };
    // perform validation

    let isValid = true;

    if(e.target.name === 'email'){
      isValid = is_valid_email(e.target.value)
    }
    if(e.target.name === 'password'){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value)
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(error => {
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = error.message
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();

  }
  // log in user
  const signInUser = event => {
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(error => {
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = error.message
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button>
        : <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && 
        <div>
          <p>Welcome {user.name}</p>
          <p>Your email: {user.email}</p>
          <img style={{width: '50%', borderRadius:'100%'}} src={user.photo} alt=""/>
        </div>
      }
      <h2>Authentication</h2>
      {/* log in form */}
      <input type="checkbox" name="switchForm" id="switchForm" onChange={switchForm}/>
      <label htmlFor="switchForm">Returning User</label>
      <form style={{display: user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
      <input type="text" name="email" onBlur={handleChange} placeholder="Your email" required/>
      <br/>
      <input type="password" name="password" onBlur={handleChange} placeholder="Your password" required/>
      <br/>
      <input type="submit" value="SignIn"/>
      </form>
      {/* sign up form */}
      <form style={{display: user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
      <input type="text" name="name" onBlur={handleChange} placeholder="Your Name" required/>
      <br/>
      <input type="text" name="email" onBlur={handleChange} placeholder="Your email" required/>
      <br/>
      <input type="password" name="password" onBlur={handleChange} placeholder="Your password" required/>
      <br/>
      <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color: 'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
