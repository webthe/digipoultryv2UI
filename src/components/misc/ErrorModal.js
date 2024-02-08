import React, { useState, useEffect, useCallback} from 'react';
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Modal, Button} from 'react-bootstrap';
const ErrorModal = (props) => {
    let show = props.show;
    
    let icon, iconColor, modaltitle;
   
    function handleChange(){
       props.onChange (false);
    }
    if(props.estatus === true) {
        icon = faTimes;
        iconColor = 'red';
        modaltitle = 'Error in Submission'
    } else {
        icon = faCheck;
        iconColor = 'red';
        modaltitle = 'Success';
    }
    return(
        <div>
            <Modal show={show} onHide = {handleChange}>
                <Modal.Header closeButton>
                    <Modal.Title>
                    <FontAwesomeIcon icon={icon} color={iconColor} />
                        &nbsp;{modaltitle}</Modal.Title>
                </Modal.Header>
                    <Modal.Body>{props.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleChange}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
        
    );
    
}
export default ErrorModal;