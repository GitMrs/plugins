module.exports = {
  returnBody(status,msg,data={}){
    this.status = status;
    this.body = {
      data,
      message:msg,
      success:true
    }
  }
}