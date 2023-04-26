import React from 'react';

const ShowMessagediv = (props) => {

    console.log(props);
  return (
    <>
        <div id="showMessage" className={props.props.className}>{props.props.innerText}</div>
      
    </>
  )
}

export default ShowMessagediv;
