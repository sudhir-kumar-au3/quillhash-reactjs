import React from 'react'
import {Line} from 'react-chartjs-2'
function Chart(props) {
    return (
        <Line data = {props.data} options = {props.options} height={600}></Line>
    )
}

export default Chart
