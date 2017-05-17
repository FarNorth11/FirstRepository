'use strict';
/**
 * 公共store，建议所有store事件都在此文件定义
 * ! 注意，Store方法不能使用箭头函数，否则将报this未定义
 * @type {store}
 */
import {Actions} from './Actions.es6';

const appData = {
};

var selectWeekArr=[];
/*
var items = [
 {id:0,name:'周一',select:false},
 {id:1,name:'周二',select:false},
 {id:2,name:'周三',select:false},
 {id:3,name:'周四',select:false},
 {id:4,name:'周五',select:false},
 {id:5,name:'周六',select:false},
 {id:6,name:'周天',select:false}
 ];
*/

let timingObjectArr=[];
/*
[
 {id:1,time:'06:00',day:selectWeekArr,deviceSwitch:false},
 {id:2,time:'09:00',day:selectWeekArr,deviceSwitch:true}
 ];
 */

const ctrSwitch={
    offon0:0,
    offon1:0,
    offon2:0,
    offon3:0,
    offon4:0,
    offon5:0,
    offon6:0,
};

let receive=[];
let dev=[0];
let on1=false;
let on2=false;
let on3=false;
let on4=false;
let on5=false;
let on6=false;
let on7=false;

let hold=[];
export const Store = Reflux.createStore({
    listenables: [Actions],
    onRepaint(data, type){
        this.trigger(data);
    },
    onSelectPower(data){
        console.log("power",data);
        var switche;
        if(data == 1){
            //1开机,2关机
            switche = 2;
            localStorage.experiencelightPower=2;
        }else{
            switche = 1;
            localStorage.experiencelightPower=1;
        }
        this.trigger({'power':switche});


    },
    onSelectColor(data){
        console.log("tem",data);
        localStorage.experiencelightTone = data;

    },
    onChangeWeekList(data){
        this.trigger({'selectWeekArr':data});
        //console.log('appData.selectWeekArr',appData.selectWeekArr);
    },
    onGetWeekList(){
        //this.trigger({'selectWeekArr':appData.selectWeekArr});
    },
    onGetBeforData(){
        if([appData.timingObjectArr instanceof Array]){
            this.trigger({'timingObjectArr':appData.timingObjectArr});
        }

    },
    onSetTimingObject(h,m,weekArr,deviceSwitch){
        console.log('小时',h,'分钟',m,'重复周',weekArr,'switch开关',deviceSwitch);
        //数据包括,1.显示的定时,2重复周的对象,3.设备的开关
        var timingObject = new Object();;
        timingObject.time = this.changeTime(h,m);
        timingObject.day = weekArr;
        timingObject.deviceSwitch = deviceSwitch;

        if(timingObjectArr.length == 0){
            timingObject.id = 0;
        }else{
            timingObject.id = timingObjectArr.length;

        }
        timingObjectArr.push(timingObject);
        appData.timingObjectArr = timingObjectArr;
        //传递的输出数据
        //console.log('-----------------timingObjectArr-----------------',timingObjectArr);
        this.trigger({'timingObjectArr':appData.timingObjectArr});

    },
    onGetTimingObject(){
        this.trigger({'timingObjectArr':appData.timingObjectArr});
    },
    changeTime(h,m){
        var timeStr = '';
        if(h<10){
            timeStr = '0'+h;
        }else{
            timeStr = ''+h;
        }
        timeStr+=':';
        //timeStr+=m;
        if(m<10){
            timeStr = timeStr+ '0'+m;
        }else{
            timeStr = timeStr+m;
        }
        //console.log('store里计算出来的时间$$$$$$$$$',timeStr);
        return timeStr;
    },



    onJudgeClock(value){    //判断定时的状态

        if(value==1){ //关机状态下定时-确定
            this.trigger({judgeClock:1});
        }else if(value==2){  //关机状态下,点击开机(不管有无定时,都转变为未选状态)
            this.trigger({judgeClock:2});
        }else if(value==3){    //关机状态下定时-取消  ---不可用状态
            this.trigger({judgeClock:3});
        }
    },
    onSubmitTimeData(c){   //小时-分钟-设备开关状态

        // var d = JSON.parse(c);
        console.log("c",c);
        this.trigger({cunAllDataStore:c});

    },
    onAddClock(){    //定时--添加按钮                                                                                 deviceClick 点击添加时,设备开关回复为默认状态
        dev=[0];   //点击添加时,给设备开关重新赋默认值(如不重新赋值,则下次再点击时保持上一状态);
        receive=[];  //点击添加时,给'重复选择'重新赋默认值(如不重新赋值,则下次再点击时保持上一状态);     tt:true,pd:false,haveData:true
        this.trigger({timeShow:true,TimeSelectstyle:'TimeSelectstyle',TimeSelectstyle2:true,deviceClick:0,dev:dev,receive:receive,haveData:true,pd:false});       // TimeSelectstyle-时间控件显示在顶部的样式
    },
    onDeviceClick(value,judgeClick){    //设备开关
        let device = value;
        dev=[];
        if(device==0){
            this.trigger({deviceClick:1});
            // dev.splice(0,1);
            dev.push(1);
            console.log("添加设备开关",dev);
        }else{
            this.trigger({deviceClick:0});
            // dev.splice(0,1);
            dev.push(0);
            console.log("取消设备开关",dev);
        }

        this.trigger({dev:dev});
    },
    onRepeatSelect(){  //显示重复页面,隐藏定时选择页面
        this.trigger({Repeat:true});

        ctrSwitch.offon0=0;
        ctrSwitch.offon1=0;
        ctrSwitch.offon2=0;
        ctrSwitch.offon3=0;
        ctrSwitch.offon4=0;
        ctrSwitch.offon5=0;
        ctrSwitch.offon6=0;
        this.trigger({num7:0,sel7:0,num1:0,sel1:0,num2:0,sel2:0,num3:0,sel3:0,num4:0,sel4:0,num5:0,sel5:0,num6:0,sel6:0});
        // 重新初始化-日期选择
        on1=false;
        on2=false;
        on3=false;
        on4=false;
        on5=false;
        on6=false;
        on7=false;
        hold=[];
        receive=[];
        dev=[];
    },
    onRepeatSure(){    //隐藏重复页面,显示定时选择页面(点击确定)
        this.trigger({Repeat:false});
        hold.sort();  //数组排序
        //接收到 重复 的数据转换为星期
        for(var i=0;i<hold.length;i++){
            if(hold[i]==1){
                hold[i]="周一";
            }else if(hold[i]==2){
                hold[i]="周二";
            }else if(hold[i]==3){
                hold[i]="周三";
            }else if(hold[i]==4){
                hold[i]="周四";
            }else if(hold[i]==5){
                hold[i]="周五";
            }else if(hold[i]==6){
                hold[i]="周六";
            }else if(hold[i]==7){
                hold[i]="周日";
            }
        }
        //如果星期全选择--则修改为每天
        if(hold.length==7){
            hold=[];
            hold.push("每天");
        }


        for(var i=0;i<hold.length-1;i++){
            hold[i] = hold[i]+', ';
        }

        receive.push(hold);
        if(receive[0].length==0){  //未选其它日期,直接确定处理
            receive = [];
        }

        // var a = receive[0];
        // var b = JSON.stringify(a);
        // var c = b.substring(0,b.length-3);
        // var a = receive[0].substring(0,10);
        // var b = JSON.stringify(receive);

        // console.log("receive---",typeof receive,'---',receive.length,'--');
        this.trigger({receive:receive});
    },
    onRepeatCancel(){    //重复页面-点击取消
      receive=[];
      this.trigger({Repeat:false,receive:receive});
      hold=[];    //点击取消,清空所选择的数组
      
    },

    onSubmitTimeData(c){   //小时-分钟-设备开关状态

        // var d = JSON.parse(c);
        console.log("c",c);
        this.trigger({cunAllDataStore:c});

    },
     onOffon(value){   //重复点击事件
      var value2 = parseInt(value);
        debugger;
      switch(value2){
        case 1:
                  if(on1==false){
                       on1=true;
                       hold.push(parseInt(value));
                       this.trigger({num1:1,sel1:1});
                  }else{
                       on1=false;
                       this.trigger({num1:0,sel1:1});

                       for(var i=0;i<hold.length;i++){
                          if(value==hold[i]){
                              hold.splice(i,1);
                           }
                        }
                  }     
              
              break;
        case 2:
           
                  if(on2==false){
                       on2=true;
                       hold.push(parseInt(value));
                       this.trigger({num2:1,sel2:2});
                  }else{
                       on2=false;
                       this.trigger({num2:0,sel2:2});
                       for(var i=0;i<hold.length;i++){
                        if(value==hold[i]){
                            hold.splice(i,1);
                          }
                        }
                  }
        
             break;
          case 3:
                  if(on3==false){
                       on3=true;
                       hold.push(parseInt(value));
                       this.trigger({num3:1,sel3:3});
                  }else{
                       on3=false;
                       this.trigger({num3:0,sel3:3});
                       for(var i=0;i<hold.length;i++){
                        if(value==hold[i]){
                            hold.splice(i,1);
                          }
                        }
                  }
        
             break;
          case 4:
                  if(on4==false){
                       on4=true;
                       hold.push(parseInt(value));
                       this.trigger({num4:1,sel4:4});
                  }else{
                       on4=false;
                       this.trigger({num4:0,sel4:4});
                       for(var i=0;i<hold.length;i++){
                        if(value==hold[i]){
                            hold.splice(i,1);
                          }
                        }
                  }
       
             break;
          case 5:
                  if(on5==false){
                       on5=true;
                       hold.push(parseInt(value));
                       this.trigger({num5:1,sel5:5});
                  }else{
                       on5=false;
                       this.trigger({num5:0,sel5:5});
                       for(var i=0;i<hold.length;i++){
                        if(value==hold[i]){
                            hold.splice(i,1);
                          }
                        }
                  }
       
             break;
          case 6:
           
                  if(on6==false){
                       on6=true;
                       hold.push(parseInt(value));
                       this.trigger({num6:1,sel6:6});
                  }else{
                       on6=false;
                       this.trigger({num6:0,sel6:6});
                       for(var i=0;i<hold.length;i++){
                        if(value==hold[i]){
                            hold.splice(i,1);
                          }
                        }
                  }
       
             break;
          case 7:
            
                  if(on7==false){
                       on7=true;
                       hold.push(parseInt(value));
                       this.trigger({num7:1,sel7:7});
                  }else{
                       on7=false;
                       this.trigger({num7:0,sel7:7});
                       for(var i=0;i<hold.length;i++){
                        if(value==hold[i]){
                            hold.splice(i,1);
                          }
                        }
                  }
        
             break;
             default:
　　　　　　　　break;//可加可不加

      }


    },
      onChangejudge(indexs,changes){
        this.trigger({cunAllDataStore:changes,haveData:true,pd:true});
    }
});