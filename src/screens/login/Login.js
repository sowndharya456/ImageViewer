import React, { Component } from 'react';
import Header from '../../common/Header';
import Card from '@material-ui/core/Card';
import { CardContent, Typography, FormControl, InputLabel, Input, Button, FormHelperText } from '@material-ui/core';
import './Login.css';
//import ReactDOM from 'react-dom';


class Login extends Component {


    constructor() {
        super();
        this.state = {
            loginusername: '',
            loginpassword: '',
            loginusernamerequired: 'dispNone',
            loginpasswordrequired: 'dispNone',
            loginError: 'dispNone',
            loginSuccess: false
        }
    }


    usernameChangeHandler = event => {
        this.setState({ loginusername: event.target.value })
        this.setState({ loginusernamerequired: 'dispNone' })
        if (event.target.value === '') {
            this.setState({ loginError: 'dispNone' })
        }


    }
    passwordChangeHandler = event => {
        this.setState({ loginpassword: event.target.value })
        this.setState({ loginpasswordrequired: 'dispNone' })
        if (event.target.value === '') {
            this.setState({ loginError: 'dispNone' })
        }

    }
    loginButtonSubmitHandler = () => {
        this.state.loginusername === '' ? this.setState({ loginusernamerequired: 'dispBlock' }) : this.setState({ loginusernamerequired: 'dispNone' })

        this.state.loginpassword === '' ? this.setState({ loginpasswordrequired: 'dispBlock' }) : this.setState({ loginpasswordrequired: 'dispNone' })

        if (this.state.loginpassword !== 'dispBlock') {
            if (this.state.loginusername === "upgrad" && this.state.loginpassword === "upgrad") {
                this.setState({ loginError: 'dispNone' });
                sessionStorage.setItem("access-token", "8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784");
                this.props.history.push('/home');
            }
            if (this.state.loginusername !== '' && this.state.loginpassword !== '') {
                this.setState({ loginError: 'dispBlock' })
            }
        }

    }
    render() {

        return (
            <div>
                <Header></Header>
                <div className="loginblock">
                    <Card>
                        <CardContent>
                            <Typography variant="h5" >LOGIN</Typography>
                            <FormControl required >
                                <InputLabel htmlFor='login-username'>Username</InputLabel>
                                <Input id='login-username' type='text' onChange={this.usernameChangeHandler}></Input>
                            </FormControl>
                            <FormHelperText className={this.state.loginusernamerequired}>
                                <span className='red'>required</span>

                            </FormHelperText>
                            <br />
                            <FormControl required>
                                <InputLabel htmlFor='loginpassword'>Password</InputLabel>
                                <Input id='loginpassword' type='password' onChange={this.passwordChangeHandler} ></Input>
                                <FormHelperText className={this.state.loginpasswordrequired}>
                                    <span className='red'>required</span>

                                </FormHelperText>
                            </FormControl>
                            <br />
                            <FormControl>
                                <FormHelperText className={this.state.loginError} >
                                    <span className='red'> Incorrect username and/or password</span>
                                </FormHelperText>
                                <br />

                                <Button variant="contained" color="primary" onClick={this.loginButtonSubmitHandler}>LOGIN</Button>
                            </FormControl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Login;