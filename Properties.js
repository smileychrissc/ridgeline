/**
 * Copyright (c) Chris Schnaufer. All rights reserved
 *
 * @flow strict-local
 * @format
 */

'use strict';
import {Component} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

class Properties extends Component {

  constructor(props) {
    super(props);
    
    this._onClose = this._onClose.bind(this);
    
    this.state = {
     visible: true,
    };
  }
  
  _onClose() {
    if (this.props && this.props.hasOwnProperty('onClose')) {
      if (typeof this.props['onClose'] == 'function') {
        this.props['onClose']();
      } else {
        this.setState({visible:false});
      }
    }
  }

  render() {
    return (
    <View style={styles.page_wrapper}>
      <View style={styles.header}>
        <View style={styles.filler}>
        </View>
        <View style={styles.title_view}>
          <Text style={styles.title}>Properties</Text>
        </View>
        <View style={styles.filler}>
        </View>
      </View>
      <View style={styles.close_wrapper}>
        <TouchableOpacity onPress={this._onClose}>
          <View style={styles.close_view}>
            <Text style={styles.close}>X</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text>Here is some text</Text>
    </View>
    );
  }
}

const CalcDimension = (size, percentage) => size - (size * percentage * 2);

const styles = StyleSheet.create({
  filler: {
    flex: 1,
  },
  close_wrapper: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  page_wrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: CalcDimension(Dimensions.get('window').width, 0.05),
    height: CalcDimension(Dimensions.get('window').height, 0.05),
    backgroundColor: 'rgba(240,240,240,1)',
    margin: "5% 5% 5% 5%",
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 2,
  },
  header: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(160,160,160)',
  },
  title_view: {
    flex: 1,
    alignSelf: 'center',
  },
  title: {
    fontSize: 23,
    fontWeight: '300',
    color: 'black',
  },
  close_view: {
    flex: 1,
    alignSelf: 'flex-end',
    marginTop: 2,
    marginRight: 5,
  },
  close: {
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
    backgroundColor: 'rgb(190,190,190)',
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 3,
    paddingRight: 5,
    paddingLeft: 5,
  },
});

export default Properties;
