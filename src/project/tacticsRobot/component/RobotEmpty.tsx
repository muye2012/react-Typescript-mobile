/*
 * Created by chenLiang on 2020/4/1.
 */
import React, {Component} from 'react';
import './RobotEmpty.scss'

export default class RobotEmpty extends Component<any, any> {
    public readonly state = {}

    componentDidMount() {
    }
    static defaultProps ={
        tips: '暂无数据'
    }

    public render() {
        const {tips} = this.props;
        return (
            <div className="robot_empty">
                <img src={require("../assets/images/common/robot_empty.png")} alt=""/>
                    <p>{tips}</p>
            </div>
        );
    }
}