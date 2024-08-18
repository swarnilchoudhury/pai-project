import React from 'react';

const ShowMessagediv = (props) => {

  let className = props.props.className;
  let role = props.props.role;
  let innerText = props.props.innerText;

  return (
    <>
      <div id="showMessage" className={className} role={role}>{innerText}</div>
    </>
  )
}

export default ShowMessagediv;


