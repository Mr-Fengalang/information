import React, { Component } from 'react';
import store from '../store/index';
import img1 from './img/Vector Smart Object-1.png';
import img2 from './img/Vector Smart Object.png';
import 'antd/dist/antd.css';
import './css/vip.css';
import axios from 'axios';
import moment from "moment";
import {encryptedData,decryptedData} from '../aes';
import {
	Select,
	Input,
	Table,
	message,
	DatePicker,
} from 'antd';
import '../constants'
const Option = Select.Option;



const columns = [{
	title: '交易类型',
	dataIndex: 'tradeType',
	width: 163.3125,
	render: (text, row, index) => {
		return (<span>  {row.type}{text===1?"充值":"提现"}</span>)
	  }
  }, {
	title: '金额',
	width: 163.3125,
	dataIndex: 'amount',
	render: val => <span>{val+"元"}</span>
  },{
	title: '手续费',
	width: 163.3125,
	dataIndex: 'sxf',
	render: val => <span>{val?val+"元":'0元'}</span>

  }, {
	title: '交易时间',
	dataIndex: 'createTime',
	width: 163.3125,
	render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
  }, {
	title: '交易状态',
	dataIndex: 'status',
	width: 163.3125,
	
  },
];


class Vip extends Component {

	constructor(props){
		super(props)
		this.state={...store.getState(),
			recharge:true,
			data: [],
			pagination: {},
			loading: false,
			channels:[],
			bankInfoIds:[],
			accountId:'',
			rechargeAmount:'',
			accountName:'',
			bankInfoId:'',
			xuanz:false,
			starttime:'',
			endtime:'',
			islogin:false,
            accessToken:'',
            customerTel:'',
			customerId:'',
			status:'',
			tradeType:'',
			iszjmm:false,
			customerCapitalPassword:'',
			customerCapitalPasswordt:'',
			payurl:''

		}		
		this.recharge=this.recharge.bind(this)
		this.tdact=this.tdact.bind(this)	
        this.yhact=this.yhact.bind(this)					
		this.rechargeAmountChang=this.rechargeAmountChang.bind(this)	
		this.pay=this.pay.bind(this)	
		this.fristonChange=this.fristonChange.bind(this)	
		this.endonChange=this.endonChange.bind(this)	
		this.statushandleChange=this.statushandleChange.bind(this)	
		this.tradeTypehandleChange=this.tradeTypehandleChange.bind(this)	
		this.customerWithdrawRecord=this.customerWithdrawRecord.bind(this)	
		this.search=this.search.bind(this)	
		this.customerCapitalPassword = this.customerCapitalPassword.bind(this)
		this.setcustomerCapitalPassword = this.setcustomerCapitalPassword.bind(this)
		this.customerCapitalPasswordt = this.customerCapitalPasswordt.bind(this)


	}	

	fristonChange(data,dateString) {
	  this.setState({
		starttime:dateString
	  })
	}

