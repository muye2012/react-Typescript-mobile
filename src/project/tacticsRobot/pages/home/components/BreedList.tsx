/*
 * Created by chenLiang on 2020/3/10.
 */
import React, {Component} from 'react';
import './BreedList.scss'

//RouteComponentProps:路由库自带的api的类型定义
class BreedList extends Component<any, any>{
    public readonly state = {}
    static defaultProps = {
      list: []
    };
    componentDidMount() {
    }

    public render() {
        const {list} =this.props;
        return (
            <div className="breed-list">
                <div className="wa-row breed-list-title">
                    <div className="wa-col-30 breed-code text-left">
                        品种代码
                    </div>
                    <div className="wa-col-33 text-right">
                        发行价/申购数量
                    </div>
                    <div className="wa-col text-center">
                        申购时间
                    </div>
                </div>
                {
                    list.map((item: any, index: number)=>(<div className="wa-row breed-list-item" key={index+'breedList'}>
                            <div className="wa-col-30 breed-code text-left">
                                {item.purchaseName}<br/><span>{item.purchaseCode}.{item.exchange}</span>
                            </div>
                            <div className="wa-col-33 text-right">
                                {item.issuePrice}元<br/>{item.purchaseCount}{item.exchange === 'SH'?'手' : '张'}
                            </div>
                            <div className="wa-col wa-center">{item.purchaseDate}</div>
                        </div>))
                }
                {
                    !list || !list.length ? (<div className="wa-row breed-list-empty">
                        <div className="wa-col-100 wa-center">
                            暂无已预约品种
                        </div>
                    </div>) : ''
                }
            </div>
        );
    }
}

export default BreedList;