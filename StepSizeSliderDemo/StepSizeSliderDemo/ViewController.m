//
//  ViewController.m
//  StepSizeSliderDemo
//
//  Created by cchhjj on 16/11/28.
//  Copyright © 2016年 CanHe Chen. All rights reserved.
//

#import "ViewController.h"
#import "CCHStepSizeSlider.h"


@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    CGFloat w = self.view.frame.size.width - 60;
    
    CCHStepSizeSlider *slider1 = [[CCHStepSizeSlider alloc] initWithFrame:CGRectMake(30, 50, w, 50)];
//    slider1.backgroundColor = [UIColor orangeColor];
    slider1.value = 0.4;
    slider1.thumbSize = CGSizeMake(20, 20);
    slider1.sliderOffset = 0;
//    slider1.lineImage = [UIImage imageNamed:@"进度条-01"];
//    slider1.thumbImage = [UIImage imageNamed:@"进度"];
    slider1.continuous = NO;
//    slider1.maxTrackColor = [UIColor  yellowColor];
//    slider1.minTrackColor= [UIColor  redColor];
    slider1.type = CCHStepSizeSliderTypeNormal;
    [slider1 addTarget:self action:@selector(valueChangeAction:) forControlEvents:UIControlEventValueChanged];
    [self.view addSubview:slider1];
    
    
    CCHStepSizeSlider *slider2 = [[CCHStepSizeSlider alloc] initWithFrame:CGRectMake(30, 130, w, 50)];
//    slider2.backgroundColor = [UIColor grayColor];
//    slider2.margin = 100;
    slider2.titleArray = @[@"体验模式",@"你好",@"好吗",@"好的",@"网络模式"];
    slider2.lineWidth = 5;
    slider2.titleOffset = 23;
//    slider2.titleColor = [UIColor blueColor];
    slider2.index = 3;
    slider2.stepWidth = 10;
    slider2.sliderOffset = -8;
    slider2.stepTouchRate = 2;
    slider2.thumbSize = CGSizeMake(20, 20);
    slider2.thumbTouchRate = 2;
//    slider2.numberOfStep = 3;
    slider2.continuous = NO;
    [slider2 addTarget:self action:@selector(valueChangeAction:) forControlEvents:UIControlEventValueChanged];
    
    [self.view addSubview:slider2];
}


- (void)valueChangeAction:(CCHStepSizeSlider *)sender {
    NSLog(@"sender :%@,value :%f,index :%ld",sender,sender.value,(long)sender.index);

}



- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end
