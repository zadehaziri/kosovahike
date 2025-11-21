import React from 'react'
import ProgressCircle from './ProgressCircle';
import './completedProfile.scss';

const CompletedProfile = ({percentage}) => {
  return (
    <div className='completed-profile'>
        <div className='left-completed'>
            <h4 className='completed-title'>
                Complete your profile
            </h4>
            <p className='completed-desc'>
                Your profile is {percentage}% completed. For a better experience in our website,
                please complete all your profile.
            </p>
        </div>
        <div className='right-completed'>
            <ProgressCircle percentage={percentage} colour={"#43815c"}/>
        </div>
    </div>
  )
}

export default CompletedProfile