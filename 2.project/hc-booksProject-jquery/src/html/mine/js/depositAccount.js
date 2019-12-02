//押金说明
;var DepositAccount = {
	
	bindBtn:function(){
		$('#jnDeposit').on('touchstart',function(){
			$.alert("请缴纳押金");
		});
	},
	init:function(){
		this.bindBtn();
	}
};
$(function(){
	DepositAccount.init();
});
