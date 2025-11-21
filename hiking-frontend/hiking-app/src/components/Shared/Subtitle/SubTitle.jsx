import React from 'react';
import './subtitle.scss';

const SubTitle = ({text, beforeLine, afterLine}) => {
    let classname = "";

    if(beforeLine && afterLine) {
        classname = "bothLines"
    }
    else if(beforeLine) {
        classname = "beforeLine"
    }
    else if(afterLine) {
        classname= "afterLine"
    }
  return (
    <div className='sub-title'>
        <span className={classname}>{text}</span>
    </div>
  )
}

export default SubTitle