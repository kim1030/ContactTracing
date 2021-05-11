import React, { Component, useState, useEffect } from "react";
import { userInfo } from "os";
import firebase from '../firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import db from '../firebase';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";


export default class Login extends Component {
        state = {
            userName : '',
            isSignIn: false,
            photo : '',
        }

    componentDidMount = async() =>{
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                console.log(user);
                this.setState({isSignIn : true, 
                    username : user.displayName,
                    photo : user.photoURL,
                })
                this.setState({})
                console.log(user.displayName);
                console.log(this.state.username)
            }
            else{
                console.log(user);
                this.defaultState()
            }
            
        });

        console.log(this.state.isSignIn)

       // You want to get the list of documents in the student collection
       const db=firebase.firestore();
       const response = db.collection('visitedPlaces');
       const data=await response.get();
       data.docs.forEach(item=>{
           console.log(item)
       })
    }

    handleLogin = () =>{

        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            }).catch((error) => {
                console.log(error)
        });
    }

    defaultState = () =>{
        this.setState({

            userName : '',
            isSignIn: false,
            photo : '',
        })
    }

    handleLogout = () =>{
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
          this.defaultState();

    }

    render() {
        return (
            <div>
                {!this.state.isSignIn ?
                    <>
                    <h3>Log in</h3>
                          <button onClick={this.handleLogin} className="btn btn-dark btn-lg btn-block">Google</button>
                    </> 
                    :
                    <BrowserRouter>
                    <Switch>
                        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
                        <Redirect from="/" to="/admin/dashboard" />
                    </Switch>
                    </BrowserRouter>
                }
            </div>
        );
    }
}
