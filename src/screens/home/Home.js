import React, { Component } from 'react';
import Header from '../../common/Header';
import { Card, CardHeader, Button, CardContent, Avatar, CardActions, Typography, IconButton, FormControl, InputLabel, Input } from '@material-ui/core';
import './Home.css';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
class Home extends Component {

    constructor() {
        super();
        this.state = {
            userDetails: [],
            filteredDetails: [],
            profile_picture: "",
            comments: [],
            addedComment: "",
            loggedin: sessionStorage.getItem('access-token') !== null ? true : false


        }
        this.updatedUserDetails = [];
    }


    componentDidMount() {
        let redirect = this.props.location.pathname;
        if (!sessionStorage.getItem('access-token')) {
            this.props.history.push(`/?redirect=${redirect}`);
            return;
        }

        let xhrReq = new XMLHttpRequest();
        let userData = null;
        let that = this;


        xhrReq.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText);
                response.data = response.data.map(user => {
                    user.newComments = [];
                    user.currentComment = "";
                    user.toggleLikeButton = false;
                    return user;
                })
                that.setState({
                    userDetails: response.data,
                    filteredDetails: response.data,
                    profile_picture: response.data[0].user.profile_picture
                });
                sessionStorage.setItem('userDetails', JSON.stringify(that.state.userDetails));
            }
        })

        xhrReq.open("GET", this.props.baseUrl + "/media/recent?access_token=" + sessionStorage.getItem("access-token"));
        //xhrReq.setRequestHeader("Cache-Control", "no-cache");
        xhrReq.send(userData);


    }

    likeButtonClickedHandler = (user) => {

        let likes = user.likes.count;
        let toggleLikeButton = user.user_has_liked;
        user.user_has_liked = !toggleLikeButton;

        if (user.user_has_liked === true) {
            user.likes.count = likes + 1;
        }
        else {
            user.likes.count = likes - 1;
        }

        this.updatedUserDetails = this.state.filteredDetails.map(tempUser => {
            if (tempUser.id === user.id) {
                return user;
            }
            return tempUser;
        });
        this.setState({ userDetails: this.updatedUserDetails });
    }

    addCommentHandler = (user) => {
        user.newComments.push(this.state.addedComment);
        let updatedUserDetails = this.state.filteredDetails.map(tempUser => {
            if (tempUser.id === user.id) {
                return user;
            }
            return tempUser;
        });
        this.setState({
            filteredDetails: updatedUserDetails,
            addedComment: ""
        });

    }

    addCommentToStateHandler = (event, user) => {
        this.setState({
            addedComment: event.target.value
        })
    }

    onSearchHandler = (event) => {

        let filteredUserDetails = this.state.userDetails;
        filteredUserDetails = filteredUserDetails.filter(user => {
            let caption = user.caption.text.split('#')[0];
            return caption.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0
        })
        this.setState(
            {
                filteredDetails: filteredUserDetails
            }
        );
    }
    render() {

        return (
            <div >
                <Header onSearchHandler={this.onSearchHandler} loggedin={this.state.loggedin} headerDropdown='true' router_props={this.props} profile_picture={this.state.profile_picture} userDetails={this.state.userDetails} />
                <div className='UserDetailsGrid'>

                    {this.state.filteredDetails.map(user => (

                        <Card className="ImageCard" key={user.id}>

                            <CardHeader
                                avatar={
                                    <Avatar aria-label="profile" >
                                        <img className="profile-thumbnail" src={this.state.profile_picture} alt="profilepicture" />
                                    </Avatar>
                                } title={user.user.username}
                                subheader={(user.created_time)} />
                            <CardContent><Typography component='p'><img className="imagesUser" src={user.images.standard_resolution.url} alt='' /></Typography>
                                <Typography component='p'>{user.caption.text.split('#')[0]}</Typography>
                                <Typography ><span className="tagClass">
                                    {user.tags.map(tag => (
                                        <span key={user.id + tag}>{"#" + tag}</span>
                                    ))}</span></Typography></CardContent>
                            <CardActions>
                                <IconButton onClick={() => this.likeButtonClickedHandler(user)}>{user.user_has_liked === true ? <FavoriteIcon className="red" /> : <FavoriteBorderIcon />}</IconButton>
                                <Typography>{user.likes.count + " likes"}</Typography>
                            </CardActions>
                            <FormControl>
                                <InputLabel htmlFor={"addComment" + user.id}>Add a comment</InputLabel>
                                <Input type='text' className="addComment" id={'addComment' + user.id} value={this.state.addedComment}
                                    onChange={(e) => this.addCommentToStateHandler(e, user)} ></Input>
                            </FormControl>
                            <FormControl>
                                <Button variant="contained" color="primary" onClick={() => this.addCommentHandler(user)}>ADD</Button>
                            </FormControl>

                            {user.newComments.map(comment => (
                                <CardContent key={'comment' + user.id + comment}>
                                    <Typography ><b>{user.user.username}</b>:{" " + comment}</Typography>
                                </CardContent>
                            ))}
                        </Card>
                    ))}
                </div>
            </div>
        )
    }
}

export default Home;