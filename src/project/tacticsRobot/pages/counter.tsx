import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { reducerType } from '../store';
import { asyncIncrementCount, decrementCount } from '../store/actions';

interface CounterProps {
    count: number;
    asyncIncrementCount: Function;
    decrementCount: Function;
}
const mapStateToProps = (state: reducerType) => ({ count: state.countReducer.count });
const mapDispatchToProps = { asyncIncrementCount, decrementCount };

// RouteComponentProps:路由库自带的api的类型定义
class Counter extends Component<RouteComponentProps & CounterProps, {}>{
    private increment = () => {
        const { asyncIncrementCount } = this.props;
        asyncIncrementCount(2);
    };
    private decrement = () => {
        const { decrementCount } = this.props;
        decrementCount(2);
    };
    public render() {
        const { count } = this.props;
        return (
            <div>
                <p>count：{count}</p>
                <div onClick={this.increment}>按钮+2</div>
                <div onClick={this.decrement}>按钮-2</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);