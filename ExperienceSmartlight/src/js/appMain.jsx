// import {Funs} from '../../../common/src/fun.es6';
import {BaseComponent} from '../../../common/src/BaseComponent.class.es6';
import {Actions} from './Actions.es6';
import {Store} from './Store.es6';
import {SlideComponent} from './SlideComponent.jsx'
import {SlideComponentTwo} from './SlideComponentTwo.jsx'
import {TimeView} from './TimgComponent/TimeView.jsx';

import {TimingPage} from './expAir_TimingCom/TimingPage.es6'
import {YYScale} from './YYScale.jsx'

var {Router, Route, hashHistory} = ReactRouter;

het.domReady(()=>{
    // 配置sdk
    het.config({
        debugMode: 'print', // 打印调试数据
        updateFlagMap: {
        }
    });
});

// 接收app推送数据
het.repaint((data, type)=>{
    Actions.repaint(data, type);
});
var modeArray = [
    {id:1,name:'晚餐'},
    {id:2,name:'看书'},
    {id:3,name:'沐浴'},
    {id:4,name:'娱乐'},
    {id:5,name:'定时'},

];
// 创建React组件
class App extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            power:  localStorage.experiencelightPower||1  ,//电源开关  1开机 2关机
            Tone:   localStorage.experiencelightTone || 0
        };
        this.listenStore(Store); // 监听Store
        //NavTitle 1显示H5的title       setNavRightBtnHiden 1 不显示加号.
        het.setTitle(JSON.stringify({setNavTitle:1,title:'智能灯',setNavRightBtnHiden:1,setBackBtnHide:0}));
        this.selectMode = this.selectMode.bind(this);
        this.switch = this.switch.bind(this);
        this.adjustRangeTem = this.adjustRangeTem.bind(this);
        this.adjustRangeColor = this.adjustRangeColor.bind(this);
    }
    handleTouchTap(e) {
        console.log('touchTap事件测试');
    }
    selectMode(e){
        let where = parseInt(e.currentTarget.getAttribute('data-mode'));
        console.log('where ',where);
        switch(where){
            case 1:{
                this.setState({
                    workmode:1
                });
                break;
            }
            case 2:{
                this.setState({
                    workmode:2
                });

                break;
            }
            case 3:{
                this.setState({
                    workmode:3
                });
                break;
            }
            case 4:{
                this.setState({
                    workmode:4
                });
                break;
            }
            case 5:{
                window.location.href = '#/timingPage';
                break;
            }
        }
    }
    adjustRangeColor(e){
        console.log("e",e);
        var rangeValue = 100/12;

        let scale = ReactDOM.findDOMNode(this.refs["lightChange"]);
        let lightBgImag = ReactDOM.findDOMNode(this.refs["lightBgImag"]);


        //有12个颜色
        if(e>=0&&e<=rangeValue){
            //01-ff0000  红色
            console.log("1");
            scale.style.background = "url('../static/img/lightList/01-ff0000.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";


            lightBgImag.style.background = "url('../static/img/bgImg_warm.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("ff0000");
        }else if(e>rangeValue&&e<=2*rangeValue){
            //橘色
            console.log("2");
            scale.style.background = "url('../static/img/lightList/02-ff7f00.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";

            lightBgImag.style.background = "url('../static/img/bgImg_warm.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("ff7f00");

        }else if(e>2*rangeValue&&e<=3*rangeValue){
            //黄色
            console.log("3");
            scale.style.background = "url('../static/img/lightList/03-ffff000.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";

            lightBgImag.style.background = "url('../static/img/bgImg_warm.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("ffff000");

        }else if(e>3*rangeValue&&e<=4*rangeValue){
            //青色
            console.log("4");
            scale.style.background = "url('../static/img/lightList/04-80ff00.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";

            lightBgImag.style.background = "url('../static/img/bgImg_cold.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("80ff00");

        }else if(e>4*rangeValue&&e<=5*rangeValue){
            //绿色
            console.log("5");
            scale.style.background = "url('../static/img/lightList/05-00ff00.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";

            lightBgImag.style.background = "url('../static/img/bgImg_cold.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("00ff00");

        }else if(e>5*rangeValue&&e<=6*rangeValue){
            //蓝色
            console.log("6");
            scale.style.background = "url('../static/img/lightList/06-00ff80.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";

            lightBgImag.style.background = "url('../static/img/bgImg_cold.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("00ff80");

        }else if(e>6*rangeValue&&e<=7*rangeValue){
            console.log("7");
            scale.style.background = "url('../static/img/lightList/07-00ffff.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";

            lightBgImag.style.background = "url('../static/img/bgImg_cold.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("00ffff");

        }else if(e>7*rangeValue&&e<=8*rangeValue){
            console.log("8");
            scale.style.background = "url('../static/img/lightList/08-0080ff.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";

            lightBgImag.style.background = "url('../static/img/bgImg_cold.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("0080ff");

        }else if(e>8*rangeValue&&e<=9*rangeValue){
            console.log("9");
            scale.style.background = "url('../static/img/lightList/09-0000ff.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";

            lightBgImag.style.background = "url('../static/img/bgImg_cold.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("0000ff");

        }else if(e>9*rangeValue&&e<=10*rangeValue){
            console.log("10");
            scale.style.background = "url('../static/img/lightList/10-8000ff.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";

            lightBgImag.style.background = "url('../static/img/bgImg_cold.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("8000ff");

        }else if(e>10*rangeValue&&e<=11*rangeValue){
            console.log("11");
            scale.style.background = "url('../static/img/lightList/11-ff00ff.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";
            lightBgImag.style.background = "url('../static/img/bgImg_warm.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("ff00ff");

        }else if(e>11*rangeValue&&e<=100){
            console.log("12");
            scale.style.background = "url('../static/img/lightList/12-ff007f.png') no-repeat";
            scale.style.backgroundSize ="100% 100%";
            lightBgImag.style.background = "url('../static/img/bgImg_warm.jpg') no-repeat";
            lightBgImag.style.backgroundSize ="100% 100%";
            Actions.selectColor("ff007f");

        }


    }
    adjustRangeTem(e){
        console.log("e",e);

        var tem = 1-e/100;
        let scale = ReactDOM.findDOMNode(this.refs["lightChange"]);

        scale.style.opacity = tem;

    }
    switch(e){
        Actions.selectPower(
            this.state.power
        );


    }
    render() {
        let items = {};
        items = modeArray;
        let selectMode = this.state.workmode? this.state.workmode:1;

        //console.log("render power",this.state.power);
        let valueSelect=0;
        var rangeValue = 100/12;
        //let scale = ReactDOM.findDOMNode(this.refs["lightChange"]);


        let urlStr ;
        if(this.state.Tone!=null){
        //,#ff0000,#ff7f00,#ffff00,#80ff00,#00ff00,#00ff80,#00ffff,#0080ff,#0000ff,#8000ff,#ff00ff,#ff007f
            if(this.state.Tone == "ff0000"){
                valueSelect = 1;
                urlStr = "01-ff0000";
                //scale.style.background = "url('../static/img/lightList/01-ff0000.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "ff7f00"){
                valueSelect = 2*rangeValue;
                urlStr = "02-ff7f00";
                //scale.style.background = "url('../static/img/lightList/02-ff7f00.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "ffff000"){
                valueSelect = 3*rangeValue;
                urlStr = "03-ffff000";
                //scale.style.background = "url('../static/img/lightList/01-ffff00.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "80ff00"){
                valueSelect = 4*rangeValue;
                urlStr = "04-80ff00";
                //scale.style.background = "url('../static/img/lightList/01-80ff00.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "00ff00"){
                valueSelect = 5*rangeValue;
                urlStr = "05-00ff00";
                //scale.style.background = "url('../static/img/lightList/01-00ff00.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "00ff80"){
                valueSelect = 6*rangeValue;
                urlStr = "06-00ff80";
                //scale.style.background = "url('../static/img/lightList/01-00ff80.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "00ffff"){
                valueSelect = 7*rangeValue;
                urlStr = "07-00ffff";
                //scale.style.background = "url('../static/img/lightList/01-00ffff.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "0080ff"){
                valueSelect = 8*rangeValue;
                urlStr = "08-0080ff";
                //scale.style.background = "url('../static/img/lightList/01-0080ff.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "0000ff"){
                valueSelect = 9*rangeValue;
                urlStr = "09-0000ff";
                //scale.style.background = "url('../static/img/lightList/01-0000ff.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "8000ff"){
                valueSelect = 10*rangeValue;
                urlStr = "10-8000ff";
                //scale.style.background = "url('../static/img/lightList/01-8000ff.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "ff00ff"){
                valueSelect = 11*rangeValue;
                urlStr = "11-ff00ff";
                //scale.style.background = "url('../static/img/lightList/01-ff00ff.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }else if(this.state.Tone == "ff007f"){
                valueSelect = 100;
                urlStr = "12-ff007f";
                //scale.style.background = "url('../static/img/lightList/01-ff007f.png') no-repeat";
                //scale.style.backgroundSize ="100% 100%";
            }

            var WarmC = true;
            if(this.state.Tone == "ff007f"&&this.state.Tone == "ff00ff"&&this.state.Tone == "ff0000"&&this.state.Tone == "ff7f00"&&this.state.Tone == "ffff000"){
                //暖色调
                WarmC = true

            }else{
                //冷色调
                WarmC = false;
            }

        };


        let power  = this.state.power;
        let switchTitle;
        if(power ==1){
            switchTitle = "开机";
        }else{
            switchTitle = "关机";
            //scale.style.background = "url('../static/img/light_1.png') no-repeat";
            //scale.style.backgroundSize ="100% 100%";
            //valueSelect =1;
            urlStr = "light_0000";

        }

        console.log("urlStr" ,urlStr,'this.state.Tone:',this.state.Tone, localStorage.experiencelightTone );
//,'background':'url(../static/img/lightList/01-ff0000.png) no-repeat'
 //style={{'backgroundSize':'inherit','background':'url(../static/img/lightList/02-ff7f00.png) no-repeat'}}
        //style={{backgroundImage:'url(../static/img/lightList/02-ff7f00.png)'}}
        return <div className="app-body">
            <section className={'app_bgimghg '+(WarmC ?'':'cold')} ref="lightBgImag">
                <div className={'lightDiv '+(power==2?'off':'')} style={{'backgroundImage': 'url(../static/img/lightList/'+urlStr+'.png)'}}  ref="lightChange"  ></div>
                <div className="turnDiv"  onClick={this.switch}>
                    <span>{switchTitle}</span>
                </div>
                <div className={'turnDiv_shadow '+(power==2?'off':'')}/>
            </section>
            <section className="btnListDiv flex">
                {items.map(function(o) {
                    return(
                        <div className={'mode'+ (power == 2? '':o.id == selectMode? ' on':'') +' flex-cell'}
                            data-mode={o.id}
                            onClick={this.selectMode}
                            style={{'display':'auto',
                            'backgroundImage': 'url(../static/img/m-'+o.id+( power == 2? '-off':o.id == selectMode? '-on':'-off')+'.png)'}} key={o.id}>
                            {o.name}
                        </div>
                    )
                }.bind(this))}
            </section>
            <section className="flex-column slideDiv">
                <SlideComponent  min="0" max="100" minus={false} value={valueSelect} titlestr="颜色" power={power} cb={this.adjustRangeColor}/>
                <SlideComponentTwo mode="1"  min="0" max="100" minus={false} value={0} titlestr="饱和度" power={power} ct={this.adjustRangeTem}/>
            </section>
            <div className={'enableView '+(power == 2?'off':'')}></div>

        </div>;
    }
}

//    <YYScale/>            <SlideComponent  min="0" max="100" minus={false} value={0} titlestr="颜色" cb={this.adjustRangeTem}/>
//<SlideComponent2 mode="1"  min="0" max='120' minus={false} value={0} titlestr="饱和度" cb={this.adjustRangeTime}/>
// 开始渲染
    het.domReady(()=>{
        het.setTitle('C-Life 设备控制');
    // 无路由方式
    //ReactDOM.render(<App />, document.getElementById('ROOT'));

    // 路由方式
    ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={App} />
            <Route path="/timingPage" component={TimingPage} />
        </Router>
    ), document.getElementById('ROOT'));
});
//<Route path="/timeView" component={TimeView} />