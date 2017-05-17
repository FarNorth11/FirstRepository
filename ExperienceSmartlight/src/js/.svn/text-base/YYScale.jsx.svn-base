/**
 * Created by yuanyunlong on 2016/12/15.
 */


import ReactDOM from 'react-dom';

export class  YYScale extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            value: 0
        }
    }

    min(){
        return this.props.min || "0";
    }

    max(){
        return this.props.max || "100";
    }

    pos(value){
        let scale = ReactDOM.findDOMNode(this.refs["scale"]);
        let cursor = ReactDOM.findDOMNode(this.refs["cursor"]);
        let scaleValue = ReactDOM.findDOMNode(this.refs["scaleValue"]);

        let rate = (value - this.min())/(this.max() - this.min()); // 比率
        let left = (scale.offsetWidth - cursor.offsetWidth) / 100 * rate * 100 ;
        if(left < 5){
            left = left - 1;
        }
        cursor.style.left = left + "px";
        var width = left + 2;
        scaleValue.style.width = width + "px";
    }

    handlerChange(e){
        var value = parseInt(e.currentTarget.value);
        console.log("input value: " + value);
        this.setState({value:value});
        if(typeof this.props.fnFeedback === "function"){
            this.props.fnFeedback(value);
        }

    }

    componentDidUpdate() {
        var value = typeof this.state.value !== "undefined" && this.oldPropValue === this.props.value ? this.state.value : this.props.value;

        let oldPropValue = this.oldPropValue || 0;
        let propsValue = this.props.value || 0;
        let stateValue = this.state.value || 0;
        console.log("updata: oldPropValue: " + oldPropValue + " propsValue: " + propsValue + "  stateValue: " + stateValue + " value: " + value);

        this.oldPropValue = this.props.value;
        this.state.value = value;
        this.pos(value);
    }



    componentDidMount() {
        this.componentDidUpdate();
    }

    render(){
        let oldPropValue = this.oldPropValue || 0;``
        let propsValue = this.props.value || 0;
        let stateValue = this.state.value || 0;
        var value = typeof this.state.value !== "undefined" && this.oldPropValue === this.props.value ? this.state.value : this.props.value;
        console.log("render: oldPropValue: " + oldPropValue + " propsValue: " + propsValue + "  stateValue: " + stateValue + " value: " + value);



        return (<div className="scale_panel">
            <div className="scale" ref="scale">
                <input type="range" min={this.min()} max={this.max()} onChange={this.handlerChange.bind(this)} value={value}  />
                <div ref="scaleValue"></div>
                <span ref="cursor" ></span>
            </div>
        </div>);
    }
}