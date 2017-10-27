import React, { Component } from 'react';
import { Table, Column, InfiniteLoader } from 'react-virtualized';
import { connect } from 'react-redux';
import {
  fetchAllEvents,
  selectEvent,
  selectedEventsSelector,
  eventListSelector,
  loadedSelector,
  loadingSelector,
} from '../../ducks/events';
import Loader from '../common/Loader';
import 'react-virtualized/styles.css';

class EventTableVirtualized extends Component {
  static propTypes = {};
  componentDidMount() {
    debugger
    this.props.fetchAllEvents();
    console.log('---', 'load events');
  }

  loadMoreRows() {}

  render() {
    if (this.props.loading) return <Loader />;
    if (this.props.events.length === 0) {
        return null
    }
    return (
      <InfiniteLoader
        isRowLoaded={() => {}}
        loadMoreRows={this.props.fetchAllEvents}
        rowCount={50} // TODO: is fake
      >
        {({ onRowsRendered, registerChild }) => (<Table
          height={500}
          width={600}
          rowHeight={40}
          rowHeaderHeight={40}
          rowGetter={this.rowGetter}
          onRowsRendered={onRowsRendered}
          ref={registerChild}
          rowCount={50} // TODO: is fake
          overscanRowCount={0}
          onRowClick={({ rowData }) => this.props.selectEvent(rowData.uid)}
        >
          <Column dataKey="title" width={300} label="title" />
          <Column dataKey="where" width={200} label="where" />
          <Column dataKey="when" width={200} label="when" />
        </Table>)}
      </InfiniteLoader>
    );
  }

  rowGetter = ({ index }) => this.props.events[index];
}

export default connect(
  (state, props) => ({
    events: eventListSelector(state, props),
    loading: loadingSelector(state),
    loaded: loadedSelector(state),
    selected: selectedEventsSelector(state),
  }),
  { fetchAllEvents, selectEvent }
)(EventTableVirtualized);
