import React from "react";
import firebase from "../firebase"

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

import { AiFillMail } from "react-icons/ai";






const Trace = () => {

  const [userName, setUserName] = React.useState('');
  const [accountSignedIn, setAccountSignedIn] = React.useState(false);
  const [visitedPlace, setVisitedPlace] = React.useState([]);
  const [civilians, setCivilianList] = React.useState([]);

  React.useEffect(async ()=>{

    async function getVisitedPlace(){
      
      await firebase
      .firestore()
      .collection('users')
      .onSnapshot((snapshot)=>{
        console.log(snapshot)
        const civilians = snapshot.docs.map((doc)=>({
          id: doc.id,
          ...doc.data()
        }))
        setCivilianList(civilians);
      })
  
      console.log(civilians);
  
      civilians.map(async(civilis) =>{
        console.log(civilis)
        await firebase
        .firestore()
        .collection('visitedPlaces').doc(civilis.id)
        .onSnapshot((snapshot)=>{
          console.log(snapshot)
          // const visited = snapshot.docs.map((doc)=>({
          //   id: doc.id,
          //   ...doc.data()
          // }))
          // setVisitedPlace(visited);
        })
      })

    return visitedPlace;
  }

  getVisitedPlace();

    firebase.auth().onAuthStateChanged(user => {
      if(user){
          setUserName(user.displayName);
          setAccountSignedIn(true);
      }

    });
  }, []);
  
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">User List</Card.Title>
                <p className="card-category">
                  A group of users who is using the app
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th className="border-0">Location</th>
                      <th className="border-0">Time Visited</th>
                      <th className="border-0">EstablishmentId</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {visitedPlace.length !== 0 && accountSignedIn ? 
                      visitedPlace.map((visitedP) =>{
                      console.log(visitedP)
                      return(<><tr key={visitedP.id}>
                        <td>{visitedP.location}</td>
                        <td>{visitedP.time_visited} </td>
                        <td>{visitedP.establishmentId}</td>
                        <td><AiFillMail/></td>
                        </tr></>);
                    }) : <tr><td colSpan="6">"No records found"</td></tr>
                  }
                   
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Trace;
