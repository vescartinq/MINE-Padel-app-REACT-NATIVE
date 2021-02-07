import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props) {
  const { navigation } = props;
  const [search, setSearch] = useState("");
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    if (search) {
      fireSQL
        .query(`SELECT * FROM clubs WHERE name LIKE '${search}%'`)
        .then((response) => {
          setClubs(response);
        });
    }
  }, [search]);

  return (
    <View>
      <SearchBar
        placeholder="Search your club..."
        onChangeText={(e) => setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
      />
      {clubs.length === 0 ? (
        <NoFoundClubs />
      ) : (
        <FlatList
          data={clubs}
          renderItem={(club) => (
            <Club club={club} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function NoFoundClubs() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("../../assets/img/no-result-found3.png")}
        resizeMode="cover"
        style={{ width: 400, height: 200 }}
      />
    </View>
  );
}

function Club(props) {
  const { club, navigation } = props;
  const { id, name, images } = club.item;

  return (
    <ListItem
      title={name}
      leftAvatar={{
        source: images[0]
          ? { uri: images[0] }
          : require("../../assets/img/no-image.png"),
      }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("clubs", {
          screen: "club",
          params: { id, name },
        })
      }
    />
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
  },
});