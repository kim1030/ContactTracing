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
  Form
} from "react-bootstrap";

import { AiFillMail } from "react-icons/ai";
import NotificationAlert from "react-notification-alert";
import emailjs from 'emailjs-com';

var checkIs = false;

const Trace = () => {

  const [userName, setUserName] = React.useState('');
  const [accountSignedIn, setAccountSignedIn] = React.useState(false);
  const [visitedPlace, setVisitedPlace] = React.useState([]);
  const [civilianList, setCivilianList] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [dateStart, setDateStart] = React.useState(0);
  const [dateEnd, setDateEnd] = React.useState(0);

  const notificationAlertRef = React.useRef(null);
  const notify = (place) => {
    var color = 1;
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            Email has been successfully sent!
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const notifyError = (place) => {
    var color = 1;
    var type;
    switch (color) {
      case 1:
        type = "danger";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            Error : Email has not been successfully sent!
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };


  function sendEmail(e) {
    e.preventDefault();

    emailjs.sendForm('service_p35macp', 'template_w7p1eck', e.target, 'user_YHSdXndcblxQC8tJTloNo')
      .then((result) => {
          console.log(result.text);
          notify("tr");
      }, (error) => {
          console.log(error.text);
          notifyError("tr");
      });
      e.target.reset();
  }

  React.useEffect(async ()=>{

    async function getVisitedPlace(){
      var newDataToReturn =[];
      var obj = {};
      await firebase
        .firestore()
        .collection('visitedPlaces')
        .onSnapshot(async(snapshot)=>{
          const visited = snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
          }))
          visited.map(visitedP =>{
            var newTime = new Date(visitedP.time_visited.seconds * 1000);
            var user_id ={}
            if(civilianList !== null){
              user_id = civilianList.find(x=>x.uid === visitedP.user_id);
            }
        
            obj = {
              user_id : visitedP.user_id,
              time_visited  : newTime.toLocaleString(),
              location : visitedP.location,
              full_name : user_id !== undefined && user_id !==undefined ? user_id.last_name +", " + user_id.first_name : "",
              email : user_id !== undefined ? user_id.email : "",
              time_visited_seconds: visitedP.time_visited.seconds
            }
  
            newDataToReturn.push(obj);
          })
          setVisitedPlace(newDataToReturn);
        })
        
      return visitedPlace;
    } 

    async function getCivilianList(){
      await firebase
      .firestore()
      .collection('users')
      .onSnapshot(async(snapshot)=>{
        const civilians = snapshot.docs.map((doc)=>({
          id: doc.id,
          ...doc.data()
        }))
        await setCivilianList(civilians);
      })

      checkIs= true;
      return civilianList;
    }

  firebase.auth().onAuthStateChanged(user => {
    if(user){
        setUserName(user.displayName);
        setAccountSignedIn(true);
    }
    else{
      setAccountSignedIn(false);
    }

  });
  await getCivilianList();
 
  await getVisitedPlace();
  }, [civilianList]);  


  function setDateEndChanger(val){
    var date = new Date(val);
    var seconds = date.getTime() / 1000; 

    console.log("end",seconds)

    setDateEnd(seconds);
  }

  function setDateStartChanger(val){
    var date = new Date(val);
    var seconds = date.getTime() / 1000; 

    setDateStart(seconds);
    console.log("start",seconds)
  }

  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Trace List</Card.Title>
                <p className="card-category">
                  A track of users who visited establishments
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
              <Form>
                <Row>
                  <Col className="pr-1" md="6">
                    <Form.Group>
                      <label>Search</label>
                      <Form.Control
                        placeholder="Search ..."
                        type="text"
                        onChange={(event)=>{
                          setSearchText(event.target.value);
                        }}
                      ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                  <Col className="pr-1" md="4">
                    <Form.Group>
                      <label>Start Date</label>
                      <Form.Control
                        type="date"
                        onChange={(event)=>{
                          setDateStartChanger(event.target.value);
                          
                        }}
                      ></Form.Control>
                      </Form.Group>
                    </Col>

                    <Col className="pr-1" md="4">
                    <Form.Group>
                      <label>End Date</label>
                      <Form.Control
                        type="date"
                        onChange={(event)=>{
                          setDateEndChanger(event.target.value);
                        }}
                      ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
              </Form> 
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th className="border-0">Civilian</th>
                      <th className="border-0">Time Visited</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Location</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  {visitedPlace.length !== 0 && accountSignedIn ? 
                      visitedPlace.filter((val) =>{
                        var visitedPlace = (val.location?val.location:'').toLowerCase();
                        var visitedEmail = (val.email?val.email:'').toLowerCase();
                        var visitedFullName = (val.full_name? val.full_name: '').toLowerCase();
                        var visitedTime = (val.time_visited ? val.time_visited: '').toLowerCase();
                        var visitedTimeSeconds = (val.time_visited_seconds ? val.time_visited_seconds: '');

                        if(searchText === ""){
                          // console.log("start",dateStart, "end",dateEnd)
                          // console.log(parseInt(dateStart) >= parseInt(visitedTimeSeconds))
                          // console.log(parseInt(dateEnd) <= parseInt(visitedTimeSeconds))
                          return val;
                        
                         
                        }
                        else if(visitedPlace.includes(searchText.toLowerCase()) || visitedEmail.includes(searchText.toLowerCase()) || visitedTime.includes(searchText.toLowerCase()) || visitedFullName.includes(searchText.toLowerCase())){
                          return val;

                        }
                       
                      })
                      .map((visitedP) =>{
                      return(<><tr key={visitedP.id}>
                        <td>{visitedP.full_name}</td>
                        <td>{visitedP.time_visited}</td>
                        <td>{visitedP.email}</td>
                        <td>{visitedP.location}</td>
                        <td><form onSubmit={sendEmail}><input style={{display:"none"}} name="user_email" defaultValue={visitedP.email}></input><input className="btn btn-primary" type="submit" value="Send" /></form></td>
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
