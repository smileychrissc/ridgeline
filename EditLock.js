/**
 * Copyright (c) Chris Schnaufer. All rights reserved
 *
 * @flow strict-local
 * @format
 */

'use strict';
import {Component} from 'react';
import {Dimensions,
        StyleSheet,
        Text,
        TextInput,
        TouchableOpacity,
        View} from 'react-native';
import React from 'react';
import Utils from './Utils'

const SCREEN_WIDTH = Dimensions.get('window').width;

class EditLock extends Component {

  constructor(props) {
    super(props);
    
    this._onClose = this._onClose.bind(this);
    this._onChangeName = this._onChangeName.bind(this);
    
    this.state = {
     visible: true,
     updatedItem: Object.assign({}, this.props.item),
    };
  }

  _onChangeName(newValue) {
    this.state.updatedItem.name = newValue;
    if (Utils.notEmptyProperty(this.props, 'onUpdate')) {
      if (typeof this.props['onUpdate'] == 'function') {
        this.props.onUpdate(this.state.updatedItem);
      }
    }
  }
  
  _onClose() {
    if (Utils.notEmptyProperty(this.props, 'onClose')) {
      if (typeof this.props['onClose'] == 'function') {
        this.props['onClose'](this.updatedItem);
      } else {
        this.setState({visible:false});
      }
    }
  }

  render() {
    const curName = this.props.item && this.props.item.hasOwnProperty('name') ? this.props.item['name'] : '';
    const curTitle = this.props.hasOwnProperty('newLock') && this.props['newLock'] ? "Add Lock" : "Edit Lock";

    return (
    <View style={styles.page_wrapper}>
      <View style={styles.header}>
        <View style={styles.filler}>
        </View>
        <View style={styles.title_view}>
          <Text style={styles.title}>{curTitle}</Text>
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
      <View style={styles.edit_fields_view}>
        <View style={styles.edit_field_wrapper} >
          <Text style={styles.item_id_label}>ID</Text>
          <Text style={styles.item_id}>{this.props.item.id}</Text>
        </View>
        <View style={styles.edit_field_wrapper} >
          <Text style={[styles.edit_left_column, styles.name_label]} >Name</Text>
          <TextInput style={[styles.edit_text_input, styles.name_input]}
                     defaultValue={this.props.item.name}
                     onChangeText={this._onChangeName}
                     />
        </View>
      </View>
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
    top: 45,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: CalcDimension(Dimensions.get('window').width, 0.05),
    backgroundColor: 'rgba(240,240,240,1)',
    margin: "5% 5% 5% 5%",
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 2,
    paddingBottom: 10,
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
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 3,
    paddingRight: 5,
    paddingLeft: 5,
  },
  edit_fields_view: {
    flex: 1,
    flexDirection: 'column',
  },
  edit_field_wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  edit_left_column: {
    width: SCREEN_WIDTH * 0.20,
    alignSelf: 'flex-start',
  },
  edit_text_input: {
    height: 20,
    borderColor: 'gray',
    borderWidth: 1,
    width: SCREEN_WIDTH * 0.60,
  },
  name_input: {
  },
});

export default EditLock;
