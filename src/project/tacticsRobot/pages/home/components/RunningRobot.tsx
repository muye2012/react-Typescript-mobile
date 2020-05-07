/*
 * Created by chenLiang on 2020/3/9.
 */
import React, {Component} from 'react';
import './RunningRobot.scss'
import BreedList from "./BreedList";
import BallotList from "./BallotList";
import {connect} from 'react-redux';
import {reducerType} from '../../../store';
import {asyncRunningList} from "../../../store/actions";
import RobotEmpty from "../../../component/RobotEmpty";

const mapStateToProps = (state: reducerType) => ({runningData: state.homeReducer.runningData});
const mapDispatchToProps = {asyncRunningList};

interface apiProps {
    runningData: object
}

//RouteComponentProps:路由库自带的api的类型定义
class RunningRobot extends Component<apiProps | any, any> {
    public readonly state = {};

    componentDidMount() {
        const {asyncRunningList} = this.props;
        asyncRunningList({})
    }

    private goPage = (name: string, params: any = '') => {
        let route = params ? `/${name}/${params}` : `/${name}`;
        this.props.history.push(route);
    };

    public render() {
        const {runningData} = this.props;
        const {purchaseTime, reservationList, signedOnSellList} = runningData;
        return (
            <div className="running-robot">
                <div className={!reservationList.length && !signedOnSellList.length ? 'hidden' : ''}>
                    <div className="wa-row running-robot-title ">
                        <div className="wa-col-40 text-left">
                            已预约列表
                        </div>
                        <div className="wa-col text-right time-date"
                             onClick={() => {
                                 this.goPage('build_robot')
                             }}
                             style={{backgroundImage: `url(${require('../../../assets/images/home/edit_icon.png')})`}}>
                            申购时间：{purchaseTime}
                        </div>
                    </div>
                    <BreedList list={reservationList}/>
                    <div className="wa-row running-robot-title">
                        <div className="wa-col-100 text-left">
                            已中签待卖出
                        </div>
                    </div>
                    <BallotList list={signedOnSellList} history={this.props.history}/>
                </div>
                {
                   !reservationList.length && !signedOnSellList.length ? (<div className="wa-row wa-center empty-breed">
                       <div className="wa-col-100">
                           <RobotEmpty tips="暂无运行品种"/>
                       </div>
                   </div>):''
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RunningRobot);