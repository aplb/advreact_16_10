import React from 'react'
import {DropTarget} from 'react-dnd'
import {connect} from 'react-redux'
import {removeEvent} from '../../ducks/events'

const style = {
    width: '150px',
    padding: '15px',
}

const EventsTrash = props => {
    const {event, connectDropTarget, canDrop, hovered} = props;
    const borderColor = canDrop ?
        hovered ?
            'green' :
            'red' :
        'black'

    return connectDropTarget(
        <div style={{...style, border: `1px solid ${borderColor}`}}>Trash</div>
    )
}

const spec = {
    drop(props, monitor) {
        const item = monitor.getItem()
        const {removeEvent} = props
        removeEvent(item.id)
    }
}

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    hovered: monitor.isOver(),
})

export default connect(
    null,
    {removeEvent}
)(
    DropTarget(['event'], spec, collect)(EventsTrash)
)
