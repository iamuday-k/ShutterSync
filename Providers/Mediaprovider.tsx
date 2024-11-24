/* eslint-disable prettier/prettier */
import * as MediaLibrary from 'expo-media-library';
import {createContext, PropsWithChildren,useContext,useEffect,useState} from 'react';
type MediacontextType = {
    assets:MediaLibrary.Asset[];
    loadlocalAssets:() => void;
    getAssetById:(id:string)=> MediaLibrary.Asset | undefined;
}
const Mediacontext =  createContext<MediacontextType>({
    assets:[],
    loadlocalAssets:() =>{},
    getAssetById:()=>undefined,
});

export default function MediaContextProvider({children}:PropsWithChildren){
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [localAssets, setLocalAssets] = useState<MediaLibrary.Asset[]>([]);
    const[hasNextPage, setNextPage] = useState(true);
    const[endCursor , setEndCursor] = useState<string |null>(null);
    const[loading,setloading] = useState(false);
    useEffect(() =>{
      if (permissionResponse?.status !== 'granted'){
        requestPermission();
      }
  
    },[])
    useEffect(() => {
   if(permissionResponse?.status ==='granted'){
    loadlocalAssets();
   }
    },[permissionResponse])
    const loadlocalAssets = async () => {
      if(loading || !hasNextPage)return;
      setloading(true);
      try{
        console.log("Fetching assets with cursor:", endCursor);
      const assetsPage  = await MediaLibrary.getAssetsAsync({first:29,after: endCursor || undefined,});
      console.log("loaded assets page:",assetsPage)
     console.log(JSON.stringify(assetsPage,null,2));
      setLocalAssets((prevAssets)=>[...prevAssets,...assetsPage.assets]);
      setNextPage(assetsPage.hasNextPage);
      setEndCursor(assetsPage.endCursor);
      }catch(error){
        console.error("Failed to load assets",error);
      }finally{
      setloading(false);
      }
    };  
    const getAssetById = (id:string) => {
      return localAssets.find((asset) => asset.id === id);
    }
    return <Mediacontext.Provider value={{assets:localAssets,loadlocalAssets,getAssetById}}>{children}</Mediacontext.Provider>; 
}
 export const useMedia = () => useContext(Mediacontext);