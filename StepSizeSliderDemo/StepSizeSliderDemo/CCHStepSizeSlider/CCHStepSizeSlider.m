//
//  CCHStepSizeSlider.m
//  蓝媒智能家居系统
//
//  Created by cchhjj on 16/10/25.
//  Copyright © 2016年 BlueMedia. All rights reserved.
//



/***
 这个控件 就是drawUI之后, 监听UIController的滑动事件方法.  在感知滑块变化后,计算出滑块此时的位置(x,y).再重绘制出UI
 
 
 ***/
#import "CCHStepSizeSlider.h"

@implementation CCHStepSizeSlider {
    
    CGPoint touchPoint;
    
    CGPoint thumbPoint;
    CGRect thumbRect;
    
    NSMutableArray *stepRectArray;
    
    CGFloat startPoint;
    CGFloat endPoint;
    
    CGFloat y;
    
    BOOL istap;
    BOOL isrun;
    
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setup];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)coder
{
    self = [super initWithCoder:coder];
    if (self) {
        [self setup];
    }
    return self;
}


- (void)awakeFromNib {
    [super awakeFromNib];
    [self setup];
}


- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self setup];
    }
    return self;
}


- (void)setup {
    self.backgroundColor = [UIColor whiteColor];
    
    _thumbBordColor = [UIColor colorWithWhite:0.99 alpha:1];
    _thumbColor = [UIColor whiteColor];
    //滑条的颜色
    _lineColor = [UIColor colorWithWhite:0.9 alpha:1];
    _stepColor = [UIColor cyanColor];
    
    _minTrackColor = [UIColor cyanColor];
    //滑条的颜色
    _maxTrackColor = _lineColor;
    
    _minimumValue = 0;
    _maximumValue = 1;
    
    _value = 0;
    _index = 0;
    
    _thumbTouchRate = 2;
    _stepTouchRate = 2;
    
    _type = CCHStepSizeSliderTypeStep;
    _continuous = YES;
    
    
    _margin = 30;
    _lineWidth = 8;
    
    _numberOfStep = 5;
    
    
    _titleOffset = 20;
    _sliderOffset = 0;
    
    _thumbSize = CGSizeMake(25, 25);
    
}

/**
 初始化,开始绘制底图
 **/
