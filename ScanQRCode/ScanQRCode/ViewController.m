//
//  ViewController.m
//  ScanQRCode
//
//  Created by Ben on 2017/5/15.
//  Copyright © 2017年 Het. All rights reserved.
//

#import "ViewController.h"

#import <AVFoundation/AVFoundation.h>
#import "ZBarSDK.h"

//获取设备的物理高度
#define ScreenHeight [UIScreen mainScreen].bounds.size.height
//获取设备的物理宽度
#define ScreenWidth [UIScreen mainScreen].bounds.size.width
#define KFONT(o) [UIFont systemFontOfSize:o]

#define SCANVIEW_EdgeTop 40.0
#define SCANVIEW_EdgeLeft 50.0
#define TINTCOLOR_ALPHA 0.2 //浅色透明度
#define DARKCOLOR_ALPHA 0.5 //深色透明度

@interface ViewController ()<ZBarReaderDelegate,ZBarReaderViewDelegate,UINavigationControllerDelegate,UIImagePickerControllerDelegate>
{
    UIImageView* scanZomeBack;
    ZBarReaderView *readview;
    UIImageView *readLineView;
    BOOL is_Anmotion;
    UIView *_QrCodeline;
    NSTimer *_timer;
    //设置扫描画面
    UIView *_scanView;
    UIImagePickerController * _picker;
    UIButton *flashlightBtn;
    AVCaptureDevice * device;
    AVCaptureSession * session;
}

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    //初始化扫描界面
    [ self setScanView];
    readview = [ZBarReaderView new];
    readview.backgroundColor = [UIColor clearColor];
    readview.frame = CGRectMake ( 0 , 0, ScreenWidth , ScreenHeight  );

    readview.allowsPinchZoom = YES;//使用手势变焦
    readview.trackingColor = [UIColor redColor];
    //  readview.showsFPS = NO;// 显示帧率  YES 显示  NO 不显示
    readview.torchMode=NO;
    //readview.scanCrop = CGRectMake(0, 0, 1, 1);//将被扫描的图像的区域
    //readview.alpha=0.9;
    
    UIImage *hbImage=[UIImage imageNamed:@"pick_bg.png"];
    scanZomeBack=[[UIImageView alloc] initWithImage:hbImage];
    //添加一个背景图片
    CGRect mImagerect=CGRectMake((readview.frame.size.width-200)/2.0, (readview.frame.size.height-200)/2.0, 200, 200);
    [scanZomeBack setFrame:mImagerect];
    //readview.scanCrop = [self getScanCrop:mImagerect readerViewBounds:readview.bounds];//将被扫描的图像的区域
    
    [readview addSubview:scanZomeBack];
    [readview addSubview:readLineView];
    
    [ readview addSubview : _scanView ];
    // [readview start];
    
    
    [self addFlashBtnAndAlumBtn];

}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)viewWillAppear:(BOOL)animated{

    [super viewWillAppear:animated];
    
    readview.readerDelegate = self;
    [self.view addSubview:readview];
    [self.view exchangeSubviewAtIndex:1 withSubviewAtIndex:0];
    _QrCodeline .frame= CGRectMake ( SCANVIEW_EdgeLeft , SCANVIEW_EdgeTop , ScreenWidth - 2 * SCANVIEW_EdgeLeft , 2);
    [readview start];
    //[ self moveUpAndDownLine];
    [self createTimer];
    
    
    AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    
    if (status ==AVAuthorizationStatusRestricted||status ==AVAuthorizationStatusDenied) {
//        [[BaseAlert shareInstance]alertWithAlertStyle:AlertStyleAlert title:@"无法使用相机" message:@"请在iphone的“设置-隐私-相机”中允许访问相机。" cancelBtnTitle:@"确定" buttonList:@[@"返回" ] AndSelectButtonAction:^(NSNumber *index) {
//            if ([index integerValue]==0) {
//                if ([[UIApplication sharedApplication]canOpenURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]]) {
//                    
//                    [[UIApplication sharedApplication]openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]];
//                }
//            }else{
//                [self.navigationController popViewControllerAnimated:YES];
//            }
//            
//        }];
        
    }else{
        [self setFlashlight];
    }

}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillAppear:animated];
    //self.navigationController.navigationBar.shadowImage = [[UIImage alloc] init];
    [self stopTimer];
    
    if (session.running) {
        [session stopRunning];
    }
    
    
    
}



