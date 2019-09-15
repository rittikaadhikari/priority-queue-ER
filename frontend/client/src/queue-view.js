import { Container, Row, Col, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import TinyQueue from 'tinyqueue'
import React from 'react'
export default class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new TinyQueue([], function (a,b) {
                if (a.triage < b.triage) return 1;
                if (a.triage == b.triage) {
                    return a.eta - b.eta;
                }
                return -1;
            })
        }
    }

    // componentDidMount - When the component is mounted.
    componentDidMount() {
        let queue = this.state.data;
        queue.push({name:'Tika',triage:1,eta:3,condition:"wart on butt"})
        queue.push({name:'An',triage:2,eta:7,condition:"broken leg"})
        queue.push({name:'Paneer',triage:2,eta:5,condition:"someone bit me"})
        queue.push({name:'I\'m Ded',triage:1,eta:6,condition:"Already ded"})
        queue.push({name:'Navam',triage:4,eta:1,condition:"Exploded"})
        this.setState({
            data: queue
        })
        return;
        // Retrieve project data from the database.
        fetch('/retrieve-data', {
            credentials: 'include'
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('Error with session response');
            }
        })
        .then((result) => {

            // Put into priority_queue
            let values = this.state.data;
            let i = 0;
            for (i = 0; i < result.length; i++) {
                values.push(result[i]);
            }

            // Set the state of data.
            this.setState({
                data: values
            })
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
    }

    deleteCase = function (value) {
        var array = []
        let queue = this.state.data
        while (queue.length) {
            let curdata = queue.pop();
            if (curdata.name === value.name && curdata.eta == value.eta && curdata.condition == value.condition) {continue;}
            array.push(curdata);
        }
        let queueFormat = new TinyQueue([], function (a,b) {
            if (a.triage < b.triage) return 1;
            if (a.triage == b.triage) {
                return a.eta - b.eta;
            }
            return -1;
        });
        let i = 0;
        for (i = 0; i < array.length; i++) {
            queueFormat.push(array[i]);
        }
        this.setState({data:queueFormat});

    }
    
    render() {
        var array = [];
        let queue = this.state.data
        while (queue.length) array.push(queue.pop());
        let i = 0;
        for (i = 0; i < array.length; i++) {
            queue.push(array[i]);
        }
        return (
            <Container>
                <Row>
                    <Col>Name</Col>
                    <Col>Severity</Col>
                    <Col>Condition</Col>
                    <Col>Eta</Col>
                    <Col></Col>
                </Row>
                {array.map((value, i) => (<Row key={i}>
                <Col>{value.name}</Col>
                <Col>{value.triage}</Col>
                <Col>{value.condition}</Col>
                <Col>{value.eta}</Col>
                <Col><Button onClick={() => {this.deleteCase(value)}}>Delete</Button></Col>
                </Row>))}
            </Container>
        );
    }
}