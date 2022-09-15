import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'
import './Loader.css'

const Loader = (props) => {
  return (
    <div className='loader-div'>
      <ThreeCircles
          height={props.height}
          width={props.width}
          color={props.color ? props.color : "#00BFFF"}
          wrapperStyle={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          wrapperClass=""
          visible={true}
          ariaLabel="three-circles-rotating"
          outerCircleColor=""
          innerCircleColor=""
          middleCircleColor=""
      />
    </div>
  )
}

export default Loader