/**
 * Copyright (c) 2021 Chris Schnaufer. All rights reserved
 *
 * @format
 * @flow strict-local
 */
'use strict'
import React, { Component } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Utils from './Utils'

const SCREEN_WIDTH = Dimensions.get('window').width;
const MIN_LOCK_SWIPE_DISTANCE=Math.max(SCREEN_WIDTH * 0.05, 5); // Minimum swipe distance before swipe action starts
const MAX_LOCK_SWIPE_DISTANCE=Math.min(SCREEN_WIDTH * 0.2, 80); // Maxmium swipe distance before considered completed

class LockElement extends Component {
  constructor(props) {
    super(props);
    
    const position = new Animated.ValueXY(0, 0);
    
    this.onLocation = this.onLocation.bind(this);
    this.onDelete = this.onDelete.bind(this);
    
    const panResponder = PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onStartShouldSetPanResponderCapture: () => true,
          onMoveShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponderCapture: () => true,
          onResponderTerminationRequest: () => true,
          
          onPanResponderGrant: () => {
            this.position.setOffset({ x: this.position.x._value, y: 0 });
            this.position.setValue({ x: 0, y: 0 });
            if (this.props.hasOwnProperty('onBegin')) {
              this.props.onBegin(this.props.item.id);
            }
        },
        onPanResponderMove: (event, gesture) => {
          if (gesture.dx >= MIN_LOCK_SWIPE_DISTANCE) {
            this.props.onSwiping(true);
            const x = gesture.dx - MIN_LOCK_SWIPE_DISTANCE;
            this.position.setValue({ x, y: 0 });
          } else if (gesture.dx <= -MIN_LOCK_SWIPE_DISTANCE) {
            this.props.onSwiping(true);
            const x = gesture.dx + MIN_LOCK_SWIPE_DISTANCE;
            this.position.setValue({ x, y: 0 });
          }
        },
        onPanResponderEnd: (event, gesture) => {
          this.position.flattenOffset();
          if (gesture.dx > 0) {
            if (gesture.dx >= MAX_LOCK_SWIPE_DISTANCE) {
              this.userSwiped('right', gesture);
              return;
            }
          } else if (gesture.dx < 0) {
            if (gesture.dx <= -MAX_LOCK_SWIPE_DISTANCE) {
              this.userSwiped('left', gesture);
              return;
            }
          }
          this.resetPosition();
        },
        onPanResponderTerminate: () => {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
    });
    
