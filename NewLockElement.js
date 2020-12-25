/**
 * Copyright (c) Chris Schnaufer. All rights reserved
 *
 * @format
 * @flow strict-local
 */
'use strict'
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import AddLock from './AddLock'

class NewLockElement extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const addLockWrapperStyle = this.props.lockSize == 'small' ? styles.addLockWrapperSmall : styles.addLockWrapper;

    return (
        <View style={styles.addLockRow} >
          {this.props.lockSize != 'small' && <View style={styles.addLockWrapper} />}
          <View style={addLockWrapperStyle} >
            <AddLock size={this.props.lockSize} onClick={this.onAddLock} />
          </View>
         {this.props.lockSize != 'small' && <View style={styles.addLockWrapper} />}
       </View>
    );
  }
};

const styles = StyleSheet.create({
  addLockRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLockWrapper: {
  },
  addLockWrapperSmall: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 10,
  },
});

export default NewLockElement;
