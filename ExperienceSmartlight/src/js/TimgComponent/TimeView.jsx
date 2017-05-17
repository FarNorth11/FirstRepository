/**
 * Created by ben on 2017/3/22.
 */
import {BaseComponent} from '../../../../common/src/BaseComponent.class.es6';
import {Actions} from '../Actions.es6';
import {Store} from '../Store.es6';
import {CellContent} from './CellComponent.jsx'
import {AddTimingComponent} from './AddTimingComponent'


//var TimingList = [
//    {id:0,time:'06:00',day:'周一,周二',select:false},
//    {id:1,time:'09:00',day:'周二',select:true}
//];

/*
 var TimingList = [
 {id:0,time:'06:00',day:selectWeekArr,deviceSwitch:false},
 {id:1,time:'09:00',day:selectWeekArr,deviceSwitch:true}
 ];
 */

export class TimeView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            showAddTiming:false
        };
        het.setTitle(JSON.stringify({setNavTitle:1,title:'定时',setNavRightBtnHiden:1}));
        this.listenStore(Store);
        Actions.getBeforData();
        this.addTiming = this.addTiming.bind(this);
        this.addedBack = this.addedBack.bind(this);
        this.cellClick = this.cellClick.bind(this);
    }
    //进入添加详情页面
    addTiming(){
        this.setState({
                showAddTiming:true,
        });
        console.log('添加定时');

    }
    //添加详情页面点击添加后传递的事件,把添加详情页面隐藏
    addedBack(){
        console.log('已添加');
        this.setState({
            showAddTiming:false,
        });
    }
    //页面显示的cell点击事件
    cellClick(cellIndex){

        //console.log('出来了 ',cellIndex);
        //this.setState({
        //    showAddTiming:true,
        //});

    }
    //返回上级页面
    backClick(){
        //是否是添加详情页面
        var isAddDetatil =  this.state.showAddTiming;
        console.log('isAddDetatil ',isAddDetatil);
        if(isAddDetatil){
            //隐藏详情页面
            this.setState({
                showAddTiming:false,
            });
        }else{
            window.location.href = '#';
        }

    }
    render() {
        var items = this.state.timingObjectArr||[];
        //items = TimingList;
        var showAddTiming = this.state.showAddTiming;
        //console.log('--------------------TimeView 显示的timingObjectArr--------------- ',this.state.timingObjectArr);
        let isIOS = !!(navigator.userAgent.match(/iPad|iPhone|iPod/));
        let navigation = isIOS ?'nav ios':'nav android';
        return(
            <section className="Timing-page">
                <nav className={navigation}>
                    <span className = "back" onClick={this.backClick.bind(this)}></span>
                </nav>
                <div className="cellDiv">
                    {items.map(function(o) {
                        return(
                            <CellContent key={o.id} cellIndex ={o.id} data-mode={o.id} time={o.time} day={o.day} switchDirect={o.deviceSwitch} cellClick = {this.cellClick}  />
                        )
                    }.bind(this))}

                </div>
                <div className="addTimingBtn" onClick={this.addTiming}>添加</div>
                <AddTimingComponent show={showAddTiming} addedBack={this.addedBack} />
            </section>
        )}
}
//cellClick = {}