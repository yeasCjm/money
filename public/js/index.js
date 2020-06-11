
// 主界面初始化
function main_init(){
  

}



function replace(doc, style) {

  $('link', doc).each(function(index, one) {

    var path = $(one).attr('href').replace(/(static\/)\w+(\/css)/g, '$1' + style + '$2').replace(/(custom\/)\w+(\/)/g, '$1' + style + '$2'), sheet;

    if(doc.createStyleSheet) {
      sheet = doc.createStyleSheet(path);
      setTimeout(function() { $(one).remove(); }, 500);
    } else {
      sheet = $('<link rel="stylesheet" type="text/css" href="' + path + '" />').appendTo($('head', doc));
      sheet = sheet[0];
      sheet.onload = function() { $(one).remove(); }
    }

  });

  $('img', doc).each(function(index, one) {
    var path = $(one).attr('src').replace(/(static\/)\w+(\/images)/g, '$1' + style + '$2');
    $(one).attr('src', path);
  });

}

$('.skin-item').click(function() {
  var color = $(this).data('color');
  replaceAll(color);
});

function replaceAll(style) {
  $('iframe').each(function(index, one) {
    try {
      replace(one.contentWindow.document, style)
    } catch(e) {
      console.warn('origin cross');
    }
  });
  replace(document, style);
}

// 退出登录
function User_Logout(){
  window.localStroage
  location.reload();
  
}







