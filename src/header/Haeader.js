import React, { Component } from 'react';
import logo from './img/logo.png';
import axios from 'axios'
import store from '../store/index'
import {  Router,Link} from "react-router-dom";
import createHashHistory from 'history/createHashHistory';
import { message } from 'antd';
import '../constants'
import {encryptedData,decryptedData} from '../aes';
const history = createHashHistory()
class Header extends Component{
    constructor(props){
        super(props);
        this.state={...store.getState(),
            customerTradePassword:'',
            customerTradeAccount:'',
            login:true,
            hidden:true
        }
        this.hiddenChange=this.hiddenChange.bind(this)
        this.login=this.login.bind(this)
        this.customerTradeAccount=this.customerTradeAccount.bind(this)
        this.customerTradePassword=this.customerTradePassword.bind(this)
        this.storeChange=this.storeChange.bind(this)
        this.loginout=this.loginout.bind(this)
		this.recharge=this.recharge.bind(this)

        store.subscribe(this.storeChange)
    }
    render(){
        return(
            <Router history={history}>
                <div className="top">
                    <div className="contenner clearfloat">
                        <div className="lfet">

                            <div className="logo">
                                <img src={logo} alt=""/>
                            </div>
                        </div>
                        <div className="right">
                            <ul className="navr clearfloat">
                                <li>
                                    <Link to="/" onClick={this.recharge} className={'home' + ' '+ (this.state.islogin ? ' ' : 'mr27')}>首页</Link>
                                </li>
                                <li>
                                    <Link  to="/vip" className={'vip' + ' '+ (this.state.islogin ? ' ' : 'hidden')} >会员中心</Link>
                                </li>
                                <li className={ (this.state.islogin ? 'hidden' : ' ') }>
                                    <button onClick={this.hiddenChange} className="login">登录</button>
                                </li>
                                <li className={ (this.state.islogin ? ' ' : 'hidden ') }>
                                    <p className='name'>{this.state.customerTradeAccount}</p>
                                </li>
                                <li className={ (this.state.islogin ? ' ' : 'hidden ') }>
                                    <Link to="/" className="login" onClick={this.loginout}>退出</Link>
                                </li>
                            </ul>
                            <div className={'denglu' + ' ' + (this.state.hidden ? 'hidden' : '')} id="app-5">
                                <div className="remom">
                                    <span className="glyphicon glyphicon-remove" onClick={this.hiddenChange}></span>

                                </div>

                                <div className="denglu_title">
                                    用户登录
                                </div>
                                <span className="denglu_heng">

                                        </span>
                                <div className="form-group dengluinputbox">
                                    <span className="glyphicon glyphicon-user dengluicon"></span>
                                    <input
                                        value={this.state.customerTradeAccount}
                                        type="text"
                                        className="form-control exampleInputEmail1"
                                        onChange={this.customerTradeAccount}
                                        placeholder="请输入用户名"
                                    />
                                </div>
                                <div className="form-group dengluinputbox mt70">
                                    <span className="glyphicon glyphicon-lock dengluicon"></span>
                                    <input
                                        value={this.state.customerTradePassword}
                                        type="password"
                                        className="form-control exampleInputEmail1"
                                        onChange={this.customerTradePassword}
                                        placeholder="请输入交易密码"
                                    />
                                    <span id="helpBlock2" className="help-block err">{this.state.err}</span>
                                </div>

                                <button type="button" className="btn log" onClick={this.login}>登录</button>

                            </div>
                        </div>
                    </div>

                </div>
            </Router>

        )

    }



