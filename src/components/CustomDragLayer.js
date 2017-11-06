import React, { Component } from 'react'
import {DragLayer} from 'react-dnd'

const layerStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    pointerEvents: 'none',
    zIndex: 1000
}

class CustomDragLayer extends Component {
    static propTypes = {

    };

    getElement() {
        const {offset, item} = this.props
        const DragPreview = item.DragPreview

        if (!DragPreview || !offset) return null

        const style = {
            transform: `translate(${offset.x}px, ${offset.y}px)`
        }
        return (
            <div style={style}>
                <DragPreview {...item} />
            </div>
        )
    }

    render() {
        const {isDragging} = this.props
        if (!isDragging) return null

        const element = this.getElement()
        if (!element) return null

        return (
            <div style = {layerStyle}>
                {element}
            </div>
        )
    }
}

const collect = (monitor) => ({
    isDragging: monitor.isDragging(),
    offset: monitor.getSourceClientOffset(),
    item: monitor.getItem()
})

export default DragLayer(collect)(CustomDragLayer)