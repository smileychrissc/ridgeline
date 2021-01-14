/**
 * Copyright (c) Chris Schnaufer. All rights reserved
 *
 * @flow strict-local
 * @format
 */

'use strict';
import {Component} from 'react';
import {Dimensions,
        Platform,
        StyleSheet,
        Text,
        TextInput,
        TouchableOpacity,
        View} from 'react-native';
import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import Utils from './Utils'

const SCREEN_WIDTH = Dimensions.get('window').width;
const showPasswordFont = Platform.OS === 'ios' ? 'Courier' : (Platform.OS === 'windows' ? 'monospace' : 'monospace');


class EditLock extends Component {

  constructor(props) {
    super(props);
    
    this._onClose = this._onClose.bind(this);
    this._onChangeName = this._onChangeName.bind(this);
    this._onChangePassword = this._onChangePassword.bind(this);
    
    this.updatedItem = Object.assign({}, this.props.item);
    
    this.state = {
     visible: true,
     hide_password: false,
    };
  }

  _onChangeName(newValue) {
    this.updatedItem.name = newValue;
    if (Utils.notEmptyProperty(this.props, 'onUpdate')) {
      if (typeof this.props['onUpdate'] == 'function') {
        this.props.onUpdate(this.updatedItem);
      }
    }
  }
  
  _onChangePassword(newValue) {
    this.updatedItem.password = newValue;
    
    if (!this.state.hide_password) {
      this.setState({hide_password: this.state.hidePassword});
    }

    if (Utils.notEmptyProperty(this.props, 'onUpdate')) {
      if (typeof this.props['onUpdate'] == 'function') {
        this.props.onUpdate(this.updatedItem);
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
    const curName = Utils.notEmptyProperty(this.props.item, 'name') ? this.props.item['name'] : '';
    const curTitle = Utils.notEmptyProperty(this.props, 'newLock') ? "Add Lock" : "Edit Lock";
    const defaultPassword = this.updatedItem && Utils.notEmptyProperty(this.updatedItem, 'password') ? this.updatedItem['password'] : null;
    
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
          <TextInput style={[styles.edit_right_column, styles.edit_text_input, styles.name_input]}
                     defaultValue={this.props.item.name}
                     onChangeText={this._onChangeName}
                     />
        </View>
        <View style={styles.edit_field_wrapper} >
          <Text style={[styles.edit_left_column, styles.password_label]} numberOfLines={1}>New password</Text>
          <TextInput style={[styles.edit_right_column, styles.edit_text_input, styles.password_input]}
                     onChangeText={this._onChangePassword}
                     secureTextEntry={true}
                     />
        </View>
        <View style={styles.edit_field_wrapper} >
          <Text style={[styles.edit_left_column, styles.show_password_label]} >Show password</Text>
          <View style={[styles.edit_right_column, styles.show_password_right]}>
            <CheckBox style={styles.show_password_checkbox}
                      disabled={false}
                      value={!this.state.hide_password}
                      onValueChange={(newValue) => this.setState({hide_password: !newValue})}
                      />
            {!this.state.hide_password && <View style={styles.show_password_text_wrapper}><Text style={[styles.show_password_text]} numberOfLines={1} >{defaultPassword}</Text></View>}
          </View>
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
    width: SCREEN_WIDTH * 0.25,
    alignSelf: 'flex-start',
  },
  edit_right_column: {
    width: SCREEN_WIDTH * 0.55,
  },
  edit_text_input: {
    height: 20,
    borderColor: 'gray',
    borderWidth: 1,
  },
  name_label: {
  },
  name_input: {
  },
  password_label: {
  },
  password_input: {
  },
  show_password_label: {
    marginLeft: 10,
    fontSize: 11,
  },
  show_password_input: {
  },
  show_password_right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  show_password_checkbox: {
    width: 14,
    height: 14,
    marginLeft: 15,
    alignSelf: 'flex-start',
  },
  show_password_text_wrapper: {
    marginLeft: 7,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 4,
    borderColor: 'skyblue',
  },
  show_password_text: {
    marginLeft: 3,
    fontSize: 11,
    color: 'rgb(80,80,80)',
    fontFamily: showPasswordFont,
    width: SCREEN_WIDTH * 0.45,
  },
});

export default EditLock;
