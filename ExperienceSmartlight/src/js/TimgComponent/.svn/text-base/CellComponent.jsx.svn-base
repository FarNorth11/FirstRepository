/**
 * Created by ben on 2017/3/22.
 */
/**
 * Cell组件
 * @prop {string} time  显示时间
 * @prop {object} day    包含显示的周时间(默认为true)
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
import {BaseComponent} from '../../../../common/src/BaseComponent.class.es6';

export class CellContent extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            temp : null,
            last : props.min // 上一次数据
            //switchDirect: true  //true switch 开  false switch 关
        };
        this.changeSwitch = this.changeSwitch.bind(this);
        this.cellClick = this.cellClick.bind(this);
    }
    changeSwitch(e){

        //e.preventDefault();
        var selectStatus = this.props.switchDirect;
        console.log('changeAutoWind',selectStatus);
        this.setState({
            switchDirect:!selectStatus,
        })
    }
    getWeekStr(object){
        var weekArr =[] ;
        weekArr = object;
        var str = "";
        var count = 0;
        for(var index in weekArr)
        {
            if(weekArr[index].select == true){
                str += weekArr[index].name;
                count+=1;
            }
        }
        if(count == 7){
            str = '每天';
        }
        if(count == 0){
            str = '无重复';
        }
        return str;
    }
    cellClick(e){
        console.log('this.props.cellIndex',this.props.cellIndex);
        this.props.cellClick(this.props.cellIndex);

    }
    render() {
        let timeC = this.props.time;
        let weekC = this.getWeekStr(this.props.day);
        let switchC = this.props.switchDirect;
        //let timeC = "06:00";
        //let weekC = "周一,周二,周三";
        console.log('switchC',switchC);
        return <div className="CellView" onClick={this.cellClick} >
             <div className="cellText">
                 <h1>{timeC}</h1>
                 <h2>{weekC}</h2>
             </div>
            <p className="switchLabel"><a id="ctrl-sleep-switch" onTouchStart={this.changeSwitch} className={'wg-switch ' + (!switchC ? '':'off')}></a></p>
        </div>;
    }

}
//