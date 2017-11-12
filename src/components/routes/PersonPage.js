import React, { Component } from 'react'
import {connect} from 'react-redux'
import {addPerson, cancelPeopleSync} from '../../ducks/people'
import NewPersonForm from '../people/NewPersonForm'
import PeopleList from '../people/PeopleList'

class PersonPage extends Component {
    static propTypes = {

    };

    componentWillUnmount() {
      this.props.cancelPeopleSync();
    }

    render() {
        return (
            <div>
                <h2>Add new person</h2>
                <NewPersonForm onSubmit={this.props.addPerson}/>
                <PeopleList />
            </div>
        )
    }
}

export default connect(null, {addPerson, cancelPeopleSync})(PersonPage)