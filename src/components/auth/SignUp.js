import React, { Component } from 'react'
import {reduxForm, Field} from 'redux-form'
import emailValidator from 'email-validator'
import ErrorField from '../common/ErrorField'

export class SignUp extends Component {
    static propTypes = {

    };

    render() {
        return (
            <div>
                <h3>Sign Up</h3>
                <form onSubmit = {this.props.handleSubmit}>
                    <Field name = 'email' component = {ErrorField} type = 'text' label = 'email'/>
                    <Field name = 'password' component = {ErrorField} type = 'password' label = 'password'/>
                    <div>
                        <input type = 'submit' disabled={this.props.invalid || this.props.submitting || this.props.pristine}/>
                    </div>
                </form>
            </div>
        )
    }
}

export const validate = ({ email, password }) => {
    const errors = {}

    if (!email) errors.email = 'email is a required field'
    if (!password) errors.password = 'password is a required field'

    if (email && !emailValidator.validate(email)) errors.email = 'invalid email'
    if (password && password.length < 8) errors.password = 'too short'

    return errors
}

export default reduxForm({
    form: 'auth',
    validate
})(SignUp)