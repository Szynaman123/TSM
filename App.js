import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Image} from "react-native";
import { Card} from "react-native-elements";
import { GameEngine } from "react-native-game-engine";
import { TouchableOpacity } from "react-native-gesture-handler";
import Food from "./components/Food";
import Head from "./components/Head";
import {
  AdMobBanner,
  AdMobInterstitial,
  setTestDeviceIDAsync
} from "expo-ads-admob";
import Tail from "./components/Tail";
import Constants from "./Constants";
import GameLoop from "./systems/GameLoop";

export default function App() {
  const Home = () => {
    React.useEffect(() => {
       setTestDeviceIDAsync("EMULATOR");
    }, []);
  }
  const BoardSize = Constants.GRID_SIZE * Constants.CELL_SIZE;
  const engine = useRef(null);
  const [isGameRunning, setIsGameRunning] = useState(true);
  const randomPositions = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const initInterstitialAd = async () => {
    // Display a rewarded ad
    await AdMobInterstitial.setAdUnitID("ca-app-pub-3940256099942544/8691691433");
    await AdMobInterstitial.requestAdAsync();
    await AdMobInterstitial.showAdAsync();
};
  const resetGame = () => {
    engine.current.swap({
      head: {
        position: [0, 0],
        size: Constants.CELL_SIZE,
        updateFrequency: 10,
        nextMove: 10,
        xspeed: 0,
        yspeed: 0,
        renderer: <Head />,
      },
      food: {
        position: [
          randomPositions(0, Constants.GRID_SIZE - 1),
          randomPositions(0, Constants.GRID_SIZE - 1),
        ],
        size: Constants.CELL_SIZE,
        updateFrequency: 10,
        nextMove: 10,
        xspeed: 0,
        yspeed: 0,
        renderer: <Food />,
      },
      tail: {
        size: Constants.CELL_SIZE,
        elements: [],
        renderer: <Tail />,
      },
    });
    setIsGameRunning(true);
  };
  return (

    
    <View style={styles.canvas}>
       
      <GameEngine
        ref={engine}
        style={{
          width: BoardSize,
          height: BoardSize,
          flex: null,
          backgroundColor: "lightyellow",
        }}
        entities={{
          head: {
            position: [0, 0],
            size: Constants.CELL_SIZE,
            updateFrequency: 10,
            nextMove: 10,
            xspeed: 0,
            yspeed: 0,
            renderer: <Head />,
          },
          food: {
            position: [
              randomPositions(0, Constants.GRID_SIZE - 1),
              randomPositions(0, Constants.GRID_SIZE - 1),
            ],
            size: Constants.CELL_SIZE,
            renderer: <Food />,
          },
          tail: {
            size: Constants.CELL_SIZE,
            elements: [],
            renderer: <Tail />,
          },
        }}
        systems={[GameLoop]}
        running={isGameRunning}
        onEvent={(e) => {
          switch (e) {
            case "game-over":
              alert("Game over!");
              setIsGameRunning(false);
              initInterstitialAd();
              return;
          }
        }}
      />
      
     
      <View style={styles.controlContainer}>
        <View style={styles.controllerRow}>
          <TouchableOpacity onPress={() => engine.current.dispatch("move-up")}>
          <Image
            source={require('./assets/up.jpg')}
            style={styles.controlBtn}
          />
          </TouchableOpacity>
        </View>
        <View style={styles.controllerRow}>
          <TouchableOpacity
            onPress={() => engine.current.dispatch("move-left")}
          >
            <Image
            source={require('./assets/left.jpg')}
            style={styles.controlBtn}
          />
          </TouchableOpacity>
          <View style={[styles.controlBtn, { backgroundColor: null }]} />
          <TouchableOpacity
            onPress={() => engine.current.dispatch("move-right")}
          >
            <Image
            source={require('./assets/right.jpg')}
            style={styles.controlBtn}
          />
          </TouchableOpacity>
        </View>
        <View style={styles.controllerRow}>
          <TouchableOpacity
            onPress={() => engine.current.dispatch("move-down")}
          >
            <Image
            source={require('./assets/down.jpg')}
            style={styles.controlBtn}
          />
          </TouchableOpacity>
        </View>
      </View>
      {!isGameRunning && (
        <TouchableOpacity onPress={resetGame}>
          <Text
            style={{
              color: "white",
              marginTop: 15,
              fontSize: 22,
              padding: 10,
              backgroundColor: "grey",
              borderRadius: 10
            }}
          >
            Start New Game
          </Text>
        </TouchableOpacity>
        
      )}<View style={{
        padding: 30,
      }}>
    <AdMobBanner
      adUnitID="ca-app-pub-3940256099942544/6300978111"
      bannerSize="smartBanner"
      servePersonalizedAds={true}
    />
    </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bannerContainer:{
    marginTop:2,
  },
  canvas: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  controlContainer: {
    marginTop: 10,
  },
  controllerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlBtn: {
    
    width: 60,
    height: 60,
  },
});