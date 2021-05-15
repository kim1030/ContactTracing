import React from "react";
import firebase from "../firebase"
// react-bootstrap components
import {
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function Dashboard() {
  const [accountSignedIn, setAccountSignedIn] = React.useState(false);

  React.useEffect(()=>{
    firebase.auth().onAuthStateChanged(user => {
      if(user){
          setAccountSignedIn(true);
      }
      else{
        setAccountSignedIn(false);
      }  
    });
  }, []);

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
  const civil = getCivilians()

  function countCivilians(){
    var ctr = 0;
    for(var x =0; x < civil.length; x++ ){
      if(civil[x].user_type === "Civilian"){
        ctr = ctr + 1;
      }
    }
    return ctr;
  }

  const civilCount = countCivilians();
  
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
           {accountSignedIn? <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Registered Civilians</p>
                      <Card.Title as="h4">{civilCount}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                <p className="copyright text-center">
                  As of {new Date().getFullYear()}{" "}
                </p>
                </div>
              </Card.Footer>
            </Card>:""}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