    hiddenChange(){
        this.setState({
            hidden: ! this.state.hidden
        })
    }	
    recharge(){
        if(this.state.islogin){
            var data1 =encryptedData({
                'customerId':this.state.customerId,
            })
            axios({
                method:'POST',
                url:global.constants.website+'/trade/appCustomer/getCustomerInfo',
                // url:global.constants.website+'/trade/appCustomer/getCustomerInfo',
                headers: {
                    'accessToken':encryptedData(this.state.accessToken),
                    'customerTel':encryptedData(this.state.customerTel),
                    'content-type': 'application/json' ,
                    'version':encryptedData(global.constants.version)
                },
                responseType: 'json',
                data: JSON.stringify({
                    "enctyptData":data1
                })
            }).then( (response) =>  {
            
                if (response.data.resCode==="509") {
                    // message.warn(data.data.msg)
                    var date=new Date();
                    //将date设置为过去的时间
                    date.setTime(date.getTime()-10000);
                    //将userId这个cookie删除
                    document.cookie="accessToken="+this.state.accessToken+"; expires="+date.toGMTString();
                    const action ={
                        type:'logout',
                        accessToken:'',
                        islogin:false
                    }
                    store.dispatch(action)
                    this.setState(store.getState())
                    message.warn(response.data.msg)
                    this.props.history.push("/")
                    return false
                }
            
                
              })
              .catch(function (error) {
                console.log(error);
              })
        }

	}
    componentDidMount(){

        var cookie = {

            get:function(key){//获取cookie方法
                /*获取cookie参数*/
                var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
                var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
                var tips;  //声明变量tips
                for(var i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
                    var arr=arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
                    if(key===arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                        tips=arr[1];   //将cookie的值赋给变量tips
                        break;   //终止for循环遍历
                    }
                }
                return tips;
            }
        }


        if (cookie.get("accessToken")!==undefined) {
            const action={
                type:'islogin',
                islogin:true,
            }
            store.dispatch(action)
            var accessToken = cookie.get("accessToken")
            

            var customerTel = cookie.get("customerTel")
            var customerId = cookie.get("customerId")
            var data1 =encryptedData({
                'customerId':customerId,

            })
            axios({
                method:'POST',
                url:global.constants.website+'/pay/payInfo/getPayList',
                headers: {
                    'accessToken':encryptedData(accessToken),
                    'customerTel':encryptedData(customerTel),
                    'content-type': 'application/json',
                    'version':encryptedData(global.constants.version)
                },
                responseType: 'json',
                data: JSON.stringify({"enctyptData":data1})
            }).then( (response) =>  {
                const data=JSON.parse(decryptedData(response.data.enctyptData))
               
                

                if(data.resCode==="200"){
                    const action={
                        type:'addinfo',
                        customerTradeAccount:data.data.customerTradeAccount,
                        customerTel:data.data.customerTel,
                        customerId:data.data.customerId,
                        customerCapital:data.data.customerCapital,
                        accessToken:accessToken,

                        islogin:true,
                    }
                    store.dispatch(action)

                    this.setState(store.getState())

                }else if(data.resCode==="509"){
                    var date=new Date();
                    //将date设置为过去的时间
                    date.setTime(date.getTime()-10000);
                    //将userId这个cookie删除
                    document.cookie="accessToken="+this.state.accessToken+"; expires="+date.toGMTString();
                    const action ={
                        type:'logout',
                        accessToken:'',
                        islogin:false
                    }
                    store.dispatch(action)
                    this.setState(store.getState())
                    message.warn(data.msg)
                    this.props.history.push("/")
                    return false
                }

            })
                .catch(function (error) {
                    console.log(error);
                })

        }
    }
    login(){
        let customerTradeAccount= this.state.customerTradeAccount;
        let customerTradePassword = this.state.customerTradePassword;
        var data1 =encryptedData({
            'customerTradeAccount':customerTradeAccount,
            'customerTradePassword':customerTradePassword
        })
        axios({
            method:'POST',
            url:global.constants.website+'/trade/appCustomer/login',
            headers: {
                'content-type': 'application/json',
                'version':encryptedData(global.constants.version)
            },
            responseType: 'json',
            data: JSON.stringify({"enctyptData":data1})
        }).then( (response) =>  {
            const data=JSON.parse(decryptedData(response.data.enctyptData))
            
            if(data.resCode==="200"){

                document.cookie = 'accessToken='+ data.data.accessToken;
                document.cookie = 'customerTel=' + data.data.customerTel;
                document.cookie = 'customerId=' + data.data.customerId;

                const action={
                    type:'addACC',
                    accessToken:data.data.accessToken,
                    customerTel:data.data.customerTel,
                    customerId:data.data.customerId,
                    customerTradeAccount:data.data.customerTradeAccount,
                    customerCapital:data.data.customerTradeAccount,
                    islogin:true,
                }
                store.dispatch(action)

            }else{
                this.setState({
                    err:data.msg,
                    hidden:false
                })
            }
        })
            .catch(function (error) {
                console.log(error);
            })
        this.setState(store.getState())
    }
    customerTradeAccount(e){
        this.setState({
            customerTradeAccount:e.target.value,
            err:''
        })
    }
    customerTradePassword(e){
        this.setState({
            customerTradePassword:e.target.value,
            err:''

        })
    }
    storeChange(){
        this.setState(store.getState())
    }
    loginout(){

        var date=new Date();
        //将date设置为过去的时间
        date.setTime(date.getTime()-10000);
        //将userId这个cookie删除
        document.cookie="accessToken="+this.state.accessToken+"; expires="+date.toGMTString();
        const action ={
            type:'logout',
            accessToken:'',
            islogin:false
        }
        store.dispatch(action)
        this.setState(store.getState())
    }
    //获取当前时间

}

export default Header;