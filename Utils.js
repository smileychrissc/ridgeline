/**
 * Copyright (c) 2021 Chris Schnaufer. All rights reserved
 *
 * @format
 * @flow strict-local
 */
'use strict'
import React, { crypto } from 'react';

var Utils = {
  notEmptyProperty(curObj, prop) {
    if (!curObj.hasOwnProperty(prop)) {
      return false;
    }
    if (curObj[prop] == null) {
      return false;
    }
    if (typeof curObj[prop] == 'number') {
      return true;
    }
    if (typeof curObj[prop] == 'string') {
      return curObj[prop].trim().length > 0;
    }
    if (typeof curObj[prop] == 'object') {
      return curObj[prop].keys().length > 0;
    }
    return true;
  },

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

};

export default Utils;
