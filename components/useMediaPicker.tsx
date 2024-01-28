import React from "react";
import * as ImagePicker from "expo-image-picker";

export function useMediaPicker() {
  const [media, setMedia] = React.useState<ImagePicker.ImagePickerAsset | null>(
    null
  );

  const pickMedia = async (
    args: ImagePicker.ImagePickerOptions | undefined
  ) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        exif: true,
        quality: 1,
        aspect: [9, 16],
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.High,
        presentationStyle:
          ImagePicker.UIImagePickerPresentationStyle.CURRENT_CONTEXT,
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
        ...args,
      });
      let finalResult: ImagePicker.ImagePickerAsset | null = null;
      if (result.assets != null) {
        finalResult = result.assets?.length > 0 ? result.assets[0] : null;
      }

      if (!result.canceled) {
        setMedia(finalResult);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { media, setMedia, pickMedia };
}
