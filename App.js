/**
 * Copyright (c) Chris Schnaufer. All rights reserved
 *
 * @format
 * @flow strict-local
 */
'use strict'
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  NativeModules,
  PanResponder,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { LocationModule } = NativeModules;

import EditLock from './EditLock'
import Header from './Header';
import LockElement from './LockElement';
import NewLockElement from './NewLockElement';
import Properties from './Properties';
import Utils from './Utils';

var locks = [{
    id: '0',
  }, {
    id: '1',
    name: 'bike 1',
  }, {
    id: '2',
    name: 'bike 2',
  }, {
    id: '3',
    name: 'gym',
  }, {
    id: '4',
    name: 'gym 2',
  }, {
    id: '5',
    name: 'Front Door',
  }, {
    id: '6',
    name: 'Side Door',
  }, {
    id: '7',
    name: 'Back door',
  }, {
    id: '8',
    name: 'Neighbors garage door',
  }, {
    id: '9',
    name: 'garage door',
  }, {
    id: '10',
    name: 'basement outside door',
  }
  ];
  
class App extends Component {
  constructor(props) {
    super(props);
    
    this.editDone = this.editDone.bind(this);
    this.editUpdate = this.editUpdate.bind(this);
    this.onSwiping = this.onSwiping.bind(this);
    this.onAddLock = this.onAddLock.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onLocation = this.onLocation.bind(this);
    this.onPropertiesClose = this.onPropertiesClose.bind(this);
    this.onSwipped = this.onSwipped.bind(this);
    this.renderLocks = this.renderLocks.bind(this);
    this.resetSwiping = this.resetSwiping.bind(this);
    this.showProperties = this.showProperties.bind(this);
    
    this.state = {
      active_lock_id: null,
      editing_lock: null,
      locks_count: (locks && locks.length) || 0,
      render_properties: false,
      swiping: false,
    };
  }
  
  editDone() {
    this.setState({editing_lock: null});
  }
  
  editUpdate(editedItem) {
    const editIndex = locks.findIndex((item) => item.id === editedItem.id);
    if (editIndex >= 0) {
      locks[editIndex] = editedItem;
    } else {
      console.log("Edited entry not found:",editedItem);
    }
  }
  
  onAddLock() {
    this.setState({editing_lock: {id: Utils.uuidv4()}});
  }
  
  onPropertiesClose() {
    this.setState({render_properties: false});
  }

  showProperties() {
    this.setState({render_properties: true});
  }
  
  onDelete(id) {
    var curLocks = locks.filter(item => {
      return item.id !== id;
    });
    locks = curLocks;
    this.setState({locks_count: locks.length})
  }
  
  onEdit(id) {
    console.log("On Edit:",id);
    var editLock = locks.filter(item => {
      return item.id === id;
    });
    console.log("Editing:",editLock)
    if (editLock.length > 0) {
      this.setState({editing_lock: editLock[0]});
    } else {
      console.log("WARN: Did not find lock to edit");
    }
  }
  
  onLocation(id) {
    console.log("Location",id);
    LocationModule.currentLocation();
  }
  
  onSwiping(swiping) {
    if (this.state.swiping != swiping) {
      this.setState({swiping});
    }
  }
  
  onSwipped(id) {
    console.log("Swipped",this.state.active_lock_id,"->",id);
    if (!this.state.swiping || (this.state.active_lock_id != id)) {
      this.setState({swiping: true, active_lock_id: id});
    }
  }
  
  resetSwiping() {
    if (this.state.swiping || (this.state.active_lock_id != null)) {
      this.setState({swiping: false, active_lock_id: null});
    }
  }
  
  renderLocks({item, index, separators}) {
    if (item.hasOwnProperty('id') && (parseInt(item['id']) == 0)) {
      return (
        <NewLockElement onClick={this.onAddLock} lockSize={this.state.locks_count ? 'small' : 'large'} />
      );
    }

    const curName = Utils.notEmptyProperty(item, 'name') ? item['name'] : '<unnamed>';
    return (
      <LockElement item={item}
                   activeItem={this.state.active_lock_id}
                   onBegin={(id) => console.log("Begining")}
                   onDelete={this.onDelete}
                   onEdit={this.onEdit}
                   onLocation={this.onLocation}
                   onSwiping={this.onSwiping}
                   onSwipedLeft={this.onSwipped}
                   onSwipedRight={this.onSwipped}
                   onReset={this.resetSwiping}
      />
    );
  }

  render() {
    const addLockSize = this.state.locks_count ? 'small' : 'large';
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <FlatList
            scrollEnabled={!(this.state.swiping)}
            data={locks}
            renderItem={this.renderLocks}
            keyExtractor={item => item.id}
            ListHeaderComponent={() => {return (
                   <>
                    <Header properties={this.showProperties} />
                  </>
              );}}
            stickyHeaderIndices={[0]}
          />
          {(this.state.editing_lock !== null) && <EditLock item={this.state.editing_lock}
                                                           onClose={this.editDone}
                                                           onUpdate={this.editUpdate} />}
          {this.state.render_properties && <Properties onClose={this.onPropertiesClose} />}
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
  lockView: {
    backgroundColor: 'rgb(230,230,230)',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgb(0,0,0)',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockName: {
    fontSize: 25,
  },
});

export default App;
