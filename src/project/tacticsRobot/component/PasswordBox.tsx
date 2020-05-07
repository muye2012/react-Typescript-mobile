/*
 * Created by chenLiang on 2020/3/31.
 */
import React, {Component} from 'react';
import './PasswordBox.scss'

export default class PasswordBox extends Component<any, any> {
    public readonly state = {
        wordArr: ['', '', '', '', '', ''],
        activeIndex: -1,
        password: ''
    };

    componentDidMount() {
    }


    static defaultProps={
        openPassword: false,
        errTips: ''
    };
    changeNum = (e: any)=> {
        let val:any = e.target.value + '';
        if (/^[0-9]*$/.test(val) && val.length < 7) {
            let wordArr:any = [...val];
            let times = 6 - wordArr.length;
            for (let i = 0; i < times; i++) {
                wordArr.push('');
            }
            this.setState({
                password: val,
                wordArr,
                activeIndex: val.length
            })
            if (val.length === 6) this.props.confirmPass(val);
        }
    };
    blurNum = ()=> {
      this.setState({
          activeIndex: -1
      })
    };
    controlBox = (isOpen: boolean) => {
        this.props.controlBox(isOpen)
    };
    componentDidUpdate (prevProps: any) {
        if (!prevProps.openPassword) {
            let el: any = document.getElementById('passInput');
            el.focus();
        }
        if (prevProps.errTips !== this.props.errTips) {
            this.setState({
                wordArr: ['', '', '', '', '', ''],
                activeIndex: -1,
                password: ''
            })
        }
    }
    public render() {
        const {wordArr, activeIndex, password} = this.state;
        let {openPassword, errTips} = this.props;
        return (
            <div className={'password-box ' + (!openPassword ? 'hidden' : '')}>
            <div className="ab-box">
                <div className="password-box-content">
                    <span className="password-box-close" onClick={() => {this.controlBox(false)}}>
                    </span>
                    <div className="password-box-title">
                        请输入交易密码
                    </div>
                    <div className="password-box-input wa-row">
                        {
                            wordArr.map((item: any, index: number)=> (<div className="wa-col-16" key={index + 'password'}>
                                <i className={activeIndex === index ? 'cursor-on' : item || item === 0 ? 'full-num' : ''}/>
                            </div>))
                        }
                        <input type="tel"
                               id="passInput"
                               onChange={this.changeNum}
                               onBlur={this.blurNum}
                               value={password}/>
                    </div>
                    <div className='err-tips'>
                        {errTips}
                    </div>
                </div>
            </div>
            <div className="password-box-modal">
            </div>
        </div>);
    }
}