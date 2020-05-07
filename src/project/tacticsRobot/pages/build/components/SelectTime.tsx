/*
 * Created by chenLiang on 2020/3/11.
 */
import React, {Component} from 'react';
import './SelectTime.scss'
import RobotBox from "../../../component/RobotBox";
import SelectPop from "../../../component/SelectPop";
import {List} from 'antd-mobile';

let TIMER: any = null;
let hoursList: object[] = [];
class SelectTime extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.getTimeList();
        this.state = {
            sayTxt: '',
            showPop: false,
            selectedHours: 0,
            selectedMinute: 0,
            pickerVal: [9, 30]
        };
    }
    componentDidMount() {
        this.robotSay();
    }
    componentWillUnmount() {
        if(TIMER)clearInterval(TIMER)
    }
    // 打字效果
    robotSay = ()=> {
        this.setState({sayTxt: ''});
        let say = '请设置您的智能可转债策略';
        clearInterval(TIMER);
        let index = 0;
        TIMER = setInterval(() => {
            if (index < say.length) {
                this.setState({sayTxt: this.state.sayTxt + say[index]})
                index++;
            } else {
                clearInterval(TIMER)
            }
        }, 150);
    }
    showTimePop = ()=> {
        this.setState({showPop: true});
    }
    // 获取时间弹框时间列表
    getTimeList() {
        let first = [];
        let second = [];
        for(let i = 0; i < 60; i++) {
            let secondItem = {label: i + '分', value: i};
            let firstItem = {label: i + '时', value: i};
            if(i < 10) {
                secondItem.label = '0' + i + '分';
                firstItem.label = '0' + i + '时';
            }
            if (i > 8 && i < 15) {
                first.push(Object.assign(firstItem, {children: [{}]}));
            }
            second.push(secondItem);
        }
        for (let j = 0; j < first.length; j++) {
            if (j === 0) {
                first[j].children = [...second].splice(30, 61);
            } else if (j === 5) {
                first[j].children = [...second].slice(0, 59);
            } else {
                first[j].children = [...second];
            }
        }
        hoursList = first;
    }
    setTimeList = ()=> {
        let first = [...hoursList];
        return first;
    }
    popConfirm = (val: any)=> {
        // this.setState({
        //     pickerVal: val
        // });
        this.props.changeTime(val);
    };
    popChange = (val: any)=> {
        this.setState({
            pickerVal: val
        });
    };
    format = (labels: React.ReactNode[]): any=> {
        labels = labels.map((item: any)=> {return item.substring(0, item.length - 1)});
        return labels.join(' : ');
    };
    public render() {
        const {sayTxt, showPop} = this.state;
        const {purchaseTime} = this.props;
        let val = purchaseTime ? purchaseTime.split(':').map((item: any)=> {return Number(item)}):'';
        return (
            <div className="select_time wa-row">
                <RobotBox>
                <div className="wa-row select_time_content wa-wrap">
                    <div className="wa-col-100 wa-center time_txt">预约申购时间</div>
         {/*           <div className="wa-col-100 wa-center arrow-right time_val"
                         onClick={() => {this.showTimePop()}}>{subscribeTime}</div>*/}
                    <SelectPop onConfirm={this.popConfirm}
                               onClick={this.showTimePop}
                               columns={this.setTimeList()}
                               showPop={showPop}
                               value={val}
                               format={this.format}
                               onChange={this.popChange}>
                        <List.Item arrow="horizontal"/>
                    </SelectPop>
                </div>
                </RobotBox>
                <div className="fixed_robot" style={{backgroundImage: `url(${require('../../../assets/images/build/robot_img.png')})`}}>
                    <div className="fixed_robot_txt">
                        {sayTxt}
                    </div>
                </div>
            </div>
        );
    }
}

export default SelectTime;