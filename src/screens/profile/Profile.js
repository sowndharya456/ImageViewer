import React, { Component } from 'react';
import Header from '../../common/Header';
import { IconButton, Typography, Button, Modal, FormControl, InputLabel, Input, Card, CardHeader, CardContent, FormHelperText, GridList, GridListTile } from '@material-ui/core';
import "./Profile.css";
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

const styles = theme => ({
    paper: {
        position: 'absolute',
        
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        // padding: theme.spacing(2, 4, 3)
        top: '30%',
        left: '30%',
        transform: 'translate(' - 50 % ' , ' - 50 % ')',
        width: '303px',
        height:'235px'
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: '75%',
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    modalImage: {
        position: 'absolute',

        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        // padding: theme.spacing(2, 4, 3)

        //transform: 'translate(' - 50 % ' , ' - 50 % ')',
        top: '19%',
        left: '12%',
        width: '74%'
    }
});





class Profile extends Component {

    constructor() {
        super();
        this.state = {
            user: {},
            userCounts: {},
            isopenModal: false,
            editFullname: "",
            userDetails: [],
            editbuttonenabled: 'dispNone',
            isopenImageModal: false,
            currentUser: {},
            addedComment: "",
            loggedin: sessionStorage.getItem('access-token') !==null ? true : false
        }
        this.body = {};
    }

    componentDidMount() {
        let redirect = this.props.location.pathname;
        if ( !sessionStorage.getItem('access-token')) {
            this.props.history.push(`/?redirect=${redirect}`);
            return;
        }    
        let xhr = new XMLHttpRequest();
        let data = null;
        let that = this;

        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText);


                response.data.newComments = [];
                response.data.currentComment = "";
                response.data.toggleLikeButton = false;



                that.setState({
                    user: response.data,
                    userCounts: response.data.counts,
                    userDetails: JSON.parse(sessionStorage.getItem('userDetails'))
                })
            }

        });
        xhr.open("GET", this.props.baseUrl + "?access_token=" + sessionStorage.getItem("access-token"));
        xhr.send(data);
    }

    editButtonHandler = () => {
        this.state.editFullname === "" ? this.setState({ editbuttonenabled: 'dispBlock' }) : this.setState({ editbuttonenabled: 'dispNone' })

    }


    handleOpenHandler = () => {

        this.setState({ isopenModal: true });
    }

    handleCloseHandler = () => {
        this.setState({ isopenModal: false });
    }

    editFullnameHandler = (event) => {
        this.setState({
            editFullname: event.target.value
        })
        if (this.state.editFullname !== '') {
            this.setState({ editbuttonenabled: false })
        }
    }

    imageModalOpenHandler = (userProfile) => {

        let userarr = this.state.userDetails.filter(user => {
            return user.id === userProfile.id;
        });
        userProfile = userarr[0];
        console.log(userProfile);

        this.setState(
            {
                currentUser: userProfile,
                isopenImageModal: true
            });


    }
    likeButtonClickedHandler = (user) => {
        console.log("inside like handler");
        let likes = user.likes.count;
        let toggleLikeButton = user.user_has_liked;
        user.user_has_liked = !toggleLikeButton;
        console.log(user);
        if (user.user_has_liked === true) {
            user.likes.count = likes + 1;
        }
        else {
            user.likes.count = likes - 1;
        }
        console.log(user.likes);
        this.updatedUserDetails = this.state.userDetails.map(tempUser => {
            if (tempUser.id === user.id) {
                return user;
            }
            return tempUser;
        });
        this.setState({ userDetails: this.updatedUserDetails });
    }

    addCommentHandler = (user) => {
        user.newComments.push(this.state.addedComment);
        let updatedUserDetails = this.state.userDetails.map(tempUser => {
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

    closeImageModalHandler = () => {
        this.setState({
            isopenImageModal: false
        })
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header profile_picture={this.state.user.profile_picture} loggedin={this.state.loggedin} headerDropdown='false' router_props={this.props} />
                <div className="ProfileHeader">
                    <div className="headercenter">
                    <div className="HeaderLeft">
                        <IconButton aria-label="Profile" ><img className="profile-thumbnail" src={this.state.user.profile_picture} alt="profilepicture" /></IconButton>

                    </div>
                    <div className="HeaderRight">
                        <div className='top'>
                            {this.state.user.username}
                        </div>
                        <br />
                        <div className='middle'>
                            <div>
                                <Typography>Posts:{this.state.userCounts.media}</Typography>
                            </div>
                            <br />
                            <div>
                                <Typography>Follows:{this.state.userCounts.follows}</Typography>
                            </div>
                            <br />
                            <div>
                                <Typography>Followed By:{this.state.userCounts.followed_by}</Typography>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="username-paddding"><Typography>{this.state.user.full_name}</Typography></div>

                            {/* <Button variant="Fab" color="secondary" onClick={this.handleOpenHandler} ><EditIcon /></Button> */}
                            <Fab size="small" color="secondary" onClick={this.handleOpenHandler} aria-label="edit">
                                <EditIcon  fontSize="small" />
                            </Fab>
                            <Modal
                                open={this.state.isopenModal}
                                onClose={this.handleCloseHandler}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                                <div className={classes.paper}>
                                    <Card className="editCard">
                                       
                                        <CardContent>
                                        <Typography variant='h4'>Edit</Typography>
                                        <br></br><br></br>
                                            <FormControl id="editButtonText" required>
                                                <InputLabel htmlFor='editableFullname'>Full Name</InputLabel>
                                                <Input id="editableFullname" type="text" onChange={this.editFullnameHandler}></Input>
                                                <FormHelperText className={this.state.editbuttonenabled}><span className='red'>required</span></FormHelperText>
                                            </FormControl>
                                            <br></br><br></br><br></br>
                                            <FormControl>
                                                <Button variant="contained" color="primary" onClick={this.editButtonHandler}>UPDATE</Button>
                                            </FormControl>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Modal>
                        </div>
                    </div>
</div>
                </div>
                <div className={classes.root}>
                    <div className="imageGridClass">
                    <GridList cellHeight={200} cols={2} className={classes.gridList}>
                        {this.state.userDetails.map(userProfile =>
                            <GridListTile rows={2} key={userProfile.id}   >
                                <img src={userProfile.images.standard_resolution.url} alt='' onClick={() => this.imageModalOpenHandler(userProfile)} />

                            </GridListTile>

                        )}

                    </GridList>
                    </div>
                    <div>
                        <Modal open={this.state.isopenImageModal} onClose={this.closeImageModalHandler} aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description">

                            <div className={classes.modalImage} >
                                <Card>
                                    {
                                        this.state.currentUser.user !== undefined &&
                                        <div className="imageModal">

                                            <CardContent>
                                                <div className="leftImageModal">
                                                    <img id="leftImageModalId" src={this.state.currentUser.images.standard_resolution.url} alt='' />
                                                </div>

                                            </CardContent>
                                            <CardContent>

                                                <div className="rightImageModal">

                                                    <div className="blockClass">
                                                        <div className="Commentlogo">
                                                        <img id="leftLogo" src={this.state.currentUser.user.profile_picture} alt="" />
                                                        </div>
                                                        <div className="commentUsername">
                                                        <Typography ><span >{this.state.currentUser.user.username}</span></Typography>
                                                        </div>


                                                    </div>
                                                    <div><hr className="new4" />
                                                        <Typography><span >{this.state.currentUser.caption.text.split('#')[0]}</span></Typography>
                                                        <Typography>
                                                            {this.state.currentUser.tags.map(tag =>(
                                                            <span key={this.state.currentUser.id + tag}>{"#"+tag}</span>
                                                            ))}</Typography>
                                                    </div>

                                                    <div >
                                                         <div className="addcommentBox">
                                                        {this.state.currentUser.newComments.map(comment => (
                                                            <CardContent key={'comment' + this.state.currentUser.id + comment}>
                                                                <Typography ><b>{this.state.currentUser.user.username}</b>:{" " + comment}</Typography>
                                                            </CardContent>
                                                        ))}
                                                        </div>
                                                        <div>
                                                        <IconButton onClick={() => this.likeButtonClickedHandler(this.state.currentUser)}>{this.state.currentUser.user_has_liked === true ? <FavoriteIcon className="red" /> : <FavoriteBorderIcon />}</IconButton>
                                                        <span>{this.state.currentUser.likes.count + " likes"}</span>
                                                        <br />
                                                        <FormControl className="commentBox">
                                                            <InputLabel htmlFor={"addComment" + this.state.currentUser.id}>Add a comment</InputLabel>
                                                            <Input type='text' id={'addComment' + this.state.currentUser.id} value={this.state.addedComment}
                                                                onChange={(e) => this.addCommentToStateHandler(e, this.state.currentUser)} ></Input>
                                                        </FormControl>
                                                        
             
                                                            <Button variant="contained" color="primary" onClick={() => this.addCommentHandler(this.state.currentUser)}>ADD</Button>
                                                        
                                                        </div>

                                                    </div>

                                                </div>
                                            </CardContent>

                                        </div>

                                    }

                                </Card>

                            </div>
                        </Modal>

                    </div>

                </div>


            </div>
        );
    }
}

export default withStyles(styles)(Profile);