- ( void )createTimer
{
    //创建一个时间计数
    _timer=[NSTimer scheduledTimerWithTimeInterval: 1.0 target: self selector: @selector (moveUpAndDownLine) userInfo: nil repeats: YES ];
}
- ( void )stopTimer
{
    if ([_timer isValid] == YES ) {
        [_timer invalidate];
        _timer = nil ;
    }
}

#pragma mark 二维码的扫描区域
- ( void )setScanView
{
    _scanView =[[ UIView alloc ] initWithFrame : CGRectMake ( 0 , 0 , ScreenWidth , ScreenHeight - 64 )];
    _scanView . backgroundColor =[ UIColor clearColor ];
    //最上部view
    UIView * upView = [[ UIView alloc ] initWithFrame : CGRectMake ( 0 , 0 , ScreenWidth , SCANVIEW_EdgeTop )];
    upView. alpha = TINTCOLOR_ALPHA ;
    upView. backgroundColor = [ UIColor blackColor ];
    [ _scanView addSubview :upView];
    UIImageView *upimageView=[[UIImageView alloc]initWithFrame:CGRectMake ( SCANVIEW_EdgeLeft , SCANVIEW_EdgeTop , 32 , 32 )];
    upimageView.image=[UIImage imageNamed:@"ScanQR1"];
    [_scanView addSubview:upimageView];
    //左侧的view
    UIView *leftView = [[ UIView alloc ] initWithFrame : CGRectMake ( 0 , SCANVIEW_EdgeTop , SCANVIEW_EdgeLeft , ScreenWidth - 2 * SCANVIEW_EdgeLeft )];
    leftView. alpha = TINTCOLOR_ALPHA ;
    leftView. backgroundColor = [ UIColor blackColor ];
    [ _scanView addSubview :leftView];
    UIImageView *leftimageView=[[UIImageView alloc]initWithFrame:CGRectMake ( SCANVIEW_EdgeLeft , SCANVIEW_EdgeTop+ScreenWidth - 2 * SCANVIEW_EdgeLeft-32 , 32,32 )];
    leftimageView.image=[UIImage imageNamed:@"ScanQR3"];
    [_scanView addSubview:leftimageView];
    /******************中间扫描区域****************************/
    UIImageView *scanCropView=[[ UIImageView alloc ] initWithFrame : CGRectMake ( SCANVIEW_EdgeLeft , SCANVIEW_EdgeTop , ScreenWidth - 2 * SCANVIEW_EdgeLeft , ScreenWidth - 2 * SCANVIEW_EdgeLeft )];
    scanCropView. backgroundColor =[ UIColor clearColor ];
    [ _scanView addSubview :scanCropView];
    //右侧的view
    UIView *rightView = [[ UIView alloc ] initWithFrame : CGRectMake ( ScreenWidth - SCANVIEW_EdgeLeft , SCANVIEW_EdgeTop , SCANVIEW_EdgeLeft , ScreenWidth - 2 * SCANVIEW_EdgeLeft )];
    rightView. alpha = TINTCOLOR_ALPHA ;
    rightView. backgroundColor = [ UIColor blackColor ];
    [ _scanView addSubview :rightView];
    UIImageView *rightimageView=[[UIImageView alloc]initWithFrame:CGRectMake ( ScreenWidth - SCANVIEW_EdgeLeft-32 , SCANVIEW_EdgeTop , 32,32 )];
    rightimageView.image=[UIImage imageNamed:@"ScanQR2"];
    [_scanView addSubview:rightimageView];
    //底部view
    UIView *downView = [[ UIView alloc ] initWithFrame : CGRectMake ( 0 , ScreenWidth - 2 * SCANVIEW_EdgeLeft + SCANVIEW_EdgeTop , ScreenWidth , ScreenHeight )];
    //downView.alpha = TINTCOLOR_ALPHA;
    downView. backgroundColor = [[ UIColor blackColor ] colorWithAlphaComponent : TINTCOLOR_ALPHA ];
    [ _scanView addSubview :downView];
    UIImageView *downimageView=[[UIImageView alloc]initWithFrame:CGRectMake( ScreenWidth - SCANVIEW_EdgeLeft-32 ,SCANVIEW_EdgeTop+ScreenWidth - 2 * SCANVIEW_EdgeLeft-32, 32,32 )];
    downimageView.image=[UIImage imageNamed:@"ScanQR4"];
    [_scanView addSubview:downimageView];
    //用于说明的label
    UILabel *labIntroudction= [[ UILabel alloc ] init ];
    labIntroudction. backgroundColor = [ UIColor clearColor ];
    labIntroudction. frame = CGRectMake ( 0 , 5 , ScreenWidth , 20 );
    labIntroudction. numberOfLines = 1 ;
    labIntroudction. font =[ UIFont systemFontOfSize : 15.0 ];
    labIntroudction. textAlignment = NSTextAlignmentCenter ;
    labIntroudction. textColor =[ UIColor whiteColor ];
    labIntroudction. text = @"将二维码对准方框，即可自动扫描" ;
    [downView addSubview :labIntroudction];
    UIView *darkView = [[ UIView alloc ] initWithFrame : CGRectMake ( 0 , downView. frame . size . height - 100.0 , ScreenWidth , 100.0 )];
    darkView. backgroundColor = [[ UIColor blackColor ]  colorWithAlphaComponent : DARKCOLOR_ALPHA ];
    [downView addSubview :darkView];
    _QrCodeline = [[ UIView alloc ] initWithFrame : CGRectMake ( SCANVIEW_EdgeLeft , SCANVIEW_EdgeTop , ScreenWidth - 2 * SCANVIEW_EdgeLeft , 2)];
    _QrCodeline . backgroundColor =[UIColor colorWithRed:26/255.0 green:178/255.0 blue:10/255.0 alpha:1.0];// [ UIColor blueColor];
    [ _scanView addSubview : _QrCodeline ];
}

