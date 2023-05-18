import React from 'react'
import Football from './Football'
import Tennis from './Tennis'
import Mma from './Mma'

const TabContent = ({sport}) => {

  return (
    sport === 'Football' ? <Football />
    : sport === 'Tennis' ? <Tennis/>
        : <Mma/>
  );
}

export default TabContent