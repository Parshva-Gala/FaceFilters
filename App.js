import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import { RNCamera } from 'react-native-camera';
import penguingif from './penguingif';
import FastImage from 'react-native-fast-image';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const overlays = {
  glasses: require('./img/thunglife.png'),
  penguin: require('./img/dancing_penguin.gif'),
};

const App = () => {
  const [type, setType] = useState(RNCamera.Constants.Type.front);
  const [box, setBox] = useState(null);
  const [selectedOverlay, setSelectedOverlay] = useState('glasses');
  const cameraRef = useRef(null);

  const handlerFace = ({ faces }) => {
    if (faces[0]) {
      setBox({
        boxs: {
          width: faces[0].bounds.size.width,
          height: faces[0].bounds.size.height,
          x: faces[0].bounds.origin.x,
          y: faces[0].bounds.origin.y,
          yawAngle: faces[0].yawAngle,
          rollAngle: faces[0].rollAngle,
        },
        rightEyePosition: faces[0].rightEyePosition,
        leftEyePosition: faces[0].leftEyePosition,
        bottomMounthPosition: faces[0].bottomMounthPosition,
      });
    } else {
      setBox(null);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri); // You can do something with the captured image data here
    }
  };

  const selectOverlay = (overlay) => {
    setSelectedOverlay(overlay);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        captureAudio={false}
        onFacesDetected={handlerFace}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
      />
      {box && (
        <>
          {selectedOverlay === 'glasses' && (
            <Image
              source={overlays.glasses}
              style={styles.glassesOverlay({
                rightEyePosition: box.rightEyePosition,
                leftEyePosition: box.leftEyePosition,
                yawAngle: box.yawAngle,
                rollAngle: box.rollAngle,
              })}
            />
          )}
          {selectedOverlay === 'penguin' && (
            <Image
              source={overlays.penguin}
              style={styles.penguinOverlay({
                width: box.boxs.width,
                x: box.boxs.x,
                y: box.boxs.y,
              })}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
          <View
            style={styles.bound({
              width: box.boxs.width,
              height: box.boxs.height,
              x: box.boxs.x,
              y: box.boxs.y,
            })}
          />
        </>
      )}
      <View style={styles.overlaySelector}>
        <TouchableOpacity
          style={[styles.overlayButton, selectedOverlay === 'glasses' && styles.selectedOverlayButton]}
          onPress={() => selectOverlay('glasses')}
        >
          <Text style={styles.overlayButtonText}>Glasses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.overlayButton, selectedOverlay === 'penguin' && styles.selectedOverlayButton]}
          onPress={() => selectOverlay('penguin')}
        >
          <Text style={styles.overlayButtonText}>Penguin</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.captureText}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  camera: {
    flexGrow: 1,
  },
  bound: ({ width, height, x, y }) => {
    return {
      position: 'absolute',
      top: y,
      left: x - 50,
      height,
      width,
      borderWidth: 5,
      borderColor: 'transparent',
      zIndex: 3000,
    };
  },
  glassesOverlay: ({ rightEyePosition, leftEyePosition, yawAngle, rollAngle }) => {
    return {
      position: 'absolute',
      top: rightEyePosition.y - 60,
      left: rightEyePosition.x - 100,
      resizeMode: 'contain',
      width: Math.abs(leftEyePosition.x - rightEyePosition.x) + 100,
    };
  },
  penguinOverlay: ({ width, x, y }) => {
    const smallerWidth = width * 0.8;
    return {
      position: 'absolute',
      top: y - smallerWidth - 200,
      left: x - 60,
      resizeMode: 'contain',
      width: smallerWidth + 100,
    };
  },
  overlaySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  overlayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  selectedOverlayButton: {
    backgroundColor: 'green',
  },
  overlayButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  captureText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
