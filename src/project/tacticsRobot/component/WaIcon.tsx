/*
 * Created by chenLiang on 2020/3/11.
 */
import React, {Component} from 'react';

class WaIcon extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state={};
    }

    componentDidMount() {
    }

    public render() {
        const imgStyle = {
            width: '100%',
            height: 'auto'
        };
        return (
            <div className="wa-icon wa-row wa-center" style={{width: this.props.size, height: '100%', marginRight: this.props.mr}}>
                <img src={this.props.img} alt="" style={imgStyle}/>
            </div>
        );
    }
}

export default WaIcon;