import React from "react";
import Tilt from 'react-parallax-tilt';
import face from './face-detection.png';
import './Logo.css';

const Logo = () => {
    return(
        <div className="ma4 mt0" style={{ maxHeight: '150px', maxWidth: '150px'}}>
            <Tilt className="Tilt br2 shadow-2 pa3">
                <div>
                    <img alt="logo" src={face} />
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;