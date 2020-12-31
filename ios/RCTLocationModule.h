//
//  RCTLocationModule.h
//  ridgeline
//
//  Created by Chris on 12/29/20.
//

#ifndef RCTLocationModule_h
#define RCTLocationModule_h

#import <CoreLocation/CoreLocation.h>

#import <React/RCTBridgeModule.h>

@interface RCTLocationModule : NSObject <RCTBridgeModule, CLLocationManagerDelegate>
  @property CLLocationManager *locationManager;
  @property RCTPromiseRejectBlock rejectCallback;
  @property RCTPromiseResolveBlock resolveCallback;

  - (NSError*)formatException: (NSException*)exception code: (int)code message: (NSString*)message;
  - (void)currentLocation: (RCTPromiseResolveBlock)resolve rejectCallback: (RCTPromiseRejectBlock)reject;
  - (void)routeLocation: (double)fromLatitude
                         fromLongitude: (double)fromLongitude
                         toLatitude: (double)toLatitude
                         toLongitude: (double)toLongitude;

  - (void)acquireLocationManager;
  - (BOOL)serviceAvailable;
  - (BOOL)isAuthorized;
  - (BOOL)isDenied;
  - (void)determineLocation: (RCTPromiseRejectBlock)reject resolveCallback: (RCTPromiseResolveBlock)resolve;
  - (void)locationManager: (CLLocationManager *)manager didUpdateLocations: (NSArray *)locations;
  - (void)locationManager: (CLLocationManager *)manager didFailWithError: (NSError *)error;

@end

#endif /* RCTLocationModule_h */
