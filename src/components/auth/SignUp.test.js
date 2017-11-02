import React from 'react'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {reducer as form, reduxForm, Field} from 'redux-form'
import {SignUp, validate} from './SignUp'
import ErrorField from '../common/ErrorField'

Enzyme.configure({ adapter: new Adapter()})


const email=  'lala@gmail.com'
const password = '12312312'

describe('SignUp form', () => {
  describe('form render', () => {
    it('should render header and form', () => {
        const wrapper = mount(makeForm())
        expect(wrapper.find('form').length).toEqual(1)
        expect(wrapper.find('h3').text()).toEqual('Sign Up')
    })

    it('should render fields and submit', () => {
        const wrapper = mount(makeForm())
        expect(wrapper.find(Field).length).toEqual(2)
        expect(wrapper.find('input[type="submit"]').length).toEqual(1)
    })

    it('should render email field', () => {
        const wrapper = mount(makeForm())
        const props = wrapper
            .findWhere(n => n.type() === Field && n.props().name === 'email')
            .props()
        expect(props.name).toEqual('email')
        expect(props.type).toEqual('text')
        expect(props.label).toEqual('email')
        expect(props.component).toEqual(ErrorField)
    })

    it('should render password field', () => {
        const wrapper = mount(makeForm())
        const props = wrapper
            .findWhere(n => n.type() === Field && n.props().name === 'password')
            .props()
        expect(props.name).toEqual('password')
        expect(props.type).toEqual('password')
        expect(props.label).toEqual('password')
        expect(props.component).toEqual(ErrorField)
    })
  })

  describe('form props', () => {
    it('submit should be disabled by default', () => {
        const wrapper = mount(makeForm())
        expect(wrapper.find('input[type="submit"]').props().disabled).toBe(true)
    })

    it('submit should be called', () => {
        const handleSubmit = jest.fn();
        const wrapper = mount(makeForm({onSubmit: handleSubmit}))
        wrapper.find('form').simulate('submit')
        expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe('form validations', () => {
    it('should pass', () => {
        const errs = validate({
            email,
            password,
        })

        expect(Object.keys(errs).length).toEqual(0)
    })

    it('should not pass when empty email', () => {
        const errs = validate({password})
        expect(errs.email).toEqual('email is a required field')
    })

    it('should not pass when invalid email', () => {
        const errs = validate({email: 'wrong', password})
        expect(errs.email).toEqual('invalid email')
    })

    it('should not pass when empty pwd', () => {
        const errs = validate({email})
        expect(errs.password).toEqual('password is a required field')
    })

    it('should not pass when short pwd', () => {
        const errs = validate({email, password: '1234567'})
        expect(errs.password).toEqual('too short')
    })
  })
})

// helpers

function makeStore() {
  return createStore(
    combineReducers({
      form,
    }),
    {}, // state
  )
}

function makeForm(props = {}, config = {}) {
  const Decorated = reduxForm({form: 'auth', ...config})(SignUp)
  return (
    <Provider store={makeStore()}>
        <Decorated {...props} />
    </Provider>
  )
}
