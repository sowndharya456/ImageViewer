import React, { Component } from 'react';
import './Header.css';
import ReactDOM from 'react-dom';
import SearchIcon from '@material-ui/icons/Search';
//import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { IconButton, InputBase,Menu, MenuItem } from '@material-ui/core';

import Login from '../screens/login/Login';





// const customStyles = {
//     content: {
//         top: '50%',
//         left: '50%',
//         right: 'auto',
//         bottom: 'auto',
//         marginRight: '-50%',
//         transform: 'translate(-50%, -50%)'
//     } 

// }


class Header extends Component {

    constructor() {
        super();

        this.state = {
            searchField: "",
            isAccountModalOpen: false,
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            anchorEl: null,
            open : false
        }
        // [this.anchorEl, this.setAnchorEl] = useState(null);

    }

     handleClose = () => {
        this.setState({
            ...this.state,
            anchorEl : null,
            open : false
        })
      }


      open = () => {
        this.setState({ ...this.state, open: !this.state.open });
      }

    searchFieldChangeHandler = (event) => {
        this.setState({ searchField: event.currentTarget })
    }
    accountDetailsHandler = (event) => {   
        this.setState({ anchorEl: event.currentTarget, open: !this.state.open });

    }

    handleProfile = () => {
        this.props.router_props.history.push("/profile");
    }

    handleLogout = () => {
        sessionStorage.removeItem('access-token');
        this.setState({ loggedIn: false });
        this.props.router_props.history.push("/");
    }

    logoutHandler = () => {
        sessionStorage.removeItem('access-token');
        this.setState({ loggedIn: false });
        ReactDOM.render(<Login />, document.getElementById('root'));
    }

    closeModalHandler = () => {
        this.setState({
            isAccountModalOpen: false
        });
    }
    searchClickHandler = (props) => {
        console.log(this.props);
    }
    render() {
        //const classes= useStyles();
        return (
            <div className='app-header'>
                <div className="logoBox">
                    <span className='app-logo'>Image Viewer</span>
                </div>

                { this.props.loggedin === true ?

                    <div className="headerRight">
                     { this.props.headerDropdown === 'true' ?
                        <div className="searchFieldBox">
                    
                            <InputBase
                                id="standard-adornment-amount"
                                placeholder="Search"
                                startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>} onChange={this.props.onSearchHandler}

                            />
                        </div>: ""
    }

                        <div className="profilePictureBox">

                            {this.props.loggedin === true  ?
                                <div >
                                    <IconButton aria-label="Profile" onClick={this.accountDetailsHandler} ><img className="profile-thumbnail" src={this.props.profile_picture} alt="profilepicture" /></IconButton>
                                </div> : ""}

                            <Menu
                                id="Profile"
                                anchorEl={this.state.anchorEl}
                                keepMounted
                                open={this.state.open}
                                onClose={this.handleClose}>
                                {this.props.headerDropdown === 'true' ?
                                <MenuItem onClick={this.handleProfile}>Profile</MenuItem>
                                : ""
                                }
                                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                             </Menu>

                        </div>
                    </div>
                    : ""}
            </div >

        );
    }
}

export default Header;