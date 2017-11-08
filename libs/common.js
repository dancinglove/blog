const crypto=require('crypto');
module.exports={
  MD5_SUFFIX:'baksghahsdasdasgjkdasjkhjk',
  md5:function(str){
    var userpass=require('crypto').createHash('md5').update(str).digest('hex');//console.log('md5'+userpass)
    return userpass
  }
}
