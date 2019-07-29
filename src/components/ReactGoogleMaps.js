import {Map, /*InfoWindow,*/ Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react'
import * as firebase from "firebase";


var config = {
  apiKey: "AIzaSyABw5Fg78SgvedyHr8tl-tPjcn5iFotB6I",
  authDomain: "phlask-web-map.firebaseapp.com",
  databaseURL: "https://phlask-web-map.firebaseio.com",
  projectId: "phlask-web-map",
  storageBucket: "phlask-web-map.appspot.com",
  messagingSenderId: "428394983826"
};

firebase.initializeApp(config);

function getTaps() {
  return firebase.database().ref('/').once('value').then(function(snapshot) {
    var allTaps = [];
    var item;
    for (item in snapshot.val()) {
      if (snapshot.val()[item].access === "WM") {
        continue;
      }
      allTaps.push(snapshot.val()[item]);
    }
    return allTaps;
  });
};


//gets the users latitude
function getLat(){
  if ("geolocation" in navigator) {
    console.log("here");
    // check if geolocation is supported/enabled on current browser
    navigator.geolocation.getCurrentPosition(
     function success(position) {
       // for when getting location is a success
       var mylat = position.coords.latitude;
       console.log('latitude', position.coords.latitude);
       return mylat;
     },
    function error(error_message) {
      // for when getting location results in an error
      console.error('An error has occured while retrieving location', error_message)
    });
  
  } else {
    // geolocation is not supported
    // get your location some other way
    console.log('geolocation is not enabled on this browser')
  }
}

//gets the users longitutude 
function getLon(){
  if ("geolocation" in navigator) {
    console.log("here");
    // check if geolocation is supported/enabled on current browser
    navigator.geolocation.getCurrentPosition(
     function success(position) {
       // for when getting location is a success
       var mylon = position.coords.longitude;
       console.log('longitude', position.coords.longitude);
       return mylon;
     },
    function error(error_message) {
      // for when getting location results in an error
      console.error('An error has occured while retrieving location', error_message)
    });
  
  } else {
    // geolocation is not supported
    // get your location some other way
    console.log('geolocation is not enabled on this browser')
  }
}


const LoadingContainer = (props) => (
  <div>Looking for water!</div>
)

const style = {
  width: '100%',
  height: '90%',
  position: 'relative'
  
}

export class ReactGoogleMaps extends Component {

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    currlat: getLat(),
    currlon: getLon(),
    taps: [],
    tapsLoaded: false
  };

  componentDidMount() {
    getTaps()
      .then(taps => {
        this.setState(oldState => {
          return {...oldState, taps: taps}
        });
      });
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  getIcon(access) {
    switch(access) {
      case "Public":
          return "https://i.imgur.com/M12e1HV.png";
      case "Private-Shared":
          return "https://i.imgur.com/DXMMxXR.png";
      case "Private":
          return "https://i.imgur.com/kt825XO.png";
      case "Restricted":
          return "https://i.imgur.com/5NOdOyY.png";
      case "Semi-public":
          return "https://i.imgur.com/DXMMxXR.png";
      default:
        break;
    }
  }

  render() {
    if(this.state.taps.length) {
      return (
        <Map google={this.props.google} className = {'map'} style={style} zoom={12} initialCenter={{
              lat: 39.9526,
              lng: -75.1652
            }}>

          <Marker
              key='current_pos'
              name={'Current Pos'}
              position={{lat: this.state.currlat, lng: this.state.currlon}}/>
          
          {
            this.state.taps.map((tap, index) => 
              <Marker key={index} name={tap.tapnum} 
                position={{lat: tap.lat, lng: tap.lon}}
                icon={{
                  url: this.getIcon(tap.access)
                }}/>
            )
          }
        </Map>
      );
    } else {
      return <div>Loading taps...</div>
    }
  }
}

 
export default GoogleApiWrapper({
  apiKey: ("AIzaSyABw5Fg78SgvedyHr8tl-tPjcn5iFotB6I"),
  LoadingContainer: LoadingContainer
})(ReactGoogleMaps)