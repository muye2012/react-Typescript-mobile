/*
 * Created by chenLiang on 2020/3/11.
 */
import React, {Component} from 'react';
import './SelectPop.scss'
import {Picker} from 'antd-mobile';

export default class SelectPop extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            show: true,
            cols: 2
        };
    }
    static defaultProps = {
        columns: [],
        showPop: true,
        barTitle: '预约申购时间'
    };

    componentDidMount() {
    }

    static getDerivedStateFromProps(props: any, state: any) {
        return {
            user: props.showPop
        };
    }

    onChange=(value: any)=> {
        this.props.onChange(value);
    };

    onConfirm = (value: any)=> {
        this.setState({show: false});
        this.props.onConfirm(value);
    };

    onCancel = ()=> {
        this.setState({show: false});
    };
    public render() {
        const {columns, barTitle, children, format, value} = this.props;
        return (
            <div className="select_pop">
                <Picker data={columns}
                        title={barTitle}
                        cols={this.state.cols}
                        onChange={this.onChange}
                        onOk={this.onConfirm}
                        format={format}
                        value={value}
                        extra="请选择"
                        onDismiss={this.onCancel}>
                    {children}
                </Picker>
            </div>
        );
    }
}