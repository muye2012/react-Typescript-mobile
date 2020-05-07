/*
 * Created by chenLiang on 2020/4/2.
 */
import React, {Component} from 'react';
import './LazyLoading.scss'


let PRE_TOP = 0;
export default class LazyLoading extends Component<any, any> {
    public readonly state = {
        el: document.getElementById('root'),
        outHt: document.documentElement.clientHeight || document.body.clientHeight,
        reachLen: 20
    };

    componentDidMount() {
        const {elId} = this.props;
        this.setState({el: document.getElementById(elId)});
        let el: any = this.state.el;
        el.style.height = '100vh';
        el.style.overflow = 'auto';
        el.addEventListener('scroll', this.lazyLoading);
        // 滚动外层元素高度
        this.setState({
           outHt: document.body.offsetHeight
        });
    }

    static defaultProps={
        elId: 'root',
        isLoading: false
    };
    componentWillUnmount () {
        let el: any = this.state.el;
        el.removeEventListener('scroll', this.lazyLoading);
    }

    lazyLoading = ()=> {
        let el: any = this.state.el;
        const {outHt, reachLen} = this.state;
        const {isLoading, pageOver} = this.props;
        if (pageOver) return false;
        // 滚动条滚动距离
        let scrollTop = el.pageYOffset ||el.scrollTop;
        // 文档总高度
        let scrollHeight = el.scrollHeight;
        if (((scrollTop + outHt) >= scrollHeight - reachLen) && !isLoading && (PRE_TOP < scrollTop)) {
            this.props.updateData();
        }
        PRE_TOP = scrollTop;
    };

    public render() {
        const {children, isLoading} = this.props;
        return (
            <div className="lazy_loading wa-row wa-wrap">
                {children}
                <div className={"wa-col-100 text-center " + (!isLoading ? 'hidden': '')}>
                    加载中...
                </div>
            </div>
        );
    }
}