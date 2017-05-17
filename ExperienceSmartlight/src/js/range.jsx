/**
 * Created by ben on 2017/4/25.
 */
/**
 * 滑动选择器组件
 * @prop {integer}  value       传入初始值
 * @prop {function} fnFeedback  用于接收处理结果的函数
 * @prop {integer}  min         可选，最小值，缺省为0
 * @prop {integer}  max         可选，最大值，缺省为100
 * @prop {boolean}  disabled    可选，是否可以点击
 */
var Range = React.createClass({
    getInitialState: function(){
        return {};
    },
    min : function() {
        return this.props.min || "0";
    },
    max : function() {
        return this.props.max || "100";
    },
    // 定位
    pos : function(value) {
        var wrap = ReactDOM.findDOMNode(this.refs["wrap"]);
        var cursor = ReactDOM.findDOMNode(this.refs["cursor"]);
        var rate = (value - this.min()) / (this.max() - this.min()); // 比率
        var left = (wrap.offsetWidth - cursor.offsetWidth) / 100 * rate * 100;
        cursor.style.left = left + "px";
        if(rate>0.9){
            cursor.style.left = left-20 + "px";

        }
    },
    handlerChange : function(e) {
        var value = parseInt(e.currentTarget.value);
        this.setState({value:value});
        if (typeof this.props.fnFeedback === "function") {
            this.props.fnFeedback(value); // 反馈处理结果
        }
    },
    componentDidUpdate : function(){
        var value = typeof this.state.value !== "undefined" && this.oldPropValue === this.props.value ? this.state.value : this.props.value;
        this.oldPropValue = this.props.value; // oldPropValue用于比较prop修改时的状态
        this.state.value = value; // 强行保持state与value同步
        this.pos(value);
    },
    componentDidMount : function(){
        this.componentDidUpdate();
    },
    render : function() {
        var value = typeof this.state.value !== "undefined" && this.oldPropValue === this.props.value ? this.state.value : this.props.value;
        return (
            <div className="__range">
                <label ref="wrap">
                    <input type="range" min={this.min()} max={this.max()} onChange={this.handlerChange} value={value} disabled={this.props.disabled ? "disabled" : ""} />
                    <i ref="cursor" className="cursor">{value}%</i>
                </label>
            </div>
        );
    }
});

module.exports = Range;
