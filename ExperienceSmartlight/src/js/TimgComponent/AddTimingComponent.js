/**
 * Created by ben on 2017/3/23.
 */
import {BaseComponent} from '../../../../common/src/BaseComponent.class.es6';
import {Actions} from '../Actions.es6';
import {Store} from '../Store.es6';
import {TimeView} from './TimeView.jsx'
import {WeekSelectComponent} from './WeekSelectComponent.jsx'

var items = [
    {id:0,name:'周一',select:false},
    {id:1,name:'周二',select:false},
    {id:2,name:'周三',select:false},
    {id:3,name:'周四',select:false},
    {id:4,name:'周五',select:false},
    {id:5,name:'周六',select:false},
    {id:6,name:'周天',select:false}
];

export class AddTimingComponent extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            hourtime:0,
            minutetime:0,
            hourindex:0,
            hourarr:[],
            minuteindex:0,
            minutearr:[],
            showOpacity:0,
            viewDisplay:false,
            selectshow:false,
            deviceSwitch:true
        };
        het.setTitle(JSON.stringify({setNavTitle:1,title:'添加定时',setNavRightBtnHiden:1}));
        this.listenStore(Store);
        this.addTimingObject = this.addTimingObject.bind(this);
        this.endDefault = this.endDefault.bind(this);
        this.startrange = this.startrange.bind(this);
        this.moverange = this.moverange.bind(this);
        this.endrange = this.endrange.bind(this);
        this.openWeek = this.openWeek.bind(this);
        this.selectWeekDay = this.selectWeekDay.bind(this);
        this.analysisWeekDay = this.analysisWeekDay.bind(this);
        this.changeSwitch = this.changeSwitch.bind(this);


    }
    componentDidMount() {
    //初始化时间可选值数组
        console.log(this.props);
        this.timearrInit(this.props);
    }
    timearrInit(next){

        //hout  0-23  min 0-59
        //
        var _hourList = [];
        var _minList = [];
        for(var i=0;i<24;i++){
            _hourList.push(i.toString());
        }
        for(var i=0;i<60;i++){
            if(i<10){
                var  i_P= '0'+i;
                _minList.push(i_P);
            }else{
                _minList.push(i.toString());
            }

        }
        //this.setState({
        //    minutearr:_minList,
        //    hourarr:_hourList,
        //    //minutearr:[2,6,8,9],
        //    //minutetime:2
        //});

        //设置hour数组 和 最小小时
        this.setState({
            hourarr:_hourList,
            hourtime:0
        });
        //设置默认小时
        this.setState({
            hourtime: 0,
            hourindex:0
        });


        this.setState({
            minutearr:_minList,
            minutetime:0
            //minutearr:[2,6,8,9],
            //minutetime:2
        });
        //设置默认分钟
        this.setState({
            minutetime: 0,
            minuteindex:0
        });

    }
    componentWillReceiveProps(next){
        var showOpacity = this.state.showOpacity;
        if(next.show != this.props.show) {
            if (next.show == true) {
                this.setState({viewDisplay: true});
                //clearInterval(this.timr);
                //this.timr = setInterval(function(){
                //    showOpacity += 1;
                //    if(showOpacity>=1){
                //        clearInterval(this.timr);
                //        this.setState({showOpacity:showOpacity});
                //    }
                //    console.log('showOpacity',showOpacity);
                //}.bind(this),10)
                this.setState({showOpacity: 1});
                //console.log('初始温度:',this.state.initialTemp,'props.value',this.props.value);
            } else if (next.show == false) {
                clearInterval(this.timr);
                //时间选择的确定button 和 覆盖的 功能按钮(速冻)位置相同. 时间选择界面消失过快 会导致速冻也被点击.
                this.timr = setInterval(function () {
                    showOpacity -= 1;
                    // console.log('1',showOpacity,parseInt(showOpacity));
                    if (showOpacity <= 0) {
                        clearInterval(this.timr);
                        this.setState({viewDisplay: false});
                        this.setState({showOpacity: showOpacity});
                    }
                }.bind(this), 10);
            }
        }
        //页面跳转问题 当时间详情页面关闭  周选择页面也需要关闭
        if(this.props.show ==false){
            this.setState({
                selectshow:false
            });
        }

    }
    endDefault(e){
        //阻止IOS上冒泡触发iscroll事件
        e.stopPropagation();
        e.preventDefault();
    }
    startrange(e){
        //开始滑动时间刻度 记录初始坐标值
        e.stopPropagation();
        e.preventDefault();
        let yvalue = parseInt(e.touches[0].clientY);
        this.setState({
            oldy: yvalue
        });
        console.log('oldy',yvalue);
    }
    moverange(e){
        //滑动时间刻度 判断滑动类型并改变刻度条的top值 产生滑动视觉效果
        e.stopPropagation();
        e.preventDefault();
        let yvalue = parseInt(e.touches[0].clientY);
        let oldy = parseInt(this.state.oldy);
        let value = (yvalue-oldy)/1.72;//获取滑动距离，px为单位，但是要转换为百分比，所以除以1.72当范围大于20的时候，算作一格，负数一样
        if(value>20) value=20;
        if(value<-20) value=-20;
        let type = e.target.getAttribute('data-type');
        if(type=='hour'){
            this.setState({
                newy: yvalue,
                hourtop:value
            });
        }
        if(type=='minute'){
            this.setState({
                newy: yvalue,
                minutetop:value
            });
        }

    }
    endrange(e){
        //滑动结束 计算滑动范围 忽略太小的滑动(20内) 然后调整选中值并重置时间刻度条
        e.stopPropagation();
        e.preventDefault();
        let newy = parseInt(this.state.newy);//滑动结束时的y值
        let oldy = parseInt(this.state.oldy);//滑动开始时的y值
        let hour = parseInt(this.state.hourtime);//上一次选中的小时值
        let hourarr = this.state.hourarr;//小时可选值数组
        let hourindex = parseInt(this.state.hourindex);//上次选中的小时值对应数组中索引
        let minutearr = this.state.minutearr;//分钟可选值数组
        let minuteindex = parseInt(this.state.minuteindex);//上次选中的分钟值对应数组索引
        let minute = parseInt(this.state.minutetime);//上次选中的分钟值
        let hourstep = parseInt(this.props.hourstep) || 1;//小时的间隔
        let minutestep = parseInt(this.props.minutestep) || 1;//分钟的间隔
        let maxhour = parseInt(this.props.maxhour) || 23;//设置的最大小时值
        let minhour = parseInt(this.props.minhour) || 0;//设置的最小小时值
        let type = e.target.getAttribute('data-type');//滑动更改的类型
        //小时减小
        if(newy-oldy>20 && type=='hour'){
            let rangestep = parseInt((newy-oldy)/50)>0 ? parseInt((newy-oldy)/50) : 1;
            hourindex = hourindex-rangestep;
            hourindex = hourindex<0?0:hourindex;
            hour = hourarr[hourindex];
            this.setState({
                hourtime:hour,
                hourindex:hourindex,
                hourtop:0
            });
        };
        //小时增加
        if(newy-oldy<-20 && type=='hour'){
            let rangestep = parseInt((oldy-newy)/50)>0 ? parseInt((oldy-newy)/50) : 1;
            hourindex = hourindex+rangestep;
            hourindex = (hourindex>=hourarr.length)?(hourarr.length-1):hourindex;
            hour = hourarr[hourindex];
            this.setState({
                hourtime:hour,
                hourindex:hourindex,
                hourtop:0
            });
        };
        //分钟减小
        if(newy-oldy>20 && type=='minute'){
            let rangestep = parseInt((newy-oldy)/50)>0 ? parseInt((newy-oldy)/50) : 1;
            minuteindex = minuteindex-rangestep;
            minuteindex = minuteindex<0?0:minuteindex;
            minute = minutearr[minuteindex];
            this.setState({
                minutetime:minute,
                minuteindex:minuteindex,
                minutetop:0
            });
        };
        //分钟增加
        if(newy-oldy<-20 && type=='minute'){
            let rangestep = parseInt((oldy-newy)/50)>0 ? parseInt((oldy-newy)/50) : 1;
            minuteindex = minuteindex+rangestep;
            minuteindex = (minuteindex>=minutearr.length)?(minutearr.length-1):minuteindex;
            minute = minutearr[minuteindex];
            this.setState({
                minutetime:minute,
                minuteindex:minuteindex,
                minutetop:0
            });
        };
        //重置为未拖动状态
        this.setState({
            hourtop:0,
            minutetop:0
        });

    }
    //完成定时设置,返回上一级页面
    addTimingObject(e){
        if(typeof this.props.addedBack === 'function'){
            console.log('this.state.hourtime,this.state.minutetime',this.state.hourtime,this.state.minutetime);
            //传递到上级页面,把添加详情页面隐藏
            this.props.addedBack();
            let me = this;
            //console.log('完成添加定时对象',this.state.hourtime,this.state.minutetime,this.state.selectWeekArr,this.state.deviceSwitch);

            Actions.setTimingObject(parseInt(this.state.hourtime) ,parseInt(this.state.minutetime),this.state.selectWeekArr==undefined?items:this.state.selectWeekArr,this.state.deviceSwitch);
            //归零当前的页面状态
            let hourValue = this.state.hourarr[0];
            let minuteValue = this.state.minutearr[0];
            me.setState({
                hourtime:hourValue,
                minutetime:minuteValue,
                hourindex:0,
                minuteindex:0,
                selectWeekArr:'',
                deviceSwitch:true
            });
        }else{
            console.log('error:the cancel callback is not a function');
        }
    }
    //打开周选择
    openWeek(){
        this.setState({
            selectshow:true,
        });
        console.log('添加定时');
    }

    //接收从周选择页面传过来的值
    selectWeekDay(e){

        this.setState({
            selectshow:false,
        });
        //Actions.getWeekList();
    }
    //解析重复周日期
    analysisWeekDay(){
        var this_arr = this.state.selectWeekArr;
        var str = "";
        var count = 0;
        for(var index in this_arr)
        {
            //console.log("arr[" + index + "] = " + this_arr[index]);

            if(this_arr[index].select == true){
                str += this_arr[index].name;
                count+=1;
            }
            if(count == 7){
                str = '每天';
            }

        }
        return str;
    }
    //改变本页的switch控件
    changeSwitch(){
        var switchStatus = this.state.deviceSwitch;
        this.setState({
            deviceSwitch:!switchStatus,
        });

    }
    render() {


        let hourtop = this.state.hourtop || 0;
        let minutetop = this.state.minutetop || 0;
        let hourarr = this.state.hourarr;
        let hourindex = parseInt(this.state.hourindex);
        let minutearr = this.state.minutearr;
        let minuteindex = parseInt(this.state.minuteindex);
        let hourunit = this.props.hourunit || '时';
        let minuteunit = this.props.minuteunit || '分';

        let selectshow = this.state.selectshow?this.state.selectshow:false;
        //console.log('--------------------getWeekList--------------------',this.state.selectWeekArr);
        let weekText = this.state.selectWeekArr==undefined||this.state.selectWeekArr==''?'从不':this.analysisWeekDay();

        //console.log('AddTimingComponent  - -- - -- isSelectshow',selectshow,this.props.show);


        return(
            <section className="Timing-pageYYY" style={{display:this.state.viewDisplay?'block':'none',opacity:this.state.showOpacity}}>
                <section className="addtimeselect" onTouchMove={this.endDefault}>
                    <section className='addtime'>
                        <section data-type='hour' style={{width:'50%',display:'inline-block'}}
                                 onTouchStart={this.startrange} onTouchMove={this.moverange}
                                 onTouchEnd={this.endrange}  className='hour'>
                        </section>
                        <section  data-type='minute' style={{display:'inline-block',width:'50%',left:'50%'}}
                                  onTouchStart={this.startrange} onTouchMove={this.moverange}
                                  onTouchEnd={this.endrange} className='minute'>
                        </section>
                        <section className='timetext'>
                            <span className='hour' style={{left:38+'%',display:'inline-block'}}>{hourunit}</span>
                            <span className='minute' style={{display:'inline-block',left:69+'%'}}>{minuteunit}</span>
                        </section>
                        <section className='hourvalue flex-column' style={{top:hourtop+'%',left:30+'%',display:'block'}}>
                            <span className={(hourindex-3)<0?'line4':'line1'}>{(hourindex-3)<0?'':hourarr[hourindex-3]}</span>
                            <span className={(hourindex-2)<0?'line4':'line1'}>{(hourindex-2)<0?'':hourarr[hourindex-2]}</span>
                            <span className={(hourindex-1)<0?'line4':'line2'}>{(hourindex-1)<0?'':hourarr[hourindex-1]}</span>
                            <span className='line3'>{hourarr[hourindex]}</span>
                            <span className={(hourindex+1)>=hourarr.length?'line4':'line2'}>{(hourindex+1)>=hourarr.length?'':hourarr[hourindex+1]}</span>
                            <span className={(hourindex+2)>=hourarr.length?'line4':'line1'}>{(hourindex+2)>=hourarr.length?'':hourarr[hourindex+2]}</span>
                            <span className={(hourindex+3)>=hourarr.length?'line4':'line1'}>{(hourindex+3)>=hourarr.length?'':hourarr[hourindex+3]}</span>
                        </section>
                        <section  className='minutevalue flex-column' style={{top:minutetop+'%',display:'block',left:58+'%'}}>
                            <span className={(minuteindex-3)<0?'line4':'line1'}>{(minuteindex-3)<0?'':minutearr[minuteindex-3]}</span>
                            <span className={(minuteindex-2)<0?'line4':'line1'}>{(minuteindex-2)<0?'':minutearr[minuteindex-2]}</span>
                            <span className={(minuteindex-1)<0?'line4':'line2'}>{(minuteindex-1)<0?'':minutearr[minuteindex-1]}</span>
                            <span className='line3'>{minutearr[minuteindex]}</span>
                            <span className={(minuteindex+1)>=minutearr.length?'line4':'line2'}>{(minuteindex+1)>=minutearr.length?'':minutearr[minuteindex+1]}</span>
                            <span className={(minuteindex+2)>=minutearr.length?'line4':'line1'}>{(minuteindex+2)>=minutearr.length?'':minutearr[minuteindex+2]}</span>
                            <span className={(minuteindex+3)>=minutearr.length?'line4':'line1'}>{(minuteindex+3)>=minutearr.length?'':minutearr[minuteindex+3]}</span>
                        </section>
                    </section>
                </section>
                <div className="cellPart flex-column">
                    <span className="cellPart_cell1">
                        <label className="cellLabel1">重复</label>
                        <div className="cellLabel2">
                            <label onClick={this.openWeek}>{weekText}
                            </label>
                            <i className="arrowImg" style={{'backgroundImage': 'url(../static/img/icon_arrow_right.png)'}} ></i>
                        </div>
                    </span>
                    <span className="cellPart_cell2">
                        <label className="cellLabel1">设备开关</label>
                        <p className="addTiming_switchLabel"><a id="ctrl-sleep-switch" onTouchStart={this.changeSwitch} className={'wg-switch ' + (!this.state.deviceSwitch ? '':'off')}></a></p>
                    </span>
                </div>
                <div className="addYYY" onClick = {this.addTimingObject} >添加</div>
                <WeekSelectComponent show={selectshow} clickWeekday={this.selectWeekDay} />
            </section>
        )}
}