    this.position = position;
    this.panResponder = panResponder;
  }

  resetPosition() {
    Animated.timing(this.position, {
      toValue: { x: 0, y: 0 },
      duration: 200,
      useNativeDriver: false,
      easing: Easing.out(Easing.quad)
    }).start(() => this.props.onReset());
  }

  getRightButtonProps() {
    const opacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH, -120, -35],
        outputRange: [0, 1, 0]
    });
    return {
        opacity,
    };
  }

  getLeftButtonProps() {
    const opacity = this.position.x.interpolate({
      inputRange: [35, 75, 320],
      outputRange: [0, 1, 0.25]
    });
    const width = this.position.x.interpolate({
      inputRange: [0, 70],
      outputRange: [0, 70]
    });
    return {
        opacity
    };
  }
  
  userSwiped(direction, gesture) {
    if ((direction == 'right') && (gesture.dx >= MAX_LOCK_SWIPE_DISTANCE)) {
      this.showButton('right');
      this.props.onSwipedRight(this.props.item.id);
    } else if ((direction == 'left') && (gesture.dx <= -MAX_LOCK_SWIPE_DISTANCE)) {
      this.showButton('left');
      this.props.onSwipedLeft(this.props.item.id);
    } else {
      this.resetPosition();
    }
  }

  showButton(side) {
    const x = side === 'right' ? SCREEN_WIDTH / 4 : -SCREEN_WIDTH / 4;
    Animated.timing(this.position, {
      toValue: { x, y: 0 },
      duration: 400,
      useNativeDriver: false,
      easing: Easing.out(Easing.quad)
    }).start();
  }

  onLocation(name) {
    this.props.onLocation(this.props.item.id);
    this.resetPosition();
  }
  
  onGotoLocation(name) {
    this.props.onGotoLocation(this.props.item.id);
    this.resetPosition();
  }

  onEdit(name) {
    this.props.onEdit(this.props.item.id);
    this.resetPosition();
  }

  onDelete(name) {
    Alert.alert(
      'Caution',
      'You are about to delete lock ' + this.props.item['name'] + '.\nDo you want to continue?',
      [
        {
          text: "Cancel",
          onPress: () => {this.resetPosition()},
          style: "cancel"
        },
        { text: "Delete",
          onPress: () => {
            Animated.timing(this.position, {
            toValue: { x: -SCREEN_WIDTH, y: 0 },
            duration: 350,
            useNativeDriver: false,
            }).start(() => this.props.onDelete(this.props.item.id));
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const haveLocation = Utils.notEmptyProperty(this.props.item, 'location');
    const curName = Utils.notEmptyProperty(this.props.item, 'name') ? this.props.item['name'] : '<unnamed>';
    const extraNameStyle = haveLocation ? {backgroundColor: '#70c3f9'} : {};
    return (
      <View style={styles.lockView} key={this.props.item.id.toString()} >
        <Animated.View style={[styles.lockLocationWrapper, this.getLeftButtonProps()]} >
          <TouchableOpacity onPress={() => this.onLocation('location')}>
            <View style={styles.buttonWrapper} >
              <Text style={styles.textStyle} numberOfLines={1}>Save</Text>
              <Image source={require('./Location.png')} />
              <Text style={styles.textStyle} numberOfLines={1}>Location</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        {haveLocation &&
          <Animated.View style={[styles.lockLocationWrapper, { left: 60, backgroundColor: '#50a3d9' }, this.getLeftButtonProps()]} >
            <TouchableOpacity onPress={() => this.onGotoLocation('gotoLocation')}>
              <View style={styles.buttonWrapper} >
                <Text style={styles.textStyle} numberOfLines={1}>Goto</Text>
                <Image source={require('./GotoLock.png')} />
                <Text style={styles.textStyle} numberOfLines={1}>Lock</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        }
        <Animated.View style={[styles.lockNameWrapper, this.position.getLayout()]} {...this.panResponder.panHandlers} >
            <Text style={[styles.lockName, extraNameStyle]}>{curName}</Text>
        </Animated.View>
        <Animated.View style={[styles.lockOptionsWrapper, { right: 60, backgroundColor: 'red' }, this.getRightButtonProps()]} >
          <TouchableOpacity onPress={() => this.onDelete('delete')}>
            <View style={styles.buttonWrapper} >
              <Text style={styles.textStyle} numberOfLines={1}>&nbsp;</Text>
              <Image source={require('./Delete.png')} />
              <Text style={styles.textStyle} numberOfLines={1}>Delete</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.lockOptionsWrapper, this.getRightButtonProps()]} >
          <TouchableOpacity onPress={() => this.onEdit('edit')}>
            <View style={styles.buttonWrapper} >
              <Text style={styles.textStyle} numberOfLines={1}>&nbsp;</Text>
              <Image source={require('./Edit.png')} />
              <Text style={styles.textStyle} numberOfLines={1}>Edit</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  lockView: {
    flex: 1,
    flexDirection: 'row',
    elevation: 3,
    height: 75,
    backgroundColor: 'rgb(230,230,230)',
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgb(0,0,0)',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  lockLocationWrapper: {
    left: 0,
    width: 60,
    height: 73,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    borderRadius: 7,
    paddingHorizontal: 18,
    paddingVertical: 23,
    backgroundColor: '#7ab991',
    position: 'absolute',
    elevation: 3,
    zIndex: 1,
  },
  lockOptionsWrapper: {
    position: 'absolute',
    right: 0,
    width: 60,
    height: 73,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 23,
    elevation: 3,
    backgroundColor: 'rgb(150, 150, 0)',
    zIndex: 1,
  },
  lockNameWrapper: {
    width: SCREEN_WIDTH / 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    elevation: 3,
    zIndex: 2
  },
  lockName: {
    fontSize: 25,
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 9,
  },
});

export default LockElement;