- (void)drawRect:(CGRect)rect {
    // Drawing code
    
    NSAssert(_maximumValue > _minimumValue, @"最大值要大于最小值");
    
    if (_maximumValue <= _minimumValue) {
        _minimumValue = 0;
        _maximumValue = 1;
    }
    
   /*
    绘制有动画效果
    */
    [UIView animateWithDuration:0.5 delay:0 usingSpringWithDamping:0.5 initialSpringVelocity:0.5 options:UIViewAnimationOptionCurveEaseIn animations:^{
        
        stepRectArray = [NSMutableArray array];
        
        CGFloat width = rect.size.width - _margin*2;
        
        y = CGRectGetMidY(rect);
        y+=_sliderOffset;
        
        /*
         计算滑动条的宽度(起止位置)
         */
        startPoint = _margin;
        endPoint = rect.size.width - _margin;
        
        CGContextRef context = UIGraphicsGetCurrentContext();
        
        /*
         1.填充底色
         有设置图片的时候,以图片填充滑条,没有就以预订颜色
         */
        if (_lineImage) {
            
            [_lineImage drawInRect:CGRectMake(startPoint, y  - _lineWidth/2,  endPoint -startPoint, _lineWidth)];
            
        } else {
            [self drawLine:context startX:startPoint endX:endPoint lineColor:self.lineColor];
        }
        
        
        /*
        2. 判断绘制的滑动条类型
         
         CCHStepSizeSliderTypeStep   步长滑动条
         CCHStepSizeSliderTypeNormal  正常滑动条
         */
        if (_type == CCHStepSizeSliderTypeStep) {
            
            CGFloat stWidth = _stepWidth?_stepWidth:_lineWidth;
            /*
             步长滑动条的组成部分 1.步进点  2.步长title
             */
            for (int i = 0; i < _numberOfStep; i++) {
                
                /*绘制步进点*/
                CGRect stepOvalRect = CGRectMake(startPoint + width/(_numberOfStep-1)*i - stWidth/2, y - stWidth/2,stWidth, stWidth);
                CGContextAddEllipseInRect(context, stepOvalRect);
                
                [self.stepColor set];
                CGContextFillPath(context);
                
                [stepRectArray addObject:[NSValue valueWithCGRect:stepOvalRect]];
                
                
                NSString *title = @"";
            
                if (self.titleArray.count > i) {
                    title = self.titleArray[i];
                }
                
                /*绘制步长title*/
                CGPoint titlePoint = CGPointMake(CGRectGetMidX(stepOvalRect), CGRectGetMinY(stepOvalRect));
                
                CGSize titleSize = [title sizeWithAttributes:self.titleAttributes];
                
                titlePoint.y += _titleOffset;
                if(i == 0 ){
                    titlePoint.x -= 10;
                }else if(i==_numberOfStep-1){
                    titlePoint.x -= titleSize.width;
                }else{
                    titlePoint.x -= titleSize.width/2;
                }

                CGRect titleRect = {titlePoint,titleSize};
                
                
                [title drawInRect:titleRect  withAttributes:self.titleAttributes];
                
            }
            
            /*
              根据当前step的值,计算当前的滑块位置
             */
            if (!isrun) {
                if (_index >= stepRectArray.count) {
                    _index = stepRectArray.count - 1;
                    if (_index < 0) {
                        _index = 0;
                    }
                }
                
                NSValue *cvalue = stepRectArray[_index];
                CGRect crect = [cvalue CGRectValue];
                thumbPoint = CGPointMake(CGRectGetMidX(crect) - _thumbSize.width/2, CGRectGetMidY(crect) - _thumbSize.height/2);
                isrun = YES;
            }
            
        }
        else if (_type == CCHStepSizeSliderTypeNormal) {
            /*
                根据当前value的值,计算当前的滑块位置
             */
            if (!isrun) {
                
                thumbPoint = CGPointMake([self ChangeX] - _thumbSize.width/2, y - _thumbSize.height/2);
                
                
                isrun = YES;
            }
            
            
            CGFloat maximumDistance;
            CGFloat distanceRatio = 0.0;
            
            /*
             根据设置的最大值,最小值和当前的value值,来计算当前的绘制的滑动条长度
             
             */
            if (_minimumValue >= 0 && _maximumValue > 0) {
                
                maximumDistance = _maximumValue - _minimumValue;
                distanceRatio = (self.value - _minimumValue)/maximumDistance;
                
            } else if (_minimumValue < 0 && _maximumValue < 0) {
                
                 maximumDistance = fabs(_minimumValue) - fabs(_maximumValue);
                 distanceRatio =  fabs(self.value - _maximumValue)/maximumDistance;
                
            } else if (_minimumValue < 0 && _maximumValue > 0) {
                
                maximumDistance = fabs(_minimumValue) + fabs(_maximumValue);
                
                CGFloat cvalue = self.value;
                if (self.value >= 0) {
                    cvalue += fabs(_minimumValue);
                }
                
                distanceRatio =  fabs(cvalue)/maximumDistance;
                
            }
            

            CGFloat startx;
            CGFloat endx;
            
            
            if (_lineImage) {
                
            } else {
                /*
                 minTrackColor  左边的颜色(如果有设置)
                 maxTrackColor  右边的颜色,就是滑条的颜色 lineColor(如果有设置)
                 */
                if (self.minTrackColor) {
                    
                    startx = startPoint;
                    //                endx = (endPoint)*distanceRatio + startPoint;
                    endx = thumbPoint.x + _thumbSize.width/2;
                    
                    
                    //                if (startx > endx) {
                    //                    startx = endx;
                    //                }
                    
                    [self drawLine:context startX:startx endX:endx lineColor:self.minTrackColor];
                    
                }
                
                if (self.maxTrackColor) {
                    
                    //                startx = (endPoint)*distanceRatio + startPoint;
                    startx = thumbPoint.x + _thumbSize.width/2;
                    endx = endPoint;
                    
                    //                if (startx > endx) {
                    //                    startx = endx;
                    //                }
                    
                    [self drawLine:context startX:startx endX:endx lineColor:self.maxTrackColor];
                    
                }
            }
            
        }

        /*
         绘制当前的滑动点.
         */
        thumbRect = CGRectMake(thumbPoint.x, thumbPoint.y  , _thumbSize.width, _thumbSize.height);
        
        if (_thumbImage) {
            [_thumbImage drawInRect:thumbRect];
        } else {
            CGContextAddEllipseInRect(context, thumbRect);

            [self.thumbColor set];
            CGContextSetLineWidth(context, 0.3);
            CGContextSetStrokeColorWithColor(context, self.thumbBordColor.CGColor);
            CGContextSetFillColorWithColor(context, self.thumbColor.CGColor);
            CGContextSetShadow(context, CGSizeMake(0, 1), 0.05);
            CGContextDrawPath(context, kCGPathFillStroke);
            
        }
        
        
        
        
    } completion:nil];
    
    
}

