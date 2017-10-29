import {all, takeEvery, put, call, select} from 'redux-saga/effects'
import {appName} from '../config'
import {Record, OrderedMap, OrderedSet} from 'immutable'
import firebase from 'firebase'
import {createSelector} from 'reselect'
import {fbToEntities} from './utils'

/**
 * Constants
 * */
export const moduleName = 'events'
const prefix = `${appName}/${moduleName}`

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`
export const FETCH_ALL_START = `${prefix}/FETCH_ALL_START`
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`
export const  FETCH_TOTAL_START = `${prefix}/ FETCH_TOTAL_START`
export const FETCH_TOTAL_REQUEST = `${prefix}/FETCH_TOTAL_REQUEST`
export const FETCH_TOTAL_SUCCESS = `${prefix}/FETCH_TOTAL_SUCCESS`

export const SELECT_EVENT = `${prefix}/SELECT_EVENT`


/**
 * Reducer
 * */
export const ReducerRecord = Record({
    loading: false,
    loaded: false,
    entities: new OrderedMap({}),
    selected: new OrderedSet([]),
    lastUid: null,
    total: 0,
})

export const EventRecord = Record({
    uid: null,
    month: null,
    submissionDeadline: null,
    title: null,
    url: null,
    when: null,
    where: null
})

export default function reducer(state = new ReducerRecord(), action) {
    const {type, payload} = action

    switch (type) {
        case FETCH_ALL_START:
            return state.set('loading', true)

        case FETCH_ALL_SUCCESS:
            debugger
            return state
                .set('loading', false)
                .set('loaded', true)
                .set('entities', fbToEntities(payload, EventRecord))
                .set('lastUid', Object.keys(payload).slice(-1)[0])

        case SELECT_EVENT:
            return state.update('selected', selected => selected.add(payload.uid))
        case FETCH_TOTAL_SUCCESS:
            const keys = Object.keys(payload)
            return state
                .set('total', keys.length)
                .set('lastUid', keys[0])
                .set('loading', false)

        default:
            return state
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName]
export const entitiesSelector = createSelector(stateSelector, state => state.entities)
export const loadingSelector = createSelector(stateSelector, state => state.loading)
export const loadedSelector = createSelector(stateSelector, state => state.loaded)
export const selectionSelector = createSelector(stateSelector, state => state.selected.toArray())
export const eventListSelector = createSelector(entitiesSelector, entities => entities.valueSeq().toArray())
export const selectedEventsSelector = createSelector(entitiesSelector, selectionSelector, (entities, selection) =>
    selection.map(uid => entities.get(uid))
)
export const totalSelector = createSelector(stateSelector, state => state.total)
export const lastUidSelector = createSelector(stateSelector, state => state.lastUid)

/**
 * Action Creators
 * */

export function fetchAllEvents(payload) {
    return {
        type: FETCH_ALL_REQUEST,
        payload,
    }
}

export function fetchEventsTotal() {
    return {
        type: FETCH_TOTAL_REQUEST,
    }
}

export function selectEvent(uid) {
    return {
        type: SELECT_EVENT,
        payload: { uid }
    }
}

/**
 * Sagas
 * */

export function* fetchAllSaga(action) {
    const lastUid = yield select(lastUidSelector)

    const ref = firebase.database().ref('events')
        .orderByKey()
        .limitToFirst(15)
        .startAt(lastUid)

    const {payload} = action;

    yield put({
        type: FETCH_ALL_START
    })

    const snapshot = yield call([ref, ref.once], 'value')

    if(payload && typeof payload.resolve === 'function') {
      payload.resolve();
    }

    yield put({
        type: FETCH_ALL_SUCCESS,
        payload: snapshot.val()
    })
}

export function * fetchTotalSaga() {
    const ref = firebase.database().ref('events')

    yield put({
        type: FETCH_TOTAL_START,
    })

    const snapshot = yield call([ref, ref.once], 'value')

    yield put({
        type: FETCH_TOTAL_SUCCESS,
        payload: snapshot.val()
    })
}

//lazy fetch FB
/*
firebase.database().ref('events')
    .orderByKey()
    .limitToFirst(10)
    .startAt(lastUid)

*/
export function* saga() {
    yield all([
        takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
        takeEvery(FETCH_TOTAL_REQUEST, fetchTotalSaga)
    ])
}