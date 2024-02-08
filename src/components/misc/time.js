import React  from 'react';
import Moment from 'react-moment';
 
export default class Time extends React.Component {
    constructor() {
        super();
        this.state = {
            newDate: new Date()
        }
    }
    componentDidMount () {
        setInterval(() => {
            this.setState({
              newDate : new Date().toLocaleString()
            })
          }, 1000)
    }
    render() {
       
        return (
            <Moment interval={30000}>
               {this.state.newDate}
            </Moment>
        );
    }
}