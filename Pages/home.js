import { View, Text, StyleSheet, Modal, Animated, TextInput, Easing } from 'react-native'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { login, logout, signup_ } from '../redux/actions/users'
import { clearSearchResult } from '../redux/actions/movies'
import Button from '../custom componet/Button'

const Home = ({ navigation, userState, logout }) => {
  const [user, setUser] = useState(userState[0]?.result ? userState[0].result : "No user")
  const [menuModal, setMenuModal] = useState(false);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState('')
  const ref = React.useRef(View.prototype);
  const newAnimation = React.useRef(new Animated.Value(1)).current;
  const searchAnimation = React.useRef(new Animated.Value(0)).current;
  const [xPos, setXPos] = React.useState();

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(newAnimation, {
        toValue: 0,
        duration: 1000,
        delay: 1000,
        easing: Easing.bezier(0, 1, 1, 1),
        useNativeDriver: true,
      }),
      Animated.timing(searchAnimation, {
        toValue: 2,
        duration: 1000,
        delay: 500,
      }),
      Animated.timing(searchAnimation, {
        toValue: 1.5,
        duration: 1000,
        delay: 500,
      }),

    ]).start();
  };

  React.useEffect(() => {
    ref.current?.measure((x, y, w, h, xAbs, yAbs) => {
      setXPos(yAbs);
    });
    startAnimation();
  }, [xPos]);

  const translateX = newAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, xPos],
  });


  useEffect(() => {
    setUser(userState[0]?.result ? userState[0].result : "No user")
  }, [search])

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={false} visible={menuModal} onRequestClose={() => { setMenuModal(!menuModal); }}>
        <View style={styles.container}>
          <View style={[styles.modalView]}>
            <Button title="Favourites" onPress={() => {
              setMenuModal(!menuModal)
              navigation.navigate("Favourites")
            }} />
            <Button title="Watch Later" onPress={() => {
              setMenuModal(!menuModal)
              navigation.navigate("Watch Later")
            }} />
            <Button title="History" onPress={() => {
              setMenuModal(!menuModal)
              navigation.navigate("History")
            }} />
            <Button title="Login/Signup" onPress={() => {
              setMenuModal(!menuModal)
              navigation.navigate("Login/Signup")
            }} />
            {
              userState[0]?.result?.name && <Button title="Logout" onPress={() => {
                setMenuModal(!menuModal)
                logout()
              }} />
            }
            <Button title="Back" onPress={() => setMenuModal(!menuModal)} />
          </View>
        </View>
      </Modal>
      <Text>{userState[0]?.result?.name ? `Welcome, ${userState[0]?.result?.name}!` : ''}</Text>
      <View style={styles.animationContainer}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <Text ref={ref} style={{ margin: 20, fontWeight: 'bold', fontSize: 24 }}>Movie Empire</Text>
        </Animated.View>
        <Animated.View
          style={{
            opacity: searchAnimation,
            width: "80%",
            height: 50,
            transform: [{ scale: searchAnimation }],
          }}>
          <TextInput style={{
            borderWidth: 1,
            borderColor: 'orange',
            borderRadius: 10,
            borderStyle: 'solid',
            textAlign: 'center',
            height: 30
          }} placeholder="Search for a movie..." value={search} onChangeText={setSearch} />
        </Animated.View>
      </View>
      <Text>{errors}</Text>
      <View style={styles.buttonsContainer}>
        <Button title='Search' onPress={() => {
          if (search.length < 1) {
            setErrors("Enter movie name to search!")
            return
          }
          navigation.navigate("Search Result", { searchtext: search, user: user })
        }} />
        <Button title='Menu' onPress={() => setMenuModal(!menuModal)} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonsContainer: { justifyContent: "center", margin: 20, display: 'flex', flexDirection: 'row' },
  animationContainer: { justifyContent: "center", alignItems: "center" },
  searchinput: { margin: 15, width: "50%", height: 30, alignItems: 'left', borderWidth: 2 },
  modalText: { marginBottom: 10 },
  modalView: { width: "80%", height: 'auto', margin: 5, backgroundColor: "black", borderColor: "red", borderWidth: 1, borderRadius: 5, padding: 15, alignItems: "center", justifyContent: "space-between" },
});

const mapStateToProps = (userState) => (userState)
const mapDispatchToProps = { login, logout, signup_, clearSearchResult }

export default connect(mapStateToProps, mapDispatchToProps)(Home)