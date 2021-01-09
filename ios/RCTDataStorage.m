//
//  RCTDataStorage.m
//  ridgeline
//
//  Created by Chris on 12/31/20.
//

#import <React/RCTLog.h>

#import "RCTDataStorage.h"

@implementation RCTDataStorage

RCT_EXPORT_MODULE();

SInt32 MAX_TEMP_FILENAME_TRIES = 24;

NSString* locksFileName = @"LockStore.geojson";
NSString* tempFilePrefix = @"ridgeline_";

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

- (NSString*)getFilePath {

  if (!_lockStorePath) {
    NSArray* dirPaths = NSSearchPathForDirectoriesInDomains(NSAllLibrariesDirectory, NSUserDomainMask, YES);
    
    NSString* libDir = dirPaths[0];
    NSString* dataFile = [libDir stringByAppendingPathComponent: locksFileName];
    
    _lockStorePath = dataFile;
  }
  
  return _lockStorePath;
}

- (NSString*)getTempFile {

  NSArray* dirPaths = NSSearchPathForDirectoriesInDomains(NSItemReplacementDirectory, NSUserDomainMask, YES);

  NSString* tempDir = dirPaths[0];
  NSString* result = nil;
  CFUUIDRef uuid;
  CFStringRef uuidStr;
  SInt32 curLoopNum = 0;

  while ((result == nil) && (curLoopNum < MAX_TEMP_FILENAME_TRIES)) {
    curLoopNum++;
    
    uuid = CFUUIDCreate(NULL);
    if (uuid == NULL) {
      RCTLogInfo(@"DataStorage: getTempFile: NULL UUID for loop %d", curLoopNum);
      continue;
    }

    uuidStr = CFUUIDCreateString(NULL, uuid);
    if (uuidStr == NULL) {
      RCTLogInfo(@"DataStorage: getTempFile: NULL UUID String for loop %d", curLoopNum);
      continue;
    }

    result = [tempDir stringByAppendingPathComponent:[NSString stringWithFormat:@"%@-%@", tempFilePrefix, uuidStr]];
    if (result == nil) {
      RCTLogInfo(@"DataStorage: getTempFile: NULL temp filename for loop %d", curLoopNum);
      continue;
    }

    CFRelease(uuidStr);
    CFRelease(uuid);
  }

  return result;
}

RCT_EXPORT_METHOD(LoadLocks: (RCTPromiseResolveBlock)resolve rejectCallback: (RCTPromiseRejectBlock)reject)
{
  @try {
    NSString *storeFile = [self getFilePath];
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    if ([fileManager fileExistsAtPath: storeFile]) {
      NSData* dataBuffer = [fileManager contentsAtPath: storeFile];
      if (dataBuffer == nil) {
        NSError* error = [[NSError alloc] initWithDomain:@"Lock file read error" code:100 userInfo:nil];
        reject(@"Error", @"Lock file error", error);
        return;
      }
      
      NSString* jsonString = [[NSString alloc] initWithData:dataBuffer encoding:NSUTF8StringEncoding];
      if (jsonString == nil) {
        NSError* error = [[NSError alloc] initWithDomain:@"Lock file corrupted error" code:101 userInfo:nil];
        reject(@"Error", @"Lock file corrupted", error);
        return;
      }
      
      NSData* data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
      NSError* error = nil;
      NSDictionary* locks = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
      
      if (error != nil) {
        reject(@"Error", @"Lock file JSON parse error", error);
      }
      if (locks == nil) {
        NSError* error = [[NSError alloc] initWithDomain:@"Lock file read error" code:102 userInfo:nil];
        reject(@"Error", @"Lock file JSON parse error", error);
        return;
      }
      
      resolve(locks);
    }
    else {
      resolve(@{});
    }
  }
  @catch (NSException *e) {
    reject(@"Exception", @"Unable to load locks", [self formatException:e code:1 message:@"Unable to load locks"]);
  }
}

RCT_EXPORT_METHOD(SaveLocks: (NSDictionary*)locks resolveCallback: (RCTPromiseResolveBlock)resolve rejectCallback: (RCTPromiseRejectBlock)reject)
{
  @try {
    NSError* error = nil;
    NSData* jsonDataString = [NSJSONSerialization dataWithJSONObject:self
                                                  options:(NSJSONWritingOptions)NSJSONWritingPrettyPrinted
                                                  error:&error];

    if (error != nil) {
      reject(@"Error", @"Lock data JSON conversion error", error);
      return;
    }
    if (jsonDataString == nil) {
      NSError* error = [[NSError alloc] initWithDomain:@"Lock data conversion failed" code:110 userInfo:nil];
      reject(@"Error", @"Lock data conversion failed", error);
      return;
    }
    NSString* jsonString = [[NSString alloc] initWithData:jsonDataString encoding:NSUTF8StringEncoding];
    NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];

    NSString *storeFile = [self getFilePath];
    NSFileManager *fileManager = [NSFileManager defaultManager];
    if ([fileManager fileExistsAtPath: storeFile]) {
/* Perhaps needs cloud enabled with registered app?

      // Write out to temp file, merge the results, and remove the temp file
      NSString* tempName = [self getTempFile];
      NSString* backupName = @"lockBackup1";
      NSError* error = nil;
      NSURL* repl = nil;
      NSURL* storeURL = [NSURL fileURLWithPath:storeFile];
      NSURL* tempURL = [NSURL fileURLWithPath:tempName];
      [fileManager createFileAtPath: tempName contents:jsonData attributes:nil];
      
      BOOL updated = [fileManager replaceItemAtURL:storeURL
                                                   withItemAtURL:tempURL
                                                   backupItemName:backupName
                                                   options:nil
                                                   resultingURL:&repl
                                                   error:&error];

      if (!error) {
        reject(@"Error", @"Lock update error", error);
        return;
      }
  */

      BOOL updated = [fileManager createFileAtPath:storeFile contents:jsonData attributes:nil];

      if (!updated) {
        NSError* error = [[NSError alloc] initWithDomain:@"Lock data update failed" code:111 userInfo:nil];
        reject(@"Error", @"Lock data update failed", error);
        return;
      }
      
/*      [fileManager removeItemAtPath:tempName error:&error];
      if (error) {
        RCTLogInfo(@"DataStorage: saveLocks: unable to remove temporary file: %@", error.localizedDescription);
      }
*/
      resolve(locks);
    }
    else {
      [fileManager createFileAtPath:storeFile contents:jsonData attributes: nil];
    }

  } @catch (NSException *e) {
    reject(@"Exception", @"Unable to save locks", [self formatException:e code:1 message:@"Unable to load locks"]);
  }
}

RCT_EXPORT_METHOD(LoadPreferences: (RCTPromiseResolveBlock)resolve rejectCallback: (RCTPromiseRejectBlock)reject)
{

}

RCT_EXPORT_METHOD(SavePreferences: (NSDictionary*)preferences resolveCallback: (RCTPromiseResolveBlock)resolve rejectCallback: (RCTPromiseRejectBlock)reject)
{

}

@end
