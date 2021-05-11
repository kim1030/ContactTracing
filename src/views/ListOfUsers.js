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
import emailjs from 'emailjs-com';

function getCivilians(){
  const [civilianList, setCivilianList] = React.useState([]);

  React.useEffect(() => {
    firebase
    .firestore()
    .collection('users')
    .onSnapshot((snapshot)=>{
      const civilians = snapshot.docs.map((doc)=>({
        id: doc.id,
        ...doc.data()
      }))
      setCivilianList(civilians);
    })

  }, [])

  return civilianList;
}

const ListOfUsers = () => {
  const [accountSignedIn, setAccountSignedIn] = React.useState(false);

  React.useEffect(()=>{
    firebase.auth().onAuthStateChanged(user => {
      if(user){
          setAccountSignedIn(true);
      }  
    });
  }, []);
  
  function sendEmail(e) {
    e.preventDefault();
    console.log(e.target)

    emailjs.sendForm('service_p35macp', 'template_w7p1eck', e.target, 'user_YHSdXndcblxQC8tJTloNo')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
      e.target.reset();
  }

  const civil = getCivilians()
  console.log(civil)
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Civilian List</Card.Title>
                <p className="card-category">
                  A group of users who is using the app
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th className="border-0">User ID</th>
                      <th className="border-0">Full Name</th>
                      <th className="border-0">Address</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Phone Contact Number</th>
                      <th className="border-0">User Type</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {civil.length !== 0 && accountSignedIn? 
                      civil.map((civilian) =>{
                      if(civilian.user_type==="Civilian"){
                        return(<><tr key={civilian.id}>
                          <td>{civilian.id}</td>
                          <td>{civilian.first_name} {civilian.last_name}</td>
                          <td>{civilian.address} </td>
                          <td>{civilian.email}</td>
                          <td>{civilian.phone_number}</td>
                          <td>{civilian.user_type}</td>
                          <td><form onSubmit={sendEmail}><input style={{display:"none"}} name="user_email" defaultValue={civilian.email}></input><input className="btn btn-primary" type="submit" value="Send" /></form></td>
                          </tr></>);
                      }
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

export default ListOfUsers;
