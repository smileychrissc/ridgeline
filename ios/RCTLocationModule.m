//
//  RCTLocationModule.m//  ridgeline
//
//  Created by Chris on 12/29/20.
//
#import <React/RCTLog.h>

#import "RCTLocationModule.h"

@implementation RCTLocationModule

RCT_EXPORT_MODULE();

- (NSError*)formatException: (NSException*)exception code: (int)code message: (NSString*)message
{
    NSMutableDictionary * info = [NSMutableDictionary dictionary];
    [info setValue:exception.name forKey:@"ExceptionName"];
    [info setValue:exception.reason forKey:@"ExceptionReason"];
    [info setValue:exception.callStackReturnAddresses forKey:@"ExceptionCallStackReturnAddresses"];
    [info setValue:exception.callStackSymbols forKey:@"ExceptionCallStackSymbols"];
    [info setValue:exception.userInfo forKey:@"ExceptionUserInfo"];
    
    return [[NSError alloc] initWithDomain:message code:code userInfo:info];
}

RCT_EXPORT_METHOD(currentLocation: (RCTPromiseResolveBlock)resolve
                                    rejectCallback: (RCTPromiseRejectBlock)reject)
{
  RCTLogInfo(@"Called currentLocation");
    
  @try {
    dispatch_async(dispatch_get_main_queue(), ^{
      BOOL b = [self serviceAvailable];
      RCTLogInfo(@"> Current location: %x", b);
      if ([self serviceAvailable]) {
        RCTLogInfo(@"> Making call to get location");
        [self determineLocation:reject resolveCallback:resolve];
      } else {
        reject(@"Unavailable", @"Location service is not available", nil);
      }
    });
  }
  @catch (NSException *e) {
    reject(@"Exception", @"Location is not available", [self formatException:e code:1 message:@"Location is not available"]);
  }
}

RCT_EXPORT_METHOD(routeLocation: (double)fromLatitude
                                 fromLongitude: (double)fromLongitude
                                 toLatitude: (double)toLatitude
                                 toLongitude: (double)toLongitude)
{
  UIApplication *application = [UIApplication sharedApplication];
  NSString* directionsURL = [NSString stringWithFormat:@"https://maps.apple.com/?saddr=%f,%f&daddr=%f,%f",
                             fromLatitude, fromLongitude, toLatitude, toLongitude];
  NSURL* URL = [NSURL URLWithString:directionsURL];
  [application openURL:URL options:@{} completionHandler:nil];
}

- (void)acquireLocationManager {
  // Create the location manager
  if (nil == self.locationManager)
    RCTLog(@">> Acquired location manager");
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyKilometer;
    self.locationManager.distanceFilter = 2; // Meters
}

- (BOOL)serviceAvailable {
  RCTLog(@">> Check service available");
  return [CLLocationManager locationServicesEnabled ];
}

- (BOOL)isAuthorized {
  int authorizationStatus = [CLLocationManager authorizationStatus];
  RCTLog(@">> Check authorized");
  
  return authorizationStatus == kCLAuthorizationStatusAuthorizedWhenInUse
         || authorizationStatus == kCLAuthorizationStatusAuthorizedAlways;
}

- (BOOL) isDenied {
  int authorizationStatus = [CLLocationManager authorizationStatus];
  RCTLog(@">> Check denied");
  
  return authorizationStatus == kCLAuthorizationStatusDenied;
}

- (void)determineLocation: (RCTPromiseRejectBlock)reject resolveCallback: (RCTPromiseResolveBlock)resolve
{
  self.rejectCallback = reject;
  self.resolveCallback = resolve;
  
  RCTLog(@">> Get Manager");
  [self acquireLocationManager];

  if (![self isAuthorized]) {
    RCTLog(@">> Get Authorization");
    [self.locationManager requestWhenInUseAuthorization];
  }
  else {
    RCTLog(@">> Already Authorized");
  }
  
  RCTLog(@">> Start update");
  [self.locationManager startUpdatingLocation];
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManager: (CLLocationManager *)manager didUpdateLocations: (NSArray *)locations {
  CLLocation* location = [locations lastObject];
  RCTLog(@">> Got location Update");
  
  NSDate* eventDate = location.timestamp;
  
  NSTimeInterval howRecent = [eventDate timeIntervalSinceNow];
  
  if (fabs(howRecent) < 5) {
    RCTLog(@"latitude %+.6f, longitude: %+.6f\n", location.coordinate.latitude, location.coordinate.longitude);
    
    self.resolveCallback(@[@(location.coordinate.latitude), @(location.coordinate.longitude)]);

    [self.locationManager stopUpdatingLocation];
  }
}

- (void)locationManager: (CLLocationManager *)manager didFailWithError: (NSError *)error {
  RCTLog(@"Location errored out: %ld %@: %@", (long)error.code, error.domain, error.localizedDescription);
  self.rejectCallback(@"Failed", @"Failed to get location", error);

  [self.locationManager stopUpdatingLocation];
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
  if ([self isAuthorized]) {
    RCTLog(@"Authorization changed and we're autohorized");
    [self.locationManager startUpdatingLocation];
  } else if ([self isDenied]) {
    RCTLog(@"Authorization changed and Denied");
    self.rejectCallback(@"Denied", @"Access to location services was denied", nil);
  }
}

@end
