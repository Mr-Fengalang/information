const defaultState ={
    accessToken:'',
    customerTel:'',
    customerId:'',
    islogin:false,
    hidden:true,
    err:'',
    name:'',
    customerTradeAccount:''
}
export default (state=defaultState,action) =>{
    if(action.type==='accessToken'){
        const newState =JSON.parse(JSON.stringify(state));
        newState.accessToken=action.accessToken;
        return newState;
    }
    if(action.type==='islogin'){
        const newState =JSON.parse(JSON.stringify(state));
        newState.islogin=action.islogin;
        return newState;
    }
    if(action.type==='addACC'){
        const newState =JSON.parse(JSON.stringify(state));
        newState.accessToken=action.accessToken;
        newState.customerTel=action.customerTel;
        newState.customerId=action.customerId;
        newState.islogin=action.islogin;
        newState.customerTradeAccount=action.customerTradeAccount;

        return newState;
    }
    if(action.type==='addinfo'){
        const newState =JSON.parse(JSON.stringify(state));
        newState.customerTradeAccount=action.customerTradeAccount;
        newState.customerTel=action.customerTel;
        newState.customerId=action.customerId;
        newState.islogin=action.islogin;
        newState.customerCapital=action.customerCapital;
        newState.accessToken=action.accessToken;


        return newState;
    }
    if(action.type==='logout'){
        const newState =JSON.parse(JSON.stringify(state));
        newState.accessToken=action.accessToken;
        newState.islogin=action.islogin;
        return newState;
    }
    if(action.type==='sysislogin'){
        const newState =JSON.parse(JSON.stringify(state));
        newState.accessToken=action.accessToken;
        newState.islogin=action.islogin;
        return newState;
    }
    return state;
}