/*
 绘制线的方法
 */
- (void)drawLine:(CGContextRef) context startX:(CGFloat)startX endX:(CGFloat)endX lineColor:(UIColor *)lineColor {
    
    CGContextMoveToPoint(context, startX, y);
    CGContextAddLineToPoint(context, endX, y);
    CGContextSetLineWidth(context, _lineWidth); // 线的宽度
    CGContextSetLineCap(context, kCGLineCapRound); // 起点和重点圆角
    CGContextSetLineJoin(context, kCGLineJoinRound); // 转角圆角
    CGContextSetStrokeColorWithColor(context, lineColor.CGColor);
    
    CGContextStrokePath(context);
    
    
    
}

#pragma  mark - UIController   滑动触发事件 ---开始滑动
- (BOOL)beginTrackingWithTouch:(UITouch *)touch withEvent:(nullable UIEvent *)event {
    
    //当前触碰的位置
    touchPoint = [touch locationInView:self];
//    touchPoint = [self convertPoint:touchPoint toView:self];
//    NSInteger tempIndex = 0;
    

    //滑块当前在的位置 thumbRect
    CGRect tempThumbRect = thumbRect;
    //滑块的实际点击区域的 宽度和高度 _thumbTouchRate点击范围比率
    tempThumbRect.size.width = tempThumbRect.size.width*_thumbTouchRate;
    tempThumbRect.size.height = tempThumbRect.size.height*_thumbTouchRate;
    //滑块实际点击区域的x,y点   移动x轴位置= (现在高度-原来的高度)/2.   现在的x - 移动x轴距离 = 现在的x轴位置
    
    tempThumbRect.origin.x -= (tempThumbRect.size.width - thumbRect.size.width)/2;
    tempThumbRect.origin.y -= (tempThumbRect.size.height - thumbRect.size.height)/2;
    
    //步长类型判断
    if (CCHStepSizeSliderTypeStep == _type) {
        istap = YES;
        
        for (NSValue *value in stepRectArray) {
            CGRect oldrect = [value CGRectValue];
//            CGRect orgin = oldrect;
            
            CGRect newrect = oldrect;
            newrect.size.width = newrect.size.width*_stepTouchRate;
            newrect.size.height = newrect.size.height*_stepTouchRate;
            newrect.origin.x -= (newrect.size.width - oldrect.size.width)/2;
            newrect.origin.y -= (newrect.size.height - oldrect.size.height)/2;
//            tempIndex++;
            //判断此时点击的点是否在当前步长范围内, 如果在就重绘UI.
            if (CGRectContainsPoint(newrect, touchPoint)) {
                thumbPoint = CGPointMake(CGRectGetMidX(newrect) - _thumbSize.width/2, CGRectGetMidY(newrect) - _thumbSize.height/2);
                /*刷新UI*/
                [self setNeedsDisplay];
                return YES;
                
            }
            
        }
        
        return CGRectContainsPoint(tempThumbRect, touchPoint);
        
    } else if (CCHStepSizeSliderTypeNormal == _type) {
        
        return CGRectContainsPoint(tempThumbRect, touchPoint);
    }

    return NO;
    
}


- (BOOL)continueTrackingWithTouch:(UITouch *)touch withEvent:(nullable UIEvent *)event {
    
    touchPoint = [touch locationInView:self];
    
    CGFloat x = touchPoint.x;
    //计算当前触碰点的x轴,y轴.
    thumbPoint.x = x - _thumbSize.width/2;
    
    //检查越界情况
    if (x < startPoint ) {
        thumbPoint.x = startPoint - _thumbSize.width/2;
    }
    
    if (x > endPoint) {
        thumbPoint.x = endPoint - _thumbSize.width/2;
    }
    
    
    /*计算当前的value值*/
    [self valueChangeForX:x];
    
    /*刷新UI*/
    [self setNeedsDisplay];
    
    
    if (_continuous) {
        //发送事件
        [self sendActionsForControlEvents:UIControlEventValueChanged];
    }
    

    istap = NO;
    
    return YES;
}

