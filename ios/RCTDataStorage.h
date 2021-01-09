//
//  RCTDataStorage.h
//  ridgeline
//
//  Created by Chris on 12/31/20.
//

#ifndef RCTDataStorage_h
#define RCTDataStorage_h

#import <React/RCTBridgeModule.h>

@interface RCTDataStorage : NSObject <RCTBridgeModule>

  @property NSString* lockStorePath;

  - (NSError*)formatException: (NSException*)exception code: (int)code message: (NSString*)message;
  - (NSString*)getFilePath;
  - (NSString*)getTempFile;

  - (void)LoadLocks: (RCTPromiseResolveBlock)resolve rejectCallback: (RCTPromiseRejectBlock)reject;
  - (void)SaveLocks: (NSDictionary*)locks resolveCallback: (RCTPromiseResolveBlock)resolve rejectCallback: (RCTPromiseRejectBlock)reject;
  - (void)UpdateLock: (NSDictionary*)lock resolveCallback: (RCTPromiseResolveBlock)resolve rejectCallback: (RCTPromiseRejectBlock)reject;

  - (void)LoadPreferences: (RCTPromiseResolveBlock)resolve rejectCallback: (RCTPromiseRejectBlock)reject;
  - (void)SavePreferences: (NSDictionary*)preferences resolveCallback: (RCTPromiseResolveBlock)resolve rejectCallback: (RCTPromiseRejectBlock)reject;

@end

#endif /* RCTDataStorage_h */
