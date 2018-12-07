import React, { Component } from 'react';
import Header from './header/Haeader'
import Main from './router/Main'
import Footer from './footer/Footer'
class App extends Component {
  render() {
    return (
      <div  className="App" >
        <Header/>
        <Main/>
        <Footer/>
      </div>
    );
  }
}

export default App;

