import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Camera } from 'expo-camera';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Dimensions
} from "react-native";

const apiDest = 'https://wander.wumpler.com';

let global_userID = "";
let global_session = "";

const backend = {
  login: (email, password) => {
    const data = {
      email: email,
      password: password
    };

    return fetch(apiDest + '/auth/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  },
  getUserPosts: async () => {
    let res = global_userID;

    return fetch(apiDest + '/posts');
  },
  register: (email, username, password) => {
    let data = { email, username, password };

    return fetch(apiDest + '/auth/register', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
};

function LogInScreen({ navigation }) {
  const [responseText, setResponseText] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Wander</Text>
      <StatusBar style="auto" />

      <Text style={styles.responseText}>{responseText}</Text>

      <Text style={styles.title}>Login</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(e) => setEmail(e)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(p) => setPassword(p)}
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotButton}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={async () => {
          backend.login(email, password).then(res => {
            if (res.status == 200) {
              let { userID, session } = res.json();
              global_userID = userID;
              global_session = session;

              setResponseText("");
              setEmail("");
              setPassword("");
              navigation.navigate('Home'); // success
            }
            else if (res.status == 401) {
              // Invalid username or password
              setResponseText("Invalid username or password");
            }
            else if (res.status == 501) {
              // User not found
              setResponseText("User not found");
            }
          });
        }}
      >
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.createAccount}>New user? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
}

const photoUploaded = false;

function PhotoUpload({ navigation }){
  if(photoUploaded == false){
    return (
      <View style = {styles.mainBackdrop}>
        <Text style= {styles.heading}>Prompt of the Day</Text>
        <Text style = {styles.prompt}>"find an animal"</Text>
        <View style = {[styles.whiteBox, styles.shadowProp]}>
        <Image source={require('./assets/upload_image.png')} style={{height:"250px", width:"250px", resizeMode: 'contain', position: 'absolute', marginTop: 30, marginBottom: 360}}/>
        <TouchableOpacity style={styles.cameraButton} activeOpacity={0.5}>
          <Image source={require('./assets/cameraAdd.png')}
          style={styles.ImageIconStyle}/>
          <Text style={styles.TextStyle}>Take a Photo!</Text>
        </TouchableOpacity>
        </View>
      </View>
    )
  }
  else{
    return (
      <View style = {styles.mainBackdrop}>
        <Text style= {styles.heading}>Prompt of the Day</Text>
        <Text style = {styles.prompt}>"find an animal"</Text>
        <View style = {[styles.whiteBox, styles.shadowProp]}>
        <Image source={require('./assets/duck.png')} style={{height:"300px", width:"300px", resizeMode: 'contain', position: 'absolute', marginTop: 30, marginBottom: 360, borderRadius: 50}}/>
        <View style={{ flexDirection:"row" }}>
        <TouchableOpacity style={styles.cameraButton} activeOpacity={0.5}>
          <Image source={require('./assets/cameraAdd.png')}
          style={styles.ImageIconStyle}/>
          <Text style={styles.TextStyle}>Edit Your Photo!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton} activeOpacity={0.5}>
          <Image source={require('./assets/Share.png')}
          style={styles.ImageIconStyle}/>
          <Text style={styles.TextStyle}>Share with Friends!</Text>
        </TouchableOpacity>
        </View>
        </View>
      </View>
   )
  }
}

function SignUpScreen({ navigation }) {
  const [responseText, setResponseText] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUserName] = React.useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Wander</Text>
      <StatusBar style="auto" />

      <Text style={styles.title}>Sign Up</Text>

      <Text style={styles.responseText}>{responseText}</Text>
      
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          onChangeText={(user) => setUserName(user)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          backend.register(email, username, password).then(res => {
            if (res.status == 201)
              navigation.navigate('Log In');
            else if (res.status == 406) // user exists
              setResponseText("A user with this email already exists.");
            else if (res.status == 500) // internal server error
              console.log('An internal server error occurred. Please try again.');
          })
          // navigation.navigate("Home")
        }}
      >
        <Text style={styles.loginText}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
}

function ExploreScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center",  flexWrap: "wrap", flexDirection: "row" }}>
      <Image source={require('./assets/animal1.jpeg')} style={{height:Dimensions.get('window').width/2, width:Dimensions.get('window').width/2}}/>
      <Image source={require('./assets/animal2.jpeg')} style={{height:Dimensions.get('window').width/2, width:Dimensions.get('window').width/2}}/>
      <Image source={require('./assets/animal3.jpeg')} style={{height:Dimensions.get('window').width/2, width:Dimensions.get('window').width/2}}/>
      <Image source={require('./assets/animal4.jpeg')} style={{height:Dimensions.get('window').width/2, width:Dimensions.get('window').width/2}}/>
      <Image source={require('./assets/animal5.jpeg')} style={{height:Dimensions.get('window').width/2, width:Dimensions.get('window').width/2}}/>
      <Image source={require('./assets/animal6.jpeg')} style={{height:Dimensions.get('window').width/2, width:Dimensions.get('window').width/2}}/>
      <Image source={require('./assets/animal7.jpeg')} style={{height:Dimensions.get('window').width/2, width:Dimensions.get('window').width/2}}/>
      <Image source={require('./assets/animal8.jpeg')} style={{height:Dimensions.get('window').width/2, width:Dimensions.get('window').width/2}}/>
      <Image source={require('./assets/animal9.jpeg')} style={{height:Dimensions.get('window').width/2, width:Dimensions.get('window').width/2}}/>
      <Image source={require('./assets/animal10.jpeg')} style={{height:Dimensions.get('window').width/2, width:Dimensions.get('window').width/2}}/>
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Prompt of the Day</Text>
      <Text>Click to take photo</Text>
    </View>
  );
}

