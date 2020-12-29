//
//  RCTLocationModule.m//  ridgeline
//
//  Created by Chris on 12/29/20.
//

#import "RCTLocationModule.h"

@implementation RCTLocationModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(currentLocation)
{
  RCTLogInfo(@"Called currentLocation");
}

@end
