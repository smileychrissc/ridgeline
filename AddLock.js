/**
 * Copyright (c) Chris Schnaufer. All rights reserved
 *
 * @format
 * @flow strict-local
 */
'use strict'
import {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';

class AddLock extends Component {

  constructor(props) {
    super(props);
    
    this._onClicked = this._onClicked.bind(this);
  }
  
  _onClicked() {
    if (this.props.hasOwnProperty('onClick') && typeof this.props['onClick'] == 'function') {
      this.props['onClick']();
    } else {
      console.log('AddLock was clicked but no onClick event handler specified');
    }
  }
  
  render() {
    const sizeLarge = this.props.hasOwnProperty('size') && this.props['size'] == 'small' ? false : true;
    const addLockBorderStyle = sizeLarge ? styles.addLockBorder : styles.addLockBorderSmall;
    const addLockVerticalStyle = sizeLarge ? styles.addLockBarVertical : styles.addLockBarVerticalSmall;
    const addLockHorizontalStyle = sizeLarge ? styles.addLockBarHorizontal : styles.addLockBarHorizontalSmall;
    return (
      <TouchableOpacity onPress={this._onClicked}>
        <View style={addLockBorderStyle} >
          <View style={addLockVerticalStyle} />
          <View style={addLockHorizontalStyle} />
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  addLockBorder: {
    flex: 1,
    width: 100,
    height: 100,
    borderColor: 'rgb(200,200,200)',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderRadius: 50,
    marginTop: 60,
  },
  addLockBorderSmall: {
    flex: 1,
    width: 31,
    height: 31,
    borderColor: 'rgb(200,200,200)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 15,
  },
  addLockBarVertical: {
    position: 'absolute',
    left: 42,
    top: 22,
    width: 10,
    height: 50,
    backgroundColor: 'rgb(200,200,200)'
  },
  addLockBarVerticalSmall: {
    position: 'absolute',
    left: 12,
    top: 5,
    width: 5,
    height: 20,
    backgroundColor: 'rgb(200,200,200)'
  },
  addLockBarHorizontal: {
    position: 'absolute',
    left: 22,
    top: 42,
    width: 50,
    height: 10,
    backgroundColor: 'rgb(200,200,200)'
  },
  addLockBarHorizontalSmall: {
    position: 'absolute',
    left: 5,
    top: 12,
    width: 20,
    height: 5,
    backgroundColor: 'rgb(200,200,200)'
  },
});

export default AddLock;
