import React from "react";
import { Text, View, Image, StyleSheet } from 'react-native';

const AddGifImage = () => {
  return (
    <View style={styles.container}>
      <Image
        style={{ width: "100%", height: "80%" }}
        source={require('./img/dancing_penguin.gif')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 25
  }
})

export default AddGifImage;