- (void)endTrackingWithTouch:(nullable UITouch *)touch withEvent:(nullable UIEvent *)event {
    
    touchPoint = [touch locationInView:self];
    NSInteger tempIndex = 0;
    //如果是点击事件,计算当前的滑块位置.
    if (istap) {
        
        for (NSValue *value in stepRectArray) {
            CGRect rect = [value CGRectValue];
            CGRect orgin = rect;
            
            rect.size.width =rect.size.width *_stepTouchRate;
            rect.size.height =rect.size.height*_stepTouchRate;
            rect.origin.x -= rect.size.width/2;
            rect.origin.y -= rect.size.height/2;
            tempIndex++;
            
            if (CGRectContainsPoint(rect, touchPoint)) {
                thumbPoint = CGPointMake(CGRectGetMidX(orgin) - _thumbSize.width/2, CGRectGetMidY(orgin) - _thumbSize.height/2);
                
                _index = tempIndex - 1;
                
//                NSLog(@"index : %ld",(long)_index);
                
                [self valueRefresh];
                
                break;
                
            }
            
        }
        
        
    }
    //如果是滑动事件,step步长类型需要做判断,当前距离哪个步长点最近
    else {
        
        if (_type == CCHStepSizeSliderTypeStep) {
            
            CGFloat x = thumbPoint.x + _thumbSize.width/2;
            
            CGFloat tempValue = 0;
            for (int i = 0; i < stepRectArray.count; i++) {
                NSValue *value = stepRectArray[i];
                CGRect rect = [value CGRectValue];
                CGFloat x1 = rect.origin.x;
                x1 += rect.size.width/2;
                
                CGFloat absvalue = fabs(x - x1);
                if (i == 0) {
                    tempValue = absvalue;
                } else {
                    
                    if (absvalue < tempValue) {
                        tempValue = absvalue;
                        tempIndex = i;
                    }
                    
                }
                
            }
            
            NSValue *cvalue = stepRectArray[tempIndex];
            CGRect crect = [cvalue CGRectValue];
            thumbPoint = CGPointMake(CGRectGetMidX(crect) - _thumbSize.width/2, CGRectGetMidY(crect) - _thumbSize.height/2);
            
            
            _index = tempIndex;
            
//            NSLog(@"index : %ld",(long)_index);
        }
        
        
        
        [self valueRefresh];
        
    }
    
    

    
}


- (CGFloat)ChangeX {
    
//    CGFloat rale;
//    if (_minimumValue >= 0 ) {
    
    if (self.value == _minimumValue) {
        return startPoint;
    }
    
    if (self.value == _maximumValue) {
        return endPoint;
    }
    
    
    return fabs(self.value)/(_maximumValue - _minimumValue)*(endPoint - startPoint)+ startPoint;
        
        
//    } else {
    

        

        
//    }
    
    
}


- (void)valueChangeForX:(CGFloat)x {
    
    CGFloat changeRale = (x - startPoint)/(endPoint - startPoint);
    
    CGFloat temp = changeRale * (_maximumValue - _minimumValue);
    
    if (_minimumValue >= 0 ) {
        self.value = temp;
    } else {
        
        if (temp < fabs(_minimumValue)) {
            self.value = -temp;
        }
        
        self.value = temp - fabs(_minimumValue);
        
    }
    
//    NSLog(@"current value : %f",self.value);
    
}

- (void)valueRefresh {
    
    [self setNeedsDisplay];
    [self sendActionsForControlEvents:UIControlEventValueChanged];
    
}


- (CGFloat)value {
    
    if (_value <= _minimumValue) {
        _value = _minimumValue;
    }
    
    if (_value >= _maximumValue) {
        _value = _maximumValue;
    }
    return _value;
}


- (NSInteger)index {
    
    
    if (_index >= _numberOfStep) {
        _index = _numberOfStep - 1;
    }
    
    if (_index < 0) {
        _index = 0;
    }
    

    return _index;
    
}

- (void)setNumberOfStep:(NSInteger)numberOfStep {
    
    if (numberOfStep < 2) {
        numberOfStep = 2;
    }
    
    _numberOfStep = numberOfStep;
    
    
}

- (NSDictionary *)titleAttributes {
    
    if (!_titleAttributes) {
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        dict[NSForegroundColorAttributeName] = self.titleColor?self.titleColor:[UIColor lightGrayColor]; // 文字颜色
        dict[NSFontAttributeName] = self.titleFont?self.titleFont:[UIFont systemFontOfSize:14]; // 字体
        _titleAttributes = dict;
    }
    
    return _titleAttributes;
    
}


@end
