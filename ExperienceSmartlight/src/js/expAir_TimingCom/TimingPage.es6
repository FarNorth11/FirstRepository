'use strict';


//import {Funs} from '../../../common/src/fun.es6';
import {Funs} from '../../../../common/src/fun.es6'
import {BaseComponent} from '../../../../common/src/BaseComponent.class.es6';
import {Actions} from '../Actions.es6';
import {Store} from '../Store.es6';
import {TimeSelect} from './TimeSelect.es6';
import {TimeSelectTwo} from './TimeSelectTwo.es6';


const { Router, Route, hashHistory, Link } = ReactRouter;
const TimingData = [];
const sign={
    num:1
};

let cunAllData=[];
let timeShowPd;
var AllData;
export class TimingPage extends BaseComponent {
    constructor(props) {
        super(props);
        let isAndroid = !!(navigator.userAgent.indexOf('Android')+1);
        this.state = {
            headerTop: isAndroid?73:64,
            pd:false
        };
        this.listenStore(Store);
        het.setTitle(JSON.stringify({setNavTitle:1,title:'添加定时',setNavRightBtnHiden:1}));
        this.repeatCancel=this.repeatCancel.bind(this);
    }

    cancelClock(){
        this.setState({
            timeShow: false,
        });

        Actions.repeatCancel();
    }
    add(){

        Actions.addClock();


    }

    submitAdd(h,m,s,r,dev){    //定时添加回调函数    小时,分钟,设备开关(默认),日期,设备开关

        let tempData={};
        tempData.hour=h;
        tempData.minute=m;
        tempData.device=s;
        tempData.id=sign.num;
        tempData.receive=r;

        tempData.dev=dev;   //设备点击
        sign.num++;

        cunAllData.push(tempData);

        Actions.submitTimeData(cunAllData);

        this.setState({
            timeShow:false,
        });
        //因为时间控件动画的原因,消失的比定时出现的慢(因为时间控件渐变的原因),故延迟定时列表0.5秒出现
        this.timer = setTimeout(
            () => {
                this.setState({
                    pd:true,
                });
            },
            500
        );


    }
    again(e){    //定时列表设备开关
        let  againClick = e.currentTarget.getAttribute('data-again');
        let  index =parseInt ( e.currentTarget.getAttribute('data-key'));

        // console.log("againClick",againClick);
        // console.log("AllData", this.state.cunAllDataStore);
        // console.log(typeof AllData);
        console.log(typeof againClick);
        // console.log("$",this);
        // console.log("$$",$('this'));
        // var a  = $(this)[0].state.dev[0];
        // $(this)[0].state.dev[0]= a=='0'?1:0;
        var change =  [...AllData];
        // debugger;
        change[index].dev[0] = againClick == '0' ? 1 : 0;
        // console.log(change[index].dev[0]);
        // console.log('index ===' + index + '   value ===' + change[index].dev[0]);
        // change.map(function(a,b){
        //    if(b==index){
        //        // console.log("b",b);
        //        if(a.dev[0]==0){

        //            a.dev[0]=1;

        //        }else{
        //            // console.log("1",change);
        //            a.dev[0]=0;
        //            // console.log("a",change);
        //        }
        //    }
        // })
        // console.log(change);

        Actions.changejudge(index,AllData);

        // if(e.target.className=="switch-on"){
        //      e.target.className='switch-off';
        //  }else if(e.target.className=="switch-off"){
        //      e.target.className='switch-on';
        //  }


        // for(var i=0;i<change.length;i++){
        //    console.log("changge--i",change[i].dev[0]);
        //    if(index==i){
        //        // debugger;
        //        console.log("123",i,index);
        //        var dev = change[i].dev[0];
        //        if(dev==0){
        //            change[i].dev[0]=1;
        //        }else{
        //            change[i].dev[0]=0;
        //        }
        //    }
        // }
    }

    repeatCancel(e){      //'重复'页---取消  事件
        this.setState({
            Repeat:false
        });
        Actions.repeatCancel();
    }