- (void)addFlashBtnAndAlumBtn{
    
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    [button setTitle:@"相册" forState:UIControlStateNormal];
    [button setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    button.frame = CGRectMake(0, 0, 60, 44);
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc]initWithCustomView:button];
    [button addTarget:self action:@selector(openAlbum) forControlEvents:UIControlEventTouchUpInside];
    
    flashlightBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [flashlightBtn setTitle:@"开启闪光灯" forState:UIControlStateNormal];
    [flashlightBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    flashlightBtn.titleLabel.font = KFONT(14);
    [flashlightBtn setTitle:@"关闭闪光灯" forState:UIControlStateSelected];
    [flashlightBtn setTitleColor:[UIColor whiteColor]  forState:UIControlStateSelected];
    flashlightBtn.frame = CGRectMake((ScreenWidth-100)/2, ScreenHeight-150, 100, 44);
    [_scanView addSubview:flashlightBtn];
    [flashlightBtn addTarget:self action:@selector(flashlightSet:) forControlEvents:UIControlEventTouchUpInside];
    
    
}
- (void)openAlbum{
    if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary]) {
        if (!_picker) {
            
            _picker =[[UIImagePickerController alloc]init];
            UIImagePickerControllerSourceType sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
            _picker.delegate =self;
            _picker.sourceType = sourceType;
        }
        
        [self presentViewController:_picker animated:YES completion:^{
            
        }];
        
    }
    
}

- (void)setFlashlight{
    device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    session = [[AVCaptureSession alloc]init];
    
    // Create device input and add to current session
    AVCaptureDeviceInput * input = [AVCaptureDeviceInput deviceInputWithDevice:device error:nil];
    [session addInput:input];
    
}


