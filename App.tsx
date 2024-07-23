import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { ImagePickerResponse, launchCamera } from 'react-native-image-picker'

export default function App() {
  const [imageData,setImageData] = useState<ImagePickerResponse | null>(null)

  const openCamera = async()=>{
    const res = await launchCamera({mediaType:'photo',includeBase64:true})
    if(!res.didCancel){
      setImageData(res)
    }
  }

  return (
    <View style={{flex:1}}>
      {imageData&& <Image source={{uri:imageData?.assets?.[0].uri}} style={{width:"90%",height:200}}/>}
      <TouchableOpacity style={{width:"90%",padding:20,backgroundColor:'pink',margin:20}} onPress={openCamera}>
        <Text>Check Photo</Text>
      </TouchableOpacity>
    </View>
  )
}
