/**
 * Copyright (c) 2021 Chris Schnaufer. All rights reserved
 *
 * @format
 * @flow strict-local
 */
'use strict'
import React from 'react';

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
  }

};

export default Utils;
