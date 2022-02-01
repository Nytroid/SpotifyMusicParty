import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom"
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export default class CreateRoomPage extends Component { 
        static defaultProps = {
            votesToSkip: 2,
            guestCanPause: true,
            update: false,
            roomCode: null,
            updateCallback: () => {},
        };

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip, 
            errorMsg: "",
            successMsg: "",
        }

        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this)
    }
    handleVotesChange = (e) => {
        this.setState({
               votesToSkip: e.target.value
    });
}

    handleGuestCanPauseChange=(e)=>{
        this.setState({
            guestCanPause: e.target.value == "true" ? true : false,
        });
    }

    handleRoomButtonPressed = async() => {
        const requestOptions = { 
            method: 'POST',
            headers: {"Content-Type": 'application/json'}, 
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
                }),
        };
        const response = await fetch('/api/create-room', requestOptions)
        data = await response.json()
        window.location.assign(data.code)
    }
    handleUpdateButtonPressed = async() => {
        const requestOptions = {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            votes_to_skip: this.state.votesToSkip,
            guest_can_pause: this.state.guestCanPause,
            code: this.props.roomCode,
          }),
        };
        const response =  await fetch("/api/update-room", requestOptions)
        if (response.ok) {
            this.setState({
              successMsg: "Room updated successfully!",
            });
          } else {
            this.setState({
              errorMsg: "Error updating room...",
            });
          }}

    renderCreateButton() {
        return(<Grid container spacing={1}>
        <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}>
                    Create Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
            </Grid>
        )}

    renderUpdateButton() {
    return (<Grid item xs={12} align="center">
        <Button color="primary" variant="contained" onClick={this.handleUpdateButtonPressed}>
            Save 
        </Button>
    </Grid> 
    )}

    render() { 
        const title = this.props.update ? "Update Room" : "Create A Room"
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align='center'>
                <Collapse in={this.state.errorMsg != "" || this.state.successMsg != ""}>
                    {this.state.successMsg != "" 
                    ? (<Alert severity="success" onClose={ () => {this.setState({successMsg: ""})}}>
                        {this.state.successMsg}</Alert>) 
                    : (<Alert severity="error" onClose={ () => {this.setState({errorMsg: ""})}}>
                        {this.state.errorMsg}</Alert>)}

                </Collapse>
            </Grid> 
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'> 
                   {title}
                </Typography>
            </Grid> 
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText >
                        <div align="center" className="GuestCanPause" style={{color: 'white'}}>
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestCanPauseChange}>
                        <FormControlLabel value='true' 
                        control={<Radio color="primary"/>}
                        label='Play/Pause'
                        labelPlacement="bottom"/>
                        
                        <FormControlLabel value='false' 
                        control={<Radio color="secondary"/>}
                        label='No Control'
                        labelPlacement="bottom"/>
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField required={true} 
                    className='Votes'
                    type='number' 
                    onChange={this.handleVotesChange}
                    defaultValue={this.state.votesToSkip} 
                    InputLabelProps={{className: "Votes__Label"}}
                    inputProps={{
                        min: 1,
                        style: {textAlign: 'center', color: 'white'}
                    }}
                    />
                    <FormHelperText>
                        <div className = "VotesToSkip" align = "center">
                            Votes Required To Skip Song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {this.props.update ? this.renderUpdateButton() : this.renderCreateButton()}
        </Grid>
        );
        
    }
}
