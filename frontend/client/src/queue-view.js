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
                if (a.triage === b.triage) {
                    return a.eta - b.eta;
                }
                return -1;
            })
        }
    }

    // componentDidMount - When the component is mounted.
    componentDidMount() {
        // Retrieve project data from the database.
        fetch('http://localhost:3001/get_all')
        .then((response) => {
            console.log(response)
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
            if (curdata.name === value.name && curdata.eta === value.eta && curdata.condition === value.condition) {continue;}
            array.push(curdata);
        }
        let queueFormat = new TinyQueue([], function (a,b) {
            if (a.triage < b.triage) return 1;
            if (a.triage === b.triage) {
                return a.eta - b.eta;
            }
            return -1;
        });
        let i = 0;
        for (i = 0; i < array.length; i++) {
            queueFormat.push(array[i]);
        }
        this.setState({data:queueFormat});const formData = new FormData();
        // formData.append('patient_uuid', value.patient_uuid);
        // fetch('http://localhost:3001/delete_row', {
        //     method: 'delete',
        //     body: formData,
          
        //     headers: {
        //       'Accept': 'application/json'
        //     },
        //     credentials: 'same-origin', // send cookies
        //     credentials: 'include',     // send cookies, even in CORS
        //   })
        // .then((response) => {
        //     console.log(response)
        //     if (response.ok) {
        //         return response.json();
        //     } else {
        //         console.log('Error with session response');
        //     }
        // })
        // .then((result) => {
        //     console.log('Result: ', result)
        // })
        // .catch((error) => {
        //     console.log('Error: ', error);
        // });
}
    
    render() {
        var array = [];
        let queue = this.state.data
        console.log(queue);
        while (queue.length) array.push(queue.pop());
        let i = 0;
        for (i = 0; i < array.length; i++) {
            queue.push(array[i]);
        }
        return (
            <Container>
                <Row><h1>Hospital View</h1></Row>
                <Row>
                    <Col>Name</Col>
                    <Col>Medical UUID</Col>
                    <Col>Severity</Col>
                    <Col>Condition</Col>
                    <Col>Eta</Col>
                    <Col></Col>
                </Row>
                {array.map((value, i) => (<Row key={i}>
                    <Col>{value.name}</Col>
                    <Col>{value.health_insurance_no}</Col>
                <Col>{value.severity}</Col>
                <Col>{value.condition_}</Col>
                <Col>{value.eta}</Col>
                <Col><Button onClick={() => {this.deleteCase(value)}}>Delete</Button></Col>
                </Row>))}
            </Container>
        );
    }
}