	endonChange(data,dateString) {
	  this.setState({
		endtime:dateString
	  })
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
		
		var accessToken = cookie.get("accessToken")
        var customerTel = cookie.get("customerTel")
        var customerId = cookie.get("customerId")

        
        if (cookie.get("accessToken")!==undefined) {
			this.setState({
                islogin:true,
                accessToken:accessToken,
                customerTel:customerTel,
                customerId:customerId,
			})   
			
			const data1 =encryptedData({
                'customerId':customerId,
			})
			
            axios({
                method:'POST',
                url:global.constants.website+'/trade/appCustomer/getCustomerInfo',
                // url:global.constants.website+'/trade/appCustomer/getCustomerInfo',
                headers: {
                    'accessToken':encryptedData(accessToken),
                    'customerTel':encryptedData(customerTel),
                    'content-type': 'application/json'  ,
					'version':encryptedData(global.constants.version)
                },
                responseType: 'json',
                data: JSON.stringify({
                    "enctyptData":data1
                })
            }).then( (response) =>  {
			const data=JSON.parse(decryptedData(response.data.enctyptData))
                if(data.resCode==="200"){
					this.setState({
						customerId:data.data.customerId,
					})

					
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
                   
                }else{
                    this.setState({
                        err:response.data.msg
                    })
                }
                
              })
              .catch(function (error) {
                console.log(error);
              })

		}
		
		
		const data2=encryptedData({
			'customerId':customerId,
			"payMethod":"1"
		})
		  axios({
			  
			method:'POST',
			url:global.constants.website+'/pay/payInfo/getPayList',
			headers: {
				'accessToken':encryptedData(accessToken),
				'customerTel':encryptedData(customerTel),
				'content-type': 'application/json'  ,
				'version':encryptedData(global.constants.version)
			},
			responseType: 'json',
			data: JSON.stringify({
				"enctyptData":data2
			})
		}).then((data) => {
			const data1=JSON.parse(decryptedData(data.data.enctyptData))
			
			if (data1.resCode==="509") {
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
				this.props.history.push("/")
				return false
			}
			if (data1.resCode === "200") {
				this.setState({
					channels:data1.data.channel,
					iszjmm: false
				})
			}
			if (data1.resCode === "523") {
				this.setState({
					iszjmm:true
				})
			}
			
		  });

		  const data21=encryptedData({
			'customerId':customerId,
		})
		  axios({
			method:'POST',
			url:global.constants.website+'/pay/bankInfo/getcustomerBankInfoList',
			headers: {
				'accessToken':encryptedData(accessToken),
				'customerTel':encryptedData(customerTel),
				'content-type': 'application/json'  ,
				'version':encryptedData(global.constants.version)
			},
			responseType: 'json',
			data: JSON.stringify({
				"enctyptData":data21
				
			})
		}).then((data) => {
			const data1=JSON.parse(decryptedData(data.data.enctyptData))
			
			if (data1.resCode==="509") {
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
				this.props.history.push("/")
				return false
			}

			if (data1.resCode==="200") {
				this.setState({
					bankInfoIds:data1.data
				})
			}else{
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
				this.props.history.push("/")
			}
			
		  });

		this.customerWithdrawRecord(accessToken,customerTel,customerId,'1')

    }
	recharge(){

		const data2=encryptedData({
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
				"enctyptData":data2
			})
		}).then( (response) =>  {
			const data1=JSON.parse(decryptedData(response.data.enctyptData))
			if (data1.resCode==="509") {
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
				message.warn(data1.msg)
				this.props.history.push("/")
				return false
			}
		
			
		  })
		  .catch(function (error) {
			console.log(error);
		  })


		this.setState({
            recharge: ! this.state.recharge
        })
	}
	tdact(channel){
		this.setState({
			accountId: channel.id,
			accountName:channel.name
        })
	}
	yhact(bankInfoId){
		this.setState({
			bankInfoId: bankInfoId.bankInfoId,
        })
	}
	rechargeAmountChang(e){
		this.setState({
			rechargeAmount:e.target.value
		})
	}

	customerWithdrawRecord(accessToken,customerTel,customerId,pageNum){
		let data = {
			'customerId':customerId,
			"pageNum":pageNum,
			'isH5':'1',
		}
		if(this.state.starttime){
			data.createTimeBegin=this.state.starttime
		}
		if(this.state.endtime){
			data.createTimeEnd=this.state.endtime
		}
		if(this.state.status){
			data.status=this.state.status
		}
		if(this.state.tradeType){
			data.tradeType=this.state.tradeType
		}

		const data3 =encryptedData(data)

		axios({
			method:'POST',
			url:global.constants.website+'/pay/payInfo/customerWithdrawRecord',
			headers: {
				'accessToken':encryptedData(accessToken),
				'customerTel':encryptedData(customerTel),
				'content-type': 'application/json'  ,
				'version':encryptedData(global.constants.version)
			},
			responseType: 'json',
			data: JSON.stringify({
				"enctyptData":data3

			})
		}).then((data) => {
			const data1=JSON.parse(decryptedData(data.data.enctyptData))
			
			if (data1.resCode==="509") {
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
				message.warn(data1.msg)
				this.props.history.push("/")
				return false
			}

			if (data1.resCode==="200") {
				
				const pagination = { ...this.state.pagination };
				// Read total count from server
				pagination.total = data1.data.count;
				pagination.pageSize=20;
				// pagination.total = 200;
				this.setState({
				loading: false,
				data: data1.data.list,
				pagination,
				});
			}else{
				message.warn(data1.msg)
			}

		  });
	}
	
	setcustomerCapitalPassword(){
		let customerCapitalPassword = this.state.customerCapitalPassword;
		let customerCapitalPasswordt = this.state.customerCapitalPasswordt;

		if (!(/^\d{6}$/.test(customerCapitalPassword))) {
			message.warn('密码为6位数字')
			return
		}
		if (customerCapitalPassword != customerCapitalPasswordt) {
			message.warn('两次密码不同')
			return false
		}
		
		const data2=encryptedData({
				
			"customerId": this.state.customerId,
			"customerCapitalPassword": customerCapitalPassword

		})

		axios({
			method: 'POST',
			url: global.constants.website+'/trade/appCustomer/initCustomerCapitalPassword',
			headers: {
				'accessToken': encryptedData(this.state.accessToken),
				'customerTel': encryptedData(this.state.customerTel),
				'content-type': 'application/json' ,
				'version':encryptedData(global.constants.version)
			},
			responseType: 'json',
			data: JSON.stringify({
				
				"enctyptData":data2

			})
		}).then((data) => {
			const data1=JSON.parse(decryptedData(data.data.enctyptData))
			
			if (data1.resCode==="509") {
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
				message.warn(data1.msg)
				this.props.history.push("/")
				return false
			}
			if (data1.resCode === '200') {
				message.success('设置成功')
				this.setState({
					iszjmm:false,
				})
			}else{
				message.warn(data1.msg)

			}
			
		});
	}
	pay(){
		
		if (!this.state.accountId) {
			message.warn("请选择支付方式")
			return
		}
		if (!this.state.rechargeAmount) {
			message.warn("请输入金额")
			return
		}
		this.setState({
			rechargeAmount:'',
			accountId:''
		})
		
		const data2=encryptedData({
				
				"bankInfoId":this.state.bankInfoId,
				"rechargeAmount":this.state.rechargeAmount,
				"accountId":this.state.accountId,
				"accountName":this.state.accountName,
				"customerId":this.state.customerId,
				"payMethod":"1"
		})
		axios({
			method:'POST',
			url:global.constants.website+'/pay/payInfo/onLineRecharge',
			headers: {
				'accessToken':encryptedData(this.state.accessToken),
				'customerTel':encryptedData(this.state.customerTel),
				'content-type': 'application/json'  ,
				'version':encryptedData(global.constants.version)
			},
			responseType: 'json',
			data: JSON.stringify({
				"enctyptData":data2
				
			})
		}).then((data) => {
			const data1=JSON.parse(decryptedData(data.data.enctyptData))
			
			if (data1.resCode==="509") {
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
				message.warn(data1.msg)
				this.props.history.push("/")
				return false
			}
			// this.setState({
			// 	bankInfoIds:data.data.data
			// })
			if (data1.resCode === '200') {
				var tempwindow=window.open('_blank'); // 先打开页面
				tempwindow.location=data1.data.url; // 后更改页面地址
				// var tempwindow=window.open();
				// tempwindow.location=;
				// window.location.href = data.data.data.url
			}else{
				message.warn(data1.msg)
			}
		  });

	}



	handleTableChange = (page) => {
		const current =page.current
		this.customerWithdrawRecord(this.state.accessToken,this.state.customerTel,this.state.customerId,current)
	  }
	  statushandleChange = (value) =>{
		  this.setState({
			  status:value
		  })
	  }
	tradeTypehandleChange  = (value) =>{
		this.setState({
			tradeType:value
		})
		
	}
	search () {
		this.customerWithdrawRecord(this.state.accessToken,this.state.customerTel,this.state.customerId,'1')
	}
	customerCapitalPassword(e) {
		this.setState({
			customerCapitalPassword: e.target.value,
			err: ''

		})
	}
	customerCapitalPasswordt(e) {
		this.setState({
			customerCapitalPasswordt: e.target.value,
			err: ''

		})
	}

  render() {
    return (
      <div className="vipmain">
			<div className="contenner">
				<div className="row">
					<div className="col-md-10 lfet">
						<div className={"lefttop" + " " + (this.state.iszjmm ? 'hidden' : ' ')}>
							<div className="tubi">
								<ul className="clearfloat">
									<li>
										<img src={img1} alt='' />
									</li>
									<li>
										<img src={img2}  alt=''/>
									</li>
								</ul>
							</div>
							<div className="lefttopmain">
								<p className="zhyy">账户余额</p>
								<p className="money">￥ <span className="qian">{this.state.customerCapital}</span> </p>
								<button type="button" className="btn btn1" onClick={this.recharge} >充值</button>

							</div>

						</div>
						<div className={"lefttop" + " " + (this.state.iszjmm ? ' ' : 'hidden')}>
							<div className="tubi">
								<ul className="clearfloat">
									<li>
										<img src={img1} alt='' />
									</li>
									<li>
										<img src={img2} alt='' />
									</li>
								</ul>
							</div>
							<div className="lefttopmain">
								< Input size = "large"
								placeholder = "设置资金密码(密码为6位数字)"
								type ="password" 
								value = {
									this.state.customerCapitalPassword
								}
								onChange = {
									this.customerCapitalPassword
								}
								/>
								< Input className='zjmm' size = "large"
								placeholder = "确认资金密码" 
								type="password"
								value = {
									this.state.customerCapitalPasswordt
								}
								onChange = {
									this.customerCapitalPasswordt
								}
								 />
								<button type="button" className="btn btn1" onClick={this.setcustomerCapitalPassword} >设置资金密码</button>

							</div>

						</div>
						{/* <Pay payurl={this.state.payurl}/> */}
						<div className={"leftbtm" + " " + (this.state.iszjmm ? 'hidden' : '') }>
							<div className={"lius" + " " +(this.state.recharge ? '' : 'hidden')}>
								<form className="form-inline">
									<div className="form-group">
										<label htmlFor="startime">起始日期</label>
										<DatePicker onChange={this.fristonChange} />
									</div>
									<div className="form-group">
										<label htmlFor="endtime">结束日期</label>
										<DatePicker onChange={this.endonChange} />
									</div>
									<div className="form-group">
										<label htmlFor="type">订单类型</label>
										<Select defaultValue="" style={{ width: 120 }} onChange={this.statushandleChange}>
											<Option value="">订单类型</Option>
											<Option value="1">提现成功</Option>
											<Option value="2">提现失败</Option>
											<Option value="3">提现中</Option>
											<Option value="4">提现申请</Option>
											<Option value="5">充值成功</Option>
											<Option value="6">充值失败</Option>
											<Option value="7">充值中</Option>
											<Option value="8">充值申请</Option>
										</Select>
																					
									</div>
									<div className="form-group">
										<label htmlFor="type">交易类型</label>
										<Select defaultValue="" style={{ width: 120 }} onChange={this.tradeTypehandleChange}>
											<Option value="">交易类型</Option>
											<Option value="1">充值</Option>
											<Option value="2">提现</Option>
										</Select>
																					
									</div>
									<div className="form-group">
										<button type="button" className="btn" onClick={this.search}>查找</button>
									</div>
								</form>
								<Table
									columns={columns}
									rowKey={record => record.id}
									dataSource={this.state.data}
									pagination={this.state.pagination}
									loading={this.state.loading}
									onChange={this.handleTableChange}
									scroll={{ y: 550 }}
								/>
								
							</div>
							<div className={"congz" + " " +(this.state.recharge ? 'hidden' : '')}>
								<span className="glyphicon glyphicon-arrow-left icon" aria-hidden="true" onClick={this.recharge}>返回</span>
								<div className="form-inline">
									<div className="form-group">
										<label htmlFor="startime">充值金额：</label>
										<input type="text" className="form-control" value={this.state.rechargeAmount} onChange={this.rechargeAmountChang}/>
									</div>
								</div>
								<div className="zhifutongdfao">
									<p>选择支付：</p>
									<ul className="clearfloat">
										{this.state.channels.map((channel) => <li className={(channel.id===this.state.accountId ? 'xuanz' : '')} onClick={() => this.tdact(channel)} key={channel.id}><img src={channel.logo_src} alt=''/></li>)}										
									</ul>
								</div>
								
								{/* <div className="zhifutongdfao">
									<p>支付银行：</p>
									<ul className="clearfloat">
										{this.state.bankInfoIds.map((bankInfoId) => <li  className={(bankInfoId.bankInfoId===this.state.bankInfoId ? 'xuanz' : '')} onClick={() => this.yhact(bankInfoId)} key={bankInfoId.cardholderIdCard}>{bankInfoId.openingBank}</li>)}
									</ul>
								</div> */}
								<button type="button" className="btn ljzf" style={{width:120}} onClick={this.pay}>立即支付</button>
							</div>
						</div>

					</div>
					<div className="col-md-2 right">
						<p className="title">
							注意事项：
						</p>
						<p className="neir">
							1.充值之前需要完成开户和实名认证
						</p>
						<p className="neir">
							2.开户和实名认证在请到APP上完成
						</p>
						<p className="neir">
							3.如需提现请到APP上完成
						</p>
						<p className="neir">
							4、支付过程中请勿点击浏览器"后退"键
						</p>
						<p className="neir">
							5、点击"前往支付"按钮后，将跳转进入所选银行网银平台，请根据页面提示进行操作
						</p>
						<p className="title">
							若支付失败：
						</p>
						<p className="neir">
							1、稍等2分钟后再刷新充值页面
						</p>
						<p className="neir">
							2、清理浏览器缓存
						</p>
						<p className="neir">
							3、切换网络环境
						</p>
						<p className="neir">
							4、联系客服
						</p>
					</div>

				</div>
			</div>
		</div>
    );
  }
}

export default Vip;
