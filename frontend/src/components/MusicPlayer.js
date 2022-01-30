import React, { Component } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

export default class MusicPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        song: {},
        HostProfile: {}
    }

    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.getUserProfile  = this.getUserProfile.bind(this)
  }

  getUserProfile = async() => {
    const response = await fetch('/spotify/user');
    const data = await response.json();
    this.setState({HostProfile: data});
  }

  skipSong() {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    }
    fetch('/spotify/skip', requestOptions)  
}

  pauseSong() {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'}
    }
    fetch('/spotify/pause', requestOptions)
}

playSong() {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'}
    }
    fetch('/spotify/play', requestOptions)
}
  
  
  // getCurrentSong() {
  //   fetch("/spotify/current-song")
  //     .then((response) => {
  //       if (!response.ok) {
  //         return {};
  //       } else {
  //         return response.json();
  //       }
  //     })
  //     .then((data) => {
  //       this.setState({ song: data });
  //     });
  // }

getCurrentSong = async () => {
  const response = await fetch("/spotify/current-song");
  const data = await response.json();
  this.setState({ song: data });
}

  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 500);
    this.getUserProfile()
  }

  render() {
    const songProgress = (this.state.song.time / this.state.song.duration) * 100;

    return (
         <div className="MusicPlayer">
         <Grid item xs={12} align="center" className="Host">
              <img src={this.state.HostProfile.pfp}/>
              <Typography>{this.state.HostProfile.name}'s room</Typography>
          </Grid>
    <Card style={{backgroundColor: "blue"}} className='Card'>
        <Grid container alignItems="center">
          <Grid item align="center" xs={8}>
            <img src={this.state.song.image_url} height="100%" width="100%" />
          </Grid>
          <Grid item align="center" xs={4}>
            <Typography component="h5" variant="h5">
              {this.state.song.title}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1" align='center'>
              {this.state.song.artist}
            </Typography>
            <div>
              <IconButton onClick={() => {this.state.song.is_playing ? this.pauseSong(): this.playSong()}}>
                {this.state.song.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton onClick={() => this.skipSong()}>
                <SkipNextIcon /> {this.state.song.votes} / {this.state.song.votes_required}
              </IconButton>
            </div>
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={songProgress} className='LinearProgress' />
      </Card>
      </div>
    );
  }
}