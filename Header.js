/**
 * Copyright (c) Chris Schnaufer. All rights reserved
 *
 * @flow strict-local
 * @format
 */

'use strict';
import {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

class Header extends Component {

  constructor(props) {
    super(props);
    
    this._onPressProperties = this._onPressProperties.bind(this);
  }
  
  _onPressProperties() {
    if (this.props && this.props.hasOwnProperty('properties')) {
      if (typeof this.props['properties'] == 'function') {
        this.props['properties']();
      } else {
        throw new TypeError('Header: props[\'properties\'] is not a function');
      }
    }
  }

  render() {
    return (
    <View style={styles.wrapper}>
      <Text> </Text>
      <View style={styles.text_view}>
        <Text style={styles.text}>RidgeLine</Text>
      </View>
      <TouchableOpacity onPress={this._onPressProperties}>
        <View style={styles.properties}>
          <Image source={require('./Properties.png')} />
        </View>
      </TouchableOpacity>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(188,188,188)',
  },
  text_view: {
  },
  text: {
    flex: 5,
    fontSize: 32,
    fontWeight: '500',
    color: 'black',
    alignSelf: 'stretch',
  },
  menu: {
    flex: 1,
    marginTop: 4,
    marginLeft: 15,
  },
  properties: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 4,
    marginRight: 15,
  },
});

export default Header;