function ProfileScreen({ navigation }) {
  let [images, setImages] = React.useState([]);

  React.useEffect(async () => {
    let raw = await backend.getUserPosts();
    let res = await raw.json(); 
    console.log(res[0].image);
    setImages(res);
  }, [])

  const renderImages = images.map((image) => {
    return (
      (<Image style={{
        width: 100,
        height: 100
      }} source={{uri: `${image.image}`}} />)
    )
  })
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {
        renderImages
      }
    </View>
  );
}

// function CameraScreen() {
//   const [hasPermission, setHasPermission] = React.useState(null);
//   const [type, setType] = React.useState(Camera.Constants.Type.back);

//   React.useEffect(async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//   }, [setHasPermission]);

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }
//   return (
//     <View style={styles.container}>
//       <Camera style={styles.camera} type={type}>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => {
//               setType(
//                 type === Camera.Constants.Type.back
//                   ? Camera.Constants.Type.front
//                   : Camera.Constants.Type.back
//               );
//             }}>
//             <Text style={styles.text}> Flip </Text>
//           </TouchableOpacity>
//         </View>
//       </Camera>
//     </View>
//   );
// }

// const StartStack = createNativeStackNavigator();

// function StartStackScreen() {
//   return ( //     <StartStack.Navigator>
//       <StartStack.Screen name="Login" component={LogInScreen} />
//       <StartStack.Screen name="Signup" component={SignUpScreen} />
//     </StartStack.Navigator>
//   );
// }

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Log In" component={LogInScreen} />
        <Tab.Screen name="Sign Up" component={SignUpScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Prompt" component={PhotoUpload} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        {/* <Tab.Screen name="Profile" component={CameraScreen} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#344E41",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  appName: {
    color: "#DAD7CD",
    fontSize: innerWidth / 9.5,
    fontWeight: "bold",
    marginBottom: 50,
  },

  title: {
    color: "#DAD7CD",
    fontSize: innerWidth / 15,
    fontWeight: "bold",
    marginBottom: 10,
    alignItems: "left",
    textAlign: "left",
    justifyContent: "left",
  },

  responseText: {
    color: "#FF0000",
    fontSize: innerWidth / 25,
    fontWeight: "bold",
    marginBottom: 10,
    alignItems: "left",
    textAlign: "left",
    justifyContent: "left",
  },

  inputView: {
    backgroundColor: "#DAD7CD",
    borderRadius: 10,
    width: "65%",
    height: 45,
    marginBottom: 20,
    alignItems: "left",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },

  forgotButton: {
    height: 30,
    color: "#DAD7CD",
  },
  
  loginText: {
    weight: "bold"
  },
  
  loginButton: {
    width: "25%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
    backgroundColor: "#DAD7CD",
    fontWeight: "bold",
  },

  createAccount: {
    height: 30,
    marginTop: 40,
    color: "#DAD7CD",
    fontStyle: "italic",
  },
  mainBackdrop: {
    flexDirection: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#588157',
 },
 whiteBox: {
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#dfdfdf',
   width: '100%',
   height: 700,
   position: 'absolute',
   top: 200,
   borderTopLeftRadius: 10,
   borderTopRightRadius: 10,
 },
 shadowProp: {
  shadowColor: '#171717',
  shadowOffset: {width: -2, height: 4},
  shadowOpacity: 0.2,
  shadowRadius: 3,
},
heading: {
  color: '#EFEFEF',
  fontWeight: 'bold',
  fontSize: innerWidth / 12,
  marginBottom: 170,
  marginTop: 40,
  alignItems: 'center',
  justifyContent: 'center',
},
prompt: {
  color: '#EFEFEF',
  fontWeight: 'normal',
  fontSize: innerWidth / 17,
  fontStyle: 'italic',
  position: 'absolute',
  top: 100,
  alignItems: 'center',
  justifyContent: 'center',
},

regularText: {
  color: '#EFEFEF',
  fontStyle: 'italic',
  marginBottom: 4,
  marginRight: 25,
},
cameraButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderWidth: 3,
  borderColor: '#145125',
  borderStyle: 'dashed',
  height: 50,
  width: 130,
  borderRadius: 10,
  margin: 5,
},
ImageIconStyle: {
  padding: 10,
  margin: 5,
  height: 25,
  width: 25,
  resizeMode: 'contains',
},
SeparatorLine:{
  backgroundColor : '#dfdfdf',
  width: 1,
  height: 200
},
});