    render() {

        let haveDataStore = this.state.haveData?true:false;                                            //暂未添加定时----显隐
        timeShowPd = this.state.timeShow==true?this.state.timeShow:false;                              //是否显示时间控件
        let ArrayInit = this.state.timeShow == true ? true:false;                                      //是否重新初始化时间控件
        let TimeSelectstyle = this.state.TimeSelectstyle?this.state.TimeSelectstyle:'';                //小时样式设置
        let TimeSelectstyle2 = this.state.TimeSelectstyle2?this.state.TimeSelectstyle2:'';             //隐藏-时分
        let deviceClick=this.state.deviceClick?this.state.deviceClick:0;                               //设备开关的判断
        let Repeat = this.state.Repeat?this.state.Repeat:false;                                        //重复页面的显示/隐藏

        //重复--选择之后--传递数据
        let num7 =this.state.num7?this.state.num7:0;
        let num1 =this.state.num1?this.state.num1:0;
        let num2 =this.state.num2?this.state.num2:0;
        let num3 =this.state.num3?this.state.num3:0;
        let num4 =this.state.num4?this.state.num4:0;
        let num5 =this.state.num5?this.state.num5:0;
        let num6 =this.state.num6?this.state.num6:0;

        let sel7 =this.state.sel7?this.state.sel7:9;
        let sel1 =this.state.sel1?this.state.sel1:9;
        let sel2 =this.state.sel2?this.state.sel2:9;
        let sel3 =this.state.sel3?this.state.sel3:9;
        let sel4 =this.state.sel4?this.state.sel4:9;
        let sel5 =this.state.sel5?this.state.sel5:9;
        let sel6 =this.state.sel6?this.state.sel6:9;

        let  hourarr=['00', '01' ,'02', '03', '04', '05','06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

        AllData=this.state.cunAllDataStore?this.state.cunAllDataStore:[];          //提交后的总数据
        let receive=this.state.receive?this.state.receive:[];                          //日期
        let dev = this.state.dev?this.state.dev:[0];


        let pd = this.state.pd;   //数据展示判断
        if(cunAllData.length>0 && AllData.length==0){
            haveDataStore=true;
            pd=true;
            AllData=cunAllData;
        }
        // console.log('pd',pd,'--timeShowPd---',timeShowPd);
        // console.log("this.",this.state.cunAllDataStore);

        let isIOS = !!(navigator.userAgent.match(/iPad|iPhone|iPod/));
        let navigation = isIOS ?'nav ios':'nav android';
        return (
            <div className="Timing">
            <div className="Time-Content"   id="TimeContent"  >
            <div className={Repeat?"masking":" "}   onTouchEnd={this.repeatCancel}  ></div>
        <nav className={navigation}></nav>
            <div className="noneContent" style={{display:haveDataStore?'none':'block'}}>
    <p>暂未添加定时</p>
        </div>
        <div className="haveContent" style={{display:pd?timeShowPd?"none":"block":'none'}} >
    <ul>
        {
            AllData.map(function(item,index){

            return <li key={index}>
                <div className="addLeft">
                <p>{item.hour}:{item.minute}</p>
            <p>{item.receive} </p>
            </div>
            <div className="addRight" id={'ju-'+item.id} key={index} data-key={index} data-again={item.dev[0]} onClick={this.again.bind(this)}    className={ "switch-"+(item.dev[0]?'on':'off')} > </div>
                </li>
        }.bind(this))
    }
    </ul>

        </div>
        </div>



        <div className="add-time"  onClick={this.add.bind(this)}>添加</div>
        <TimeSelectTwo title={true}
        minuteshow={true}
        hourshow={true}
        hourstep={1}
        maxhour={2}
        minhour={0}
        minutestep={0}
        defaulthour={0}
        statusname={''}
        cancelClock={this.cancelClock.bind(this)}
        show={timeShowPd}
        hourarr={hourarr}
        arrayInit={ArrayInit}
        TimeSelectstyle={TimeSelectstyle}
        TimeSelectstyle2={TimeSelectstyle2}
        deviceClick={deviceClick}
        submitAdd={this.submitAdd.bind(this)}
        Repeat={Repeat}
        num7={num7}
        num1={num1}
        num2={num2}
        num3={num3}
        num4={num4}
        num5={num5}
        num6={num6}
        sel7={sel7}
        sel1={sel1}
        sel2={sel2}
        sel3={sel3}
        sel4={sel4}
        sel5={sel5}
        sel6={sel6}
        receive={receive}
        dev={dev}

            />



            </div>


    );
    }
}
