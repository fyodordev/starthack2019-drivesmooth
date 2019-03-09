import React from 'react';
import ReactDOM from 'react-dom';

const HelloWorld = () => {
  return (
    <div className='hello-world'>
      <h1>Hello World</h1>
      <p>Welcome to my world</p>
    </div>
  )
}


ReactDOM.render(<HelloWorld />, document.getElementById('app'));