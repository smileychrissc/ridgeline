/**
 * Copyright (c) Chris Schnaufer. All rights reserved
 *
 * @format
 * @flow strict-local
 */
'use strict'
import React, { Component } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AddLock from './AddLock'
import Header from './Header';
import Properties from './Properties';

const locks = [];

class App extends Component {
  constructor(props) {
    super(props);
    
    this.onAddLock = this.onAddLock.bind(this);
    this.onPropertiesClose = this.onPropertiesClose.bind(this);
    this.showProperties = this.showProperties.bind(this);
    
    this.state = {
      render_properties: false,
      locks_count: (locks && locks.length) || 0,
    };
  }
  
  onAddLock() {
    alert("");
  }
  
  onPropertiesClose() {
    this.setState({render_properties: false});
  }

  showProperties() {
    this.setState({render_properties: true});
  }

  render() {
    const addLockSize = this.state.locks_count ? 'small' : 'large';
    const addLockWrapperStyle = this.state.locks_count ? styles.addLockWrapperSmall : styles.addLockWrapper;
    
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header properties={this.showProperties} />
            <View style={styles.addLockRow} >
              {addLockSize != 'small' && <View style={styles.addLockWrapper} />}
              <View style={addLockWrapperStyle} >
                <AddLock size={addLockSize} onClick={this.onAddLock} />
              </View>
              {addLockSize != 'small' && <View style={styles.addLockWrapper} />}
            </View>
            <Text>Something else</Text>
            {this.state.render_properties && <Properties onClose={this.onPropertiesClose} />}
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'rgb(255, 255, 255)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  addLockRow: {
    flex: 1,
    flexDirection: 'row',
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

export default App;
