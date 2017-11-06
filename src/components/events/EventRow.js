import React, { Component } from 'react'
import {DragSource} from 'react-dnd'
import {getEmptyImage} from 'react-dnd-html5-backend'
import DragPreview from './EventDragPreview'

class EventRow extends Component {
    componentDidMount() {
        this.props.connectPreview(getEmptyImage())
    }

    render() {
        const {style, rowData, connectDragSource, isDragging} = this.props
        return (
            <div style={{...style, opacity: isDragging ? 0.1 : 1}}>
                {connectDragSource(<span><span>{rowData.title}</span>
                <span>{rowData.where}</span>
                <span>{rowData.when}</span></span>)}
            </div>
        )
    }
}

const spec = {
    beginDrag(props) {
        // debugger
        return {
            id: props.rowData.uid,
            DragPreview
        }
    }
}

const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
})

export default DragSource('event', spec, collect)(EventRow)
