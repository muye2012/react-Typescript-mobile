/*
 * Created by chenLiang on 2020/3/11.
 */
import React, {Component} from 'react';
import './RobotBox.scss'

export default class RobotBox extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state={};
    }
    public readonly state = {};

    static defaultProps = {
        isError: false,
        type: '1',
        // 样式风格 0 为透明样式风格 1 为蓝色样式风格
        styleType: '0',
        // 没有白色装饰
        noSide: false
    };
    componentDidMount() {
    }
    public render() {
        const {isError, styleType, type, noSide, children} = this.props;
        return (
            <div className={`robot_box wa-row wa-wrap ${isError ? 'box_error' : ''} ${styleType === '1' ? 'blue_style' : ''} ${type === 2 ? 'type_2' : ''}`}>
                <div className="robot_box_top">
                </div>
                {children}
                {
                    type === '1' ?(<div className="robot_box_bottom" style={{backgroundImage: `url(${require("../assets/images/common/blue_bg_bottom.png")})`}}> </div>) : (<div className="robot_box_down"> </div>)
                }
                {
                    !noSide?(<b className="aside_left aside_bg"> </b>):''
                }
                {
                    !noSide?(<b className="aside_right aside_bg"> </b>):''
                }
            </div>
        );
    }
}