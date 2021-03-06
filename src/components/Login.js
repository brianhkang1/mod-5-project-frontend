import React from 'react'
import {Segment, Form, Button} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { signInUser } from '../redux/actions/signInUser'

const BASE_URL = `http://localhost:3000`

class Login extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
      username: "",
      password: ""
    }
  }

  handleChange = (event, data) => {
    this.setState({
      [event.target.name]: data.value
    })
  }

  handleSubmit = (event, routerProps) => {
    event.preventDefault()
    let body = {
      user: {
        username: this.state.username,
        password: this.state.password
      }
    }

    fetch(`${BASE_URL}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
      .then(json => { //check if successfully logged in or not
        if(json.message === "Invalid username or password"){
          alert(json.message)
        } else {
          localStorage.setItem("token", json.jwt) //if logged in successfully, set token and transition to index trips page
          this.props.signInUser(json.user)
          routerProps.history.push('/search_trips')
        }
      })
    }

  render(){
    return(
      <div id="login-page">
      <Segment id="login-form">
        <Form size='large' onSubmit={(event) => this.handleSubmit(event, this.props.router)}>
          <Form.Input required fluid icon='user' iconPosition='left' name="username" placeholder='username' onChange={this.handleChange} />
          <Form.Input required fluid icon='lock' iconPosition='left' name="password" placeholder='password' type='password' onChange={this.handleChange} />
          <Button color="blue" fluid size='large'>Login</Button>
        </Form>
      </Segment>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signInUser: (userInfo) => dispatch(signInUser(userInfo))
  }
}

export default connect(null, mapDispatchToProps)(Login)
