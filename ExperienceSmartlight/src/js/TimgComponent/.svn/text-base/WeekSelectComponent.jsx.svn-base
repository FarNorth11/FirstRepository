/**
 * Created by ben on 2017/3/24.
 */

import {BaseComponent} from '../../../../common/src/BaseComponent.class.es6';
import {Store} from '../Store.es6'
import {Actions} from '../Actions.es6'

var items = [
    {id:0,name:'周一',select:false},
    {id:1,name:'周二',select:false},
    {id:2,name:'周三',select:false},
    {id:3,name:'周四',select:false},
    {id:4,name:'周五',select:false},
    {id:5,name:'周六',select:false},
    {id:6,name:'周天',select:false}
];
var items_Init = [
    {id:0,name:'周一',select:false},
    {id:1,name:'周二',select:false},
    {id:2,name:'周三',select:false},
    {id:3,name:'周四',select:false},
    {id:4,name:'周五',select:false},
    {id:5,name:'周六',select:false},
    {id:6,name:'周天',select:false}
];


export class WeekSelectComponent extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            temp : null,
            last : props.min ,// 上一次数据
            showOpacity:0,
            viewDisplay:false,
        };
        this.listenStore(Store);
        this.selectWeek = this.selectWeek.bind(this);
        this.clickWeekday = this.clickWeekday.bind(this);
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
    }
    selectWeek(e){
        let where = parseInt(e.currentTarget.getAttribute('data-mode'));
        console.log('where ',where,items[where].select,items);
        var testArr = items;
        testArr[where].select = !testArr[where].select;

        //delete testArr[1];
        Actions.changeWeekList(testArr);
    }
    //选择完成周选择,返回上级页面
    clickWeekday(){
        if(typeof this.props.clickWeekday === 'function'){
            this.props.clickWeekday();
            let me = this;
            me.setState({
                selectWeekArr:items_Init
            });
            items = items_Init;
        }else{
            console.log('error:the cancel callback is not a function');
        }

    }
    render() {

        var statusArr = [];
        statusArr = this.state.selectWeekArr||items;


        return <section className="weekSelectPage" style={{display:this.state.viewDisplay?'block':'none',opacity:this.state.showOpacity}}>
            <div className="weekDiv flex-column" >
                {statusArr.map(function(o) {
                    return(
                        <div className="weekDivCell"
                             data-mode={o.id}
                             onClick={this.selectWeek}
                             style={{'display':'auto'}} key={o.id}>
                            {o.name}
                            <i className="sureImg" style={{'backgroundImage': 'url(../static/img/sureImg_'+(o.select? 'on':'off')+'.png)'}} ></i>
                        </div>
                    )
                }.bind(this))}
            </div>
            <div className="addYYY"  onClick={this.clickWeekday}>确定</div>
        </section>
    }
}