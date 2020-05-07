/*
 * Created by chenLiang on 2020/3/10.
 */
import React, {Component} from 'react';
import './ProductList.scss'
import RobotBox from "../../../component/RobotBox";
import { connect } from 'react-redux';
import {reducerType} from "../../../store";

const mapStateToProps = (state: reducerType) => ({ purchaseData: state.purchaseReducer.purchaseData });
class ProductList extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isEmpty: false
        };
    }

    public readonly state = {
        isEmpty: false
    };

    componentDidMount() {
    }

    private goSetPage = (index: number, grade: number) => {
        this.props.history.push('/set_type/'+index + '/' + grade);
    };

    public render() {
        const {list, params, isNoSelect} = this.props;
        const selectBreed = (index: number, grade: number) => {
            const {purchaseData} = this.props;
            const {recommendSubscribeList, notRecommendSubscribeList, notGradSubscribeList} = purchaseData;
            let item: any = {};
            if (grade === 1) {
                item = recommendSubscribeList[index] || {};
            } else if(grade === 2) {
                item = notRecommendSubscribeList[index] || {};
            } else if(grade === 0) {
                item = notGradSubscribeList[index] || {};
            }
            item.selected = !item.selected;
            list[index].selected = item.selected;
            this.setState({isEmpty: false});
        };
        return (
            <div className="product-list">
                <RobotBox noSide={true}>
                    <div className="wa-row product-list-title">
                        <div className="wa-col-33 product-code text-left">
                            品种代码
                        </div>
                        <div className="wa-col-33 wa-center">
                            发行价/申购数量
                        </div>
                        <div className="wa-col-33 wa-xend product-date">
                            申购日期
                        </div>
                    </div>
                    {list ? list.map((obj: any, i: number)=> {
                        return(<div className={"wa-row wa-wrap product-item " + (params.addBreed && (obj.subscribed === 1) ? 'hidden':'')}
                                    key={obj.stockId + i}
                                    onClick={() => selectBreed(i, obj.grade)}>
                            <div className={"wa-col-33 product-item-code" + (!obj.selected ? ' no-select' : '')} >
                                {obj.purchaseName}<br/>
                                {obj.purchaseCode + '.' + obj.exchange}
                            </div>
                            <div className="wa-col-33 text-right price-num">
                                {obj.issuePrice}元<br/>
                                {obj.maxPurchaseQuantity}{obj.exchange === 'SH'?'手' : '张'}
                            </div>
                            <div className="wa-col wa-center">
                                {obj.purchaseDate}
                            </div>
                            <div className="wa-col-100 price-val">
                    <span className="arrow-right" onClick={(e)=> { e.stopPropagation(); return this.goSetPage(i, obj.grade || 0)}}>卖出策略：{
                        obj.ruleType === 1 ? (<span>估价≥{obj.accessPrice}元后, 回落<b className='green-col'>{obj.turnBack}%</b>卖出</span>) :
                            obj.ruleType === 2 ? (<span>估价≥{obj.accessPrice}元后卖出</span>) :
                                obj.ruleType === 3 ? (<span>上市首日{obj.entrustTime}卖出</span>):
                                    (<span>暂不卖出</span>)
                    }</span>
                            </div>
                        </div>)
                    }): ''}
                    {
                        !list || !list.length || (params.addBreed && !isNoSelect)? (<div className="wa-row empty-breed">
                            <div className="wa-col-100 wa-center">
                                暂无可选品种
                            </div>
                        </div>) : ''
                    }
                </RobotBox>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ProductList);