- (void)flashlightSet:(UIButton *)sender{
    sender.selected = !sender.selected;
    if (sender.selected) {
        
        if([device hasTorch] && [device hasFlash])
        {
            if(device.torchMode == AVCaptureTorchModeOff)
            {
                [session beginConfiguration];
                [device lockForConfiguration:nil];
                [device setTorchMode:AVCaptureTorchModeOn];
                [device setFlashMode:AVCaptureFlashModeOn];
                [device unlockForConfiguration];
                [session commitConfiguration];
                [session startRunning];
            }
        }
        
    }else{
        if([device hasTorch] && [device hasFlash]){
            
            if(device.torchMode == AVCaptureTorchModeOn)
            {
                [device lockForConfiguration:nil];
                [device setTorchMode:AVCaptureTorchModeOff];
                [device setFlashMode:AVCaptureFlashModeOff];
                [device unlockForConfiguration];
                [session commitConfiguration];
                [session stopRunning];
            }
        }
        
    }
    
}

//二维码的横线移动
- ( void )moveUpAndDownLine
{
    CGFloat Y= _QrCodeline . frame . origin . y ;
    //CGRectMake(SCANVIEW_EdgeLeft, SCANVIEW_EdgeTop, ScreenWidth-2*SCANVIEW_EdgeLeft, 1)]
    if (ScreenWidth- 2 *SCANVIEW_EdgeLeft+SCANVIEW_EdgeTop==Y){
        [UIView beginAnimations: @"asa" context: nil ];
        [UIView setAnimationDuration: 1 ];
        _QrCodeline.frame=CGRectMake(SCANVIEW_EdgeLeft, SCANVIEW_EdgeTop, ScreenWidth- 2 *SCANVIEW_EdgeLeft, 2 );
        [UIView commitAnimations];
    } else if (SCANVIEW_EdgeTop==Y){
        [UIView beginAnimations: @"asa" context: nil ];
        [UIView setAnimationDuration: 1 ];
        _QrCodeline.frame=CGRectMake(SCANVIEW_EdgeLeft, ScreenWidth- 2 *SCANVIEW_EdgeLeft+SCANVIEW_EdgeTop, ScreenWidth- 2 *SCANVIEW_EdgeLeft, 2 );
        [UIView commitAnimations];
    }
}

#pragma mark 获取扫描区域
-(CGRect)getScanCrop:(CGRect)rect readerViewBounds:(CGRect)readerViewBounds
{
    CGFloat x,y,width,height;
    
    x = rect.origin.x / readerViewBounds.size.width;
    y = rect.origin.y / readerViewBounds.size.height;
    width = rect.size.width / readerViewBounds.size.width;
    height = rect.size.height / readerViewBounds.size.height;
    
    return CGRectMake(x, y, width, height);
}
#pragma mark 扫描动画
-(void)loopDrawLine
{
    CGRect  rect = CGRectMake(scanZomeBack.frame.origin.x, scanZomeBack.frame.origin.y, scanZomeBack.frame.size.width, 2);
    if (readLineView) {
        [readLineView removeFromSuperview];
    }
    readLineView = [[UIImageView alloc] initWithFrame:rect];
    [readLineView setImage:[UIImage imageNamed:@"line.png"]];
    [UIView animateWithDuration:3.0
                          delay: 0.0
                        options: UIViewAnimationOptionCurveEaseIn
                     animations:^{
                         //修改fream的代码写在这里
                         readLineView.frame =CGRectMake(scanZomeBack.frame.origin.x, scanZomeBack.frame.origin.y+scanZomeBack.frame.size.height, scanZomeBack.frame.size.width, 2);
                         [readLineView setAnimationRepeatCount:0];
                         
                     }
                     completion:^(BOOL finished){
                         if (!is_Anmotion) {
                             
                             [self loopDrawLine];
                         }
                         
                     }];
    
    [readview addSubview:readLineView];
    
}

