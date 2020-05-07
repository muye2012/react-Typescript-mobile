/*
 * Created by chenLiang on 2020/3/26.
 * 公用底部固定按钮
 */
import React, {Component} from 'react';
import './RobotBtn.scss'

export default class RobotBtn extends Component<any, any> {
    public readonly state = {
        disabled: false,
        btnImg: '',
        // 所有按钮图片对应关系
        btnImgList: {
            // 选好了
            '1': 'select_btn',
            // 选好了不可点击
            '2': 'select_disabled_btn',
            // 确认搭建
            '3': 'confirm_btn',
            // 立即查看
            '4': 'look_btn',
            // 下一步
            '5': 'next_btn',
            // 下一步不可点击
            '6': 'next_disabled_btn',
            // 提交搭建
            '7': 'submit_btn',
            '8': 'confirm_submit'
        }
    };

    static defaultProps = {
        // 对照btnImgList对应关系可为值1,2,3。。。 也可为class名
        type: '1',
        disabled: false,
        // 按钮样式 0 为图片按钮 1为普通按钮
        styleType: '0'
    };

    componentDidMount() {
        if (Number(this.props.type) < 10) {
            this.setState({
               btnImg: this.state.btnImgList[this.props.type]
            });
        }
    };

    btnTap = ()=> {
        if (this.state.disabled) return false;
        this.props.btnTap();
    };
    public render() {
        const {disabled, btnImg} = this.state;
        const {type, styleType, children} = this.props;
        return (
            <div className={disabled ? 'robot_btn robot_btn_disabled' : 'robot_btn'}>
                {
                    styleType === '0' ? (
                        <div className={btnImg ? (btnImg + ' robot_btn_img') : (type + ' robot_btn_img')} onClick={this.btnTap}/>) : (
                        <div className="robot_btn_content" onClick={this.btnTap}>
                            {children}
                        </div>)
                }
            </div>
        );
    }
}