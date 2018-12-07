import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Icon, Button, Layout, Menu, Card } from 'antd';


export default class Pay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        iFrameHeight: '0px'
    }
}
  render() {
    return (
        <iframe style={{border:0,width:"100%",height:630,}} src={this.props.payurl}/>
    );
  }
}
