import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom'
import { Button, duration, Grid, Typography } from '@material-ui/core';
import CreateRoomPage from './CreateRoomPage';
import  MusicPlayer from './MusicPlayer';

function leaveRoom() {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'}, 
  }
  fetch('/api/leave-room', requestOptions).then((_response) => {
    window.location.assign('/');
  });
}


export default function Room(props) {
  
    const initialState = {
      votesToSkip: 2,
      guestCanPause: false, 
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
      song: {}
    }
    const [roomData, setRoomData] = useState(initialState) 
    const { roomCode } = useParams()

    function CloseSettings() {
      setRoomData({
        ...roomData, 
        showSettings: false}); 
        window.location.reload(true)     
    }

    function ShowSettings(value) {
      setRoomData({
        ...roomData, 
        showSettings: value,
          
      });
    }


    function renderSettingsButton() {
      return (
        <Grid item xs={12} align='center' className='Settings'>
          <Button variant='contained' color='primary' onClick={() => ShowSettings(true)}>
            Settings
          </Button>
        </Grid>
      )
    }

    function SpotifyLogInButton() {
      return( 
    <Grid item xs={12} align="center" justify="space-between" className='Log-In'>
    <Button color="secondary" variant="text" onClick={authenticateSpotify}>
        Connect Spotify 
    </Button>
</Grid> 
      )}

    function renderSettings() {
      return(
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <CreateRoomPage 
          update={true}  
          votesToSkip={roomData.votesToSkip} 
          guestCanPause={roomData.guestCanPause}
          roomCode={roomCode }
          updateCallback={() => {}}
          />
        </Grid>
        <Grid item xs={12} align='center'>
        <Button variant='contained' color='secondary' onClick={CloseSettings}>
            Close Settings
          </Button>
        </Grid>
      </Grid>
      )}

      function renderSong() {
       return( <MusicPlayer {...roomData.song}/>)
      }

    const authenticateSpotify = async () => {
      const response = await fetch('/spotify/is-authenticated')
      const data = await response.json()
      setRoomData({...roomData,
        spotifyAuthenticated: data.status})
        if (!data.status) {
          const response = await fetch('/spotify/get-auth-url')
          const data = await response.json()
          window.location.assign(data.url)
        }else {
          window.alert('Already Connected!')
        }
    }

    const getRoom = async () => {
      const response = await fetch(`api/get-room?code=${roomCode}` )
      const data = await response.json()
      setRoomData({...roomData,
        votesToSkip: data.votes_to_skip,
        guestCanPause: data.guest_can_pause,
        isHost: data.is_host})
    }
   
    useEffect(() => {
        getRoom()}, [])

    useEffect(() => {
        renderSong()
      })

     if (roomData.showSettings) {
      return renderSettings();
    }

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align='center' className='Code'>
          <Typography variant='h2' component='h2' style={{color: 'white'}}>
            Code: {roomCode}
          </Typography>
        </Grid>
        <MusicPlayer/>
        {roomData.isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align='center'>
        <Button variant="contained" color="secondary" onClick={leaveRoom} className='LeaveRoom'>
            Leave Room 
          </Button>
          {roomData.isHost ? SpotifyLogInButton() : null}
      </Grid>
      </Grid>
    )
  }