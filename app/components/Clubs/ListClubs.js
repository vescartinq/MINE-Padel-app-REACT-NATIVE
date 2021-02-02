import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListClubs({clubs}) {
    const navigation = useNavigation();


  return (
    <View>
      {size(clubs) > 0 ? (
            <FlatList
            data={clubs}
            renderItem={(club) => (
              <Club club={club} navigation={navigation} />
            )}
            keyExtractor={(item, index) => index.toString()}
            // onEndReachedThreshold={0.5}
            // onEndReached={handleLoadMore}
            // ListFooterComponent={<FooterList isLoading={isLoading} />}
          /> 
      ) : (
          <View style={styles.loaderClubs}>
             <ActivityIndicator size="large"/>
             <Text>Loading clubs</Text> 
          </View>
      )}
    </View>
  );
}

function Club({restaurant, navigation}){
    return (
        <View>
            <Text>Club Data</Text>
        </View>
    )
}

function FooterList({ isLoading } ) {
  
    if (isLoading) {
      return (
        <View style={styles.loaderClubs}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.notFoundClubs}>
          <Text>All clubs downloaded</Text>
        </View>
      );
    }
  }

const styles = StyleSheet.create({
    loaderClubs: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
      },
      viewClub: {
        flexDirection: "row",
        margin: 10,
      },
      viewClubImage: {
        marginRight: 15,
      },
      imageClub: {
        width: 80,
        height: 80,
      },
      clubName: {
        fontWeight: "bold",
      },
      clubAddress: {
        paddingTop: 2,
        color: "grey",
      },
      clubDescription: {
        paddingTop: 2,
        color: "grey",
        width: 300,
      },
      notFoundClubs: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
      },
});
