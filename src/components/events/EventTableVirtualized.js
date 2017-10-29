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
  fetchEventsTotal,
  totalSelector,
  lastUidSelector,
} from '../../ducks/events';
import Loader from '../common/Loader';
import 'react-virtualized/styles.css';

let firstRun = true
let _startIndex
let _stopIndex

class EventTableVirtualized extends Component {
  static propTypes = {};
  componentDidMount() {
    this.props.fetchEventsTotal();
    console.log('---', 'load events');
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.lastUid && nextProps.lastUid) {
      this.props.fetchAllEvents()
    }
  }

  isRowLoaded = ({index}) => {
    return !!this.props.events[index]
  }

  loadMoreRows = ({startIndex, stopIndex}) => {
    if (firstRun) {
      firstRun = false
      return Promise.resolve()
    }
    if (startIndex === _startIndex && _stopIndex === stopIndex) {
      return Promise.resolve()
    }
    _startIndex = startIndex
    _stopIndex = stopIndex

    return new Promise((resolve, reject) => {
      this.props.fetchAllEvents({
        resolve,
        startIndex,
        stopIndex,
      });
    })
  }

  render() {
    if (this.props.loading) return <Loader />;
    if (this.props.events.length === 0) {
        return null
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={this.props.total}
      >
        {({ onRowsRendered, registerChild }) => (<Table
          height={500}
          width={600}
          rowHeight={40}
          rowHeaderHeight={40}
          rowGetter={this.rowGetter}
          onRowsRendered={onRowsRendered}
          ref={registerChild}
          rowCount={this.props.total}
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
    total: totalSelector(state),
    lastUid: lastUidSelector(state),
  }),
  { fetchAllEvents, selectEvent, fetchEventsTotal }
)(EventTableVirtualized);
