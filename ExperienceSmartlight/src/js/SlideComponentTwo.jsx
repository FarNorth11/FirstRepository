/**
 * Created by ben on 2017/4/25.
 */
/**
 * 温度设置组件
 * @prop {integer}  value 当前温度值
 * @prop {integer}  min   最小温度值
 * @prop {integer}  max   最大温度值
 * @prop {boolean}  minus 是否有负号
 * @prop {function} ct    可选，调节温度后的回调函数
 */
import Range from './range.jsx';
export class SlideComponentTwo extends React.Component {
    constructor(props) {
        super(props);
        this.rangechange = this.rangechange.bind(this);
        this.rangeTouchEnd = this.rangeTouchEnd.bind(this);

    }
    rangechange(e){


    }
    rangeTouchEnd(e){
        let val = this.state.temp;
        if (typeof this.props.ct==='function') {
            console.log('sdfsdfsd:='+val);
            this.props.ct(val);
        }

    }
    feedback(value){
        //let val = Math.round(value)*10;

        //if(this.props.mode == 1){
        //    this.setState({temp: this.props.minus ? -val : val});
        //}else {
        //    this.setState({temp: this.props.minus ? -val : val});
        //}
        let val = value;
        console.log('range:='+val);
        this.setState({temp: val });

    }
    //滑动结束的时候,把值传到父类去
    touchEnd(e) {
        let val = this.state.temp;
        if (typeof this.props.ct==='function' && this.state.temp != this.state.last) {
            console.log('sdfsdfsd:='+val);
            this.props.ct(val);
        }
    }
    isNum(s) {
        if (s!==null && s!=='') return !isNaN(s);
        return false;
    }
    render() {
        let min = this.props.min;
        let max = this.props.max;
        let value = this.props.value;

        /*设定range的头文字标题*/
        let title=this.props.titlestr;
        let power = this.props.power;

        return <div className="rangeDiv">
            <h2>{title}</h2>
            <div className="range">
                <span className={'label1 '+(this.props.mode=="1"?'':'off')}/>
                <section className="rangeblock">
                    <div className={'t-range2 '+(power=="2"?'do':'')} onTouchEnd={this.rangeTouchEnd.bind(this)}>
                        <Range min={min} max={max} value={value} fnFeedback={this.feedback.bind(this)} />
                    </div>
                </section>
                <span className={'label2 '+(this.props.mode=="1"?'':'off')}/>
            </div>
        </div>;
    }
};