import React  from 'react';
const SignalStrength = (props)=>   {
    return(
        <div className="signals">
            <span className="signal">Signal Strength: {props.signalStrength} <span className={`${props.signalStatus}`}><i class="fa fa-circle " aria-hidden="true"></i></span></span> 
        </div>
    );
}
export default SignalStrength;