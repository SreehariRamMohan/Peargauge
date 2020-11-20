import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

function CardToggle({ children, eventKey }) {

    const [hide, setHide] = useState(false)

    const decoratedOnClick = useAccordionToggle(eventKey, () => {
        setHide(!hide)
    });

    return (

        <div onClick={decoratedOnClick}>
            <div>{hide ? "Show" : "Hide"} Results</div>
        </div>

    );
}

export default withRouter(CardToggle);

