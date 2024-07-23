import axios from 'axios';
import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { ImagePickerResponse, launchCamera } from 'react-native-image-picker'
import TextRecognition from 'react-native-text-recognition';

export default function App() {
  const [imageData,setImageData] = useState<ImagePickerResponse | null>(null)

  const getTextFromImage = async (imageBase64:string) =>{
    const API_KEY ="AIzaSyCuA1eYnHgYpuSl-xd6Sz_0o4MJUD1NzKE"
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`
    const data = {
      requests:[
        {
          image:{
            content:imageBase64
          },
          features:[
            {
              type:"TEXT_DETECTION",
              maxResults:1
            }
          ]
        }
      ]
    }

    // const res = await axios.post(url,data)
    const res = await fetch(url,{
      method:"POST",
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    })
   const json = await res.json()
   console.log(json)
  }

  const openCamera = async()=>{
    const res = await launchCamera({mediaType:'photo',includeBase64:true})
    if(!res.didCancel){
      let base64 = res?.assets?.[0].base64
      if(base64){
        setImageData(res)
        getTextFromImage(base64)
      }
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
