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

const { DataStorage, LocationModule } = NativeModules;

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
    this.onGotoLocation = this.onGotoLocation.bind(this);
    this.onPropertiesClose = this.onPropertiesClose.bind(this);
    this.onSwipped = this.onSwipped.bind(this);
    this.renderLocks = this.renderLocks.bind(this);
    this.resetSwiping = this.resetSwiping.bind(this);
    this.showProperties = this.showProperties.bind(this);

    // Load the locks
    DataStorage.LoadLocks()
      .then((loaded_locks) => {locks = (loaded_locks.length > 0) ? loaded_locks : [{id: '0'}];
                               this.setState({locks_count:locks.length});})
      .catch(ex => {
        const { code, message, details } = ex;
        console.log("App:contructor:LoadLocks Exception:", code, message, details);
      });

    this.state = {
      active_lock_id: null,
      editing_lock: null,
      locks_count: (locks && locks.length) || 0,
      new_lock: false,
      render_properties: false,
      swiping: false,
    };
  }
  
  // TODO: After 1 second display a spinner
  // TODO: Retry save upon failure for x times (with status message)
  saveLocks() {
    DataStorage.SaveLocks(locks)
      .then(() => console.log("Locks Saved"))
      .catch(ex => {
        const { code, message, details } = ex;
        console.log("saveLocks Exception:", code, message, details);
      });
  }

  editDone(editedItem) {
    const editIndex = locks.findIndex((item) => item.id === editedItem.id);
    if (editIndex >= 0) {
      // Check if we need to encrypt the password
      if (Utils.notEmptyProperty(editedItem, 'password') &&
          Utils.notEmptyProperty(locks[editIndex], 'password') &&
          (editedItem['password'] !== locks[editIndex]['password'])) {
        //editedItem['password'] = Encrypt.hash(editedItem['password'];
      }
      locks[editIndex] = editedItem;
    
      this.setState({editing_lock: null, locks_count: (locks && locks.length) || 0});
      this.saveLocks();
    } else {
      console.log("Unable to find edited entry after edit");
    }
  }
  
  editUpdate(editedItem) {
    const editIndex = locks.findIndex((item) => item.id === editedItem.id);
    if (editIndex >= 0) {
      locks[editIndex] = editedItem;
    } else {
      if (this.state.new_lock) {
        const newLen = locks.push(editedItem);
      } else {
        console.log("Edited entry not found:",editedItem);
      }
    }
  }
  
  onAddLock() {
    this.setState({editing_lock: {id: Utils.uuidv4()}, new_lock: true});
  }
  
  onPropertiesClose() {
    this.setState({render_properties: false});
  }

  showProperties() {
    this.setState({render_properties: true});
  }
  
  onDelete(id) {
    const deleteLock = locks.filter(item => {
      return item.id === id;
    });
    var curLocks = locks.filter(item => {
      return item.id !== id;
    });
    locks = curLocks;
    this.setState({locks_count: locks.length})
    this.saveLocks();
  }
  
  onEdit(id) {
    console.log("On Edit:",id);
    var editLock = locks.filter(item => {
      return item.id === id;
    });
    console.log("Editing:",editLock)
    if (editLock.length > 0) {
      this.setState({editing_lock: editLock[0], new_lock: false});
    } else {
      console.log("WARN: Did not find lock to edit");
    }
  }
  
  onLocation(id) {
    console.log("Location",id,LocationModule);
    LocationModule.currentLocation()
      .then(location => {
        const locIndex = locks.findIndex((item) => item.id === id);
        if (locIndex >= 0) {
          locks[locIndex]['location'] = location;
          this.setState({swiping: this.state.swiping});
          this.saveLocks();
        } else {
          console.log("Entry not found for location:",id);
        }
      })
      .catch(ex => {
        const { code, message, details } = ex;
        console.log("OnLocation Exception:", code, message, details);
      });
  }
  
  onGotoLocation(id) {
    const locItem = locks.filter(item => {
      return item.id === id;
    });
    console.log("GOTO:",id,locItem,locItem[0]['location']);
    LocationModule.currentLocation()
      .then(location => {
        LocationModule.routeLocation(location[0], location[1], locItem[0]['location'][0], locItem[0]['location'][1]);
      })
      .catch(ex => {
        const { code, message, details } = ex;
        console.log("onGotoLocation Exception:", code, message, details);
      });
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
                   onGotoLocation={this.onGotoLocation}
                   onSwiping={this.onSwiping}
                   onSwipedLeft={this.onSwipped}
                   onSwipedRight={this.onSwipped}
                   onReset={this.resetSwiping}
      />
    );
  }

  render() {
    const addLockSize = this.state.locks_count ? 'small' : 'large';
    const editNewLock = this.state.editing_lock ? (this.state.new_lock ? true : false) : false;
    if (this.state.editing_lock)
      console.log("EDIT NEW LOCK:",editNewLock,this.state.new_lock);
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
                                                           newLock={editNewLock}
                                                           onClose={this.editDone}
                                                           onUpdate={this.editUpdate}
                                                           />}
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
