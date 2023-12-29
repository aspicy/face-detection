import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';
// import Clarifai from 'clarifai';

// const app = new Clarifai.App({
//   apiKey: '335c9368a9064297b86485adb8ea1fad'
// });

const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = 'ff3551eda0004f9aa81429e9b2e46fa7';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = '2a53leyyvgvc';       
  const APP_ID = 'detectify';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  
  return requestOptions;
}
    

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions.map(region => region.region_info.bounding_box);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // const allFaces = clarifaiFace.map(facePosition => {
    //   return {
    //     leftCol: facePosition.left_col * width,
    //     topRow: facePosition.top_row * height,
    //     rightCol: width - (facePosition.right_col * width),
    //     bottomRow: height - (facePosition.bottom_row * height)}
    // });
    return clarifaiFace.map(face => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      }
    });
  }

  displayFaceBox = (boxes) => {
    console.log(boxes);
    this.setState({boxes : boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // app.models.predict('face-detection', this.state.input)
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
        .then(response => response.json())
        .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, boxes, route } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { 
          route === 'home' 
          ? <div>
          <Logo />
          <Rank />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} 
          />
          <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
          </div> 
          : (
            route === 'signin' 
            ? <Signin onRouteChange={this.onRouteChange} /> 
            : <Register onRouteChange={this.onRouteChange} />
          )
          
        }
      </div>
    );
  }
}

export default App;
