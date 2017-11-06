import React, { Component } from 'react'
import EventsTable from '../events/VirtualizedLazyTable'
import EventsTrash from '../events/EventsTrash'

class EventsPage extends Component {
    static propTypes = {

    };

    render() {
        return (
            <div>
                <EventsTrash />
                <EventsTable />
            </div>
        )
    }
}

export default EventsPage