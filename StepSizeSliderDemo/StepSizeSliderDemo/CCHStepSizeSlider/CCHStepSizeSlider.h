//
//  CCHStepSizeSlider.h
//  蓝媒智能家居系统
//
//  Created by cchhjj on 16/10/25.
//  Copyright © 2016年 BlueMedia. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef enum : NSUInteger {
    CCHStepSizeSliderTypeNormal,
    CCHStepSizeSliderTypeStep,
    
} CCHStepSizeSliderType;

@interface CCHStepSizeSlider : UIControl


/**
 滑条的类型
 */
@property (assign, nonatomic) CCHStepSizeSliderType type;

/**
 滑块的颜色
 */
@property (strong, nonatomic) UIColor *thumbColor;


/**
 滑块图片
 */
@property (strong, nonatomic) UIImage *thumbImage;

/**
 滑块的大小
 */
@property (assign, nonatomic) CGSize thumbSize;

/**
 滑块的点击范围，默认是2倍
 */
@property (assign, nonatomic) CGFloat thumbTouchRate;

/**
 滑块边框颜色
 */
@property (strong, nonatomic) UIColor *thumbBordColor;


/**
 类型为普通时，使用value
 */
@property (assign, nonatomic) CGFloat value;

/**
 最大值
 */
@property (assign, nonatomic) CGFloat maximumValue;

/**
 最小值
 */
@property (assign, nonatomic) CGFloat minimumValue;

/**
 最大值的滑动颜色
 */
@property (strong, nonatomic) UIColor *maxTrackColor;
/**
 最小值的滑动颜色
 */
@property (strong, nonatomic) UIColor *minTrackColor;

/**
 值变化是否是连续的
 */
@property (assign, nonatomic, getter=isContinuous) BOOL continuous;


/**
  类型为步长时，使用index
 */
@property (assign, nonatomic) NSInteger index;

/**
  步长的step数 默认是5级,最低是2级
 */
@property (assign, nonatomic) NSInteger numberOfStep;


/**
 step点击范围，默认是step大小的2倍 stepTouchRate ＝ 2
 */
@property (assign, nonatomic) CGFloat stepTouchRate;

/**
 设置step的颜色
 */
@property (strong, nonatomic) UIColor *stepColor;
/**
 设置step的大小
 */
@property (assign, nonatomic) CGFloat stepWidth;

/**
 设置slider的左右间隔
 */
@property (assign, nonatomic) CGFloat margin;

/**
 滑条的颜色
 */
@property (strong, nonatomic) UIColor *lineColor;

/**
 设置滑条图片来显示
 */
@property (strong, nonatomic) UIImage *lineImage;

/**
 设置滑条的粗细程度
 */
@property (assign, nonatomic) CGFloat lineWidth;

/**
 滑条y偏移量，默认是0
 */
@property (assign, nonatomic) CGFloat sliderOffset;


/**
 标题y偏移,默认是向下偏移20 正数向下，负数向上
 */
@property (assign, nonatomic) CGFloat titleOffset;

/**
 设置step下的标题
 */
@property (copy, nonatomic) NSArray *titleArray;


/**
 标题字体
 */
@property (strong, nonatomic) UIFont *titleFont;

/**
 标题颜色
 */
@property (strong, nonatomic) UIColor *titleColor;

/**
 文字的属性
 */
@property (copy, nonatomic) NSDictionary *titleAttributes;













@end
