import axios from 'axios';
import React, { useState } from 'react'
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native'
import { ImagePickerResponse, launchCamera } from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';

export default function App() {
  const [imageData,setImageData] = useState<ImagePickerResponse | null>(null)

  const imageToBase64 = async (uri:string) => {
    // Convert image URI to base64 using rn-fetch-blob
    const response = await RNFetchBlob.fs.readFile(uri, 'base64');
    return `data:image/jpeg;base64,${response}`;
  };

  const resizeImageIfNeeded = async (base64: string) => {
    const maxSizeInBytes = 1024 * 1024; // 1024 KB
    const options = {
      maxSize: 1024, // 1 MB
      quality: 80,
      base64: true,
      format: 'JPEG',
    };
  
    try {
      const resizedImage = await ImageResizer.createResizedImage(base64, options.maxSize, options.maxSize, "JPEG", options.quality);
      const resizedBase64 = await imageToBase64(resizedImage.uri);
      return resizedBase64;
    } catch (error) {
      console.error('Error resizing image:', error);
      return base64; // Return original base64 if resizing fails
    }
  };

  const getTextFromImage = async (imageBase64:string,uri:string) =>{
    const apiKey = '0f3cbbfe4f88957';  // Replace with your actual API key
    const language = 'eng';
    const isOverlayRequired = 'false';
    const url = 'https://api.ocr.space/parse/image';
    const resizedImage = await resizeImageIfNeeded(uri);
    const base64Image = `data:image/jpeg;base64,${resizedImage}`;  // Replace with your base64 encoded image data
    // Convert the base64 image string into a FormData object
    const formData = new FormData();
    formData.append('base64Image', resizedImage);
    formData.append('language', language);
    formData.append('isOverlayRequired', isOverlayRequired);
    
    // Make a POST request using axios
    axios.post(url, formData, {
      headers: {
        'apikey': apiKey,
        'Content-Type': 'multipart/form-data',  // Set Content-Type as multipart/form-data
      },
    })
    .then(response => {
      console.log('Response:', response.data);
      const data =response.data.ParsedResults[0].ParsedText
      console.log({data})
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  const openCamera = async()=>{
    const res = await launchCamera({mediaType:'photo',includeBase64:true})
    if(!res.didCancel){
      let base64 = res?.assets?.[0].base64
      if(base64){
        setImageData(res)
        getTextFromImage(base64,res?.assets?.[0].uri??"")
      }
    }
  }
  //https://ocr.space/ocrapi
  // ThaiNationalIDCardData1234567890123vauNameMr.SampleLastnameMiddleNameSatitsakul30Ia.2508DateofBirth30Mar.19651/111memJ5NI29255631s.a.255014255711:52:1429Mar.201331Dec.www.rd-comp.comDateotExpiryAThailDVt.0.0IFO. 

  return (
    <View style={{flex:1}}>
      {imageData&& <Image source={{uri:imageData?.assets?.[0].uri}} style={{width:"90%",height:200}}/>}
      <TouchableOpacity style={{width:"90%",padding:20,backgroundColor:'pink',margin:20}} onPress={openCamera}>
        <Text>Check Photo</Text>
      </TouchableOpacity>
    </View>
  )
}
