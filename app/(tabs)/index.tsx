import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import { View, FlatList, Pressable } from 'react-native';

import { useMedia } from '~/Providers/Mediaprovider';
export default function Home() {
  const { assets, loadlocalAssets } = useMedia();
  return (
    <>
      <Stack.Screen options={{ title: 'Photos' }} />
      <View style={{ flex: 1 }}>
        <FlatList
          data={assets}
          numColumns={4}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          columnWrapperStyle={{ gap: 2 }}
          contentContainerStyle={{ gap: 2 }}
          onEndReached={() => {
            console.log('End reached!');
            loadlocalAssets();
          }}
          onEndReachedThreshold={0.9}
          renderItem={({ item }) => (
            <Link href={`/asset?id=${item.id}`} asChild>
              <Pressable style={{ width: '25%' }}>
                <Image source={{ uri: item.uri }} style={{ width: '100%', aspectRatio: 1 }} />
              </Pressable>
            </Link>
          )}
        />
      </View>
    </>
  );
}