#pragma mark 获取扫描结果
- (void)readerView:(ZBarReaderView *)readerView didReadSymbols:(ZBarSymbolSet *)symbols fromImage:(UIImage *)image
{
    is_Anmotion=YES;
    // 得到扫描的条码内容
    const zbar_symbol_t *symbol = zbar_symbol_set_first_symbol(symbols.zbarSymbolSet);
    // NSString *symbolStr = [NSString stringWithUTF8String: zbar_symbol_get_data(symbol)];
    if (zbar_symbol_get_type(symbol) == ZBAR_QRCODE) {
        // 是否QR二维码
    }
    
    for (ZBarSymbol *symbol in symbols) {
        NSLog(@"扫描的结果:%@",symbol.data);
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunused-variable"
        NSString * resultStr = symbol.data;
        NSLog(@"scan resultStr %@",resultStr);
#pragma clang diagnostic pop
        
        
        
        
        /* 处理扫描结果 */
        [self analysisDataWith:symbol.data];
        
    }
    
    
    
    //判断是否包含 头'http:'
    /*NSString *regex = @"http+:[^//s]*" ;
     NSPredicate *predicate = [ NSPredicate predicateWithFormat : @"SELF MATCHES %@" ,regex];
     UIAlertView *alertView=[[ UIAlertView alloc ] initWithTitle : @"" message :symbolStr delegate : nil cancelButtonTitle : @"取消" otherButtonTitles : nil ];
     [alertView show ];
     //判断是否包含 头'ssid:'
     NSString *ssid = @"ssid+:[^//s]*" ;;
     NSPredicate *ssidPre = [ NSPredicate predicateWithFormat : @"SELF MATCHES %@" ,ssid];
     if ([predicate evaluateWithObject :symbolStr]) {
     }
     else if ([ssidPre evaluateWithObject :symbolStr]){
     NSArray *arr = [symbolStr componentsSeparatedByString : @";" ];
     NSArray * arrInfoHead = [[arr objectAtIndex : 0 ] componentsSeparatedByString : @":" ];
     NSArray * arrInfoFoot = [[arr objectAtIndex : 1 ] componentsSeparatedByString : @":" ];
     symbolStr = [ NSString stringWithFormat : @"ssid: %@ /n password:%@" ,
     [arrInfoHead objectAtIndex : 1 ],[arrInfoFoot objectAtIndex : 1 ]];
     UIPasteboard *pasteboard=[ UIPasteboard generalPasteboard ];
     //然后，可以使用如下代码来把一个字符串放置到剪贴板上：
     pasteboard. string = [arrInfoFoot objectAtIndex : 1 ];
     }*/
    
    
}
#pragma mark-========UIImagePickerControllerDelegate===============
- (void) imagePickerController: (UIImagePickerController*) reader
 didFinishPickingMediaWithInfo: (NSDictionary*) info
{
    UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
    
    ZBarReaderController* read = [ZBarReaderController new];
    
    read.readerDelegate = self;
    
    CGImageRef cgImageRef = image.CGImage;
    
    ZBarSymbol* symbol = nil;
    
    for(symbol in [read scanImage:cgImageRef])
        
        break;
    NSLog(@"扫描的结果0:%@",symbol.data);
    
    /* 处理扫描结果 */
    __weak typeof(self)Wself = self;
    [reader dismissViewControllerAnimated:NO completion:^{
        
        [Wself analysisDataWith:symbol.data];
    }];
    
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker{
    
    [self dismissViewControllerAnimated:YES completion:nil];
}
- (void)analysisDataWith:(id)data{
    
    if ([data isKindOfClass:[NSString class]]) {
        
        NSString *dataStr = (NSString *)data;
        NSMutableCharacterSet *set = [NSMutableCharacterSet characterSetWithCharactersInString:@"?&,"];
        NSArray *dataArray = [dataStr componentsSeparatedByCharactersInSet:set];
        
        NSLog(@"data:%@",dataArray);
        if (dataArray.count ==3) {
            
            [readview stop];
//            _identify = dataArray[1];
//            SelectMapLocationVC * selectMapLocation =[[SelectMapLocationVC alloc]init];
//            selectMapLocation.identify = self.identify;
//            [self.navigationController pushViewController:selectMapLocation animated:YES];
        }
        
        
        //        if (self.block) {
        //            self.block(self.identify,self.currentLoactionStr, self.deviceLongitude,self.deviceLatitude);
        //        }
        //         [HelpMsg showMessage:@"设置成功" inView:[[[UIApplication sharedApplication]delegate]window]];
        //
        //        [self.navigationController popViewControllerAnimated:YES];
        
        
        
    }
}

@end
