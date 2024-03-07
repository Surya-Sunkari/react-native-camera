import {StatusBar} from 'expo-status-bar'
import React, {useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image} from 'react-native'
import {Camera} from 'expo-camera'
import CameraPreview from './components/CameraPreview'
import { Cloudinary } from "@cloudinary/url-gen";
import {upload} from 'cloudinary-react-native'

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dyrw53yus'
  },
  url: {
    secure: true
  }
});


export default function App() {
  const [cameraOpen, setStartCamera] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [savedPhotoURL, setSavedPhotoURL] = useState('')
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)

  var camera = null

  const openCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      Alert.alert('Access denied')
    }
  }

  const closeCamera = () => {
    setStartCamera(false)
  }

  const takePicture = async () => {
    const photo = await camera.takePictureAsync()
    console.log(photo)
    setPreviewVisible(true)
    //setStartCamera(false)
    setCapturedImage(photo)
  }

  const savePhoto = async () => {
    //add photo to db??
    var photo = capturedImage.uri;
    console.log('saving photo: ', photo)

    //cloudinary upload
    const options = {
      upload_preset: 're8ry9up',
      tag: 'sample',
      unsigned: true,
    }

    await upload(cloudinary, {
      file: photo,
      options: options,
      callback: (error, result) => {
        if (!error) {
          console.log('result: ', result)
          setSavedPhotoURL(result.url)
        }
        else {
          console.log('error: ', error)
        }
      }
    })
    

    Alert.alert('Photo saved')
    retakePhoto()
  }
  const retakePhoto = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    openCamera()
  }

  const switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }

  return (
    <View style={styles.container}>
      {cameraOpen ? (
        <View
          style={{
            flex: 1,
            width: '100%'
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} savePhoto={savePhoto} retakePicture={retakePhoto} />
          ) : (
            <Camera
              type={cameraType}
              style={{flex: 1}}
              ref={(r) => {
                camera = r
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <TouchableOpacity
                    onPress={closeCamera}
                    style={{
                      marginTop: 20,
                      borderRadius: '50%',
                      height: 25,
                      width: 25
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20
                      }}
                    >
                      ❎
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={switchCamera}
                    style={{
                      marginTop: 20,
                      borderRadius: '50%',
                      height: 25,
                      width: 25
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20
                      }}
                    >
                      {cameraType === 'front' ? '🤳' : '📷'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={openCamera}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Take picture
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
